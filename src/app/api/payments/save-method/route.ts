import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

// POST — after Stripe confirms the SetupIntent, save the resulting payment method as default.
// Body: { setupIntentId }
export async function POST(req: Request) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const { setupIntentId } = await req.json();
    if (!setupIntentId) return NextResponse.json({ error: 'setupIntentId required' }, { status: 400 });

    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
    if (setupIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'SetupIntent not yet succeeded' }, { status: 400 });
    }

    const pmId = setupIntent.payment_method as string;
    const pm = await stripe.paymentMethods.retrieve(pmId);

    await db.update(users)
      .set({ defaultPaymentMethod: pmId })
      .where(eq(users.id, caller.userId));

    return NextResponse.json({
      saved: true,
      card: pm.card ? {
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
      } : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
