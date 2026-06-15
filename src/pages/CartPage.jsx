import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartItems } from '../redux/slices/cartSlice'
import { CartLineItem } from '../components/cart/CartLineItem'
import { CartSummary } from '../components/cart/CartSummary'
import { EmptyState } from '../components/common/Feedback'
import { Button } from '../components/common/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function CartPage() {
  useDocumentTitle('Cart')
  const items = useSelector(selectCartItems)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl sm:text-4xl">Your Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Pieces you add will appear here, ready when you are."
          action={
            <Link to="/">
              <Button $variant="primary" $size="md">
                Continue shopping
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            {items.map((item) => (
              <CartLineItem key={`${item.id}-${item.size}`} item={item} />
            ))}
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  )
}
