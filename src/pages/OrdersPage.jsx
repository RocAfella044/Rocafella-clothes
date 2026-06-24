import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadOrders, selectOrderHistory } from '../redux/slices/ordersSlice';
import { useAuth } from '../context/AuthContext';
import { EmptyState, Spinner } from '../components/common/Feedback';
import { Button } from '../components/common/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl sm:text-4xl">Order History</h1>
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Once you place an order it will show up here."
          action={
            <Link to="/">
              <Button $variant="primary">Browse the shop</Button>
            </Link>
          }
        />
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex flex-col gap-2 border border-line p-5 transition-colors hover:border-ink sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono text-sm">{order.id}</p>
                <p className="mt-1 text-xs text-ink/50">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <p className="font-mono text-xs uppercase tracking-widest2 text-moss">
                  {order.status}
                </p>
                <p className="font-mono text-sm">
                  ${Number(order.total).toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
