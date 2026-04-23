'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Header() {
  const locale = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function switchLocale() {
    const next = locale === 'fr' ? 'en' : 'fr'
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/${locale}/shop?q=${encodeURIComponent(search.trim())}`)
      setMobileOpen(false)
    }
  }

  const navLinks = [
    { href: `/${locale}/shop`,           label: 'Akiba Store'  },
    { href: `/${locale}/marketplace`,    label: 'Akiba Market' },
    { href: `/${locale}/become-vendor`,  label: locale === 'fr' ? 'Devenir revendeur' : 'Become a seller' },
  ]

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-[#e2e7ff]'
          : 'bg-[#faf8ff]/80 backdrop-blur-md border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3.5">

        {/* ── Logo + nav ── */}
        <div className="flex items-center gap-10">
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7ffc97] via-[#fff170] to-[#3b82f6] flex items-center justify-center shadow-md ring-1 ring-[#131b2e]/5 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[#131b2e]" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-[#131b2e]">Akiba</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200',
                    isActive
                      ? 'text-[#006b2c] bg-[#7ffc97]/20'
                      : 'text-[#131b2e] hover:text-[#006b2c] hover:bg-[#f2f3ff]'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center bg-[#f2f3ff] hover:bg-white border border-transparent hover:border-[#e2e7ff] focus-within:bg-white focus-within:border-[#006b2c] focus-within:ring-2 focus-within:ring-[#006b2c]/20 px-4 py-2 rounded-full transition-all"
          >
            <span className="material-symbols-outlined text-[#3e4a3d] mr-2" style={{ fontSize: '18px' }}>search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-36 lg:w-56 text-[#131b2e] placeholder:text-[#3e4a3d]/60"
              placeholder={locale === 'fr' ? 'Rechercher un abonnement…' : 'Search a subscription…'}
            />
          </form>

          {/* Language switcher */}
          <button
            onClick={switchLocale}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-[#131b2e] hover:bg-[#f2f3ff] hover:text-[#006b2c] transition-all text-sm font-semibold"
            title={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>language</span>
            {locale.toUpperCase()}
          </button>

          {/* Cart */}
          <Link
            href={`/${locale}/checkout`}
            className="relative p-2.5 rounded-full text-[#131b2e] hover:bg-[#f2f3ff] hover:text-[#006b2c] transition-all"
            aria-label="Panier"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#006b2c] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth CTA */}
          <Link
            href={`/${locale}/auth/login`}
            className="hidden md:inline-flex items-center gap-1.5 bg-[#006b2c] hover:bg-[#00873a] text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-md shadow-[#006b2c]/20 hover:shadow-lg hover:shadow-[#006b2c]/30 hover:scale-[1.02] transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>login</span>
            {locale === 'fr' ? 'Connexion' : 'Sign in'}
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-full text-[#131b2e] hover:bg-[#f2f3ff] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#e2e7ff] px-4 sm:px-6 py-5 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="flex items-center bg-[#f2f3ff] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#006b2c]/20 px-4 py-2.5 rounded-full transition-all">
            <span className="material-symbols-outlined text-[#3e4a3d] mr-2" style={{ fontSize: '18px' }}>search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm flex-1 text-[#131b2e] placeholder:text-[#3e4a3d]/60"
              placeholder={locale === 'fr' ? 'Rechercher…' : 'Search…'}
            />
          </form>

          <div className="flex flex-col gap-1 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold py-3 px-4 rounded-xl text-[#131b2e] hover:bg-[#f2f3ff] hover:text-[#006b2c] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { switchLocale(); setMobileOpen(false) }}
              className="flex items-center gap-2 text-sm font-semibold py-3 px-4 rounded-xl text-[#131b2e] hover:bg-[#f2f3ff] hover:text-[#006b2c] transition-colors text-left"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>language</span>
              {locale === 'fr' ? 'Switch to English' : 'Passer en français'}
            </button>
          </div>

          <div className="flex gap-2 pt-3 border-t border-[#e2e7ff]">
            <Link
              href={`/${locale}/auth/register`}
              className="flex-1 text-center py-3 text-sm border-2 border-[#006b2c] text-[#006b2c] rounded-full font-semibold hover:bg-[#006b2c] hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {locale === 'fr' ? "S'inscrire" : 'Sign up'}
            </Link>
            <Link
              href={`/${locale}/auth/login`}
              className="flex-1 text-center py-3 text-sm bg-[#006b2c] text-white rounded-full font-semibold hover:bg-[#00873a] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {locale === 'fr' ? 'Connexion' : 'Sign in'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
