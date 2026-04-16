const BASE_URL = process.env.CHARIOW_API_BASE_URL!
const API_KEY = process.env.CHARIOW_API_KEY!

interface ChariowPaymentParams {
  amount: number
  currency: string
  orderId: string
  description: string
  returnUrl: string
  webhookUrl: string
  customerEmail?: string
}

interface ChariowPaymentResponse {
  paymentId: string
  paymentUrl: string
  status: string
}

export async function createChariowPayment(params: ChariowPaymentParams): Promise<ChariowPaymentResponse> {
  const res = await fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      order_id: params.orderId,
      description: params.description,
      return_url: params.returnUrl,
      webhook_url: params.webhookUrl,
      customer_email: params.customerEmail,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Chariow error: ${res.status}`)
  }

  return res.json()
}

export function verifyChariowWebhook(payload: string, signature: string): boolean {
  const crypto = require('crypto')
  const expected = crypto
    .createHmac('sha256', process.env.CHARIOW_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')
  return expected === signature
}
