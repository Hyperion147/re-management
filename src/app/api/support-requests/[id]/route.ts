import { NextResponse } from 'next/server';
import { db } from '@/db';
import { supportRequests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized, forbidden } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status?: string };

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    if (caller.role === 'USER') {
      const [existing] = await db
        .select({ userId: supportRequests.userId })
        .from(supportRequests)
        .where(eq(supportRequests.id, id));

      if (!existing || existing.userId !== caller.userId) {
        return forbidden();
      }
    }

    const updated = await db
      .update(supportRequests)
      .set({ status })
      .where(eq(supportRequests.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Support request not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update support request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();
    if (caller.role === 'USER') return forbidden();

    const { id } = await params;
    const deleted = await db
      .delete(supportRequests)
      .where(eq(supportRequests.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Support request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete support request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
