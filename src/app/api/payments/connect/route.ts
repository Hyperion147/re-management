import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

// GET  — returns the agent's current connect status + dashboard link if active
// POST — creates a Stripe Connect Express account and returns an onboarding link
export async function GET() {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const [user] = await db.select().from(users).where(eq(users.id, caller.userId)).limit(1);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.stripeConnectId) {
      return NextResponse.json({ status: 'not_connected' });
    }

    const account = await stripe.accounts.retrieve(user.stripeConnectId);
    const active = account.charges_enabled && account.payouts_enabled;

    if (active && user.stripeConnectStatus !== 'active') {
      await db.update(users).set({ stripeConnectStatus: 'active' }).where(eq(users.id, user.id));
    }

    return NextResponse.json({
      status: active ? 'active' : 'pending',
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const [user] = await db.select().from(users).where(eq(users.id, caller.userId)).limit(1);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let connectId = user.stripeConnectId;

    if (!connectId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: { userId: user.id },
      });
      connectId = account.id;
      await db.update(users)
        .set({ stripeConnectId: connectId, stripeConnectStatus: 'pending' })
        .where(eq(users.id, user.id));
    }

    const accountLink = await stripe.accountLinks.create({
      account: connectId,
      refresh_url: `${baseUrl}/client/profile?connect=refresh`,
      return_url: `${baseUrl}/client/profile?connect=success`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
