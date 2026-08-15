import { createServerClient } from '@supabase/ssr'
import { normalizeRole } from '@/lib/roles'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isAdminPage = pathname.startsWith('/admin')
  const isClientPage = pathname.startsWith('/client')
  const isProtectedPage = isAdminPage || isClientPage

  // 1. Not logged in → redirect to login
  if (isProtectedPage && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Logged in on auth page → redirect to dashboard
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/client', request.url))
  }

  // 3. Admin route protection — check role from DB
  if (isAdminPage && user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // Debug: log user id and role fetched from DB
    try {
      // eslint-disable-next-line no-console
      console.log('[proxy] auth user id:', user.id, 'db role:', userData?.role);
    } catch (e) {}

    const role = normalizeRole(userData?.role ?? 'USER') ?? 'USER'
    if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/no-access', request.url))
    }
  }

  // 4. Record session + IP for authenticated users on page navigations
  if (user && (isClientPage || isAdminPage)) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'
    const userAgent = request.headers.get('user-agent') || ''

    // Fire-and-forget — don't block the response
    fetch(`${request.nextUrl.origin}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, ipAddress: ip, userAgent }),
    }).catch(() => { /* session tracking is non-critical */ })
  }

  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and API routes
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
