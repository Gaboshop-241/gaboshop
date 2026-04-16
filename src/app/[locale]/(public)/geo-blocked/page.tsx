import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { buttonVariants } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function GeoBlockedPage() {
  const locale = await getLocale()
  const t = await getTranslations('errors')
  const tNav = await getTranslations('nav')

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-6">🇬🇦</div>
      <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">{t('geo_blocked')}</h1>
      <p className="text-muted-foreground max-w-sm mb-6">{t('geo_blocked_desc')}</p>
      <div className="flex gap-3">
        <Link href={`/${locale}/shop`} className={cn(buttonVariants())}>{tNav('shop')}</Link>
        <Link href={`/${locale}`} className={cn(buttonVariants({ variant: 'outline' }))}>Retour à l&apos;accueil</Link>
      </div>
    </div>
  )
}
