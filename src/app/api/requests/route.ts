import { NextRequest, NextResponse } from 'next/server';
import { desc, ne, eq } from 'drizzle-orm';
import { db } from '@/db';
import { requests, users } from '@/db/schema';
import { sendPushNotification } from '@/lib/notifications';
import { sendBookingConfirmationEmail } from '@/lib/email';
import { getCurrentUserRole } from '@/lib/auth';

const SERVICE_LABEL: Record<string, string> = {
  'Private Home Showing': 'Home Showing',
  'Multi-Home Tour': 'Multi-Home Tour',
  'Request a Task': 'Task',
  'Virtual Walkthrough': 'Virtual Walkthrough',
  'Buyer Consultation': 'Buyer Consultation',
  'Flat Fee Agent': 'Flat Fee Agent',
  'Market Analysis (CMA)': 'Market Analysis',
  'Listing Consultation': 'Listing Consultation',
  'Open House Hosting': 'Open House',
  'Property Photography': 'Property Photography',
  'Move-In / Move-Out Cleaning': 'Cleaning',
  'Home Staging': 'Home Staging',
  'Inspection Coordination': 'Inspection',
  'Lockbox Access Support': 'Lockbox',
};

export async function GET(req: NextRequest) {
  try {
    // Admin-only: return all requests
    const auth = await getCurrentUserRole();
    if (!auth || !['ADMIN', 'SUPERADMIN'].includes(auth.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const allRequests = await db.select().from(requests).orderBy(desc(requests.createdAt));
    return NextResponse.json(allRequests);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Must be logged in to create a request
    const auth = await getCurrentUserRole();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Enforce the authenticated user's ID as clientId — never trust the body
    const payload = { ...body, clientId: auth.userId };

    const newRequest = await db.insert(requests).values(payload).returning();
    const created = newRequest[0];

    // --- Push notification to all agents (non-blocking) ---
    try {
      const creatorRows = await db
        .select({ fcmToken: users.fcmToken })
        .from(users)
        .where(ne(users.id, auth.userId));

      const tokens = creatorRows
        .map(r => r.fcmToken)
        .filter((t): t is string => !!t && t.trim() !== '');

      if (tokens.length > 0) {
        const label = SERVICE_LABEL[created.serviceType] ?? 'Job';
        await sendPushNotification({
          tokens,
          title: `New ${label} request available`,
          body: `${created.address}, ${created.city} — ₹${Number(created.compensation).toLocaleString('en-IN')}`,
          data: { requestId: created.id, type: 'new_opening' },
        });
      }
    } catch (notifErr) {
      console.error('[FCM] Failed to send push notification:', notifErr);
    }

    // --- Booking confirmation email to client (non-blocking) ---
    try {
      const clientRows = await db
        .select({ email: users.email, fullName: users.fullName })
        .from(users)
        .where(eq(users.id, auth.userId))
        .limit(1);

      const client = clientRows[0];
      if (client?.email) {
        sendBookingConfirmationEmail(client.email, client.fullName, {
          serviceType: created.serviceType,
          address: created.address,
          city: created.city,
          state: created.state,
          date: created.date,
          startTime: created.startTime,
          endTime: created.endTime,
          compensation: created.compensation,
          requestId: created.id,
        }).catch(err => console.error('[Email] Booking confirmation failed:', err));
      }
    } catch (emailErr) {
      console.error('[Email] Failed to fetch client for confirmation:', emailErr);
    }

    return NextResponse.json(created);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
