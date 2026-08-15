import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized, forbidden } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const body = await req.json();
    const { fcmToken, ...userFields } = body;

    // ── FCM token update ──────────────────────────────────────────────────────
    // Any authenticated user can update their own FCM token (needed for push
    // notifications). No role restriction here — just must be the same user.
    if (fcmToken !== undefined && Object.keys(userFields).length === 0) {
      if (caller.userId !== id && caller.role !== 'SUPERADMIN') {
        return forbidden();
      }

      const updated = await db
        .update(users)
        .set({ fcmToken })
        .where(eq(users.id, id))
        .returning();

      if (updated.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(updated[0]);
    }

    // ── User field updates (role, status, name, etc.) ─────────────────────────
    // Only SUPERADMIN can change user information
    if (caller.role !== 'SUPERADMIN') {
      return forbidden();
    }

    // SUPERADMIN role cannot be assigned via the API — must be set directly in DB
    if (userFields.role === 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'SUPERADMIN role cannot be assigned via the API. Set it directly in the database.' },
        { status: 403 }
      );
    }

    const fieldsToUpdate: Record<string, any> = {};
    if (userFields.fullName !== undefined) fieldsToUpdate.fullName = userFields.fullName;
    if (userFields.email !== undefined) fieldsToUpdate.email = userFields.email;
    if (userFields.role !== undefined) fieldsToUpdate.role = userFields.role;
    if (userFields.status !== undefined) fieldsToUpdate.status = userFields.status;
    if (userFields.jobTitle !== undefined) fieldsToUpdate.jobTitle = userFields.jobTitle;
    if (fcmToken !== undefined) fieldsToUpdate.fcmToken = fcmToken;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const updated = await db
      .update(users)
      .set(fieldsToUpdate)
      .where(eq(users.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(updated[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Only SUPERADMIN can delete users
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();
    if (caller.role !== 'SUPERADMIN') return forbidden();

    const deleted = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
