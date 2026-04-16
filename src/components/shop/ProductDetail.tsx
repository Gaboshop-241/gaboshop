'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Star, ShoppingCart, Zap, Shield, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Review {
  rating: number
  comment: string | null
  created_at: string
}

interface Product {
  id: string
  title_fr: string
  title_en: string
  description_fr: string
  description_en: string
  price: number
  currency: string
  images: string[]
  type: string
  space: 'official' | 'marketplace'
  vendor_id: string | null
  delivery_info: Record<string, unknown>
  vendors?: { business_name: string; is_verified: boolean } | null
  categories?: { name_fr: string; name_en: string } | null
  reviews?: Review[]
}

export default function ProductDetail({ product, locale }: { product: Product; locale: string }) {
  const t = useTranslations('shop')
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()
  const currentLocale = useLocale()

  const title = locale === 'fr' ? product.title_fr : product.title_en
  const description = locale === 'fr' ? product.description_fr : product.description_en
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : null

  function handleAddToCart() {
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

  function handleBuyNow() {
    handleAddToCart()
    router.push(`/${currentLocale}/checkout`)
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-muted rounded-xl overflow-hidden">
            {product.images[0] ? (
              <img src={product.images[0]} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="w-16 h-16 shrink-0 rounded-md overflow-hidden border">
                  <img src={img} alt={`${title} ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={product.space === 'official' ? 'default' : 'secondary'}>
                {product.space === 'official' ? 'Officiel' : 'Marketplace'}
              </Badge>
              {product.categories && (
                <Badge variant="outline">
                  {locale === 'fr' ? product.categories.name_fr : product.categories.name_en}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {product.vendors && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <span>Par {product.vendors.business_name}</span>
                {product.vendors.is_verified && (
                  <Badge variant="secondary" className="text-xs"><CheckCircle className="mr-1 h-3 w-3" />Certifié</Badge>
                )}
              </div>
            )}
          </div>

          {avgRating && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">
                {avgRating.toFixed(1)} ({product.reviews!.length} avis)
              </span>
            </div>
          )}

          <div className="text-4xl font-bold text-primary">
            {product.price.toLocaleString()} FCFA
          </div>

          <Separator />

          <div className="space-y-3">
            <Button size="lg" className="w-full" onClick={handleBuyNow}>
              <Zap className="mr-2 h-4 w-4" />
              {t('buy_now')}
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t('add_to_cart')}
            </Button>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-primary" />
                <span>{t('delivery_instant')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Paiement 100% sécurisé</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div>
            <h2 className="font-semibold mb-2">{t('details')}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-6" />
          <h2 className="text-xl font-bold mb-4">{t('reviews')} ({product.reviews.length})</h2>
          <div className="space-y-4">
            {product.reviews.map((review, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(review.created_at).toLocaleDateString(locale)}
                    </span>
                  </div>
                  {review.comment && <p className="text-sm">{review.comment}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
