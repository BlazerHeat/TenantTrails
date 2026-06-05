import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { apartments, getNeighbourhoods } from '../data/apartments'
import { useReviews, statsForApartment } from '../context/ReviewsContext'
import DashNav from '../components/DashNav'
import Stars from '../components/Stars'

const SORTS = {
  rating_desc: { label: 'Highest Rated', cmp: (a, b) => b.avg - a.avg },
  rating_asc: { label: 'Lowest Rated', cmp: (a, b) => a.avg - b.avg },
  reviews_desc: { label: 'Most Reviewed', cmp: (a, b) => b.count - a.count },
  name_asc: { label: 'Name (A–Z)', cmp: (a, b) => a.name.localeCompare(b.name) },
}

function ApartmentCard({ apt }) {
  return (
    <Link to={`/apartment/${apt.id}`} className="apt-card-link">
      <article className="apt-card">
        <div className="apt-image-wrap">
          <img src={apt.image} alt={apt.name} className="apt-image" loading="lazy" />
          <span className="apt-rating-badge">★ {apt.avg.toFixed(1)}</span>
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
              apt.tags.map((t) => <span key={t} className="apt-tag">{t}</span>)
            )}
          </div>
          <div className="apt-footer">
            <span className="apt-reviews">{apt.count} reviews</span>
            <Stars rating={apt.avg} />
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function Dashboard() {
  const { reviews } = useReviews()
  const location = useLocation()
  const [query, setQuery] = useState(location.state?.q ?? '')
  const [neighbourhood, setNeighbourhood] = useState('all')
  const [sortKey, setSortKey] = useState('rating_desc')

  const neighbourhoods = getNeighbourhoods()

  const enriched = useMemo(
    () => apartments.map((a) => ({ ...a, ...statsForApartment(reviews, a.id) })),
    [reviews]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = enriched.filter((a) => {
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q) ||
        a.neighbourhood.toLowerCase().includes(q)
      const matchesHood = neighbourhood === 'all' || a.neighbourhood === neighbourhood
      return matchesQuery && matchesHood
    })
    return [...list].sort(SORTS[sortKey].cmp)
  }, [enriched, query, neighbourhood, sortKey])

  const totalReviews = reviews.length

  return (
    <div className="dash-shell">
      <DashNav query={query} onQueryChange={setQuery} />

      <main className="dash-main">
        <header className="dash-header">
          <h1>Apartments in Halifax</h1>
          <p>Honest reviews from real tenants. Read before you rent.</p>
          <div className="dash-stats">
            <span className="dash-stat">{apartments.length} apartments</span>
            <span className="dash-stat">{totalReviews} reviews</span>
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
