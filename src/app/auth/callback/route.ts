import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /auth/callback
 *
 * Supabase redirects here after a successful OAuth flow (e.g. Google).
 * Exchanges the code for a session, then ensures the user has a row in
 * the public users table (creates one with role USER if missing).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const requestedNext = searchParams.get('next')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const authUser = data.user

  // Ensure the user exists in our public users table.
  // Google users won't have a row yet on first login.
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1)

  if (!existing) {
    const fullName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'User'

    await db.insert(users).values({
      id: authUser.id,
      fullName,
      email: authUser.email!,
      role: 'USER',
    })
  }

  const [userRow] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1)

  const defaultNext =
    userRow?.role === 'ADMIN' || userRow?.role === 'SUPERADMIN' ? '/admin' : '/client'
  const next = requestedNext && requestedNext.startsWith('/') ? requestedNext : defaultNext

  return NextResponse.redirect(`${origin}${next}`)
}
