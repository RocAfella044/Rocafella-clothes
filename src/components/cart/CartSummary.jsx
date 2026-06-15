import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartTotal, selectCartCount } from '../../redux/slices/cartSlice'
import { Button } from '../common/Button'

const SHIPPING_THRESHOLD = 150
const SHIPPING_COST = 8

export function CartSummary({ checkoutTo = '/checkout' }) {
  const subtotal = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  return (
    <div className="border border-line p-6">
      <p className="eyebrow mb-4">Order Summary</p>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink/60">Items ({count})</dt>
          <dd className="font-mono">NPR {subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/60">Shipping</dt>
          <dd className="font-mono">{shipping === 0 ? 'Free' : `NPR ${shipping.toFixed(2)}`}</dd>
        </div>
        {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
          <p className="text-xs text-moss">
            Add NPR {(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.
          </p>
        )}
      </dl>
      <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-lg">
        <span>Total</span>
        <span className="font-mono">NPR {total.toFixed(2)}</span>
      </div>
      {count === 0 ? (
        <Button $variant="primary" $size="lg" disabled className="mt-6 w-full">
          Checkout
        </Button>
      ) : (
        <Link to={checkoutTo} className="mt-6 block">
          <Button $variant="primary" $size="lg" className="w-full">
            Checkout
          </Button>
        </Link>
      )}
    </div>
  )
}
