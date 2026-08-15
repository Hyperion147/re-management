import { NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized, forbidden } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const { searchParams } = new URL(req.url);
    let targetUserId = caller.userId; // Default to the caller

    // If Admin is fetching, they must specify which user's thread they want
    if (caller.role === 'ADMIN' || caller.role === 'SUPERADMIN') {
      const qUserId = searchParams.get('userId');
      if (qUserId) {
        targetUserId = qUserId;
      } else {
        return NextResponse.json({ error: 'Admin must specify userId' }, { status: 400 });
      }
    }

    const thread = await db
      .select()
      .from(messages)
      .where(eq(messages.userId, targetUserId))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json(thread);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch messages';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const body = await req.json();
    const { userId, message } = body as {
      userId?: string;
      message?: string;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let targetUserId = caller.userId;
    let isFromAdmin = false;

    if (caller.role === 'ADMIN' || caller.role === 'SUPERADMIN') {
      if (!userId) {
        return NextResponse.json({ error: 'Admin must specify userId' }, { status: 400 });
      }
      targetUserId = userId;
      isFromAdmin = true;
    }

    const inserted = await db
      .insert(messages)
      .values({
        userId: targetUserId,
        message: message.trim(),
        isFromAdmin,
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
