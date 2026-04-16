import { NextRequest, NextResponse } from 'next/server'
import { verifyChariowWebhook } from '@/lib/chariow/client'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const payload = await request.text()
  const signature = request.headers.get('x-chariow-signature') ?? ''

  if (!verifyChariowWebhook(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(payload)
  const admin = createAdminClient()

  if (event.type === 'payment.completed') {
    const orderId = event.data.order_id
    const apiRef = event.data.payment_id

    // Update transaction
    await admin
      .from('transactions')
      .update({ status: 'completed' })
      .eq('api_ref', apiRef)

    // Update order
    await admin
      .from('orders')
      .update({ status: 'paid', payment_ref: apiRef })
      .eq('id', orderId)

    // Mark as delivered (digital products)
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
  }

  return NextResponse.json({ received: true })
}
