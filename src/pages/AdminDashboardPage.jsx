import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { fetchProducts } from '../supabase/products';
import { fetchAllOrders } from '../supabase/admin';
import { listUsers } from '../supabase/auth';
import { Spinner, ErrorMessage } from '../components/common/Feedback';
import { Button } from '../components/common/Button';

export function AdminDashboardPage() {
  useDocumentTitle('Admin dashboard');
  const [counts, setCounts] = useState({ products: 0, orders: 0, users: 0 });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCounts() {
      setStatus('loading');
      setError(null);

      try {
        const [products, orders, users] = await Promise.all([
          fetchProducts({}),
          fetchAllOrders(),
          listUsers(),
        ]);
        setCounts({
          products: products.length,
          orders: orders.length,
          users: users.length,
        });
        setStatus('succeeded');
      } catch (err) {
        setError(err?.message || 'Failed to load dashboard');
        setStatus('failed');
      }
    }

    loadCounts();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="eyebrow mb-3">Admin</p>
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-ink/60">
          Manage products, orders, and users from a single admin panel.
        </p>
      </div>

      {status === 'loading' && <Spinner label="Loading admin data" />}
      {status === 'failed' && <ErrorMessage message={error} />}

      {status === 'succeeded' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-line bg-sand p-6">
            <p className="eyebrow">Products</p>
            <p className="mt-4 text-4xl font-display">{counts.products}</p>
            <p className="mt-3 text-sm text-ink/60">
              Total products available in the catalog.
            </p>
            <Link to="/admin/products">
              <Button $variant="secondary" className="mt-6">
                Manage products
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-line bg-sand p-6">
            <p className="eyebrow">Orders</p>
            <p className="mt-4 text-4xl font-display">{counts.orders}</p>
            <p className="mt-3 text-sm text-ink/60">
              View and update order status for all orders.
            </p>
            <Link to="/admin/orders">
              <Button $variant="secondary" className="mt-6">
                Manage orders
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-line bg-sand p-6">
            <p className="eyebrow">Users</p>
            <p className="mt-4 text-4xl font-display">{counts.users}</p>
            <p className="mt-3 text-sm text-ink/60">
              Review user accounts and assign admin roles.
            </p>
            <Link to="/admin/users">
              <Button $variant="secondary" className="mt-6">
                Manage users
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
