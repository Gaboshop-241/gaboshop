import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Supabase email confirmation callback.
 * Supabase redirects here after the user clicks the confirmation/reset link.
 * The `code` param is exchanged for a session cookie, then the user is redirected.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/fr/client'
  const type = searchParams.get('type') // 'signup' | 'recovery' | 'invite'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/fr/auth/reset-password`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/fr/auth/login?error=auth_callback_failed`)
}
