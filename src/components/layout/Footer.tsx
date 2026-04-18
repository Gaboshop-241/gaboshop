'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useState } from 'react'

export default function Footer() {
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    // TODO: wire to newsletter endpoint
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <footer className="bg-gradient-to-br from-[#131b2e] to-[#1a2238] text-slate-400 mt-20">
      {/* Top strip: trust signals */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          {[
            { icon: 'bolt',           label: 'Livraison en 5 min' },
            { icon: 'verified_user',  label: 'Paiements sécurisés' },
            { icon: 'support_agent',  label: 'Support 24/7' },
            { icon: 'workspace_premium', label: 'Qualité garantie' },
          ].map((item) => (
            <div key={item.icon} className="flex items-center gap-3 justify-center md:justify-start">
              <span
                className="material-symbols-outlined text-[#7ffc97] shrink-0"
                style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold text-white">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Col 1: Brand */}
        <div className="md:col-span-1">
          <Link href={`/${locale}`} className="flex items-center gap-2 mb-5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006b2c] to-[#00873a] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">GaboShop</span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            La plateforme de référence pour vos abonnements digitaux au Gabon. Livraison instantanée, paiement local, support 7j/7.
          </p>
          <div className="flex gap-3">
            {[
              { href: '#', icon: 'public',          label: 'Web' },
              { href: '#', icon: 'alternate_email', label: 'Email' },
              { href: '#', icon: 'forum',           label: 'WhatsApp' },
            ].map((s) => (
              <a
                key={s.icon}
                href={s.href}
                aria-label={s.label}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#006b2c] hover:border-[#006b2c] transition-all"
              >
                <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Explorer */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Explorer</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href={`/${locale}/shop`}                         className="hover:text-white transition-colors">Boutique Officielle</Link></li>
            <li><Link href={`/${locale}/marketplace`}                  className="hover:text-white transition-colors">Marketplace Local</Link></li>
            <li><Link href={`/${locale}/shop?category=streaming`}      className="hover:text-white transition-colors">Abonnements streaming</Link></li>
            <li><Link href={`/${locale}/shop?category=music`}          className="hover:text-white transition-colors">Abonnements musique</Link></li>
            <li><Link href={`/${locale}/auth/register?vendor=1`}       className="hover:text-white transition-colors">Vendre sur GaboShop</Link></li>
          </ul>
        </div>

        {/* Col 3: Assistance */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Assistance</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href={`/${locale}/about`}          className="hover:text-white transition-colors">À propos</Link></li>
            <li><Link href={`/${locale}/help`}           className="hover:text-white transition-colors">Aide & Support</Link></li>
            <li><Link href={`/${locale}/legal/terms`}    className="hover:text-white transition-colors">Conditions</Link></li>
            <li><Link href={`/${locale}/legal/returns`}  className="hover:text-white transition-colors">Politique de retour</Link></li>
            <li><Link href={`/${locale}/legal/privacy`}  className="hover:text-white transition-colors">Confidentialité</Link></li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Newsletter</h4>
          <p className="text-sm mb-4">Recevez nos promos et nouveautés en avant-première.</p>
          <form onSubmit={handleNewsletter} className="relative mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#7ffc97] focus:ring-2 focus:ring-[#7ffc97]/20 rounded-xl text-sm px-4 py-3 pr-12 focus:outline-none text-white placeholder:text-slate-500"
              placeholder="votre@email.ga"
              required
            />
            <button
              type="submit"
              aria-label="S'inscrire à la newsletter"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#006b2c] hover:bg-[#00873a] text-white p-2 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-[#7ffc97] flex items-center gap-1.5 -mt-4 mb-6">
              <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Merci ! Vous êtes inscrit.
            </p>
          )}

          <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Paiements acceptés</h4>
          <div className="flex flex-wrap gap-2">
            <PaymentLogo label="Airtel" bg="#E60000" />
            <PaymentLogo label="Moov"   bg="#FDB913" fg="#002E5D" />
            <PaymentLogo label="VISA"   bg="#1A1F71" />
            <PaymentLogo label="MC"     bg="#EB001B" title="Mastercard" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © 2026 GaboShop. Tous droits réservés. · Fait avec <span className="text-[#7ffc97]">♥</span> à Libreville.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-xs font-medium">
            <Link href={`/${locale}/legal/privacy`}  className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href={`/${locale}/legal/cookies`}  className="hover:text-white transition-colors">Cookies</Link>
            <Link href={`/${locale}/legal/mentions`} className="hover:text-white transition-colors">Mentions Légales</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function PaymentLogo({ label, bg, fg = '#FFFFFF', title }: { label: string; bg: string; fg?: string; title?: string }) {
  return (
    <div
      className="h-9 w-14 rounded-lg flex items-center justify-center font-black text-[11px] tracking-tight shadow-sm"
      style={{ backgroundColor: bg, color: fg }}
      title={title || label}
    >
      {label}
    </div>
  )
}
