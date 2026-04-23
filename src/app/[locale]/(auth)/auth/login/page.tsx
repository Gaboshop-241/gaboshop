'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const AVATARS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDI23sAS2ZCrymeCggRlJFZN061hXlUXw7DT4E-lezM_CmYzuqOTsS7UmmbK-OTUeBx_fD-RxO0uu4VtYYaIaFKW0CcnlBVotzHy8SRLM889AGJWhLJU2uUg_m-yaA2vx5bTp8CyJaWdereWiJxUe0UVZtAl1KbB0K6VPThZ7zjDXRQGSQR9v5LToUuIyLo6UkLvnvuG6Xe4rHnL5FEaQOf0EmBspM2NhjH34vd1bvudE1lhW5aHmvH2CIdEZy38QlzDmiwIui4APKA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDMjuXfKcKEdPElJSGDeyU5zDSGmdLD1V2nBzv720rgxKfxIbUmHD_g_jHF5N2M7E7uYXLZ0xCkeR2oUbNQ_wneIjNweFzcFI2xxk3vkX60Ge_KFJiv-zOG-R4BXSTRnqdEeHG5RvNuGsXBvgai7cs74NIhcc72HsPEd1DLg5_R7pLuZiNmM7gv4jZzzLHd6AimsCU-KmDZGwLoJ2K1vmqurycthM7t1X94ecd1w5RJKvYqh7EGZMUK11XuM2kDEDwq8C2JJiL_LbqF',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuARmxij-Ac2UyrY1PLv8l6-P9DBrfK7Oirr6aoRSrlgJiAoY_EO3XqqgGPldeihTePFroShvGF0YGyOv52y2pE_LmFL8Js-RnbJFMXqlKQ6XpSyJcRJAop2Phn1abAo-rNvrEXjmACYFrHIP7fSxZ-phmSGPTTWpjStf3icsJbPjzWjBmhF-BjUhF-BlXAtkGvSvjI1gLH4mhpRELJlMZS0r2-GquoZB12h8iAG762_NEUxrsV01TUXt5uRwFYL9TWuHI5Q5QkFaQf4',
]

export default function LoginPage() {
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const explicitRedirect = searchParams.get('redirectTo')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect.'
          : error.message === 'Email not confirmed'
          ? 'Veuillez confirmer votre email avant de vous connecter.'
          : error.message
      )
      setLoading(false)
      return
    }
    if (data.user) {
      let target = explicitRedirect
      if (!target) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle()
        const role = (profile?.role as string | undefined) ?? 'client'
        target =
          role === 'admin'  ? `/${locale}/admin`  :
          role === 'vendor' ? `/${locale}/vendor` :
                              `/${locale}/client`
      }
      router.push(target)
      router.refresh()
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    const supabase = createClient()
    const next = explicitRedirect || `/${locale}/client`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      toast.error('Connexion Google impossible. Vérifiez la configuration OAuth.')
      setGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel ── */}
      <section className="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden bg-[#006b2c]">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnIN3uBuwLwS4sYKanhJ0vzbu_PBDwNdJ4hKRVAJejL3jUyAYDAQF7_eej_lFIF0cNQ_c-kIn7DNqzOvu6bnpvzZ28owkBlYKk7FsEcFRkVERYzSGAm_wRzzbMRdqPRH2flZ7lkFGxHqGfmHyO3ErWbjZnpC2JmypcdK-ERESrRD1ZhwON8pvcMk0qtyeLQH_HLjLj4J1R6sASB3uQ52Cn4Wnnd4W_8RVAMnW1hZJ1S8UdaGX5Y3VG53Uip4OJFbSEMdJNng_9B8F8"
            alt="Forêt tropicale gabonaise"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#006b2c] to-transparent opacity-80" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 lg:p-20 text-white h-full">
          {/* Logo */}
          <Link href={`/${locale}`} className="inline-flex items-center gap-2.5 group">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7ffc97] via-[#fff170] to-[#3b82f6] flex items-center justify-center shadow-lg ring-1 ring-white/30 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[#131b2e]" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'var(--font-manrope)' }}>
              Akiba
            </span>
          </Link>

          {/* Headline */}
          <div className="max-w-xl space-y-5">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: 'var(--font-manrope)' }}>
              Bon retour sur Akiba
            </h1>
            <p className="text-xl lg:text-2xl text-[#7ffc97] opacity-90 leading-relaxed">
              Vos abonnements digitaux, payés en FCFA, livrés en 5 minutes.
            </p>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 border-t border-white/20 pt-8">
            <div className="flex -space-x-3">
              {AVATARS.map((src, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#006b2c] overflow-hidden bg-[#eaedff]">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm text-white/80">Rejoignez plus de 10 000 curateurs digitaux à travers le Gabon.</p>
          </div>
        </div>
      </section>

      {/* ── Right panel ── */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-[#faf8ff]">
        {/* Mobile logo */}
        <div className="md:hidden self-start mb-12">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7ffc97] via-[#fff170] to-[#3b82f6] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[#131b2e]" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-[#131b2e]" style={{ fontFamily: 'var(--font-manrope)' }}>
              Akiba
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-10">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#131b2e] tracking-tight" style={{ fontFamily: 'var(--font-manrope)' }}>
              Bon retour !
            </h2>
            <p className="text-[#3e4a3d]">Veuillez entrer vos coordonnées pour accéder à votre espace.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold text-[#3e4a3d] uppercase tracking-wider">
                Adresse email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="nom@exemple.ga"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-[#e2e7ff] focus:border-[#006b2c] focus:outline-none focus:ring-0 text-[#131b2e] placeholder-[#3e4a3d]/40 transition-colors"
                />
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[#3e4a3d]/50 select-none" style={{ fontSize: '20px' }}>
                  mail
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-[#3e4a3d] uppercase tracking-wider">
                  Mot de passe
                </label>
                <Link href={`/${locale}/auth/forgot-password`} className="text-xs font-semibold text-[#006b2c] hover:text-[#00873a] transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-[#e2e7ff] focus:border-[#006b2c] focus:outline-none focus:ring-0 text-[#131b2e] placeholder-[#3e4a3d]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#3e4a3d]/50 hover:text-[#006b2c] transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPwd ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-br from-[#006b2c] to-[#00873a] text-white font-bold rounded-xl shadow-[0_12px_32px_-4px_rgba(0,107,44,0.18)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
                style={{ fontFamily: 'var(--font-manrope)' }}
              >
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-[#e2e7ff]" />
                <span className="flex-shrink mx-4 text-xs text-[#3e4a3d] uppercase tracking-widest">ou continuer avec</span>
                <div className="flex-grow border-t border-[#e2e7ff]" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full py-4 px-6 bg-white border border-[#bdcaba]/30 text-[#131b2e] font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-[#f2f3ff] transition-colors active:scale-[0.98] disabled:opacity-60"
                style={{ fontFamily: 'var(--font-manrope)' }}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.21-3.21C17.5 1.63 14.96 1 12 1 7.42 1 3.52 3.65 1.64 7.47l3.77 2.92C6.31 7.22 8.94 5.04 12 5.04z" fill="#EA4335" />
                  <path d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.48-1.11 2.74-2.36 3.58l3.78 2.94c2.21-2.04 3.6-5.04 3.6-8.76z" fill="#4285F4" />
                  <path d="M5.41 14.61c-.24-.71-.37-1.46-.37-2.24s.13-1.53.37-2.24l-3.77-2.92C.6 8.93 0 10.4 0 12s.6 3.07 1.64 4.77l3.77-3.16z" fill="#FBBC05" />
                  <path d="M12 23c3.12 0 5.73-1.02 7.64-2.77l-3.78-2.94c-1.06.71-2.42 1.13-3.86 1.13-3.06 0-5.65-2.08-6.58-4.88L1.64 16.71C3.52 20.53 7.42 23 12 23z" fill="#34A853" />
                </svg>
                {googleLoading ? 'Connexion…' : 'Se connecter avec Google'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-[#3e4a3d]">
            Pas encore de compte ?{' '}
            <Link href={`/${locale}/auth/register`} className="ml-1 text-[#006b2c] font-bold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Legal */}
        <div className="mt-auto pt-12 flex flex-wrap gap-x-6 gap-y-2 opacity-50 text-[10px] uppercase tracking-widest text-[#3e4a3d]">
          <span>© 2026 Akiba</span>
          <Link href={`/${locale}/legal/privacy`} className="hover:text-[#006b2c] transition-colors">Confidentialité</Link>
          <Link href={`/${locale}/legal/terms`} className="hover:text-[#006b2c] transition-colors">Conditions</Link>
          <Link href={`/${locale}/help`} className="hover:text-[#006b2c] transition-colors">Support</Link>
        </div>
      </section>
    </main>
  )
}
