export default function Stars({ rating, max = 5, size = 13, className = '' }) {
  const rounded = Math.round(rating)
  return (
    <span
      className={`stars ${className}`}
      style={{ fontSize: size }}
      aria-label={`${rating} out of ${max}`}
      role="img"
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          data-testid={n <= rounded ? 'star-filled' : 'star-empty'}
          className={n <= rounded ? 'star-filled' : 'star-empty'}
        >
          ★
        </span>
      ))}
    </span>
  )
}
