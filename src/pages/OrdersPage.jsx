import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadOrders, selectOrderHistory } from '../redux/slices/ordersSlice';
import { useAuth } from '../context/AuthContext';
import { EmptyState, Spinner } from '../components/common/Feedback';
import { Button } from '../components/common/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const statusColor = {
  confirmed: 'text-moss bg-moss/10',
  shipped: 'text-ink bg-ink/10',
  delivered: 'text-clay bg-clay/10',
  cancelled: 'text-clay/70 bg-clay/5',
};

export function OrdersPage() {
  useDocumentTitle('Orders');
  const dispatch = useDispatch();
  const { user } = useAuth();
  const orders = useSelector(selectOrderHistory);
  const status = useSelector((state) => state.orders.status);

  useEffect(() => {
    if (user) dispatch(loadOrders(user.id));
  }, [user, dispatch]);

  if (status === 'loading') return <Spinner label="Loading orders" />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow mb-1">Account</p>
          <h1 className="font-display text-3xl sm:text-4xl">Order History</h1>
        </div>
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink transition-colors mb-1"
        >
          Shop →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No orders yet"
            message="Once you place an order, it will show up here."
            action={
              <Link to="/">
                <Button $variant="primary">Browse the shop</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="group border border-line p-5 hover:border-ink transition-colors"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  {/* Order icon */}
                  <div className="flex h-10 w-10 flex-none items-center justify-center border border-line bg-sand text-lg">
                    📦
                  </div>
                  <div>
                    <p className="font-mono text-sm">{order.id}</p>
                    <p className="mt-0.5 text-xs text-ink/50">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="mt-1 text-xs text-ink/40">
                      {order.items?.length} item
                      {order.items?.length !== 1 ? 's' : ''} ·{' '}
                      {order.customer?.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <span
                    className={`inline-block rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-widest2 ${statusColor[order.status] || statusColor.confirmed}`}
                  >
                    {order.status}
                  </span>
                  <p className="font-display text-lg">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Item thumbnails */}
              {order.items?.length > 0 && (
                <div className="mt-4 flex gap-2 border-t border-line pt-4">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-10 object-cover bg-sand"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex h-12 w-10 items-center justify-center bg-sand font-mono text-xs text-ink/50">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
