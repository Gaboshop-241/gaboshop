import { NextRequest, NextResponse } from 'next/server'
import { verifySingPayWebhook } from '@/lib/singpay/client'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get('x-singpay-signature') ?? ''

  if (!verifySingPayWebhook(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(payload)
  const admin = createAdminClient()

  if (event.type === 'transaction.success') {
    const orderId = event.data.order_id
    const apiRef = event.data.transaction_id

    // Update transaction
    await admin
      .from('transactions')
      .update({ status: 'completed' })
      .eq('api_ref', apiRef)

    // Update order to paid
    await admin
      .from('orders')
      .update({ status: 'paid', payment_ref: apiRef })
      .eq('id', orderId)

    // Get order items with vendors
    const { data: orderItems } = await admin
      .from('order_items')
      .select('id, vendor_id, unit_price, quantity, commission_amount')
      .eq('order_id', orderId)
      .not('vendor_id', 'is', null)

    // Get commission rate
    const { data: config } = await admin
      .from('system_config')
      .select('value')
      .eq('key', 'commission_rate')
      .single()

    const rate = parseFloat(config?.value ?? '0.10')

    // Create commission records for each vendor item
    if (orderItems?.length) {
      const commissions = orderItems.map((item) => ({
        vendor_id: item.vendor_id!,
        order_item_id: item.id,
        amount: item.commission_amount,
        rate,
        status: 'pending' as const,
      }))
      await admin.from('commissions').insert(commissions)
    }

    // Mark as delivered
    await admin
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', orderId)

    // Notify client
    const { data: order } = await admin
      .from('orders')
      .select('client_id')
      .eq('id', orderId)
      .single()

    if (order) {
      await admin.from('notifications').insert({
        user_id: order.client_id,
        type: 'order_delivered',
        title: '✅ Commande livrée',
        body: `Votre commande #${orderId.slice(0, 8)} a été livrée avec succès.`,
        is_read: false,
      })
    }

    // Notify vendors
    if (orderItems?.length) {
      const vendorNotifications = orderItems.map((item) => ({
        user_id: item.vendor_id!,
        type: 'new_sale',
        title: '🎉 Nouvelle vente',
        body: `Vous avez une nouvelle commande. Commission : ${item.commission_amount} FCFA à recevoir.`,
        is_read: false,
      }))
      // Note: vendor_id in order_items points to vendors table, not profiles
      // Notifications will be created after joining with profiles
    }
  }

  return NextResponse.json({ received: true })
}
