import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import ProductDetail from '@/components/shop/ProductDetail'

export default async function MarketplaceProductPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params
  const locale = await getLocale()
  const supabase = await createClient()

  const [{ data: product }, { data: relatedProducts }] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(name_fr, name_en), vendors(business_name, is_verified), reviews(rating, comment, created_at)')
      .eq('id', slug)
      .eq('space', 'marketplace')
      .eq('is_active', true)
      .single(),
    supabase
      .from('products')
      .select('id, title_fr, title_en, price, images, categories(name_fr, name_en)')
      .eq('is_active', true)
      .eq('space', 'marketplace')
      .neq('id', slug)
      .limit(4)
      .order('created_at', { ascending: false }),
  ])

  if (!product) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProductDetail product={product} locale={locale} relatedProducts={(relatedProducts ?? []) as any} />
}
