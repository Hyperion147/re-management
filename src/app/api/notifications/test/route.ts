import { NextResponse } from 'next/server';
import { and, eq, isNotNull } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getCurrentUserRole, forbidden, unauthorized } from '@/lib/auth';
import { sendPushNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();
    if (!['ADMIN', 'SUPERADMIN'].includes(caller.role)) return forbidden();

    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === 'string' && body.title.trim()
      ? body.title.trim()
      : 'Veyro test notification';
    const messageBody = typeof body.body === 'string' && body.body.trim()
      ? body.body.trim()
      : `Test push sent at ${new Date().toLocaleString('en-US', { hour12: true })}`;

    const recipients = await db
      .select({ fcmToken: users.fcmToken })
      .from(users)
      .where(and(eq(users.status, 'Active'), isNotNull(users.fcmToken)));

    const tokens = recipients
      .map((recipient) => recipient.fcmToken)
      .filter((token): token is string => !!token && token.trim() !== '');

    if (tokens.length === 0) {
      return NextResponse.json({ error: 'No active users have notifications enabled.' }, { status: 400 });
    }

    const response = await sendPushNotification({
      tokens,
      title,
      body: messageBody,
      data: { type: 'admin_test' },
    });

    return NextResponse.json({
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokensRemoved: response.invalidTokensRemoved,
      attemptedCount: tokens.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
