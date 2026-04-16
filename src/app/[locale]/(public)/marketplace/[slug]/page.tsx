import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import ProductDetail from '@/components/shop/ProductDetail'

export default async function MarketplaceProductPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name_fr, name_en), vendors(business_name, is_verified), reviews(rating, comment, created_at)')
    .eq('id', slug)
    .eq('space', 'marketplace')
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  return <ProductDetail product={product} locale={locale} />
}
