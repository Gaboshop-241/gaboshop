import { getLocale } from 'next-intl/server'
import Link from 'next/link'
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

  return (
    <div className="pb-28 md:pb-10 max-w-7xl mx-auto px-6 pt-8">

      {/* Breadcrumb & Title */}
      <section className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-[#3e4a3d] mb-4">
          <Link href={`/${locale}`} className="hover:text-[#006b2c] transition-colors">
            Accueil
          </Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span className="text-[#006b2c] font-medium">Boutique</span>
        </nav>
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-3xl text-[#131b2e]">Boutique Officielle</h1>
          <span
            className="material-symbols-outlined text-[#006b2c]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>
        <p className="text-[#3e4a3d] mt-1">Abonnements, comptes partagés et services digitaux</p>
      </section>

      <ProductGrid products={products} categories={categories} locale={locale} space="official" />
    </div>
  )
}
