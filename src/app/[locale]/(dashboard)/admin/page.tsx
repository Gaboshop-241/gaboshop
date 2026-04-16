import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'

async function getAdminStats() {
  const supabase = await createClient()
  const [ordersRes, vendorsRes, revenueRes] = await Promise.all([
    supabase.from('orders').select('id, status', { count: 'exact' }),
    supabase.from('vendors').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('orders').select('total_amount').eq('status', 'delivered'),
  ])

  const totalOrders = ordersRes.count ?? 0
  const activeVendors = vendorsRes.count ?? 0
  const totalRevenue = revenueRes.data?.reduce((s, o) => s + o.total_amount, 0) ?? 0
  const pendingOrders = ordersRes.data?.filter((o) => o.status === 'pending').length ?? 0

  return { totalOrders, activeVendors, totalRevenue, pendingOrders }
}

async function getRecentOrders() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('id, status, total_amount, currency, created_at, profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([getAdminStats(), getRecentOrders()])

  const statCards = [
    { label: 'Revenu total', value: `${stats.totalRevenue.toLocaleString()} FCFA`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Commandes totales', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Revendeurs actifs', value: stats.activeVendors, icon: Users, color: 'text-purple-600' },
    { label: 'En attente', value: stats.pendingOrders, icon: TrendingUp, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Administration</h1>

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
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucune commande pour le moment.</p>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.profiles?.full_name} — {new Date(order.created_at).toLocaleDateString('fr')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{order.total_amount.toLocaleString()} FCFA</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
