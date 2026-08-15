import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { eq, or, desc } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized } from '@/lib/auth';

export async function GET() {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const rows = await db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.fromUserId, caller.userId),
          eq(transactions.toUserId, caller.userId)
        )
      )
      .orderBy(desc(transactions.createdAt))
      .limit(50);

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
