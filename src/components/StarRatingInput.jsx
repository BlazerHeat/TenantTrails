import { useState } from 'react'

export default function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <div className="star-input" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-input-btn ${n <= display ? 'is-filled' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
