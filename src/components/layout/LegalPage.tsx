import Link from 'next/link'

type Section = { title: string; body: string | string[] }

export default function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string
  subtitle?: string
  updated: string
  sections: Section[]
}) {
  return (
    <div className="bg-[#faf8ff] min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-[#131b2e] to-[#283044] text-white py-14 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/fr" className="inline-flex items-center gap-1 text-[#7ffc97] hover:text-white text-sm font-semibold mb-4 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Accueil
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight">{title}</h1>
          {subtitle && <p className="text-slate-300 text-base md:text-lg">{subtitle}</p>}
          <p className="text-xs text-slate-500 mt-4">Dernière mise à jour : {updated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 px-6 lg:px-8">
        <article className="max-w-3xl mx-auto bg-white border border-[#e2e7ff] rounded-2xl p-8 md:p-10 space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg md:text-xl font-bold text-[#131b2e] mb-3">{s.title}</h2>
              {Array.isArray(s.body) ? (
                <ul className="space-y-2 text-sm text-[#3e4a3d] leading-relaxed list-disc list-outside pl-5">
                  {s.body.map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-[#3e4a3d] leading-relaxed whitespace-pre-line">{s.body}</p>
              )}
            </div>
          ))}
        </article>
      </section>
    </div>
  )
}
