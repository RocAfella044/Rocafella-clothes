import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPriceRange } from '../../redux/slices/productsSlice'

export function PriceRangeFilter() {
  const dispatch = useDispatch()
  const { minPrice, maxPrice } = useSelector((state) => state.products.filters)
  const [min, setMin] = useState(minPrice ?? '')
  const [max, setMax] = useState(maxPrice ?? '')
  const [error, setError] = useState('')

  const handleApply = (e) => {
    e.preventDefault()
    const minVal = min === '' ? null : Number(min)
    const maxVal = max === '' ? null : Number(max)

    if (minVal != null && maxVal != null && minVal > maxVal) {
      setError('Minimum price cannot exceed maximum.')
      return
    }
    setError('')
    dispatch(setPriceRange({ min: minVal, max: maxVal }))
  }

  return (
    <form onSubmit={handleApply}>
      <p className="eyebrow mb-2">Price</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          aria-label="Minimum price"
          className="w-20 border border-line bg-transparent px-2 py-1.5 font-mono text-xs focus:border-ink focus:outline-none"
        />
        <span className="text-ink/40">–</span>
        <input
          type="number"
          inputMode="numeric"
          min="0"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          aria-label="Maximum price"
          className="w-20 border border-line bg-transparent px-2 py-1.5 font-mono text-xs focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="border border-ink px-3 py-1.5 font-mono text-xs uppercase tracking-widest2 hover:bg-ink hover:text-canvas transition-colors"
        >
          Go
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-clay">{error}</p>}
    </form>
  )
}
