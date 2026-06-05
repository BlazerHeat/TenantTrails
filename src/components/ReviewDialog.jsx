import { useEffect, useRef, useState } from 'react'
import StarRatingInput from './StarRatingInput'
import { validateReview } from '../utils/validation'

const ACCEPTED = 'image/jpeg,image/png,video/mp4'
const MAX_BYTES = 10 * 1024 * 1024

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export default function ReviewDialog({ mode = 'create', initial, onClose, onSubmit }) {
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [text, setText] = useState(initial?.text ?? '')
  const [attachments, setAttachments] = useState(initial?.attachments ?? [])
  const [errors, setErrors] = useState({})
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleFiles(fileList) {
    setUploadError('')
    const next = []
    for (const file of Array.from(fileList)) {
      if (!ACCEPTED.split(',').includes(file.type)) {
        setUploadError(`${file.name}: unsupported format. Use JPG, PNG, or MP4.`)
        continue
      }
      if (file.size > MAX_BYTES) {
        setUploadError(`${file.name}: exceeds 10MB limit.`)
        continue
      }
      const dataUrl = await readAsDataUrl(file)
      next.push({ name: file.name, type: file.type, size: file.size, dataUrl })
    }
    if (next.length) setAttachments((prev) => [...prev, ...next])
  }

  function removeAttachment(i) {
    setAttachments((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const v = validateReview({ rating, text })
    setErrors(v)
    if (Object.keys(v).length) return
    onSubmit({ rating, text: text.trim(), attachments })
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

        <label className="modal-label">Attach photos or videos (optional)</label>
        <button
          type="button"
          className="dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="dropzone-icon" aria-hidden>📎</span>
          <span className="dropzone-title">Click to upload</span>
          <span className="dropzone-hint">JPG, PNG, MP4 up to 10MB</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
        {uploadError && <span className="auth-error">{uploadError}</span>}

        {attachments.length > 0 && (
          <div className="attachment-list">
            {attachments.map((a, i) => (
              <div key={`${a.name}-${i}`} className="attachment-chip">
                {a.type.startsWith('image/') ? (
                  <img src={a.dataUrl} alt={a.name} />
                ) : (
                  <span className="attachment-video" aria-hidden>🎬</span>
                )}
                <span className="attachment-name" title={a.name}>{a.name}</span>
                <button
                  type="button"
                  className="attachment-remove"
                  onClick={() => removeAttachment(i)}
                  aria-label={`Remove ${a.name}`}
                >×</button>
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">{submitLabel}</button>
        </div>
      </form>
    </div>
  )
}
