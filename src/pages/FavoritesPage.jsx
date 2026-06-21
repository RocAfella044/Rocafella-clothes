import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectFavoriteIds } from '../redux/slices/favoritesSlice'
import { products } from '../services/mockData'
import { ProductGrid } from '../components/product/ProductGrid'
import { EmptyState } from '../components/common/Feedback'
import { Button } from '../components/common/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function FavoritesPage() {
  useDocumentTitle('Favorites')
  const favoriteIds = useSelector(selectFavoriteIds)
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl sm:text-4xl">You Preferred</h1>
      <p className="mt-2 text-ink/60">Pieces you&rsquo;re keeping an eye on.</p>

      {favoriteProducts.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          message="Tap the heart on any product to save it for later."
          action={
            <Link to="/">
              <Button $variant="primary">Lets shop</Button>
            </Link>
          }
        />
      ) : (
        <div className="mt-8">
          <ProductGrid products={favoriteProducts} />
        </div>
      )}
    </div>
  )
}
