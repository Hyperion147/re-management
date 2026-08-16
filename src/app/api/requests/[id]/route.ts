import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { requests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getCurrentUserRole();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, agentId } = body;

  if (!status && !agentId) {
    return NextResponse.json({ error: 'status or agentId is required' }, { status: 400 });
  }

  // Fetch existing request to enforce ownership rules
  const [existing] = await db.select().from(requests).where(eq(requests.id, id));
  if (!existing) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(auth.role);
  const isClient = existing.clientId === auth.userId;
  const isAssignedAgent = existing.agentId === auth.userId;

  // Rules:
  // - Admin can do anything
  // - An agent accepting an open request: can set status=ACTIVE + their own agentId
  // - The assigned agent can set status=COMPLETED
  // - The client (or admin) can CANCEL their own request
  const acceptingRequest = agentId === auth.userId && status === 'ACTIVE' && existing.status === 'PENDING';
  const completingRequest = isAssignedAgent && status === 'COMPLETED';
  const cancellingRequest = (isClient || isAdmin) && status === 'CANCELLED';

  if (!isAdmin && !acceptingRequest && !completingRequest && !cancellingRequest) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [updated] = await db
    .update(requests)
    .set({
      ...(status && { status }),
      ...(agentId && { agentId }),
    })
    .where(eq(requests.id, id))
    .returning();

  return NextResponse.json(updated);
}
