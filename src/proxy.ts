import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './lib/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/vendor', '/client']
const MARKETPLACE_ROUTES = ['/marketplace']
const ADMIN_ROUTES = ['/admin']
const VENDOR_ROUTES = ['/vendor']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|en)/, '')
  const locale = pathname.startsWith('/en') ? 'en' : 'fr'

  // Geo-restriction for marketplace
  if (MARKETPLACE_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))) {
    const country = request.headers.get('x-vercel-ip-country')
    if (process.env.NODE_ENV === 'production' && country && country !== 'GA') {
      return NextResponse.redirect(new URL(`/${locale}/geo-blocked`, request.url))
    }
  }

  // For protected routes we run the i18n middleware first to get a base
  // response we can attach refreshed Supabase cookies onto, then we add the
  // auth gate. For everything else, just delegate to next-intl.
  if (!PROTECTED_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))) {
    return intlMiddleware(request)
  }

  let response = intlMiddleware(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Mirror refreshed cookies into both the incoming request (so
          // downstream getUser/profile lookups see them) AND the outgoing
          // response (so the browser stores the rotated tokens). Without
          // this, Supabase's token rotation silently drops the new cookie
          // and the next navigation appears unauthenticated — causing the
          // login → dashboard → login bounce.
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const redirect = NextResponse.redirect(
      new URL(`/${locale}/auth/login?redirectTo=${encodeURIComponent(pathname)}`, request.url)
    )
    // Carry any cookies the SDK may have set during getUser onto the redirect
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c))
    return redirect
  }

  // Role-based gating
  const needsRoleCheck =
    ADMIN_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r)) ||
    VENDOR_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))

  if (needsRoleCheck) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const isAdminRoute = ADMIN_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))
    const allowed = isAdminRoute
      ? profile?.role === 'admin'
      : ['vendor', 'admin'].includes(profile?.role ?? '')

    if (!allowed) {
      const redirect = NextResponse.redirect(new URL(`/${locale}/`, request.url))
      response.cookies.getAll().forEach((c) => redirect.cookies.set(c))
      return redirect
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
