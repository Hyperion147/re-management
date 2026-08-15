import { NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const { tokens, title, body, data } = await req.json();

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ error: 'No tokens provided' }, { status: 400 });
    }

    const response = await sendPushNotification({ tokens, title, body, data });

    return NextResponse.json({
      successCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokensRemoved: response.invalidTokensRemoved,
    });
  } catch (error: any) {
    console.error('[FCM Admin] Failed to send notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
