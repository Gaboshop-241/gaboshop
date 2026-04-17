'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'

const ITEMS_PER_PAGE = 8

interface Product {
  id: string
  title_fr: string
  title_en: string
  price: number
  currency: string
  images: string[]
  space: 'official' | 'marketplace'
  vendor_id: string | null
  categories: { id: string; name_fr: string; name_en: string; slug: string } | null
}

interface Category {
  id: string
  name_fr: string
  name_en: string
  slug: string
}

interface Props {
  products: Product[]
  categories: Category[]
  locale: string
  space: 'official' | 'marketplace'
}

export default function ProductGrid({ products, categories, locale, space }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  const filtered = products
    .filter((p) => {
      const title = locale === 'fr' ? p.title_fr : p.title_en
      const matchSearch = title.toLowerCase().includes(search.toLowerCase())
      const matchCat = selectedCategory === 'all' || p.categories?.id === selectedCategory
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price
      if (sort === 'price_desc') return b.price - a.price
      return 0
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  function handleAddToCart(product: Product) {
    const title = locale === 'fr' ? product.title_fr : product.title_en
    addItem({
      id: product.id,
      productId: product.id,
      title,
      price: product.price,
      currency: product.currency,
      image: product.images[0] ?? null,
      space: product.space,
      vendorId: product.vendor_id,
    })
    toast.success(`${title} ajouté au panier`)
  }

  function handleSearch(val: string) { setSearch(val); setPage(1) }
  function handleCategory(val: string) { setSelectedCategory(val); setPage(1) }
  function handleSort(val: string) { setSort(val); setPage(1) }

  function getPageNumbers(): (number | '...')[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }

  return (
    <div>
      {/* Filters bar */}
      <section className="mb-10 p-4 bg-white rounded-2xl flex flex-wrap items-center gap-4 shadow-sm border border-[#bdcaba]/10">
        <div className="relative flex-1 min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4a3d]" style={{ fontSize: '18px' }}>
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full bg-[#f2f3ff] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#006b2c] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategory(e.target.value)}
            className="bg-[#f2f3ff] border-none rounded-xl py-2.5 px-4 text-sm font-medium text-[#3e4a3d] focus:ring-1 focus:ring-[#006b2c] focus:outline-none min-w-[180px] appearance-none cursor-pointer"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {locale === 'fr' ? cat.name_fr : cat.name_en}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-[#f2f3ff] border-none rounded-xl py-2.5 px-4 text-sm font-medium text-[#3e4a3d] focus:ring-1 focus:ring-[#006b2c] focus:outline-none min-w-[160px] appearance-none cursor-pointer"
          >
            <option value="newest">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
      </section>

      {/* Empty state */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-20 h-20 rounded-2xl bg-[#f2f3ff] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#006b2c] text-4xl">inventory_2</span>
          </div>
          <p className="text-[#131b2e] font-bold text-lg">Aucun produit trouvé</p>
          <p className="text-[#3e4a3d] text-sm">Aucun produit ne correspond à vos critères.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('all'); setSort('newest'); setPage(1) }}
            className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-xl border-2 border-[#006b2c] text-[#006b2c] text-sm font-semibold hover:bg-[#006b2c] hover:text-white transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          {/* Product grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginated.map((product) => {
              const title = locale === 'fr' ? product.title_fr : product.title_en
              const href = `/${locale}/${space === 'official' ? 'shop' : 'marketplace'}/${product.id}`
              const categoryName =
                (locale === 'fr' ? product.categories?.name_fr : product.categories?.name_en) ?? null

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl p-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#006b2c]/5 border border-transparent hover:border-[#006b2c]/10"
                >
                  <Link href={href}>
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#eaedff] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#006b2c] text-5xl">inventory_2</span>
                        </div>
                      )}
                      {categoryName && (
                        <span className="absolute top-2 left-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#006b2c] border border-[#006b2c]/20 rounded-full">
                          {categoryName}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="px-1">
                    <Link href={href}>
                      <h3 className="font-bold text-[#131b2e] text-lg mb-1 leading-tight group-hover:text-[#006b2c] transition-colors line-clamp-2">
                        {title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-amber-400 text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                      <span className="text-[10px] text-[#3e4a3d] font-medium ml-1">(--)</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-extrabold text-[#006b2c]">
                        {product.price.toLocaleString()} FCFA
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-3 bg-[#006b2c] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-[#00873a]"
                    >
                      <span className="material-symbols-outlined text-lg">shopping_cart</span>
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              )
            })}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className="mt-16 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#bdcaba]/30 text-[#3e4a3d] hover:border-[#006b2c] hover:text-[#006b2c] transition-all disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="px-2 text-[#3e4a3d]">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                      currentPage === p
                        ? 'bg-[#006b2c] text-white'
                        : 'border border-[#bdcaba]/30 text-[#3e4a3d] hover:border-[#006b2c] hover:text-[#006b2c]'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#bdcaba]/30 text-[#3e4a3d] hover:border-[#006b2c] hover:text-[#006b2c] transition-all disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </section>
          )}
        </>
      )}
    </div>
  )
}
