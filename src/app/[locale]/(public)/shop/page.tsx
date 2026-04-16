import { useTranslations } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/shop/ProductGrid'

async function getOfficialProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name_fr, name_en, slug)')
    .eq('is_active', true)
    .eq('space', 'official')
    .order('created_at', { ascending: false })
  return data ?? []
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .in('space', ['official', 'both'])
  return data ?? []
}

export default async function ShopPage() {
  const [products, categories, locale] = await Promise.all([
    getOfficialProducts(),
    getCategories(),
    getLocale(),
  ])

  return <ShopPageContent products={products} categories={categories} locale={locale} />
}

function ShopPageContent({ products, categories, locale }: { products: any[]; categories: any[]; locale: string }) {
  const t = useTranslations('shop')

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>
      <ProductGrid products={products} categories={categories} locale={locale} space="official" />
    </div>
  )
}
