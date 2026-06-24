import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../supabase/products';
import { ProductForm } from '../../components/admin/ProductForm';
import { useUI } from '../../context/UIContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function AdminNewProductPage() {
  useDocumentTitle('Add Product');
  const navigate = useNavigate();
  const { showToast } = useUI();

  const handleSubmit = async (values) => {
    await createProduct(values);
    showToast('Product created successfully', { type: 'success' });
    navigate('/admin/products');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/admin/products"
        className="font-mono text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink"
      >
        ← Back to products
      </Link>
      <h1 className="mt-4 font-display text-3xl">Add Product</h1>
      <div className="mt-8">
        <ProductForm onSubmit={handleSubmit} submitLabel="Create product" />
      </div>
    </div>
  );
}
