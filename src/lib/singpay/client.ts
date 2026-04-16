const BASE_URL = process.env.SINGPAY_API_BASE_URL!
const API_KEY = process.env.SINGPAY_API_KEY!

interface SingPayPaymentParams {
  amount: number
  currency: string
  orderId: string
  description: string
  returnUrl: string
  webhookUrl: string
  customerPhone?: string
}

interface SingPayPaymentResponse {
  transactionId: string
  paymentUrl: string
  status: string
}

export async function createSingPayPayment(params: SingPayPaymentParams): Promise<SingPayPaymentResponse> {
  const res = await fetch(`${BASE_URL}/transactions/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      order_id: params.orderId,
      description: params.description,
      return_url: params.returnUrl,
      webhook_url: params.webhookUrl,
      customer_phone: params.customerPhone,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `SingPay error: ${res.status}`)
  }

  return res.json()
}

export function verifySingPayWebhook(payload: string, signature: string): boolean {
  const crypto = require('crypto')
  const expected = crypto
    .createHmac('sha256', process.env.SINGPAY_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')
  return expected === signature
}
