'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function VendorOnboardingPage() {
  const locale = useLocale()
  const router = useRouter()
  const [form, setForm] = useState({
    businessName: '',
    description: '',
    city: '',
    phone: '',
    nif: '',
  })
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.businessName.trim()) {
      toast.error('Le nom de la boutique est requis.')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/${locale}/auth/login`)
        return
      }

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) throw new Error('Profil introuvable')

      // Create vendor record
      const { error } = await supabase.from('vendors').insert({
        profile_id: profile.id,
        business_name: form.businessName,
        description: form.description || null,
        city: form.city || null,
        phone: form.phone || null,
        nif: form.nif || null,
        is_verified: false,
      })

      if (error) throw error

      // Update profile role to vendor
      await supabase
        .from('profiles')
        .update({ role: 'vendor' })
        .eq('id', profile.id)

      toast.success('Boutique créée ! En attente de vérification.')
      router.push(`/${locale}/vendor`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la création.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-0.5">
            <span className="text-3xl font-bold text-[#006b2c]" style={{ fontFamily: 'var(--font-manrope)' }}>Gabo</span>
            <span className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-manrope)' }}>Shop</span>
          </Link>
          <p className="text-sm text-slate-500 mt-2">Espace revendeur</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006b2c]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-manrope)' }}>
                  Créer votre boutique
                </h1>
                <p className="text-xs text-slate-500">Informations de votre boutique</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              <span className="material-symbols-outlined text-amber-500 shrink-0" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>info</span>
              Votre boutique sera examinée par notre équipe avant d'être activée (24-48h).
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nom de la boutique <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>store</span>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => update('businessName', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                  placeholder="Ex: Tech Gabon, Épicerie du Centre…"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Description de la boutique
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c] resize-none"
                placeholder="Décrivez vos produits et services…"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ville</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>location_city</span>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                    placeholder="Libreville"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>phone</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                    placeholder="+241 01 00 00 00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Numéro NIF / RC
                <span className="text-xs text-slate-400 font-normal ml-2">(optionnel)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '18px' }}>badge</span>
                <input
                  type="text"
                  value={form.nif}
                  onChange={(e) => update('nif', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006b2c]/30 focus:border-[#006b2c]"
                  placeholder="Numéro d'identification fiscale"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006b2c] hover:bg-[#005a24] text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Création en cours…'
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>storefront</span>
                  Créer ma boutique
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
