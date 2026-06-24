import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFavoriteIds } from '../redux/slices/favoritesSlice';
import { fetchProducts } from '../supabase/products';
import { ProductGrid } from '../components/product/ProductGrid';
import { EmptyState, Spinner } from '../components/common/Feedback';
import { Button } from '../components/common/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function FavoritesPage() {
  useDocumentTitle('Saved');
  const favoriteIds = useSelector(selectFavoriteIds);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    fetchProducts()
      .then((all) => setProducts(all.filter((p) => favoriteIds.includes(p.id))))
      .finally(() => setLoading(false));
  }, [favoriteIds]);

  if (loading) return <Spinner label="Loading saved items" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow mb-1">Account</p>
          <h1 className="font-display text-3xl sm:text-4xl">Saved Items</h1>
        </div>
        <div className="flex items-center gap-4 mb-1">
          {products.length > 0 && (
            <p className="font-mono text-sm text-ink/50">
              {products.length} piece{products.length !== 1 ? 's' : ''}
            </p>
          )}
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink transition-colors"
          >
            Shop →
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="Nothing saved yet"
            message="Tap the heart on any product to save it here for later."
            action={
              <Link to="/">
                <Button $variant="primary">Browse the shop</Button>
              </Link>
            }
          />
          {/* Suggestion row */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 max-w-xl mx-auto">
            <Link
              to="/orders"
              className="flex items-center justify-between border border-line px-4 py-4 hover:border-ink hover:bg-sand transition-colors"
            >
              <span className="text-sm">View order history</span>
              <span className="text-ink/30">→</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center justify-between border border-line px-4 py-4 hover:border-ink hover:bg-sand transition-colors"
            >
              <span className="text-sm">Go to cart</span>
              <span className="text-ink/30">→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
}
