'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useCartStore } from '@/store/cart'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function CheckoutPage() {
  const t = useTranslations('checkout')
  const tCart = useTranslations('cart')
  const locale = useLocale()
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const hasMarketplaceItems = items.some((i) => i.space === 'marketplace')
  const hasOfficialItems = items.some((i) => i.space === 'official')

  async function handleCheckout() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/${locale}/auth/login?redirectTo=/${locale}/checkout`)
        return
      }

      const paymentApi = hasMarketplaceItems ? 'singpay' : 'chariow'

      const response = await fetch('/api/checkout/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, paymentApi }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      if (data.paymentUrl) {
        clearCart()
        window.location.href = data.paymentUrl
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t('processing'))
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{tCart('empty')}</h1>
        <p className="text-muted-foreground mb-6">{tCart('empty_desc')}</p>
        <Link href={`/${locale}/shop`} className={cn(buttonVariants())}>
          {tCart('continue_shopping')}
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/${locale}/shop`} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' })) }>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {item.space === 'official' ? 'Officiel' : 'Marketplace'}
                  </Badge>
                  <p className="text-primary font-semibold mt-1">
                    {(item.price * item.quantity).toLocaleString()} FCFA
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</Button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                  <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => removeItem(item.productId)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('order_summary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span className="text-muted-foreground truncate max-w-[150px]">
                      {item.title} ×{item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>{tCart('total')}</span>
                <span className="text-primary">{total().toLocaleString()} FCFA</span>
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 rounded p-3">
                <p className="font-medium mb-1">{t('payment_method')} :</p>
                {hasMarketplaceItems ? (
                  <p>💳 {t('pay_with_singpay')}</p>
                ) : (
                  <p>💳 {t('pay_with_chariow')}</p>
                )}
                {hasOfficialItems && hasMarketplaceItems && (
                  <p className="text-yellow-600 mt-1">⚠️ Panier mixte — SingPay appliqué</p>
                )}
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
                {loading ? t('processing') : t('place_order')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
