import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { agentApplications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole } from '@/lib/auth';
import { sendAgentApprovedEmail, sendAgentRejectedEmail } from '@/lib/email';

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

  // Send email based on new status — fire-and-forget
  if (status === 'APPROVED') {
    sendAgentApprovedEmail(updated.email, updated.fullName, adminNote)
      .catch(err => console.error('[Email] Failed to send approval email:', err));
  } else if (status === 'REJECTED') {
    sendAgentRejectedEmail(updated.email, updated.fullName, adminNote)
      .catch(err => console.error('[Email] Failed to send rejection email:', err));
  }

  return NextResponse.json({ success: true, application: updated });
}
