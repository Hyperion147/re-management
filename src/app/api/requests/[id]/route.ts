import { NextResponse } from 'next/server';
import { db } from '@/db';
import { requests } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, agentId } = body;

    if (!status && !agentId) {
      return NextResponse.json({ error: 'Status or agentId is required' }, { status: 400 });
    }

    const updatedRequest = await db
      .update(requests)
      .set({ 
        ...(status && { status }),
        ...(agentId && { agentId })
      })
      .where(eq(requests.id, id))
      .returning();

    if (updatedRequest.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(updatedRequest[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
