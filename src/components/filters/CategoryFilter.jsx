import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../../redux/slices/productsSlice';

const CATEGORIES = [
  'All',
  'Outerwear',
  'Knitwear',
  'Tops',
  'Bottoms',
  'Dresses',
  'Accessories',
];

export function CategoryFilter() {
  const dispatch = useDispatch();
  const active = useSelector((state) => state.products.filters.category);

  return (
    <div>
      <p className="eyebrow mb-2">Category</p>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((option) => (
          <button
            key={option}
            onClick={() => dispatch(setCategory(option))}
            className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
              active === option
                ? 'border-ink bg-ink text-canvas'
                : 'border-line text-ink/70 hover:border-ink'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
