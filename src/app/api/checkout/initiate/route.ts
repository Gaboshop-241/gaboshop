import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createChariowPayment } from '@/lib/chariow/client'
import { createSingPayPayment } from '@/lib/singpay/client'
import type { CartItem } from '@/store/cart'

export async function POST(request: NextRequest) {
  try {
    const { items, paymentApi }: { items: CartItem[]; paymentApi: 'chariow' | 'singpay' } =
      await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Get client profile
    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
    }

    // Get commission rate
    const { data: config } = await admin
      .from('system_config')
      .select('value')
      .eq('key', 'commission_rate')
      .single()

    const commissionRate = parseFloat(config?.value ?? '0.10')
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    // Create order
    const { data: order, error: orderErr } = await admin
      .from('orders')
      .insert({
        client_id: profile.id,
        status: 'pending',
        total_amount: totalAmount,
        currency: items[0].currency,
        payment_api: paymentApi,
      })
      .select()
      .single()

    if (orderErr || !order) {
      throw new Error('Erreur création commande')
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      vendor_id: item.vendorId,
      quantity: item.quantity,
      unit_price: item.price,
      commission_amount: item.vendorId ? item.price * item.quantity * commissionRate : 0,
    }))

    await admin.from('order_items').insert(orderItems)

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!
    const webhookBase = appUrl

    // Initiate payment
    if (paymentApi === 'chariow') {
      const payment = await createChariowPayment({
        amount: totalAmount,
        currency: items[0].currency,
        orderId: order.id,
        description: `Commande GaboShop #${order.id.slice(0, 8)}`,
        returnUrl: `${appUrl}/fr/checkout/success?orderId=${order.id}`,
        webhookUrl: `${webhookBase}/api/webhooks/chariow`,
        customerEmail: user.email,
      })

      await admin.from('transactions').insert({
        order_id: order.id,
        amount: totalAmount,
        currency: items[0].currency,
        status: 'pending',
        payment_api: 'chariow',
        api_ref: payment.paymentId,
        metadata: { paymentUrl: payment.paymentUrl },
      })

      return NextResponse.json({ paymentUrl: payment.paymentUrl })
    } else {
      const payment = await createSingPayPayment({
        amount: totalAmount,
        currency: items[0].currency,
        orderId: order.id,
        description: `Commande GaboShop #${order.id.slice(0, 8)}`,
        returnUrl: `${appUrl}/fr/checkout/success?orderId=${order.id}`,
        webhookUrl: `${webhookBase}/api/webhooks/singpay`,
      })

      await admin.from('transactions').insert({
        order_id: order.id,
        amount: totalAmount,
        currency: items[0].currency,
        status: 'pending',
        payment_api: 'singpay',
        api_ref: payment.transactionId,
        metadata: { paymentUrl: payment.paymentUrl },
      })

      return NextResponse.json({ paymentUrl: payment.paymentUrl })
    }
  } catch (err: any) {
    console.error('[checkout/initiate]', err)
    return NextResponse.json({ error: err.message ?? 'Erreur serveur' }, { status: 500 })
  }
}
