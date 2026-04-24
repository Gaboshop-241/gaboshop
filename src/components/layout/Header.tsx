'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AkibaLogo } from '@/components/brand/AkibaLogo'

export default function Header() {
  const locale = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/${locale}/shop?q=${encodeURIComponent(search.trim())}`)
      setMobileOpen(false)
    }
  }

  const navLinks = [
    { href: `/${locale}`,             label: 'Accueil'    },
    { href: `/${locale}/shop`,        label: 'Catégories' },
    { href: `/${locale}/shop?sort=deals`, label: 'Offres' },
    { href: `/${locale}/help`,        label: 'Contact'    },
  ]

  function isActive(href: string) {
    const base = href.split('?')[0]
    if (base === `/${locale}`) return pathname === base || pathname === `${base}/`
    return pathname === base || pathname.startsWith(base + '/')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow',
        scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.04)]' : 'border-b border-[#F0F0F0]'
      )}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-6 px-6 lg:px-12 h-20">

        {/* ── Logo ── */}
        <Link href={`/${locale}`} className="shrink-0">
          <AkibaLogo size="md" variant="dark" />
        </Link>

        {/* ── Center nav ── */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'relative text-sm font-semibold transition-colors',
                  active ? 'text-[#22C55E]' : 'text-[#0B0B0B] hover:text-[#22C55E]'
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-[#22C55E]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-[#F5F5F5] hover:bg-[#EFEFEF] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#22C55E]/30 focus-within:shadow-sm rounded-full pl-5 pr-2 h-11 w-[280px] lg:w-[340px] transition-all"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-0 text-sm text-[#0B0B0B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
              placeholder="Rechercher…"
            />
            <button
              type="submit"
              aria-label="Rechercher"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#22C55E] transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
            </button>
          </form>

          {/* Cart */}
          <Link
            href={`/${locale}/checkout`}
            aria-label="Panier"
            className="relative w-11 h-11 rounded-full border border-[#E5E7EB] hover:border-[#22C55E] hover:text-[#22C55E] text-[#0B0B0B] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#22C55E] text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href={`/${locale}/auth/login`}
            aria-label="Mon compte"
            className="hidden sm:flex w-11 h-11 rounded-full border border-[#E5E7EB] hover:border-[#22C55E] hover:text-[#22C55E] text-[#0B0B0B] items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>person</span>
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            className="lg:hidden w-11 h-11 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#0B0B0B]"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#F0F0F0] bg-white px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="flex items-center bg-[#F5F5F5] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#22C55E]/30 rounded-full pl-5 pr-2 h-12">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-0 text-sm text-[#0B0B0B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
              placeholder="Rechercher…"
            />
            <button type="submit" aria-label="Rechercher" className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B7280]">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
            </button>
          </form>

          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'py-3 px-4 rounded-xl text-sm font-semibold transition-colors',
                  isActive(link.href)
                    ? 'bg-[#22C55E]/10 text-[#22C55E]'
                    : 'text-[#0B0B0B] hover:bg-[#F5F5F5]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#F0F0F0]">
            <Link
              href={`/${locale}/auth/register`}
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-3 text-sm rounded-full border-2 border-[#22C55E] text-[#22C55E] font-semibold"
            >
              S’inscrire
            </Link>
            <Link
              href={`/${locale}/auth/login`}
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center py-3 text-sm rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold"
            >
              Connexion
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
