'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { COUNTRIES, type Country } from '@/lib/countries'

// ── Password helpers ──────────────────────────────────────────────────────────

const CRITERIA = [
  { key: 'length',  label: '8 caractères minimum',           test: (p: string) => p.length >= 8 },
  { key: 'upper',   label: 'Une lettre majuscule (A-Z)',      test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lower',   label: 'Une lettre minuscule (a-z)',      test: (p: string) => /[a-z]/.test(p) },
  { key: 'number',  label: 'Un chiffre (0-9)',                test: (p: string) => /[0-9]/.test(p) },
  { key: 'special', label: 'Un caractère spécial (!@#$…)',   test: (p: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p) },
]

function scorePassword(p: string) {
  return CRITERIA.filter((c) => c.test(p)).length
}

function generatePassword(): string {
  const U = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const L = 'abcdefghjkmnpqrstuvwxyz'
  const N = '23456789'
  const S = '!@#$%&*'
  const ALL = U + L + N + S
  const r = (s: string) => s[Math.floor(Math.random() * s.length)]
  const chars = [r(U), r(U), r(L), r(L), r(N), r(N), r(S), r(S), ...Array.from({ length: 4 }, () => r(ALL))]
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}

const STRENGTH_COLORS = ['', '#ba1a1a', '#f97316', '#eab308', '#22c55e', '#006b2c']
const STRENGTH_LABELS = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']

// ── Country selector ──────────────────────────────────────────────────────────

function CountrySelector({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = COUNTRIES.find((c) => c.code === value)
  const filtered = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search)
  )

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-0 py-3 bg-transparent border-0 border-b-2 border-[#e2e7ff] focus:border-[#006b2c] focus:outline-none transition-colors text-left"
      >
        {selected ? (
          <span className="flex items-center gap-2 text-[#131b2e]">
            <span className="text-xl">{selected.flag}</span>
            <span className="text-sm">{selected.name}</span>
            <span className="text-xs text-[#3e4a3d]/50">{selected.dialCode}</span>
          </span>
        ) : (
          <span className="text-[#3e4a3d]/40 text-sm">Sélectionner un pays…</span>
        )}
        <span className="material-symbols-outlined text-[#3e4a3d]/50 select-none" style={{ fontSize: '20px' }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-[#e2e7ff] rounded-xl shadow-2xl mt-1 overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e2e7ff] bg-[#f2f3ff]">
            <span className="material-symbols-outlined text-[#3e4a3d]/50 shrink-0" style={{ fontSize: '18px' }}>search</span>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un pays…"
              className="flex-1 bg-transparent text-sm text-[#131b2e] placeholder-[#3e4a3d]/40 focus:outline-none"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="text-[#3e4a3d]/50 hover:text-[#006b2c]">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
              </button>
            )}
          </div>
          {/* List */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-[#3e4a3d]/50 py-6">Aucun pays trouvé</p>
            ) : (
              filtered.map((c: Country) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); setSearch('') }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#f2f3ff] ${
                    value === c.code ? 'bg-emerald-50 text-[#006b2c] font-semibold' : 'text-[#131b2e]'
                  }`}
                >
                  <span className="text-lg shrink-0">{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-xs text-[#3e4a3d]/40 shrink-0">{c.dialCode}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Password strength display ─────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password)
  if (!password) return null
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: i <= score ? STRENGTH_COLORS[score] : '#e2e7ff' }}
            />
          ))}
        </div>
        {score > 0 && (
          <span className="text-xs font-semibold shrink-0" style={{ color: STRENGTH_COLORS[score] }}>
            {STRENGTH_LABELS[score]}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
        {CRITERIA.map(({ key, label, test }) => {
          const met = test(password)
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs">
              <span
                className="material-symbols-outlined shrink-0"
                style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1", color: met ? '#006b2c' : '#bdcaba' }}
              >
                {met ? 'check_circle' : 'radio_button_unchecked'}
              </span>
              <span style={{ color: met ? '#006b2c' : '#6e7b6c' }}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Register page ─────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isVendorFlow = searchParams.get('vendor') === '1'

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', country: isVendorFlow ? 'GA' : '',
    password: '', confirm: '', invitationCode: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: '' }))
  }, [])

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Client-side confirm check
    if (form.password !== form.confirm) {
      setFieldErrors((p) => ({ ...p, confirm: 'Les mots de passe ne correspondent pas.' }))
      return
    }
    if (isVendorFlow && form.country !== 'GA') {
      setFieldErrors((p) => ({ ...p, country: 'Les revendeurs doivent être basés au Gabon.' }))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || undefined,
          country: form.country || undefined,
          password: form.password,
          invitationCode: form.invitationCode || undefined,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.field) {
          setFieldErrors((p) => ({ ...p, [data.field]: data.error }))
          toast.error(data.error)
        } else {
          toast.error(data.error || 'Erreur lors de la création du compte.')
        }
      } else {
        setSuccess(true)
        toast.success('Compte créé ! Vérifiez votre email.')
        if (isVendorFlow && form.country === 'GA') {
          setTimeout(() => router.push(`/${locale}/auth/vendor-onboarding`), 2000)
        }
      }
    } catch {
      toast.error('Erreur réseau. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100">
            <span className="material-symbols-outlined text-[#006b2c]" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
          </div>
          <h2 className="text-2xl font-bold text-[#131b2e] mb-3" style={{ fontFamily: 'var(--font-manrope)' }}>Email de confirmation envoyé !</h2>
          <p className="text-[#3e4a3d] text-sm mb-6">
            Vérifiez la boîte email <strong>{form.email}</strong> et cliquez sur le lien pour activer votre compte.
          </p>
          <Link href={`/${locale}/auth/login`} className="inline-flex items-center gap-2 text-[#006b2c] font-semibold hover:underline text-sm">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#faf8ff]">

      {/* ── Left panel ── */}
      <section className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#006b2c] items-center justify-center">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlxrcdA8fyO-IS89OanY_u8GHZe4BE2-VzdPfekDWVE5g2Y1-NR_-8DikR1X2m0yvX0d9Cfz40e0pOaHtKvW87B-yIov3lk14EZWKNCmQJXe4Qyg2SX2jgZw0SqCfo6afHF2P7RwA0lxdMKi0PvkoTuXzXVTWjaYTrvWN0lEWVC8-Smaqq38iGdTWy8-NCM7ghI-6AMTGk_VfXsJqxpD2Kwxn8gaFUcfAVhP01nqP5KWlkIn2Sa8X3CC-4ALQ-irBC0DPTR5GD8HJz"
          alt="Artisan gabonais"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#006b2c] via-transparent to-[#00873a] opacity-40" />
        <div className="relative z-10 p-12 lg:p-20 text-white max-w-xl">
          <Link href={`/${locale}`} className="mb-8 inline-flex items-center gap-2.5 group">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7ffc97] via-[#fff170] to-[#3b82f6] flex items-center justify-center shadow-lg ring-1 ring-white/30 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[#131b2e]" style={{ fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
            </span>
            <span className="font-extrabold text-3xl tracking-tight text-white" style={{ fontFamily: 'var(--font-manrope)' }}>Akiba</span>
          </Link>
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-manrope)' }}>
            Rejoignez la communauté
          </h2>
          <p className="text-xl lg:text-2xl text-[#7ffc97] leading-relaxed opacity-90">
            Accédez au meilleur du digital et de l'artisanat local avec une expérience curatoriale unique au Gabon.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { icon: 'verified_user', label: 'Paiements sécurisés' },
              { icon: 'local_shipping', label: 'Livraison Express' },
              { icon: 'support_agent', label: 'Support 24/7' },
              { icon: 'diversity_3', label: 'Communauté locale' },
            ].map(({ icon, label }) => (
              <div key={icon} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <span className="material-symbols-outlined text-[#68dba9] mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <p className="text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Right panel ── */}
      <section className="flex-1 md:w-1/2 bg-[#faf8ff] flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 relative">
        {/* Mobile logo */}
        <Link href={`/${locale}`} className="md:hidden self-start mb-10 inline-flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7ffc97] via-[#fff170] to-[#3b82f6] flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[#131b2e]" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
          </span>
          <span className="font-bold text-2xl tracking-tight text-[#131b2e]" style={{ fontFamily: 'var(--font-manrope)' }}>Akiba</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Desktop logo */}
          <div className="hidden md:flex mb-10 items-center justify-between">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7ffc97] via-[#fff170] to-[#3b82f6] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[#131b2e]" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
              </span>
              <span className="font-bold text-3xl tracking-tight text-[#131b2e]" style={{ fontFamily: 'var(--font-manrope)' }}>Akiba</span>
            </Link>
            {isVendorFlow && (
              <span className="text-xs font-semibold text-[#006b2c] bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                Compte Revendeur
              </span>
            )}
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#131b2e] mb-1" style={{ fontFamily: 'var(--font-manrope)' }}>
              Créer votre compte
            </h1>
            <p className="text-[#3e4a3d] text-sm">Complétez vos informations pour commencer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full name */}
            <Field label="Nom complet" error={fieldErrors.fullName}>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
                required
                placeholder="Ex: Jean-Paul Mba Obiang"
                className={inputCls(!!fieldErrors.fullName)}
              />
            </Field>

            {/* Email */}
            <Field label="Adresse email" error={fieldErrors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                required
                autoComplete="email"
                placeholder="votre@email.com"
                className={inputCls(!!fieldErrors.email)}
              />
            </Field>

            {/* Phone */}
            <Field label={`Téléphone (${selectedCountry?.dialCode || '+241'})`} error={fieldErrors.phone}>
              <div className="flex items-center gap-2">
                {selectedCountry && (
                  <span className="text-xl shrink-0">{selectedCountry.flag}</span>
                )}
                <span className="text-sm text-[#3e4a3d] shrink-0">{selectedCountry?.dialCode || '+241'}</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="06 00 00 00"
                  className={inputCls(!!fieldErrors.phone) + ' flex-1'}
                />
              </div>
              <div className={`border-b-2 transition-colors ${fieldErrors.phone ? 'border-[#ba1a1a]' : 'border-[#e2e7ff] focus-within:border-[#006b2c]'}`} />
            </Field>

            {/* Country */}
            <Field label="Pays de résidence" error={fieldErrors.country}>
              <CountrySelector value={form.country} onChange={(v) => set('country', v)} />
            </Field>

            {/* Password */}
            <Field label="Mot de passe" error={fieldErrors.password}>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputCls(!!fieldErrors.password) + ' pr-20'}
                />
                {/* Generator */}
                <button
                  type="button"
                  onClick={() => { const p = generatePassword(); set('password', p); set('confirm', p); setShowPwd(true) }}
                  title="Générer un mot de passe sécurisé"
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-[#006b2c] hover:text-[#00873a] transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_fix_high</span>
                </button>
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
              <PasswordStrength password={form.password} />
            </Field>

            {/* Confirm password */}
            <Field label="Confirmer le mot de passe" error={fieldErrors.confirm}>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => set('confirm', e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputCls(!!fieldErrors.confirm)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#3e4a3d]/50 hover:text-[#006b2c] transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showConfirm ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </Field>

            {/* Invitation code */}
            <Field label="Code d'invitation (optionnel)" error={fieldErrors.invitationCode}>
              <div className="relative">
                <input
                  type="text"
                  value={form.invitationCode}
                  onChange={(e) => set('invitationCode', e.target.value.toUpperCase())}
                  placeholder="Ex: GABO-2025"
                  maxLength={20}
                  className={inputCls(!!fieldErrors.invitationCode) + ' font-mono tracking-widest uppercase'}
                />
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-[#3e4a3d]/40 select-none" style={{ fontSize: '18px' }}>
                  card_membership
                </span>
              </div>
            </Field>

            {/* Terms */}
            <p className="text-[0.7rem] leading-relaxed text-[#3e4a3d]/70">
              En vous inscrivant, vous acceptez nos{' '}
              <Link href={`/${locale}/legal/terms`} className="text-[#006b2c] font-semibold hover:underline">Conditions Générales</Link>{' '}
              et notre{' '}
              <Link href={`/${locale}/legal/privacy`} className="text-[#006b2c] font-semibold hover:underline">Politique de Confidentialité</Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || scorePassword(form.password) < 5}
              className="w-full py-4 bg-gradient-to-r from-[#006b2c] to-[#00873a] text-white font-bold rounded-xl text-base shadow-lg shadow-[#006b2c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              {loading ? (
                'Création en cours…'
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
                  {isVendorFlow ? 'Créer mon compte revendeur' : 'Créer mon compte'}
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-10 text-center">
            <p className="text-[#3e4a3d] text-sm">
              Déjà un compte ?{' '}
              <Link href={`/${locale}/auth/login`} className="text-[#006b2c] font-bold ml-1 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Help button */}
        <Link href={`/${locale}/help`} className="absolute top-6 right-6 text-[#3e4a3d]/40 hover:text-[#006b2c] transition-colors" aria-label="Aide">
          <span className="material-symbols-outlined text-2xl">help_outline</span>
        </Link>

        {/* Inline legal footer */}
        <div className="w-full max-w-md mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest text-[#3e4a3d]/50">
          <span>© 2026 Akiba</span>
          <Link href={`/${locale}/legal/privacy`} className="hover:text-[#006b2c] transition-colors">Confidentialité</Link>
          <Link href={`/${locale}/legal/terms`} className="hover:text-[#006b2c] transition-colors">Conditions</Link>
          <Link href={`/${locale}/help`} className="hover:text-[#006b2c] transition-colors">Support</Link>
        </div>
      </section>
    </main>
  )
}

// ── Shared input helpers ──────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return `w-full px-0 py-3 bg-transparent border-0 border-b-2 ${
    hasError ? 'border-[#ba1a1a]' : 'border-[#e2e7ff] focus:border-[#006b2c]'
  } focus:outline-none focus:ring-0 text-[#131b2e] placeholder-[#3e4a3d]/40 transition-colors text-sm`
}

function Field({
  label, error, children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-[#3e4a3d] uppercase tracking-wider">{label}</label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-[#ba1a1a] mt-1">
          <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>error</span>
          {error}
        </p>
      )}
    </div>
  )
}
