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

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|en)/, '')

  // Geo-restriction for marketplace
  if (MARKETPLACE_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))) {
    const country = request.headers.get('x-vercel-ip-country')
    // In development, allow access; in production enforce Gabon only
    if (process.env.NODE_ENV === 'production' && country && country !== 'GA') {
      const locale = pathname.startsWith('/en') ? 'en' : 'fr'
      return NextResponse.redirect(
        new URL(`/${locale}/geo-blocked`, request.url)
      )
    }
  }

  // Auth guard for protected routes
  if (PROTECTED_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const locale = pathname.startsWith('/en') ? 'en' : 'fr'

    if (!user) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?redirectTo=${encodeURIComponent(pathname)}`, request.url)
      )
    }

    // Role-based access for admin routes
    if (ADMIN_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL(`/${locale}/`, request.url))
      }
    }

    // Role-based access for vendor routes
    if (VENDOR_ROUTES.some((r) => pathnameWithoutLocale.startsWith(r))) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!profile || !['vendor', 'admin'].includes(profile.role)) {
        const locale2 = pathname.startsWith('/en') ? 'en' : 'fr'
        return NextResponse.redirect(new URL(`/${locale2}/`, request.url))
      }
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
