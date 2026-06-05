import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useReviews, userStats } from '../context/ReviewsContext'
import { getApartment } from '../data/apartments'
import DashNav from '../components/DashNav'
import Stars from '../components/Stars'
import ReviewDialog from '../components/ReviewDialog'

function initialsFor(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function truncate(s, n = 140) {
  return s.length > n ? s.slice(0, n) + '...' : s
}

export default function Profile() {
  const { user } = useAuth()
  const { reviews, updateReview, deleteReview } = useReviews()
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const myReviews = useMemo(
    () => reviews.filter((r) => r.userEmail === user.email)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [reviews, user.email]
  )
  const stats = useMemo(() => userStats(reviews, user.email), [reviews, user.email])

  function handleDelete(id) {
    deleteReview(id)
    setConfirmDelete(null)
  }

  return (
    <div className="dash-shell">
      <DashNav />

      <main className="dash-main">
        <Link to="/dashboard" className="back-link">← Back to apartments</Link>

        <section className="profile-card">
          <span className="profile-avatar">{initialsFor(user.name)}</span>
          <div className="profile-identity">
            <h1>{user.name}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
          <div className="profile-stats">
            <div>
              <div className="profile-stat-num">{stats.reviews}</div>
              <div className="profile-stat-label">REVIEWS</div>
            </div>
            <div>
              <div className="profile-stat-num">{stats.comments}</div>
              <div className="profile-stat-label">COMMENTS</div>
            </div>
          </div>
        </section>

        <h2 className="profile-section-title">Your Reviews</h2>

        {myReviews.length === 0 ? (
          <div className="dash-empty">You haven&rsquo;t written any reviews yet.</div>
        ) : (
          <div className="profile-reviews">
            {myReviews.map((r) => {
              const apt = getApartment(r.apartmentId)
              return (
                <article key={r.id} className="profile-review">
                  <div className="profile-review-body">
                    <h3>{apt?.name ?? 'Unknown apartment'}</h3>
                    <Stars rating={r.rating} />
                    <p>{truncate(r.text)}</p>
                  </div>
                  <div className="profile-review-actions">
                    <Link to={`/apartment/${r.apartmentId}`} className="link-action">View</Link>
                    <button type="button" className="btn-outline" onClick={() => setEditing(r)}>Edit</button>
                    <button type="button" className="btn-danger" onClick={() => setConfirmDelete(r)}>Delete</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      {editing && (
        <ReviewDialog
          mode="edit"
          initial={{ rating: editing.rating, text: editing.text }}
          onClose={() => setEditing(null)}
          onSubmit={({ rating, text }) => {
            updateReview(editing.id, { rating, text })
            setEditing(null)
          }}
        />
      )}

      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(null)} role="dialog" aria-modal="true">
          <div className="modal-card modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Delete this review?</h2>
            <p className="modal-hint">This action cannot be undone.</p>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button type="button" className="btn-danger" onClick={() => handleDelete(confirmDelete.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
