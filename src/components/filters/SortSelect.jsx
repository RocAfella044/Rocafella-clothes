import { useDispatch, useSelector } from 'react-redux'
import { setSort } from '../../redux/slices/productsSlice'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export function SortSelect() {
  const dispatch = useDispatch()
  const sort = useSelector((state) => state.products.filters.sort)

  return (
    <div>
      <label htmlFor="sort" className="eyebrow mb-2 block">
        Sorts
      </label>
      <select
        id="sort"
        value={sort}
        onChange={(e) => dispatch(setSort(e.target.value))}
        className="border border-line bg-transparent px-3 py-2 font-mono text-xs focus:border-ink focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
