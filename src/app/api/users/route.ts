import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getCurrentUserRole, unauthorized, forbidden } from '@/lib/auth';

export async function GET() {
  try {
    // ADMIN and SUPERADMIN can list users; plain USERs cannot
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();
    if (caller.role === 'USER') return forbidden();

    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return NextResponse.json(allUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Only SUPERADMIN can create users via the API
    const caller = await getCurrentUserRole();
    if (!caller) return unauthorized();
    if (caller.role !== 'SUPERADMIN') return forbidden();

    const body = await req.json();

    // SUPERADMIN cannot be created via the API — must be set directly in the DB
    if (body.role === 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'SUPERADMIN accounts cannot be created via the API. Set the role directly in the database.' },
        { status: 403 }
      );
    }

    const newUser = await db.insert(users).values(body).returning();
    return NextResponse.json(newUser[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
