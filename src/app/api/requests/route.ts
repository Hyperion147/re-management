import { NextResponse } from 'next/server';
import { desc, isNotNull, ne } from 'drizzle-orm';
import { db } from '@/db';
import { requests, users } from '@/db/schema';
import { sendPushNotification } from '@/lib/notifications';

const SERVICE_EMOJI: Record<string, string> = {
  'Private Home Showing': 'Home',
  'Multi-Home Tour': 'Tour',
  'Request a Task': 'Task',
  'Virtual Walkthrough': 'Video',
  'Buyer Consultation': 'Consult',
  'Flat Fee Agent': 'Agent',
  'Market Analysis (CMA)': 'CMA',
  'Listing Consultation': 'Listing',
  'Open House Hosting': 'Open House',
  'Property Photography': 'Photo',
  'Move-In / Move-Out Cleaning': 'Cleaning',
  'Home Staging': 'Staging',
  'Inspection Coordination': 'Inspect',
  'Lockbox Access Support': 'Lockbox',
};

export async function GET() {
  try {
    const allRequests = await db.select().from(requests).orderBy(desc(requests.createdAt));
    return NextResponse.json(allRequests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newRequest = await db.insert(requests).values(body).returning();
    const created = newRequest[0];

    try {
      const userRows = await db
        .select({ fcmToken: users.fcmToken })
        .from(users)
        .where(isNotNull(users.fcmToken));

      const creatorRows = created.clientId
        ? await db
            .select({ fcmToken: users.fcmToken })
            .from(users)
            .where(ne(users.id, created.clientId))
        : [];

      const allTokens = userRows
        .map((row) => row.fcmToken)
        .filter((token): token is string => !!token && token.trim() !== '');

      const nonCreatorTokens = creatorRows
        .map((row) => row.fcmToken)
        .filter((token): token is string => !!token && token.trim() !== '');

      const tokens = nonCreatorTokens.length > 0 ? nonCreatorTokens : allTokens;

      if (tokens.length > 0) {
        const label = SERVICE_EMOJI[created.serviceType] ?? 'Job';

        await sendPushNotification({
          tokens,
          title: `New ${label} job available`,
          body: `${created.address}, ${created.city} - $${created.compensation}`,
          data: {
            requestId: created.id,
            type: 'new_opening',
          },
        });
      }
    } catch (notifErr) {
      console.error('[FCM] Failed to send opening notification:', notifErr);
    }

    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
