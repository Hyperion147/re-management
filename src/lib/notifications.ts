import type admin from 'firebase-admin';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';

type SendPushNotificationParams = {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
};

const INVALID_TOKEN_ERRORS = new Set([
  'messaging/invalid-registration-token',
  'messaging/registration-token-not-registered',
]);

export async function sendPushNotification({
  tokens,
  title,
  body,
  data,
}: SendPushNotificationParams) {
  const firebaseAdmin = getFirebaseAdmin();
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin SDK is not configured');
  }

  const uniqueTokens = [...new Set(tokens.filter(Boolean))];
  if (uniqueTokens.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokensRemoved: 0 };
  }

  const message: admin.messaging.MulticastMessage = {
    notification: { title, body },
    data: data ?? {},
    tokens: uniqueTokens,
  };

  const response = await firebaseAdmin.messaging().sendEachForMulticast(message);

  const invalidTokens = response.responses
    .map((result, index) => {
      const code = result.error?.code;
      if (!code || !INVALID_TOKEN_ERRORS.has(code)) return null;
      return uniqueTokens[index] ?? null;
    })
    .filter((token): token is string => !!token);

  if (invalidTokens.length > 0) {
    await Promise.all(
      invalidTokens.map((token) =>
        db
          .update(users)
          .set({ fcmToken: null })
          .where(eq(users.fcmToken, token))
      )
    );
  }

  return {
    ...response,
    invalidTokensRemoved: invalidTokens.length,
  };
}
