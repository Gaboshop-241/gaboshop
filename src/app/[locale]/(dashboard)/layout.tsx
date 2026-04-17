import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/dashboard/Sidebar'
import DashboardHeader from '@/components/dashboard/Header'

function getInitials(name?: string | null): string {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { id: string; full_name: string | null; role: string } | null = null
  let vendor: { id: string; business_name: string; is_verified: boolean } | null = null

  if (user) {
    const { data: p } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('user_id', user.id)
      .single()

    profile = p

    if (p?.role === 'vendor') {
      const { data: v } = await supabase
        .from('vendors')
        .select('id, business_name, is_verified')
        .eq('profile_id', p.id)
        .single()
      vendor = v
    }
  }

  const userInitials = getInitials(profile?.full_name)
  const role = (profile?.role ?? 'client') as 'admin' | 'vendor' | 'client'

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <DashboardSidebar
        role={role}
        vendorName={vendor?.business_name}
        isVerified={vendor?.is_verified ?? false}
        userInitials={userInitials}
      />
      <div className="ml-64 flex flex-col min-h-screen">
        <DashboardHeader
          userName={profile?.full_name ?? 'Utilisateur'}
          userInitials={userInitials}
        />
        <main className="flex-1 p-8 bg-slate-50/50">{children}</main>
      </div>
    </div>
  )
}
