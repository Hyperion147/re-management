import { NextResponse } from 'next/server';
import { db } from '@/db';
import { requestMessages, requests, users } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const { id: requestId } = await params;

    const [request] = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

    const msgs = await db
      .select({
        id: requestMessages.id,
        message: requestMessages.message,
        createdAt: requestMessages.createdAt,
        senderId: requestMessages.senderId,
        senderName: users.fullName,
        senderRole: users.role,
      })
      .from(requestMessages)
      .innerJoin(users, eq(requestMessages.senderId, users.id))
      .where(eq(requestMessages.requestId, requestId))
      .orderBy(asc(requestMessages.createdAt));

    return NextResponse.json({ messages: msgs, request });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch messages';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const { id: requestId } = await params;

    const [request] = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

    const body = await req.json();
    const { message } = body as { message?: string };
    if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    const [inserted] = await db
      .insert(requestMessages)
      .values({ requestId, senderId: caller.userId, message: message.trim() })
      .returning();

    return NextResponse.json(inserted);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
