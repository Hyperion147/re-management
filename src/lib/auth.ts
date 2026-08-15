import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

/**
 * Resolves the role of the currently authenticated user from the DB.
 *
 * Reads the Supabase JWT from the Authorization header (set by the axios
 * interceptor in src/lib/axios.ts). Falls back to null if missing or invalid.
 */
export async function getCurrentUserRole(): Promise<{ userId: string; role: string } | null> {
  try {
    const headerStore = await headers();
    const authorization = headerStore.get('authorization');
    if (!authorization?.startsWith('Bearer ')) return null;

    const jwt = authorization.slice(7);

    // Use a plain Supabase client with the anon key to verify the JWT
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: { user }, error } = await supabase.auth.getUser(jwt);
    if (error || !user) return null;

    const [row] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    return { userId: user.id, role: row?.role ?? 'USER' };
  } catch {
    return null;
  }
}

/** Returns a 401 response. */
export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Returns a 403 response. */
export function forbidden() {
  return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
}
