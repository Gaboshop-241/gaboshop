'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const COUNTRIES = [
  { code: 'GA', label: '🇬🇦 Gabon' },
  { code: 'CM', label: '🇨🇲 Cameroun' },
  { code: 'CG', label: '🇨🇬 Congo' },
  { code: 'SN', label: '🇸🇳 Sénégal' },
  { code: 'CI', label: '🇨🇮 Côte d\'Ivoire' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'OTHER', label: '🌍 Autre pays' },
]

export default function RegisterPage() {
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isVendorFlow = searchParams.get('vendor') === '1'

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', country: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 8) { toast.error('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (isVendorFlow && form.country !== 'GA') { toast.error('Les revendeurs doivent être basés au Gabon.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/${locale}/${isVendorFlow ? 'auth/vendor-onboarding' : 'client'}`,
        data: { full_name: form.fullName, country_code: form.country, phone: form.phone },
      },
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Compte créé ! Vérifiez votre boîte email pour confirmer.')
      if (isVendorFlow && form.country === 'GA') {
        router.push(`/${locale}/auth/vendor-onboarding`)
      } else {
        router.push(`/${locale}/auth/login`)
      }
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
          {isVendorFlow && (
            <p className="text-xs font-semibold text-[#006b2c] bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mt-2 inline-block">
              Inscription Revendeur
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h1 className="text-xl font-bold text-slate-800 mb-1" style={{ fontFamily: 'var(--font-manrope)' }}>
            {isVendorFlow ? 'Créer un compte revendeur' : 'Créer un compte'}
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Déjà un compte ?{' '}
            <Link href={`/${locale}/auth/login`} className="text-[#006b2c] font-medium hover:underline">
              Se connecter
            </Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>person</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                  placeholder="Prénom Nom"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                  placeholder="vous@email.com"
                />
              </div>
            </div>

            {/* Phone + Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>phone</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                    placeholder="+241…"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Pays {isVendorFlow && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: '18px' }}>public</span>
                  <select
                    value={form.country}
                    onChange={(e) => update('country', e.target.value)}
                    required={isVendorFlow}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c] appearance-none"
                  >
                    <option value="">Choisir…</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Vendor warning */}
            {isVendorFlow && form.country && form.country !== 'GA' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-xs text-red-600">
                <span className="material-symbols-outlined text-red-400 shrink-0" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>warning</span>
                Les revendeurs doivent être basés au Gabon.
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>lock</span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                  placeholder="Min. 8 caractères"
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{showPwd ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>lock_reset</span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => update('confirm', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (isVendorFlow && !!form.country && form.country !== 'GA')}
              className="w-full py-3 rounded-xl bg-[#006b2c] hover:bg-[#005a24] text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Création…' : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                  {isVendorFlow ? 'Créer mon compte revendeur' : 'Créer mon compte'}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          En créant un compte, vous acceptez nos{' '}
          <Link href={`/${locale}/terms`} className="hover:underline">conditions d'utilisation</Link>
        </p>
      </div>
    </div>
  )
}
