import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Zap, Shield, MapPin, ArrowRight, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

async function getFeaturedProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('id, title_fr, title_en, price, currency, images, space, vendor_id')
    .eq('is_active', true)
    .limit(6)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function HomePage() {
  const [locale, products, t, tCommon] = await Promise.all([
    getLocale(),
    getFeaturedProducts(),
    getTranslations('home'),
    getTranslations('common'),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-4">🇬🇦 Made for Gabon</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('hero_title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/shop`} className={cn(buttonVariants({ size: 'lg' }))}>
              {t('cta_shop')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href={`/${locale}/marketplace`} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              {t('cta_marketplace')}
            </Link>
          </div>
        </div>
      </section>

      {/* Two spaces */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-6">
          <Card className="border-primary/20 hover:border-primary transition-colors">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">🏪</div>
              <h2 className="text-xl font-bold mb-2">{t('official_title')}</h2>
              <p className="text-muted-foreground mb-4">{t('official_desc')}</p>
              <Link href={`/${locale}/shop`} className={cn(buttonVariants())}>
                {t('cta_shop')}
              </Link>
            </CardContent>
          </Card>
          <Card className="border-green-500/20 hover:border-green-500 transition-colors">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">🤝</div>
              <h2 className="text-xl font-bold mb-2">{t('marketplace_title')}</h2>
              <p className="text-muted-foreground mb-4">{t('marketplace_desc')}</p>
              <Link href={`/${locale}/marketplace`} className={cn(buttonVariants({ variant: 'outline' }))}>
                {t('cta_marketplace')}
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured products */}
      {products.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">{t('featured_products')}</h2>
              <Link href={`/${locale}/shop`} className={cn(buttonVariants({ variant: 'ghost' }))}>
                {tCommon('view_all')} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <FeaturedProductCard key={product.id} product={product as any} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why GaboShop */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">{t('why_gaboshop')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="h-8 w-8 text-primary" />, title: t('fast_delivery'), desc: t('fast_delivery_desc') },
              { icon: <Shield className="h-8 w-8 text-primary" />, title: t('secure'), desc: t('secure_desc') },
              { icon: <MapPin className="h-8 w-8 text-primary" />, title: t('local'), desc: t('local_desc') },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="flex justify-center mb-4">{icon}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become vendor CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Devenez revendeur GaboShop 🇬🇦</h2>
          <p className="mb-6 opacity-90">
            Proposez vos services à des milliers de clients gabonais. Inscription gratuite, paiements via SingPay.
          </p>
          <Link href={`/${locale}/auth/register?vendor=1`} className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}>
            Commencer maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeaturedProductCard({ product, locale }: { product: { id: string; title_fr: string; title_en: string; price: number; images: string[]; space: string }; locale: string }) {
  const space = product.space as 'official' | 'marketplace'
  const href = `/${locale}/${space === 'official' ? 'shop' : 'marketplace'}/${product.id}`
  const title = locale === 'fr' ? product.title_fr : product.title_en

  return (
    <Link href={href}>
      <Card className="group hover:shadow-md transition-shadow overflow-hidden">
        <div className="aspect-video bg-muted flex items-center justify-center">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">📦</span>
          )}
        </div>
        <CardContent className="p-4">
          <Badge variant={space === 'official' ? 'default' : 'secondary'} className="mb-2 text-xs">
            {space === 'official' ? 'Officiel' : 'Marketplace'}
          </Badge>
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-primary">
              {product.price.toLocaleString()} FCFA
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
