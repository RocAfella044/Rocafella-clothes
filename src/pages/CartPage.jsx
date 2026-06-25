import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartItems } from '../redux/slices/cartSlice'
import { CartLineItem } from '../components/cart/CartLineItem'
import { CartSummary } from '../components/cart/CartSummary'
import { EmptyState } from '../components/common/Feedback'
import { Button } from '../components/common/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

// Group cart items by product id so same product with different
// sizes appears as one card with multiple size rows underneath
function groupByProduct(items) {
  const map = new Map()
  items.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, {
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        category: item.category,
        sizes: [],
      })
    }
    map.get(item.id).sizes.push({
      id: item.id,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    })
  })
  return Array.from(map.values())
}

const suggestedLinks = [
  { to: '/', label: 'Continue shopping', icon: '→' },
  { to: '/favorites', label: 'View saved items', icon: '♡' },
  { to: '/orders', label: 'Order history', icon: '📦' },
]

export function CartPage() {
  useDocumentTitle('Cart')
  const items = useSelector(selectCartItems)
  const grouped = groupByProduct(items)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow mb-1">Shopping</p>
          <h1 className="font-display text-3xl sm:text-4xl">Your Cart</h1>
        </div>
        {items.length > 0 && (
          <p className="font-mono text-sm text-ink/50 mb-1">
            {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="Your cart is empty"
            message="Pieces you add will appear here, ready when you are."
          />
          <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto">
            {suggestedLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between border border-line px-4 py-4 hover:border-ink hover:bg-sand transition-colors"
              >
                <span className="text-sm">{label}</span>
                <span className="text-ink/30">{icon}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            {grouped.map((product) => (
              <CartLineItem
                key={product.id}
                item={product}
                allSizes={product.sizes}
              />
            ))}

            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-6">
              <Link to="/" className="font-mono text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink transition-colors">
                ← Continue shopping
              </Link>
              <span className="text-line">·</span>
              <Link to="/favorites" className="font-mono text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink transition-colors">
                ♡ Saved items
              </Link>
              <span className="text-line">·</span>
              <Link to="/orders" className="font-mono text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink transition-colors">
                📦 Orders
              </Link>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  )
}