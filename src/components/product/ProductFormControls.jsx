export function SizeSelector({ sizes, value, onChange, error }) {
  return (
    <div>
      <p className="eyebrow mb-2">Size</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={value === size}
            onClick={() => onChange(size)}
            className={`border px-3 py-2 font-mono text-xs transition-colors ${
              value === size
                ? 'border-ink bg-ink text-canvas'
                : 'border-line text-ink/70 hover:border-ink'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-clay">{error}</p>}
    </div>
  )
}

export function QuantityInput({ value, onChange, min = 1, max = 9 }) {
  const clamp = (n) => Math.min(max, Math.max(min, n))

  return (
    <div>
      <p className="eyebrow mb-2">Quantity</p>
      <div className="inline-flex items-center border border-line">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onChange(clamp(value - 1))}
          className="px-3 py-2 font-mono hover:bg-sand transition-colors"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10)
            onChange(Number.isNaN(n) ? min : clamp(n))
          }}
          className="w-12 border-x border-line bg-transparent py-2 text-center font-mono text-sm focus:outline-none"
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onChange(clamp(value + 1))}
          className="px-3 py-2 font-mono hover:bg-sand transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
