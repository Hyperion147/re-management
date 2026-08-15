import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized, forbidden } from '@/lib/auth';

export async function GET() {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();
    if (caller.role === 'USER') return forbidden();

    // Join sessions with users to get name + email alongside each session
    const rows = await db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        startedAt: sessions.startedAt,
        lastActive: sessions.lastActive,
        isOnline: sessions.isOnline,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
      })
      .from(sessions)
      .leftJoin(users, eq(sessions.userId, users.id))
      .orderBy(desc(sessions.startedAt));

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/sessions
 * Called by proxy.ts on every authenticated page request.
 * Upserts the session row and updates the user's last_seen + last_ip.
 */
export async function POST(req: Request) {
  try {
    const { userId, ipAddress, userAgent } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const now = new Date();

    // Upsert session — one active session per user (keyed by userId)
    const existing = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.startedAt))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(sessions)
        .set({ lastActive: now, isOnline: true, ipAddress, userAgent })
        .where(eq(sessions.id, existing[0].id));
    } else {
      await db.insert(sessions).values({
        userId,
        ipAddress,
        userAgent,
        startedAt: now,
        lastActive: now,
        isOnline: true,
      });
    }

    // Update user's last_seen and last_ip
    await db
      .update(users)
      .set({ lastSeen: now, lastIp: ipAddress })
      .where(eq(users.id, userId));

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
