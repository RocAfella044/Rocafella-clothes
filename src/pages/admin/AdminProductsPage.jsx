import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../supabase/products';
import {
  Spinner,
  ErrorMessage,
  EmptyState,
} from '../../components/common/Feedback';
import { Button } from '../../components/common/Button';
import { useUI } from '../../context/UIContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function AdminProductsPage() {
  useDocumentTitle('Manage Products');
  const { showToast } = useUI();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setStatus('loading');
    try {
      const data = await fetchProducts();
      setProducts(data);
      setStatus('succeeded');
    } catch (err) {
      setError(err.message);
      setStatus('failed');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`))
      return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`Deleted "${product.name}"`, { type: 'success' });
    } catch (err) {
      showToast(err.message || 'Failed to delete product.', { type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  if (status === 'loading') return <Spinner label="Loading products" />;
  if (status === 'failed')
    return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Admin</p>
          <h1 className="font-display text-3xl">Products</h1>
        </div>
        <Link to="/admin/products/new">
          <Button $variant="primary">+ Add product</Button>
        </Link>
      </div>
      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          message="Add your first product to get started."
          action={
            <Link to="/admin/products/new">
              <Button $variant="primary">Add product</Button>
            </Link>
          }
        />
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(
                  (h) => (
                    <th key={h} className="eyebrow pb-3 pr-4">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="py-3 pr-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-10 bg-sand object-cover"
                    />
                  </td>
                  <td className="py-3 pr-4 font-display">{product.name}</td>
                  <td className="py-3 pr-4 text-ink/60">{product.category}</td>
                  <td className="py-3 pr-4 font-mono">${product.price}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        product.stock === 0 ? 'text-clay' : 'text-moss'
                      }
                    >
                      {product.stock === 0 ? 'Out of stock' : product.stock}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="font-mono text-xs uppercase tracking-widest2 underline hover:text-moss"
                      >
                        Edit
                      </Link>
                      <Button
                        $variant="danger"
                        $size="sm"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product)}
                      >
                        {deletingId === product.id ? '…' : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
