import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agentApplications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getCurrentUserRole();
  if (!auth || !['ADMIN', 'SUPERADMIN'].includes(auth.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { status, adminNote } = await req.json();

  const allowed = ['APPROVED', 'REJECTED', 'SUSPENDED', 'PENDING'];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const [updated] = await db
    .update(agentApplications)
    .set({ status, ...(adminNote !== undefined ? { adminNote } : {}) })
    .where(eq(agentApplications.id, id))
    .returning();

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ success: true, application: updated });
}
