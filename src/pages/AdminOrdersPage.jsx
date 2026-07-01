import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { fetchAllOrders } from '../supabase/admin';
import {
  Spinner,
  ErrorMessage,
  EmptyState,
} from '../components/common/Feedback';

export function AdminOrdersPage() {
  useDocumentTitle('Admin orders');
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      setStatus('loading');
      setError(null);
      try {
        const data = await fetchAllOrders();
        setOrders(data);
        setStatus('succeeded');
      } catch (err) {
        setError(err?.message || 'Failed to load orders');
        setStatus('failed');
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="eyebrow">Admin</p>
        <h1 className="font-display text-4xl sm:text-5xl">사용자 orders</h1>
      </div>

      {status === 'loading' && <Spinner label="Loading orders" />}
      {status === 'failed' && <ErrorMessage message={error} />}

      {status === 'succeeded' && orders.length === 0 && (
        <EmptyState title="No orders" message="No orders exist yet." />
      )}

      {status === 'succeeded' && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-line bg-sand p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-sm">Order {order.id}</p>
                  <p className="mt-1 text-xs text-ink/50">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest2 text-ink/60">
                    Status
                  </span>
                  <span className="rounded border border-line bg-transparent px-3 py-2 text-sm">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 text-sm text-ink/60">
                <p>{order.customer?.fullName || 'Unknown customer'}</p>
                <p>{order.customer?.email}</p>
                <p className="mt-2 font-mono">
                  Total: NPR {Number(order.total).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
