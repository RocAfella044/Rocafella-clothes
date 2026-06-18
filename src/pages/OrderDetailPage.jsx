import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectOrderHistory } from '../redux/slices/ordersSlice'
import { EmptyState } from '../components/common/Feedback'
import { Button } from '../components/common/Button'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function OrderDetailPage() {
  const { id } = useParams()
  const orders = useSelector(selectOrderHistory)
  const order = orders.find((o) => o.id === id)

  useDocumentTitle(order ? `Order ${order.id}` : 'Order')

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="Order not found"
          message="We couldn't find that order."
          action={
            <Link to="/orders">
              <Button $variant="primary">View order history</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="eyebrow text-moss">Order confirmed</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl">Thank you, {order.customer.fullName.split(' ')[0]}.</h1>
      <p className="mt-3 text-ink/60">
        Your order <span className="font-mono">{order.id}</span> was placed on{' '}
        {new Date(order.placedAt).toLocaleString()}.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <p className="eyebrow mb-4">Items</p>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={`${item.id}-${item.size}`} className="flex items-center gap-4 py-4">
                <img src={item.image} alt={item.name} className="h-20 w-16 flex-none bg-sand object-cover" />
                <div className="flex-1">
                  <p className="font-display text-sm">{item.name}</p>
                  <p className="mt-1 font-mono text-xs text-ink/50">
                    Size {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <p className="font-mono text-sm">NPR {(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-line p-6">
            <p className="eyebrow mb-4">Shipping to</p>
            <div className="text-sm leading-relaxed text-ink/70">
              <p>{order.customer.fullName}</p>
              <p>{order.customer.address}</p>
              <p>
                {order.customer.city}, {order.customer.postcode}
              </p>
              <p>{order.customer.country}</p>
              <p className="mt-2 text-ink/50">{order.customer.email}</p>
            </div>
          </div>
          <div className="border border-line p-6">
            <div className="flex justify-between font-display text-lg">
              <span>Total price </span>
              <span className="font-mono">NPR {order.total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/">
            <Button $variant="secondary" $size="lg" className="w-full">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
