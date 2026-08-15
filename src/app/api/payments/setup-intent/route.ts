import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

// Creates a SetupIntent so the client can save a card without charging immediately.
// Also ensures the user has a Stripe Customer record.
export async function POST() {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const [user] = await db.select().from(users).where(eq(users.id, caller.userId)).limit(1);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, user.id));
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
