import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, requests, transactions } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized, forbidden } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

// POST — admin captures escrowed payment and transfers it to the agent.
// Called after admin approves a completed job.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();
    if (!['ADMIN', 'SUPERADMIN'].includes(caller.role)) return forbidden();

    const { requestId } = await params;

    const [request] = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    if (!request.paymentIntentId) {
      return NextResponse.json({ error: 'No escrowed payment for this request' }, { status: 400 });
    }
    if (request.escrowStatus !== 'HELD') {
      return NextResponse.json({ error: `Escrow status is ${request.escrowStatus}, cannot release` }, { status: 400 });
    }
    if (!request.agentId) {
      return NextResponse.json({ error: 'No agent assigned to this request' }, { status: 400 });
    }

    const [agent] = await db.select().from(users).where(eq(users.id, request.agentId)).limit(1);
    if (!agent?.stripeConnectId) {
      return NextResponse.json({ error: 'Agent has not set up their payout account' }, { status: 400 });
    }

    // Capture the held payment intent
    const captured = await stripe.paymentIntents.capture(request.paymentIntentId);

    const amountCents = Math.round(Number(request.compensation) * 100);

    // Transfer to agent's connected account (Veyro keeps the platform fee implicitly)
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency: 'usd',
      destination: agent.stripeConnectId,
      transfer_group: requestId,
      metadata: { requestId, agentId: request.agentId },
    });

    await db.update(requests)
      .set({ escrowStatus: 'RELEASED', transferId: transfer.id })
      .where(eq(requests.id, requestId));

    // Update agent's totalEarned
    await db.update(users)
      .set({
        totalEarned: sql`${users.totalEarned} + ${request.compensation}`,
        completedShowings: sql`${users.completedShowings} + 1`,
      })
      .where(eq(users.id, request.agentId));

    await db.insert(transactions).values({
      requestId,
      fromUserId: request.clientId,
      toUserId: request.agentId,
      amount: request.compensation,
      type: 'RELEASE',
      status: 'COMPLETED',
      stripePaymentIntentId: captured.id,
      stripeTransferId: transfer.id,
    });

    return NextResponse.json({ success: true, transferId: transfer.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
