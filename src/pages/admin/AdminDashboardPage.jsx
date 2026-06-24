import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../supabase/products';
import { listUsers } from '../../supabase/auth';
import { Spinner, ErrorMessage } from '../../components/common/Feedback';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

function StatCard({ label, value, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-1 border border-line p-6 hover:border-ink transition-colors"
    >
      <p className="eyebrow">{label}</p>
      <p className="font-display text-4xl">{value}</p>
    </Link>
  );
}

export function AdminDashboardPage() {
  useDocumentTitle('Admin Dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchProducts(), listUsers()])
      .then(([products, users]) =>
        setStats({ products: products.length, users: users.length }),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Admin</p>
      <h1 className="font-display text-3xl sm:text-4xl">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total products"
          value={stats.products}
          to="/admin/products"
        />
        <StatCard label="Total users" value={stats.users} to="/admin/users" />
        <Link
          to="/admin/products/new"
          className="flex flex-col items-start justify-end gap-1 border border-ink bg-ink p-6 text-canvas hover:bg-ink/90 transition-colors"
        >
          <p className="eyebrow text-canvas/60">Quick action</p>
          <p className="font-display text-2xl">Add product →</p>
        </Link>
      </div>
      <div className="mt-10">
        <p className="eyebrow mb-4">Quick links</p>
        <div className="flex flex-wrap gap-3">
          {[
            { to: '/admin/products', label: 'Manage products' },
            { to: '/admin/users', label: 'View users' },
            { to: '/', label: 'View storefront' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest2 hover:border-ink transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
