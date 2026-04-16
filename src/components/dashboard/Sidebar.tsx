'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  MessageSquare,
  Settings,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('dashboard')

  const isAdmin = pathname.includes('/admin')
  const isVendor = pathname.includes('/vendor')

  const adminLinks = [
    { href: `/${locale}/admin`, label: t('overview'), icon: LayoutDashboard },
    { href: `/${locale}/admin/orders`, label: t('orders'), icon: ShoppingBag },
    { href: `/${locale}/admin/products`, label: t('products'), icon: Package },
    { href: `/${locale}/admin/vendors`, label: t('vendors'), icon: Users },
    { href: `/${locale}/admin/transactions`, label: t('transactions'), icon: CreditCard },
    { href: `/${locale}/admin/support`, label: t('support'), icon: MessageSquare },
    { href: `/${locale}/admin/settings`, label: t('settings'), icon: Settings },
  ]

  const vendorLinks = [
    { href: `/${locale}/vendor`, label: t('overview'), icon: LayoutDashboard },
    { href: `/${locale}/vendor/products`, label: t('products'), icon: Package },
    { href: `/${locale}/vendor/orders`, label: t('orders'), icon: ShoppingBag },
    { href: `/${locale}/vendor/commissions`, label: t('commissions'), icon: DollarSign },
    { href: `/${locale}/vendor/support`, label: t('support'), icon: MessageSquare },
  ]

  const clientLinks = [
    { href: `/${locale}/client`, label: t('overview'), icon: LayoutDashboard },
    { href: `/${locale}/client/orders`, label: t('orders'), icon: ShoppingBag },
    { href: `/${locale}/client/support`, label: t('support'), icon: MessageSquare },
    { href: `/${locale}/client/settings`, label: t('settings'), icon: Settings },
  ]

  const links = isAdmin ? adminLinks : isVendor ? vendorLinks : clientLinks

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href={`/${locale}`} className="flex items-center gap-1">
          <span className="text-xl font-bold text-primary">Gabo</span>
          <span className="text-xl font-bold">Shop</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
