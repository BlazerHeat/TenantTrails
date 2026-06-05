import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getApartment } from '../data/apartments'
import { useReviews, statsForApartment } from '../context/ReviewsContext'
import { useAuth } from '../context/AuthContext'
import DashNav from '../components/DashNav'
import Stars from '../components/Stars'
import ReviewDialog from '../components/ReviewDialog'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function initialsFor(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function CommentForm({ onSubmit }) {
  const [text, setText] = useState('')

  function handle(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    setText('')
  }

  return (
    <form className="comment-form" onSubmit={handle}>
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="btn-primary" disabled={!text.trim()}>Reply</button>
    </form>
  )
}

function ReviewItem({ review, currentEmail, onAddComment }) {
  const isOwn = review.userEmail === currentEmail
  return (
    <article className="review-item">
      <div className="review-head">
        <div className="review-author">
          <span className="dash-avatar">{initialsFor(review.userName)}</span>
          <div>
            <div className="review-author-name">
              {review.userName}{isOwn && <span className="review-you"> (you)</span>}
            </div>
            <div className="review-date">{formatDate(review.createdAt)}</div>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>
      <p className="review-text">{review.text}</p>

      {review.attachments?.length > 0 && (
        <div className="review-attachments">
          {review.attachments.map((a, i) => (
            a.type.startsWith('image/') ? (
              <a key={i} href={a.dataUrl} target="_blank" rel="noreferrer" className="review-attachment">
                <img src={a.dataUrl} alt={a.name} />
              </a>
            ) : (
              <video key={i} src={a.dataUrl} controls className="review-attachment review-video" />
            )
          ))}
        </div>
      )}

      {review.comments.length > 0 && (
        <div className="review-comments-meta">💬 {review.comments.length} comment{review.comments.length === 1 ? '' : 's'}</div>
      )}

      {review.comments.map((c) => (
        <div key={c.id} className="comment">
          <div className="comment-head">
            <span className="comment-author">{c.userName}</span>
            <span className="comment-date">{formatDate(c.createdAt)}</span>
          </div>
          <p className="comment-text">{c.text}</p>
        </div>
      ))}

      <CommentForm onSubmit={(text) => onAddComment(review.id, text)} />
    </article>
  )
}

function RatingBreakdown({ breakdown, total }) {
  return (
    <div className="rating-breakdown">
      <h3>Rating Breakdown</h3>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = breakdown[5 - star]
        const pct = total ? (count / total) * 100 : 0
        return (
          <div key={star} className="rb-row">
            <span className="rb-label">{star} <span className="star-filled">★</span></span>
            <div className="rb-bar"><div className="rb-fill" style={{ width: `${pct}%` }} /></div>
            <span className="rb-count">{count}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function ApartmentDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { reviews, addReview, addComment } = useReviews()
  const [dialogOpen, setDialogOpen] = useState(false)

  const apartment = getApartment(id)
  const stats = useMemo(() => statsForApartment(reviews, id), [reviews, id])
  const aptReviews = useMemo(
    () => reviews.filter((r) => r.apartmentId === id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [reviews, id]
  )

  if (!apartment) return <Navigate to="/dashboard" replace />

  function handleSubmit({ rating, text, attachments }) {
    addReview({ apartmentId: id, user, rating, text, attachments })
    setDialogOpen(false)
  }

  return (
    <div className="dash-shell">
      <DashNav />

      <main className="dash-main">
        <Link to="/dashboard" className="back-link">← Back to all apartments</Link>

        <section className="apt-hero">
          <div>
            <h1 className="apt-hero-name">{apartment.name}</h1>
            <p className="apt-hero-address">
              <span className="apt-pin" aria-hidden>📍</span>
              {apartment.address} · {apartment.neighbourhood}
            </p>
            <p className="apt-hero-desc">{apartment.description}</p>
          </div>
          <div className="apt-hero-rating">
            <div className="apt-hero-score">{stats.avg ? stats.avg.toFixed(1) : '—'}</div>
            <Stars rating={stats.avg} size={16} />
            <div className="apt-hero-count">{stats.count} review{stats.count === 1 ? '' : 's'}</div>
          </div>
        </section>

        <div className="detail-grid">
          <div className="detail-main">
            {apartment.summary && (
              <section className="ai-summary">
                <div className="ai-summary-label">✨ AI-GENERATED SUMMARY</div>
                <p>{apartment.summary}</p>
              </section>
            )}

            {apartment.tags.length > 0 && (
              <section className="key-issues">
                <h2>Key Issues</h2>
                <div className="apt-tags">
                  {apartment.tags.map((t) => <span key={t} className="apt-tag">{t}</span>)}
                </div>
              </section>
            )}

            <section className="reviews-section">
              <div className="reviews-header">
                <h2>Reviews ({stats.count})</h2>
                <button type="button" className="btn-outline" onClick={() => setDialogOpen(true)}>
                  + Write a Review
                </button>
              </div>

              {aptReviews.length === 0 ? (
                <div className="dash-empty">No reviews yet. Be the first to share your experience.</div>
              ) : (
                aptReviews.map((r) => (
                  <ReviewItem
                    key={r.id}
                    review={r}
                    currentEmail={user.email}
                    onAddComment={(reviewId, text) => addComment(reviewId, { user, text })}
                  />
                ))
              )}
            </section>
          </div>

          <aside className="detail-side">
            <div className="info-card">
              <h3>Property Info</h3>
              <dl>
                <dt>Landlord</dt><dd>{apartment.landlord}</dd>
                <dt>Units</dt><dd>{apartment.units}</dd>
                <dt>Year built</dt><dd>{apartment.yearBuilt}</dd>
                <dt>Neighbourhood</dt><dd>{apartment.neighbourhood}</dd>
              </dl>
            </div>

            <div className="info-card">
              <RatingBreakdown breakdown={stats.breakdown} total={stats.count} />
            </div>

            <button type="button" className="btn-primary full-width" onClick={() => setDialogOpen(true)}>
              Write a Review
            </button>
          </aside>
        </div>
      </main>

      {dialogOpen && (
        <ReviewDialog mode="create" onClose={() => setDialogOpen(false)} onSubmit={handleSubmit} />
      )}
    </div>
  )
}
