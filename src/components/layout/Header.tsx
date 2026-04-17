'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Header() {
  const locale = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale() {
    const next = locale === 'fr' ? 'en' : 'fr'
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) router.push(`/${locale}/shop?q=${encodeURIComponent(search)}`)
  }

  const navLinks = [
    { href: `/${locale}/shop`, label: 'Boutique' },
    { href: `/${locale}/marketplace`, label: 'Marketplace' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#faf8ff]/80 backdrop-blur-md border-b border-[#f2f3ff]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">

        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="text-2xl font-bold tracking-tight text-[#006b2c]">
            GaboShop
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-medium transition-colors duration-200',
                    isActive
                      ? 'text-[#006b2c] font-bold border-b-2 border-[#006b2c] pb-1'
                      : 'text-[#131b2e] hover:text-[#00873a]'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: Search + actions */}
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-[#f2f3ff] px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-[#3e4a3d] mr-2" style={{ fontSize: '18px' }}>search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-48 text-[#131b2e] placeholder:text-[#3e4a3d]"
              placeholder="Rechercher..."
            />
          </form>

          <div className="flex items-center gap-4">
            <button
              onClick={switchLocale}
              className="text-[#3e4a3d] font-medium text-sm cursor-pointer hover:text-[#006b2c] transition-colors"
            >
              FR/EN
            </button>

            <Link href={`/${locale}/checkout`} className="relative p-2 text-[#131b2e] hover:scale-95 duration-150 ease-in-out">
              <span className="material-symbols-outlined">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#006b2c] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href={`/${locale}/auth/login`}
              className="hidden md:block bg-[#006b2c] text-white px-6 py-2 rounded-xl font-semibold hover:scale-95 duration-150 ease-in-out"
            >
              Connexion
            </Link>

            <button
              className="md:hidden p-2 text-[#131b2e]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#faf8ff] px-8 py-4 flex flex-col gap-3 border-t border-[#f2f3ff]">
          <form onSubmit={handleSearch} className="flex items-center bg-[#f2f3ff] px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-[#3e4a3d] mr-2" style={{ fontSize: '18px' }}>search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm flex-1 text-[#131b2e] placeholder:text-[#3e4a3d]"
              placeholder="Rechercher..."
            />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-2 text-[#131b2e] hover:text-[#006b2c]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t border-[#f2f3ff]">
            <Link
              href={`/${locale}/auth/register`}
              className="flex-1 text-center py-2 text-sm border border-[#006b2c] text-[#006b2c] rounded-full font-medium"
              onClick={() => setMobileOpen(false)}
            >
              S&apos;inscrire
            </Link>
            <Link
              href={`/${locale}/auth/login`}
              className="flex-1 text-center py-2 text-sm bg-[#006b2c] text-white rounded-full font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Connexion
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
