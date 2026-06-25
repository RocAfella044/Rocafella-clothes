import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, resetFilters } from '../redux/slices/productsSlice';
import { ProductGrid } from '../components/product/ProductGrid';
import { SearchBar } from '../components/filters/SearchBar';
import { CategoryFilter } from '../components/filters/CategoryFilter';
import { SortSelect } from '../components/filters/SortSelect';
import {
  Spinner,
  ErrorMessage,
  EmptyState,
} from '../components/common/Feedback';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function HomePage() {
  useDocumentTitle('Shop');
  const dispatch = useDispatch();
  const { items, status, error, filters } = useSelector(
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-3">Spring 수집</p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          WEAR YOUR IDENTITY
        </h1>
        <p className="mt-4 text-ink/60">
          APPAREL CRAFTED TO MATCH YOUR RHYTHM OF LIFE
        </p>
      </div>

      <div className="mb-8 grid gap-6 border border-line p-4 sm:p-6 lg:grid-cols-[2fr_3fr_1fr] lg:items-end">
        <SearchBar initialValue={filters.search} />
        <CategoryFilter />
        <SortSelect />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="font-mono text-xs text-ink/50">
          {status === 'succeeded' &&
            `${items.length} item${items.length === 1 ? '' : 's'}`}
        </p>
        {(filters.category !== 'All' ||
          filters.search ||
          filters.sort !== 'featured') && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="font-mono text-xs uppercase tracking-widest2 text-moss hover:underline"
          >
            Clear the filters
          </button>
        )}
      </div>

      {status === 'loading' && <Spinner label="Loading collection" />}
      {status === 'failed' && (
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchProducts(filters))}
        />
      )}
      {status === 'succeeded' && items.length === 0 && (
        <EmptyState
          title="Nothing here yet"
          message="Try a different search term or clear your filters."
        />
      )}
      {status === 'succeeded' && items.length > 0 && (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
