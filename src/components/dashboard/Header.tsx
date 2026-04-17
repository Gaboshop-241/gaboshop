'use client'

interface Props {
  userName: string
  userInitials: string
}

export default function DashboardHeader({ userName, userInitials }: Props) {
  const firstName = userName.split(' ')[0]

  const dateStr = new Date().toLocaleDateString('fr-GA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div>
        <h1 className="text-base font-semibold text-slate-800">
          Bonjour, {firstName} 👋
        </h1>
        <p className="text-xs text-slate-500">Dashboard Vendeur • Libreville, GMT+1</p>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xs text-slate-400 hidden md:block capitalize">{dateStr}</p>

        <div className="w-px h-5 bg-slate-200 mx-2" />

        <button
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            notifications
          </span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
          aria-label="Paramètres"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            settings
          </span>
        </button>

        <div className="w-px h-5 bg-slate-200 mx-2" />

        <div className="w-9 h-9 rounded-full bg-[#006b2c]/10 border border-[#006b2c]/20 flex items-center justify-center text-[#006b2c] font-semibold text-sm select-none">
          {userInitials}
        </div>
      </div>
    </header>
  )
}
