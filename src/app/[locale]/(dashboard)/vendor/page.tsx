import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react'

async function getVendorData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('user_id', user.id)
    .single()

  if (!profile) return null

  const { data: vendor } = await supabase
    .from('vendors')
    .select('id, business_name')
    .eq('profile_id', profile.id)
    .single()

  if (!vendor) return null

  const [productsRes, ordersRes, commissionsRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact' }).eq('vendor_id', vendor.id),
    supabase.from('order_items').select('order_id', { count: 'exact' }).eq('vendor_id', vendor.id),
    supabase.from('commissions').select('amount, status').eq('vendor_id', vendor.id),
  ])

  const totalProducts = productsRes.count ?? 0
  const totalOrders = ordersRes.count ?? 0
  const pendingCommissions = commissionsRes.data?.filter((c) => c.status === 'pending')
    .reduce((s, c) => s + c.amount, 0) ?? 0
  const paidCommissions = commissionsRes.data?.filter((c) => c.status === 'paid')
    .reduce((s, c) => s + c.amount, 0) ?? 0

  return { vendor, profile, totalProducts, totalOrders, pendingCommissions, paidCommissions }
}

export default async function VendorDashboard() {
  const locale = await getLocale()
  const data = await getVendorData()

  if (!data) redirect(`/${locale}/auth/login`)

  const { vendor, totalProducts, totalOrders, pendingCommissions, paidCommissions } = data

  const statCards = [
    { label: 'Produits', value: totalProducts, icon: Package, color: 'text-blue-600' },
    { label: 'Commandes', value: totalOrders, icon: ShoppingBag, color: 'text-green-600' },
    { label: 'Commissions en attente', value: `${pendingCommissions.toLocaleString()} FCFA`, icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Commissions reçues', value: `${paidCommissions.toLocaleString()} FCFA`, icon: DollarSign, color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{vendor.business_name}</h1>
        <p className="text-muted-foreground">Tableau de bord revendeur</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accès rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: `/${locale}/vendor/products`, label: 'Gérer mes produits', emoji: '📦' },
            { href: `/${locale}/vendor/orders`, label: 'Voir mes commandes', emoji: '🛒' },
            { href: `/${locale}/vendor/commissions`, label: 'Mes commissions', emoji: '💰' },
          ].map(({ href, label, emoji }) => (
            <a key={href} href={href} className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted transition-colors">
              <span className="text-2xl">{emoji}</span>
              <span className="font-medium text-sm">{label}</span>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
