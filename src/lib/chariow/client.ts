import crypto from 'crypto'

const BASE_URL = process.env.CHARIOW_API_BASE_URL ?? 'https://api.chariow.com/v1'
const API_KEY = process.env.CHARIOW_API_KEY!
const WEBHOOK_SECRET = process.env.CHARIOW_WEBHOOK_SECRET!

export interface ChariowPaymentParams {
  amount: number
  currency: string
  orderId: string
  description: string
  returnUrl: string
  webhookUrl: string
  customerEmail?: string
}

export interface ChariowPaymentResponse {
  paymentId: string
  paymentUrl: string
  status: string
}

export async function createChariowPayment(
  params: ChariowPaymentParams
): Promise<ChariowPaymentResponse> {
  const body = JSON.stringify({
    amount: params.amount,
    currency: params.currency,
    reference: params.orderId,
    description: params.description,
    success_url: params.returnUrl,
    cancel_url: params.returnUrl.replace('success', 'cancel'),
    webhook_url: params.webhookUrl,
    customer_email: params.customerEmail,
    payment_methods: ['card', 'airtel_money', 'moov_money', 'crypto'],
  })

  const res = await fetch(`${BASE_URL}/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `Chariow error: ${res.status}`)
  }

  const data = await res.json() as {
    id?: string
    checkout_url?: string
    payment_url?: string
    status?: string
  }

  return {
    paymentId: data.id ?? params.orderId,
    paymentUrl: data.checkout_url ?? data.payment_url ?? '',
    status: data.status ?? 'pending',
  }
}

export function verifyChariowWebhook(payload: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
