'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Star, Search, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'

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
  vendors?: { business_name: string; is_verified: boolean } | null
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
  const t = useTranslations('shop')
  const tCommon = useTranslations('common')
  const addItem = useCartStore((s) => s.addItem)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sort, setSort] = useState('newest')

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

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tCommon('search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t('all_categories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_categories')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {locale === 'fr' ? cat.name_fr : cat.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v ?? 'newest')}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('sort_newest')}</SelectItem>
            <SelectItem value="price_asc">{t('sort_price_asc')}</SelectItem>
            <SelectItem value="price_desc">{t('sort_price_desc')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">{t('no_products')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const title = locale === 'fr' ? product.title_fr : product.title_en
            const href = `/${locale}/${space}/${product.id}`
            return (
              <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-shadow">
                <Link href={href}>
                  <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-5xl">📦</span>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  {product.vendors && (
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-xs text-muted-foreground">{product.vendors.business_name}</span>
                      {product.vendors.is_verified && (
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">✓</Badge>
                      )}
                    </div>
                  )}
                  <Link href={href}>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-primary text-lg">
                      {product.price.toLocaleString()} FCFA
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-3"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-3 w-3" />
                    {t('add_to_cart')}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
