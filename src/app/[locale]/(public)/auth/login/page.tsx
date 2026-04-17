'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || `/${locale}/client`

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : error.message)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-0.5">
            <span className="text-3xl font-bold text-[#006b2c]" style={{ fontFamily: 'var(--font-manrope)' }}>Gabo</span>
            <span className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-manrope)' }}>Shop</span>
          </Link>
          <p className="text-sm text-slate-500 mt-2">La marketplace gabonaise</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'var(--font-manrope)' }}>
            Connexion
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Pas encore de compte ?{' '}
            <Link href={`/${locale}/auth/register`} className="text-[#006b2c] font-medium hover:underline">
              Créer un compte
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c] transition-colors"
                  placeholder="vous@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                <Link href={`/${locale}/auth/forgot-password`} className="text-xs text-[#006b2c] hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>lock</span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {showPwd ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006b2c] hover:bg-[#005a24] text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                'Connexion…'
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>login</span>
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        {/* Vendor CTA */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Vous voulez vendre sur GaboShop ?{' '}
            <Link href={`/${locale}/auth/register?vendor=1`} className="text-[#006b2c] font-medium hover:underline">
              Devenir revendeur
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
