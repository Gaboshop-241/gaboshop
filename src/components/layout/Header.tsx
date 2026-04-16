'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ShoppingCart, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCartStore } from '@/store/cart'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    const segments = pathname.split('/')
    segments[1] = next
    router.push(segments.join('/'))
  }

  const navLinks = [
    { href: `/${locale}/shop`, label: t('shop') },
    { href: `/${locale}/marketplace`, label: t('marketplace') },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Gabo</span>
          <span className="text-2xl font-bold">Shop</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" aria-label="Langue">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLocale('fr')}>
                🇫🇷 Français {locale === 'fr' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale('en')}>
                🇬🇧 English {locale === 'en' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Link href={`/${locale}/checkout`} className="relative" aria-label={t('cart')}>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-4 w-4" />
            </Button>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            <Link href={`/${locale}/auth/login`} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              {t('login')}
            </Link>
            <Link href={`/${locale}/auth/register`} className={cn(buttonVariants({ size: 'sm' }))}>
              {t('register')}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t">
            <Link href={`/${locale}/auth/login`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1 justify-center')}>
              {t('login')}
            </Link>
            <Link href={`/${locale}/auth/register`} className={cn(buttonVariants({ size: 'sm' }), 'flex-1 justify-center')}>
              {t('register')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
