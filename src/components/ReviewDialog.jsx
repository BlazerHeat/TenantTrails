import { useEffect, useState } from 'react'
import StarRatingInput from './StarRatingInput'
import { validateReview } from '../utils/validation'

export default function ReviewDialog({ mode = 'create', initial, onClose, onSubmit }) {
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [text, setText] = useState(initial?.text ?? '')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e) {
    e.preventDefault()
    const v = validateReview({ rating, text })
    setErrors(v)
    if (Object.keys(v).length) return
    onSubmit({ rating, text: text.trim() })
  }

  const title = mode === 'edit' ? 'Edit Review' : 'Write a Review'
  const submitLabel = mode === 'edit' ? 'Save Changes' : 'Submit Review'

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit} noValidate>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <label className="modal-label">Your rating</label>
        <StarRatingInput value={rating} onChange={setRating} />
        <span className="modal-hint">{rating ? `${rating} of 5` : 'Click to rate'}</span>
        {errors.rating && <span className="auth-error">{errors.rating}</span>}

        <label className="modal-label" htmlFor="review-text">Your review</label>
        <textarea
          id="review-text"
          className={`modal-textarea ${errors.text ? 'auth-input-error' : ''}`}
          rows={5}
          placeholder="What was your experience living here? Cover maintenance, responsiveness, noise, pests, deposit handling, and anything future tenants should know."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {errors.text && <span className="auth-error">{errors.text}</span>}

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{submitLabel}</button>
        </div>
      </form>
    </div>
  )
}
