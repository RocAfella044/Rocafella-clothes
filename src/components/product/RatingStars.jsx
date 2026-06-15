export function RatingStars({ rating }) {
  const full = Math.round(rating)
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'text-clay' : 'text-line'}>
          ★
        </span>
      ))}
      <span className="ml-1 font-mono text-xs text-ink/50">{rating.toFixed(1)}</span>
    </div>
  )
}
