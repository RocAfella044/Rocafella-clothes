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
      <h1 className="font-display text-3xl sm:text-4xl">당신이 선호한
</h1>
      <p className="mt-2 text-ink/60">Attire you&rsquo;re keeping an eye on.</p>
      {products.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          message="Tap the heart on any product to save it for later."
          action={
              <Link to="/">
                <Button $variant="primary">Browse the shop</Button>
              </Link>
          }
        />
      ) : (
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
}
