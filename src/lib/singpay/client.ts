import crypto from 'crypto'

const BASE_URL = process.env.SINGPAY_API_BASE_URL ?? 'https://api.singpay.app/v1'
const MERCHANT_ID = process.env.SINGPAY_MERCHANT_ID!
const SECRET_KEY = process.env.SINGPAY_SECRET_KEY!
const API_KEY = process.env.SINGPAY_API_KEY!

export interface SingPayPaymentParams {
  amount: number
  currency: string
  orderId: string
  description: string
  returnUrl: string
  webhookUrl: string
  customerPhone?: string
}

export interface SingPayPaymentResponse {
  transactionId: string
  paymentUrl: string
  status: string
}

function signRequest(body: string): string {
  return crypto.createHmac('sha256', SECRET_KEY).update(body).digest('hex')
}

export async function createSingPayPayment(
  params: SingPayPaymentParams
): Promise<SingPayPaymentResponse> {
  const body = JSON.stringify({
    merchant_id: MERCHANT_ID,
    amount: params.amount,
    currency: params.currency,
    reference: params.orderId,
    description: params.description,
    callback_url: params.webhookUrl,
    return_url: params.returnUrl,
    customer_phone: params.customerPhone,
    payment_methods: ['airtel_money', 'moov_money'],
  })

  const signature = signRequest(body)

  const res = await fetch(`${BASE_URL}/payments/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      'X-Merchant-ID': MERCHANT_ID,
      'X-Signature': signature,
    },
    body,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `SingPay error: ${res.status}`)
  }

  const data = await res.json() as {
    transaction_id?: string
    payment_url?: string
    checkout_url?: string
    status?: string
  }

  return {
    transactionId: data.transaction_id ?? params.orderId,
    paymentUrl: data.payment_url ?? data.checkout_url ?? '',
    status: data.status ?? 'pending',
  }
}

export function verifySingPayWebhook(payload: string, signature: string): boolean {
  const expected = signRequest(payload)
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

/** Commission due au vendeur = montant × taux */
export function calculateCommission(amount: number, rate = 0.10): number {
  return Math.round(amount * rate)
}
