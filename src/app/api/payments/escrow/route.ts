import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, requests, transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

// POST — charges the client and holds funds in escrow for a specific request.
// Body: { requestId }
// The client must have a saved payment method (stripeCustomerId + defaultPaymentMethod).
export async function POST(req: Request) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const { requestId } = await req.json();
    if (!requestId) return NextResponse.json({ error: 'requestId is required' }, { status: 400 });

    const [user] = await db.select().from(users).where(eq(users.id, caller.userId)).limit(1);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!user.stripeCustomerId) {
      return NextResponse.json({ error: 'No payment method on file. Please add a card first.' }, { status: 400 });
    }

    const [request] = await db.select().from(requests).where(eq(requests.id, requestId)).limit(1);
    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    if (request.clientId !== caller.userId) {
      return NextResponse.json({ error: 'Not your request' }, { status: 403 });
    }
    if (request.escrowStatus === 'HELD') {
      return NextResponse.json({ error: 'Payment already escrowed for this request' }, { status: 400 });
    }

    const amountCents = Math.round(Number(request.compensation) * 100);

    // Capture manually so funds are held until admin releases
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method: user.defaultPaymentMethod ?? undefined,
      capture_method: 'manual',
      confirm: !!user.defaultPaymentMethod,
      description: `Escrow for request ${requestId} — ${request.serviceType}`,
      metadata: { requestId, clientId: caller.userId },
    });

    await db.update(requests)
      .set({ paymentIntentId: paymentIntent.id, escrowStatus: 'HELD' })
      .where(eq(requests.id, requestId));

    await db.insert(transactions).values({
      requestId,
      fromUserId: caller.userId,
      amount: request.compensation,
      type: 'ESCROW',
      status: 'COMPLETED',
      stripePaymentIntentId: paymentIntent.id,
    });

    return NextResponse.json({ paymentIntentId: paymentIntent.id, status: paymentIntent.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
