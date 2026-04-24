'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { PaymentLogosRow } from '@/components/PaymentLogos'
import { AkibaLogo } from '@/components/brand/AkibaLogo'
import { GabonMap } from '@/components/brand/GabonMap'

export default function Footer() {
  const locale = useLocale()

  const LIENS_UTILES = [
    { href: `/${locale}`,             label: 'Accueil'    },
    { href: `/${locale}/shop`,        label: 'Catégories' },
    { href: `/${locale}/shop?sort=deals`, label: 'Offres' },
    { href: `/${locale}/help`,        label: 'Contact'    },
  ]
  const INFORMATIONS = [
    { href: `/${locale}/about`,          label: 'À propos'                  },
    { href: `/${locale}/legal/terms`,    label: "Conditions d'utilisation" },
    { href: `/${locale}/legal/privacy`,  label: 'Politique de confidentialité' },
    { href: `/${locale}/help`,           label: 'FAQ'                       },
  ]
  const AIDE = [
    { href: `/${locale}/help`,              label: 'Comment ça marche ?' },
    { href: `/${locale}/help#payments`,     label: 'Méthodes de paiement' },
    { href: `/${locale}/legal/returns`,     label: 'Livraison'           },
    { href: `/${locale}/help`,              label: 'Support'             },
  ]

  const SOCIALS = [
    { icon: 'public',       label: 'Facebook',  href: '#' },
    { icon: 'photo_camera', label: 'Instagram', href: '#' },
    { icon: 'forum',        label: 'WhatsApp',  href: '#' },
    { icon: 'send',         label: 'Telegram',  href: '#' },
  ]

  return (
    <footer className="bg-[#0B0B0B] text-slate-300">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-16 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Col 1: brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block mb-5">
              <AkibaLogo size="md" variant="light" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-[260px]">
              Votre plateforme de confiance pour vos abonnements et services numériques au meilleur prix au Gabon.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/80 flex items-center justify-center hover:bg-[#22C55E] hover:border-[#22C55E] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Liens utiles */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5">Liens utiles</h4>
            <ul className="space-y-3 text-sm">
              {LIENS_UTILES.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-slate-400 hover:text-[#22C55E] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Informations */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5">Informations</h4>
            <ul className="space-y-3 text-sm">
              {INFORMATIONS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-slate-400 hover:text-[#22C55E] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Aide */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5">Aide</h4>
            <ul className="space-y-3 text-sm">
              {AIDE.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-slate-400 hover:text-[#22C55E] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact + Gabon map */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm mb-5">Nous contacter</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#22C55E] shrink-0 mt-0.5" style={{ fontSize: '18px' }}>call</span>
                    +241 62 12 34 56
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#22C55E] shrink-0 mt-0.5" style={{ fontSize: '18px' }}>mail</span>
                    contact@akibastore.ga
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#22C55E] shrink-0 mt-0.5" style={{ fontSize: '18px' }}>location_on</span>
                    Libreville, Gabon
                  </li>
                </ul>
              </div>
              <GabonMap size={110} className="shrink-0 hidden sm:block" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-5">
          <p className="text-xs text-slate-500">
            © 2026 AKIBASTORE. Tous droits réservés.
          </p>
          <PaymentLogosRow />
        </div>
      </div>
    </footer>
  )
}
