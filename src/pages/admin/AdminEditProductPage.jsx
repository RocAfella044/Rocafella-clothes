import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchProductById, updateProduct } from '../../supabase/products';
import { ProductForm } from '../../components/admin/ProductForm';
import { Spinner, ErrorMessage } from '../../components/common/Feedback';
import { useUI } from '../../context/UIContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function AdminEditProductPage() {
  useDocumentTitle('Edit Product');
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useUI();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setStatus('succeeded');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('failed');
      });
  }, [id]);

  const handleSubmit = async (values) => {
    await updateProduct(id, values);
    showToast('Product updated successfully', { type: 'success' });
    navigate('/admin/products');
  };

  if (status === 'loading') return <Spinner label="Loading product" />;
  if (status === 'failed') return <ErrorMessage message={error} />;

  const initialValues = {
    ...product,
    sizes: Array.isArray(product.sizes)
      ? product.sizes.join(', ')
      : product.sizes,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/admin/products"
        className="font-mono text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink"
      >
        ← Back to products
      </Link>
      <h1 className="mt-4 font-display text-3xl">Edit Product</h1>
      <p className="mt-1 font-mono text-xs text-ink/40">{product.name}</p>
      <div className="mt-8">
        <ProductForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Update product"
        />
      </div>
    </div>
  );
}
