import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

async function getVendorDashboardData() {
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

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [productsRes, orderItemsRes, commissionsRes, monthOrderItemsRes] = await Promise.all([
    supabase
      .from('products')
      .select('id, title_fr, price, images, is_active, categories(name_fr)')
      .eq('vendor_id', vendor.id)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('order_items')
      .select('order_id, unit_price, quantity, created_at')
      .eq('vendor_id', vendor.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('commissions')
      .select('amount, status, created_at')
      .eq('vendor_id', vendor.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('order_items')
      .select('unit_price, quantity')
      .eq('vendor_id', vendor.id)
      .gte('created_at', startOfMonth),
  ])

  const products = productsRes.data ?? []
  const orderItems = orderItemsRes.data ?? []
  const commissions = commissionsRes.data ?? []
  const monthItems = monthOrderItemsRes.data ?? []

  const revenueThisMonth = monthItems.reduce(
    (s, i) => s + (i.unit_price ?? 0) * (i.quantity ?? 1),
    0
  )
  const totalOrders = new Set(orderItems.map((i) => i.order_id)).size
  const activeProducts = products.filter((p) => p.is_active).length
  const pendingCommission = commissions
    .filter((c) => c.status === 'pending')
    .reduce((s, c) => s + c.amount, 0)

  // 6-month chart data from commissions
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const total = commissions
      .filter((c) => {
        const cd = new Date(c.created_at)
        return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth()
      })
      .reduce((s, c) => s + c.amount, 0)
    return { month: MONTH_LABELS[d.getMonth()], total }
  })

  const chartMax = Math.max(...chartData.map((d) => d.total), 1)

  return {
    vendor,
    products,
    revenueThisMonth,
    totalOrders,
    activeProducts,
    pendingCommission,
    chartData,
    chartMax,
    recentOrders: orderItems.slice(0, 5),
  }
}

export default async function VendorDashboard() {
  const locale = await getLocale()
  const data = await getVendorDashboardData()
  if (!data) redirect(`/${locale}/auth/login`)

  const {
    vendor,
    products,
    revenueThisMonth,
    totalOrders,
    activeProducts,
    pendingCommission,
    chartData,
    chartMax,
    recentOrders,
  } = data

  const stats = [
    {
      label: 'Revenus ce mois',
      value: `${revenueThisMonth.toLocaleString('fr-FR')} FCFA`,
      icon: 'trending_up',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-l-4 border-emerald-500',
    },
    {
      label: 'Commandes',
      value: totalOrders,
      icon: 'shopping_bag',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-500',
    },
    {
      label: 'Produits actifs',
      value: activeProducts,
      icon: 'inventory_2',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-l-4 border-purple-500',
    },
    {
      label: 'Commission due',
      value: `${pendingCommission.toLocaleString('fr-FR')} FCFA`,
      icon: 'payments',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-l-4 border-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-manrope)' }}>
          {vendor.business_name}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Aperçu de votre boutique</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color, bg, border }) => (
          <div key={label} className={`bg-white rounded-2xl p-5 shadow-sm ${border}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <span
                  className={`material-symbols-outlined ${color}`}
                  style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
                >
                  {icon}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-manrope)' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Products table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Mes Produits</h2>
            <Link
              href={`/${locale}/vendor/products`}
              className="text-xs text-[#006b2c] font-medium hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-6 py-3 font-medium">Produit</th>
                  <th className="text-left px-4 py-3 font-medium">Catégorie</th>
                  <th className="text-right px-4 py-3 font-medium">Prix</th>
                  <th className="text-center px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                      Aucun produit encore
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const img = Array.isArray(p.images) ? p.images[0] : null
                    const catRaw = p.categories
                    const cat = Array.isArray(catRaw) ? (catRaw[0] as { name_fr: string } | undefined) : (catRaw as { name_fr: string } | null)
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={p.title_fr}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                    image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 truncate max-w-[160px]">
                                {p.title_fr}
                              </p>
                              <p className="text-[11px] text-slate-400">#{p.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{cat?.name_fr ?? '—'}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-700">
                          {p.price.toLocaleString('fr-FR')} <span className="text-[10px] font-normal text-slate-400">FCFA</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#82f5c1]/40 text-[#00714e]">
                              En Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#ffdad6]/60 text-[#93000a]">
                              Rupture
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/${locale}/vendor/products/${p.id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors inline-flex"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                              edit
                            </span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Bar chart */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Commissions (6 mois)</h2>
            <div className="flex items-end justify-between gap-2 h-28">
              {chartData.map(({ month, total }) => {
                const pct = chartMax > 0 ? Math.round((total / chartMax) * 100) : 0
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all"
                        style={{ height: `${Math.max(pct, 4)}%` }}
                        title={`${total.toLocaleString('fr-FR')} FCFA`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{month}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Dernières ventes</h2>
              <Link
                href={`/${locale}/vendor/orders`}
                className="text-xs text-[#006b2c] font-medium hover:underline"
              >
                Voir tout
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Aucune vente</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-700">
                        #{item.order_id?.slice(0, 8) ?? '—'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600">
                      +{((item.unit_price ?? 0) * (item.quantity ?? 1)).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full orders table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Historique des commandes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-3 font-medium">#Commande</th>
                <th className="text-left px-4 py-3 font-medium">Montant</th>
                <th className="text-center px-4 py-3 font-medium">Qté</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-slate-400 text-sm">
                    Aucune commande
                  </td>
                </tr>
              ) : (
                recentOrders.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-slate-600">
                      #{item.order_id?.slice(0, 12) ?? '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {((item.unit_price ?? 0) * (item.quantity ?? 1)).toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500">{item.quantity ?? 1}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(item.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
