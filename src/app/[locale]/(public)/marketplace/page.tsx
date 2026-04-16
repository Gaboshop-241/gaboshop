import { useTranslations } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/shop/ProductGrid'

async function getMarketplaceProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name_fr, name_en, slug), vendors(business_name, is_verified)')
    .eq('is_active', true)
    .eq('space', 'marketplace')
    .order('created_at', { ascending: false })
  return data ?? []
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .in('space', ['marketplace', 'both'])
  return data ?? []
}

export default async function MarketplacePage() {
  const [products, categories, locale] = await Promise.all([
    getMarketplaceProducts(),
    getCategories(),
    getLocale(),
  ])

  return <MarketplaceContent products={products} categories={categories} locale={locale} />
}

function MarketplaceContent({ products, categories, locale }: { products: any[]; categories: any[]; locale: string }) {
  const t = useTranslations('marketplace')

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>
      <ProductGrid products={products} categories={categories} locale={locale} space="marketplace" />
    </div>
  )
}
