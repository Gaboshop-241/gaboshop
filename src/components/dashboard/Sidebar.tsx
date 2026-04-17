'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface Props {
  role: 'admin' | 'vendor' | 'client'
  vendorName?: string
  isVerified: boolean
  userInitials: string
}

const vendorLinks = (locale: string) => [
  { href: `/${locale}/vendor`, label: 'Tableau de bord', icon: 'dashboard' },
  { href: `/${locale}/vendor/products`, label: 'Mes Produits', icon: 'inventory_2' },
  { href: `/${locale}/vendor/orders`, label: 'Commandes', icon: 'shopping_cart' },
  { href: `/${locale}/vendor/commissions`, label: 'Commissions', icon: 'payments' },
  { href: `/${locale}/vendor/wallet`, label: 'Portefeuille', icon: 'account_balance_wallet' },
  { href: `/${locale}/vendor/support`, label: 'Support', icon: 'support_agent' },
  { href: `/${locale}/vendor/settings`, label: 'Paramètres', icon: 'settings' },
]

const adminLinks = (locale: string) => [
  { href: `/${locale}/admin`, label: 'Tableau de bord', icon: 'dashboard' },
  { href: `/${locale}/admin/products`, label: 'Produits', icon: 'inventory_2' },
  { href: `/${locale}/admin/orders`, label: 'Commandes', icon: 'shopping_cart' },
  { href: `/${locale}/admin/vendors`, label: 'Vendeurs', icon: 'store' },
  { href: `/${locale}/admin/transactions`, label: 'Transactions', icon: 'payments' },
  { href: `/${locale}/admin/support`, label: 'Support', icon: 'support_agent' },
  { href: `/${locale}/admin/settings`, label: 'Paramètres', icon: 'settings' },
]

const clientLinks = (locale: string) => [
  { href: `/${locale}/client`, label: 'Tableau de bord', icon: 'dashboard' },
  { href: `/${locale}/client/orders`, label: 'Mes Commandes', icon: 'shopping_cart' },
  { href: `/${locale}/client/support`, label: 'Support', icon: 'support_agent' },
  { href: `/${locale}/client/settings`, label: 'Paramètres', icon: 'settings' },
]

export default function DashboardSidebar({ role, vendorName, isVerified, userInitials }: Props) {
  const pathname = usePathname()
  const locale = useLocale()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push(`/${locale}/auth/login`)
  }

  const links =
    role === 'admin' ? adminLinks(locale) : role === 'vendor' ? vendorLinks(locale) : clientLinks(locale)

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 flex flex-col z-40 shadow-2xl">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800/60">
        <Link href={`/${locale}`} className="flex items-center gap-0.5">
          <span className="text-xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-manrope)' }}>Gabo</span>
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-manrope)' }}>Shop</span>
        </Link>
      </div>

      {/* Vendor profile */}
      {role === 'vendor' && (
        <div className="px-4 py-4 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{vendorName ?? 'Ma Boutique'}</p>
              {isVerified ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className="material-symbols-outlined text-emerald-400"
                    style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">Revendeur vérifié</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-500">En attente de vérification</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
          Menu Principal
        </p>
        <div className="space-y-0.5">
          {links.map(({ href, label, icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600/10 text-emerald-400 border-r-4 border-emerald-500'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-emerald-300 hover:translate-x-1'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '20px',
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {icon}
                </span>
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800/60">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all duration-200"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            logout
          </span>
          Déconnexion
        </button>
        <p className="text-[10px] text-slate-600 text-center mt-3">GaboShop v2.4.0</p>
      </div>
    </aside>
  )
}
