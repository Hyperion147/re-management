import { NextResponse } from 'next/server';
import { db } from '@/db';
import { supportRequests } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized } from '@/lib/auth';

export async function GET() {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const query = db.select().from(supportRequests).orderBy(desc(supportRequests.createdAt));

    const supportRows = caller.role === 'USER'
      ? await query.where(eq(supportRequests.userId, caller.userId))
      : await query;

    return NextResponse.json(supportRows);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch support requests';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const body = await req.json();
    const { subject, message, attachmentName, attachmentUrl } = body as {
      subject?: string;
      message?: string;
      attachmentName?: string;
      attachmentUrl?: string;
    };

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    const inserted = await db
      .insert(supportRequests)
      .values({
        userId: caller.userId,
        subject: subject.trim(),
        message: message.trim(),
        attachmentName: attachmentName?.trim() || null,
        attachmentUrl: attachmentUrl?.trim() || null,
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create support request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
