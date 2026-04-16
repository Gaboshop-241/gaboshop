export type UserRole = 'client' | 'vendor' | 'admin'
export type OrderStatus = 'pending' | 'paid' | 'delivered' | 'cancelled'
export type PaymentApi = 'chariow' | 'singpay'
export type ProductSpace = 'official' | 'marketplace'
export type ProductType = 'digital' | 'subscription' | 'service'
export type CommissionStatus = 'pending' | 'paid'
export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type TicketPriority = 'low' | 'normal' | 'high'
export type CategorySpace = 'official' | 'marketplace' | 'both'

// Row types — used for query result typing
export type ProfileRow = {
  id: string
  user_id: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  country_code: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export type VendorRow = {
  id: string
  profile_id: string
  business_name: string
  description: string | null
  is_verified: boolean
  is_active: boolean
  singpay_wallet_id: string | null
  created_at: string
}

export type CategoryRow = {
  id: string
  name_fr: string
  name_en: string
  slug: string
  icon: string | null
  parent_id: string | null
  space: CategorySpace
  created_at: string
}

export type ProductRow = {
  id: string
  vendor_id: string | null
  category_id: string
  title_fr: string
  title_en: string
  description_fr: string
  description_en: string
  price: number
  currency: string
  images: string[]
  type: ProductType
  delivery_info: Record<string, unknown>
  is_active: boolean
  space: ProductSpace
  created_at: string
  updated_at: string
}

export type OrderRow = {
  id: string
  client_id: string
  status: OrderStatus
  total_amount: number
  currency: string
  payment_api: PaymentApi
  payment_ref: string | null
  created_at: string
  updated_at: string
}

export type OrderItemRow = {
  id: string
  order_id: string
  product_id: string
  vendor_id: string | null
  quantity: number
  unit_price: number
  commission_amount: number
}

export type TransactionRow = {
  id: string
  order_id: string
  amount: number
  currency: string
  status: string
  payment_api: PaymentApi
  api_ref: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type CommissionRow = {
  id: string
  vendor_id: string
  order_item_id: string
  amount: number
  rate: number
  status: CommissionStatus
  paid_at: string | null
  created_at: string
}

export type ReviewRow = {
  id: string
  product_id: string
  client_id: string
  rating: number
  comment: string | null
  created_at: string
}

export type SupportTicketRow = {
  id: string
  client_id: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  updated_at: string
}

export type SupportMessageRow = {
  id: string
  ticket_id: string
  sender_id: string
  message: string
  created_at: string
}

export type NotificationRow = {
  id: string
  user_id: string
  type: string
  title: string
  body: string
  is_read: boolean
  created_at: string
}

export type SystemConfigRow = {
  key: string
  value: string
  updated_at: string
}
