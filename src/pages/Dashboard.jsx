import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apartments, getNeighbourhoods, totalReviews } from '../data/apartments'

const SORTS = {
  rating_desc: { label: 'Highest Rated', cmp: (a, b) => b.rating - a.rating },
  rating_asc: { label: 'Lowest Rated', cmp: (a, b) => a.rating - b.rating },
  reviews_desc: { label: 'Most Reviewed', cmp: (a, b) => b.reviewCount - a.reviewCount },
  name_asc: { label: 'Name (A–Z)', cmp: (a, b) => a.name.localeCompare(b.name) },
}

function Stars({ rating }) {
  const rounded = Math.round(rating)
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  )
}

function ApartmentCard({ apt }) {
  return (
    <article className="apt-card">
      <div className="apt-image-wrap">
        <img src={apt.image} alt={apt.name} className="apt-image" loading="lazy" />
        <span className="apt-rating-badge">★ {apt.rating.toFixed(1)}</span>
      </div>
      <div className="apt-body">
        <h3 className="apt-name">{apt.name}</h3>
        <p className="apt-address">
          <span className="apt-pin" aria-hidden>📍</span>
          {apt.address} · {apt.neighbourhood}
        </p>
        <div className="apt-tags">
          {apt.tags.length === 0 ? (
            <span className="apt-tag apt-tag-muted">No AI summary yet</span>
          ) : (
            apt.tags.map((t) => (
              <span key={t} className="apt-tag">{t}</span>
            ))
          )}
        </div>
        <div className="apt-footer">
          <span className="apt-reviews">{apt.reviewCount} reviews</span>
          <Stars rating={apt.rating} />
        </div>
      </div>
    </article>
  )
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [query, setQuery] = useState('')
  const [neighbourhood, setNeighbourhood] = useState('all')
  const [sortKey, setSortKey] = useState('rating_desc')

  const neighbourhoods = getNeighbourhoods()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = apartments.filter((a) => {
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q) ||
        a.neighbourhood.toLowerCase().includes(q)
      const matchesHood = neighbourhood === 'all' || a.neighbourhood === neighbourhood
      return matchesQuery && matchesHood
    })
    return [...list].sort(SORTS[sortKey].cmp)
  }, [query, neighbourhood, sortKey])

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="dash-shell">
      <nav className="dash-nav">
        <a href="/" className="dash-logo">TenantTrails</a>
        <div className="dash-search">
          <span className="dash-search-icon" aria-hidden>🔍</span>
          <input
            type="search"
            placeholder="Search apartments by address or neighbourhood..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="dash-user">
          <span className="dash-avatar">{initials}</span>
          <span className="dash-username">{user.name}</span>
          <button type="button" className="dash-signout" onClick={signOut}>Sign out</button>
        </div>
      </nav>

      <main className="dash-main">
        <header className="dash-header">
          <h1>Apartments in Halifax</h1>
          <p>Honest reviews from real tenants. Read before you rent.</p>
          <div className="dash-stats">
            <span className="dash-stat">{apartments.length} apartments</span>
            <span className="dash-stat">{totalReviews()} reviews</span>
            <span className="dash-stat">{neighbourhoods.length} neighbourhoods</span>
          </div>
        </header>

        <div className="dash-controls">
          <select value={neighbourhood} onChange={(e) => setNeighbourhood(e.target.value)}>
            <option value="all">All Neighbourhoods</option>
            {neighbourhoods.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            {Object.entries(SORTS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="dash-empty">No apartments match your search.</div>
        ) : (
          <div className="apt-grid">
            {filtered.map((apt) => (
              <ApartmentCard key={apt.id} apt={apt} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
