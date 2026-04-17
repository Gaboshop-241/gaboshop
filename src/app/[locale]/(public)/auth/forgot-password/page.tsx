'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?type=recovery`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-0.5">
            <span className="text-3xl font-bold text-[#006b2c]" style={{ fontFamily: 'var(--font-manrope)' }}>Gabo</span>
            <span className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-manrope)' }}>Shop</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[#006b2c]" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
                  mark_email_read
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2" style={{ fontFamily: 'var(--font-manrope)' }}>
                Email envoyé !
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Vérifiez votre boîte email <strong>{email}</strong> et cliquez sur le lien de réinitialisation.
              </p>
              <Link
                href={`/${locale}/auth/login`}
                className="text-sm text-[#006b2c] font-medium hover:underline"
              >
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[#006b2c]" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>
                    lock_reset
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-manrope)' }}>
                  Mot de passe oublié ?
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Entrez votre email et nous vous enverrons un lien de réinitialisation.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                      placeholder="vous@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#006b2c] hover:bg-[#005a24] text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? 'Envoi…' : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                      Envoyer le lien
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link href={`/${locale}/auth/login`} className="text-sm text-slate-500 hover:text-[#006b2c]">
                    ← Retour à la connexion
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
