import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Star, MessageSquare } from 'lucide-react'
import Link from 'next/link'

async function getClientData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('user_id', user.id)
    .single()

  if (!profile) return null

  const [ordersRes, reviewsRes, ticketsRes] = await Promise.all([
    supabase.from('orders').select('id, status, total_amount, created_at').eq('client_id', profile.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('reviews').select('id', { count: 'exact' }).eq('client_id', profile.id),
    supabase.from('support_tickets').select('id', { count: 'exact' }).eq('client_id', profile.id).neq('status', 'closed'),
  ])

  return {
    profile,
    recentOrders: ordersRes.data ?? [],
    reviewCount: reviewsRes.count ?? 0,
    openTickets: ticketsRes.count ?? 0,
  }
}

export default async function ClientDashboard() {
  const locale = await getLocale()
  const data = await getClientData()

  if (!data) redirect(`/${locale}/auth/login`)

  const { profile, recentOrders, reviewCount, openTickets } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, {profile.full_name} 👋</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace client</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Commandes', value: recentOrders.length, icon: ShoppingBag, color: 'text-blue-600', href: `/${locale}/client/orders` },
          { label: 'Avis donnés', value: reviewCount, icon: Star, color: 'text-yellow-600', href: `/${locale}/client` },
          { label: 'Tickets ouverts', value: openTickets, icon: MessageSquare, color: 'text-red-600', href: `/${locale}/client/support` },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Aucune commande pour le moment.</p>
              <Link href={`/${locale}/shop`} className="text-primary text-sm hover:underline">
                Découvrir la boutique →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">Commande #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString('fr')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{order.total_amount.toLocaleString()} FCFA</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
