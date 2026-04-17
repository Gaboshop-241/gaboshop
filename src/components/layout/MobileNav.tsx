'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cart'

export default function MobileNav() {
  const locale = useLocale()
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`
  const isShop = pathname.includes('/shop')
  const isMarket = pathname.includes('/marketplace')

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,107,44,0.05)] z-50">
      <Link
        href={`/${locale}`}
        className={`flex flex-col items-center justify-center active:scale-95 transition-transform ${
          isHome ? 'text-[#006b2c]' : 'text-slate-400'
        }`}
      >
        <span className="material-symbols-outlined">home</span>
        <span className="text-[10px] font-medium">Accueil</span>
      </Link>

      <Link
        href={`/${locale}/shop`}
        className={`flex flex-col items-center justify-center rounded-2xl px-4 py-1.5 active:scale-95 transition-transform ${
          isShop ? 'bg-emerald-50 text-[#006b2c]' : 'text-slate-400'
        }`}
      >
        <span className="material-symbols-outlined">grid_view</span>
        <span className="text-[10px] font-medium">Boutique</span>
      </Link>

      <Link
        href={`/${locale}/checkout`}
        className="relative flex flex-col items-center justify-center text-slate-400 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">shopping_bag</span>
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 bg-[#006b2c] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
        <span className="text-[10px] font-medium">Panier</span>
      </Link>

      <Link
        href={`/${locale}/auth/login`}
        className="flex flex-col items-center justify-center text-slate-400 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px] font-medium">Profil</span>
      </Link>
    </nav>
  )
}
