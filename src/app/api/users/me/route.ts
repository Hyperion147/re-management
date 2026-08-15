import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized } from '@/lib/auth';

export async function GET() {
  try {
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();

    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, caller.userId))
      .limit(1);

    if (!row) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(row);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
