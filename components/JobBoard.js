'use client'
import { useState, useMemo, useRef, useEffect } from 'react'

const TYPE_COLORS = {
  'RH & Paie':                      'bg-purple-900/40 text-purple-300 border-purple-700/50',
  'Informatique & Dev':             'bg-blue-900/40 text-blue-300 border-blue-700/50',
  'Data & Digital':                 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50',
  'Marketing & Com':                'bg-pink-900/40 text-pink-300 border-pink-700/50',
  'Finance & Compta':               'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  'Commerce & Vente':               'bg-orange-900/40 text-orange-300 border-orange-700/50',
  'Banque & Assurance':             'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'Logistique & Supply Chain':      'bg-teal-900/40 text-teal-300 border-teal-700/50',
  'Ingénierie & Production':        'bg-red-900/40 text-red-300 border-red-700/50',
  'BTP & Génie Civil':              'bg-stone-800/60 text-stone-300 border-stone-600/50',
  'Maintenance & Électrotechnique': 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
  'Juridique & Droit':              'bg-indigo-900/40 text-indigo-300 border-indigo-700/50',
  'Qualité':                        'bg-lime-900/40 text-lime-300 border-lime-700/50',
}

function getColor(type) {
  const key = Object.keys(TYPE_COLORS).find(k => type?.includes(k.split(' ')[0])) || ''
  return TYPE_COLORS[key] || 'bg-zinc-800/40 text-zinc-400 border-zinc-600/50'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return ''
  const diff = Math.floor((Date.now() - d) / 86400000)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  if (diff < 7) return `Il y a ${diff} jours`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatSalaire(min, max) {
  if (!min && !max) return null
  if (min && max) return `${Math.round(min).toLocaleString('fr-FR')} – ${Math.round(max).toLocaleString('fr-FR')} €`
  if (min) return `À partir de ${Math.round(min).toLocaleString('fr-FR')} €`
  return null
}

// ── Dropdown multi-select component ──────────────────────────────────────────
function MultiDropdown({ label, icon, options, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function toggle(value) {
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value]
    )
  }

  function clearAll() { onChange([]) }

  const count = selected.length

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-colors ${
          open || count > 0
            ? 'border-jungle-accent text-jungle-accent bg-jungle-accent/5'
            : 'border-jungle-border text-jungle-muted bg-jungle-card hover:border-zinc-500'
        }`}
      >
        {icon}
        <span>{label}</span>
        {count > 0 && (
          <span className="bg-jungle-accent text-black text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
            {count}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 ml-1 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 z-40 min-w-[220px] bg-[#1a1a1a] border border-jungle-border rounded-xl shadow-xl overflow-hidden">
          {count > 0 && (
            <div className="px-3 pt-2.5 pb-1.5 border-b border-jungle-border">
              <button
                onClick={clearAll}
                className="text-xs text-jungle-accent hover:underline underline-offset-2"
              >
                Effacer la sélection ({count})
              </button>
            </div>
          )}
          <ul className="py-1.5 max-h-64 overflow-y-auto">
            {options.map(opt => {
              const active = selected.includes(opt)
              return (
                <li key={opt}>
                  <button
                    onClick={() => toggle(opt)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                      active
                        ? 'text-jungle-accent bg-jungle-accent/5'
                        : 'text-jungle-text hover:bg-white/5'
                    }`}
                  >
                    {/* custom checkbox */}
                    <span className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
                      active ? 'bg-jungle-accent border-jungle-accent' : 'border-zinc-600'
                    }`}>
                      {active && (
                        <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {opt}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

// ── Job card ──────────────────────────────────────────────────────────────────
function JobCard({ job }) {
  const initials = job.entreprise
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const salaire = formatSalaire(job.salaire_min, job.salaire_max)
  const colorClass = getColor(job.type)

  return (
    <article className="card-hover border border-jungle-border rounded-2xl p-5 bg-jungle-card flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-jungle-text shrink-0 border border-jungle-border">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-jungle-muted text-xs mb-0.5 truncate">{job.entreprise}</p>
            <h3 className="text-jungle-text text-sm font-medium leading-snug line-clamp-2">{job.titre}</h3>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${colorClass}`}>
          {job.type}
        </span>
      </div>

      <p className="text-jungle-muted text-xs leading-relaxed line-clamp-3">
        {job.description || 'Description non disponible.'}
      </p>

      <div className="flex items-center gap-2 flex-wrap text-xs text-jungle-muted">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.lieu}
        </span>
        {salaire && (
          <span className="flex items-center gap-1 text-jungle-accent">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {salaire}
          </span>
        )}
        <span className="ml-auto">{formatDate(job.date)}</span>
      </div>

      <a
        href={job.lien}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-center mt-1"
        aria-label={`Voir l'offre : ${job.titre} chez ${job.entreprise}`}
      >
        Voir l'offre →
      </a>
    </article>
  )
}

// ── Main board ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 24

export default function JobBoard({ jobs, allTypes }) {
  const [search, setSearch]           = useState('')
  const [activeTypes, setActiveTypes] = useState([])   // multi
  const [activeRegions, setActiveRegions] = useState([]) // multi
  const [page, setPage]               = useState(1)

  const allRegions = useMemo(
    () => [...new Set(jobs.map(j => j.region).filter(Boolean))].sort(),
    [jobs]
  )

  const filtered = useMemo(() => {
    let res = jobs
    if (activeTypes.length)   res = res.filter(j => activeTypes.includes(j.type))
    if (activeRegions.length) res = res.filter(j => activeRegions.includes(j.region))
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter(j =>
        j.titre.toLowerCase().includes(q) ||
        j.entreprise.toLowerCase().includes(q) ||
        j.lieu.toLowerCase().includes(q) ||
        j.secteur.toLowerCase().includes(q)
      )
    }
    return res
  }, [jobs, activeTypes, activeRegions, search])

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE)
  const hasMore   = paginated.length < filtered.length

  const hasActiveFilters = activeTypes.length > 0 || activeRegions.length > 0 || search.trim()

  function resetAll() {
    setSearch('')
    setActiveTypes([])
    setActiveRegions([])
    setPage(1)
  }

  function handleSearch(e) {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className="relative min-h-screen z-10">

      {/* Header */}
      <header className="border-b border-jungle-border sticky top-0 z-50 bg-jungle-bg/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-jungle-accent text-xl font-display">◆</span>
            <span className="font-display text-lg text-jungle-text">Start'Ease</span>
          </div>
          <span className="text-jungle-muted text-sm hidden sm:block">
            {filtered.length} offre{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-14">
        <div className="max-w-3xl">
          <p className="text-jungle-accent text-sm font-medium tracking-widest uppercase mb-4">
            France · Mis à jour aujourd'hui
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-jungle-text leading-[1.05] mb-6">
            <span className="text-jungle-accent">Start'Ease</span>
          </h1>
          <p className="text-jungle-muted text-lg leading-relaxed max-w-xl">
            +23k offres mises à jour quotidiennement dans tous les secteurs.
            Postule directement sur le site de l'entreprise.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mt-12 border-t border-jungle-border pt-8">
          {[
            { n: jobs.length, label: 'offres actives' },
            { n: allTypes.length, label: 'domaines' },
            { n: [...new Set(jobs.map(j => j.entreprise))].length, label: 'entreprises' },
          ].map(({ n, label }) => (
            <div key={label}>
              <p className="font-display text-3xl text-jungle-text">{n.toLocaleString('fr-FR')}</p>
              <p className="text-jungle-muted text-sm mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search + Filters */}
      <section className="max-w-7xl mx-auto px-6 mb-10">

        {/* Search bar */}
        <div className="relative mb-4">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jungle-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Rechercher un poste, une entreprise, une ville…"
            className="w-full bg-jungle-card border border-jungle-border rounded-xl pl-11 pr-4 py-3.5 text-jungle-text placeholder-jungle-muted text-sm focus:outline-none focus:border-jungle-accent transition-colors"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-jungle-muted hover:text-jungle-text"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Secteur dropdown */}
          <MultiDropdown
            label="Secteur"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            options={allTypes}
            selected={activeTypes}
            onChange={(v) => { setActiveTypes(v); setPage(1) }}
          />

          {/* Région dropdown */}
          <MultiDropdown
            label="Région"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            options={allRegions}
            selected={activeRegions}
            onChange={(v) => { setActiveRegions(v); setPage(1) }}
          />

          {/* Reset button — only visible when filters are active */}
          {hasActiveFilters && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-jungle-muted hover:text-jungle-text border border-transparent hover:border-jungle-border transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Réinitialiser
            </button>
          )}

          {/* Active filter chips */}
          <div className="flex flex-wrap gap-2 ml-1">
            {activeTypes.map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-jungle-accent/40 text-jungle-accent bg-jungle-accent/5">
                {t}
                <button onClick={() => { setActiveTypes(prev => prev.filter(v => v !== t)); setPage(1) }} className="hover:text-white">✕</button>
              </span>
            ))}
            {activeRegions.map(r => (
              <span key={r} className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-jungle-accent/40 text-jungle-accent bg-jungle-accent/5">
                {r}
                <button onClick={() => { setActiveRegions(prev => prev.filter(v => v !== r)); setPage(1) }} className="hover:text-white">✕</button>
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-jungle-muted">
            <p className="text-5xl mb-4">◇</p>
            <p className="text-lg">Aucune offre trouvée pour cette recherche.</p>
            <button onClick={resetAll} className="mt-4 text-jungle-accent text-sm underline underline-offset-4">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger">
              {paginated.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="border border-jungle-border text-jungle-text text-sm px-8 py-3 rounded-full hover:border-jungle-accent hover:text-jungle-accent transition-colors"
                >
                  Voir plus d'offres ({filtered.length - paginated.length} restantes)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-jungle-border py-8 px-6 text-center text-jungle-muted text-xs">
        <p>Start'Ease · Offres mises à jour quotidiennement · Sources : Adzuna</p>
      </footer>
    </div>
  )
}
