import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../supabase/products';
import { Button } from '../components/common/Button';
import { Spinner, ErrorMessage, EmptyState } from '../components/common/Feedback';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  color: '',
  image: '',
  stock: '',
  sizes: '',
  rating: '',
  is_new: false,
};

export function AdminProductsPage() {
  useDocumentTitle('Admin products');
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      setStatus('loading');
      setError(null);
      try {
        const result = await fetchProducts({});
        setProducts(result);
        setStatus('succeeded');
      } catch (err) {
        setError(err?.message || 'Failed to load products');
        setStatus('failed');
      }
    }

    loadProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError(null);

    const payload = {
      ...form,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
      sizes: form.sizes ? form.sizes.split(',').map((size) => size.trim()) : [],
    };

    try {
      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        setProducts((prev) =>
          prev.map((item) => (item.id === editingId ? updated : item)),
        );
      } else {
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
      }
      setForm(initialForm);
      setEditingId(null);
      setStatus('succeeded');
    } catch (err) {
      setError(err?.message || 'Failed to save product');
      setStatus('failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      color: product.color || '',
      image: product.image || '',
      stock: product.stock || '',
      sizes: (product.sizes || []).join(', '),
      rating: product.rating || '',
      is_new: product.is_new || false,
    });
  };

  const handleDelete = async (productId) => {
    setStatus('loading');
    setError(null);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setStatus('succeeded');
    } catch (err) {
      setError(err?.message || 'Failed to delete product');
      setStatus('failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="font-display text-4xl sm:text-5xl">Manage products</h1>
        </div>
      </div>

      {status === 'loading' && <Spinner label="Loading products" />}
      {status === 'failed' && <ErrorMessage message={error} />}

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <section className="space-y-6 rounded-xl border border-line bg-sand p-6">
          <h2 className="font-display text-2xl">Create / edit product</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { name: 'name', label: 'Name' },
              { name: 'category', label: 'Category' },
              { name: 'color', label: 'Color' },
              { name: 'image', label: 'Image URL' },
            ].map((field) => (
              <label key={field.name} className="block text-sm">
                <span className="text-ink/60">{field.label}</span>
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="mt-2 w-full rounded border border-line bg-transparent px-3 py-2 text-sm focus:border-ink focus:outline-none"
                />
              </label>
            ))}

            <label className="block text-sm">
              <span className="text-ink/60">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="mt-2 w-full rounded border border-line bg-transparent px-3 py-2 text-sm focus:border-ink focus:outline-none"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: 'price', label: 'Price' },
                { name: 'stock', label: 'Stock' },
                { name: 'rating', label: 'Rating' },
                { name: 'sizes', label: 'Sizes (comma separated)' },
              ].map((field) => (
                <label key={field.name} className="block text-sm">
                  <span className="text-ink/60">{field.label}</span>
                  <input
                    type={field.name === 'rating' ? 'number' : 'text'}
                    step={field.name === 'rating' ? '0.1' : undefined}
                    min={field.name === 'rating' ? '0' : undefined}
                    max={field.name === 'rating' ? '5' : undefined}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="mt-2 w-full rounded border border-line bg-transparent px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  />
                </label>
              ))}
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="is_new"
                checked={form.is_new}
                onChange={handleChange}
                className="h-4 w-4 accent-ink"
              />
              <span>Mark as new</span>
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" $variant="primary">
                {editingId ? 'Update product' : 'Create product'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </section>

        <section className="space-y-4 rounded-xl border border-line bg-sand p-6">
          <h2 className="font-display text-2xl">Product list</h2>
          {products.length === 0 ? (
            <EmptyState
              title="No products"
              message="Create a product to get started."
            />
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-line bg-canvas p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-display text-sm">{product.name}</p>
                      <p className="mt-1 text-xs text-ink/50">
                        {product.category} · NPR {product.price}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        $variant="secondary"
                        type="button"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        $variant="danger"
                        type="button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
