import { useState } from 'react';
import { uploadProductImage } from '../../supabase/products';
import { Button } from '../common/Button';

const CATEGORIES = [
  'Outerwear',
  'Knitwear',
  'Tops',
  'Bottoms',
  'Dresses',
  'Accessories',
];

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  color: '',
  stock: '',
  sizes: '',
  image: '',
  is_new: false,
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
    errors.price = 'Enter a valid price.';
  if (!form.category) errors.category = 'Category is required.';
  if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
    errors.stock = 'Enter a valid stock number.';
  return errors;
}

export function ProductForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Save product',
}) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5MB.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const url = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setSaving(true);
    setServerError('');
    try {
      const sizesArray = form.sizes
        ? form.sizes
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        color: form.color.trim(),
        stock: Number(form.stock),
        sizes: sizesArray,
        image: form.image,
        is_new: form.is_new,
      });
    } catch (err) {
      setServerError(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const fc = (name) =>
    `w-full border bg-transparent px-4 py-3 text-sm focus:outline-none ${errors[name] ? 'border-clay' : 'border-line focus:border-ink'}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-xs text-ink/60">
          Product name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={fc('name')}
        />
        {errors.name && <p className="mt-1 text-xs text-clay">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-xs text-ink/60">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className={`${fc('description')} resize-none`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-clay">{errors.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-1 block text-xs text-ink/60">
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className={fc('price')}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-clay">{errors.price}</p>
          )}
        </div>
        <div>
          <label htmlFor="stock" className="mb-1 block text-xs text-ink/60">
            Stock quantity
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            className={fc('stock')}
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-clay">{errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-xs text-ink/60">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className={fc('category')}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-clay">{errors.category}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="color" className="mb-1 block text-xs text-ink/60">
            Color
          </label>
          <input
            id="color"
            name="color"
            value={form.color}
            onChange={handleChange}
            className={fc('color')}
          />
        </div>
        <div>
          <label htmlFor="sizes" className="mb-1 block text-xs text-ink/60">
            Sizes (comma-separated)
          </label>
          <input
            id="sizes"
            name="sizes"
            value={form.sizes}
            placeholder="S, M, L, XL"
            onChange={handleChange}
            className={fc('sizes')}
          />
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs text-ink/60">Product image</p>
        <div className="flex flex-col gap-3">
          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="h-40 w-32 object-cover bg-sand"
            />
          )}
          <label className="cursor-pointer border border-dashed border-line px-4 py-6 text-center hover:border-ink transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="sr-only"
            />
            <p className="font-mono text-xs uppercase tracking-widest2 text-ink/60">
              {uploading ? 'Uploading…' : 'Click to upload image'}
            </p>
            <p className="mt-1 text-xs text-ink/40">PNG, JPG, WEBP up to 5MB</p>
          </label>
          <div>
            <label htmlFor="image" className="mb-1 block text-xs text-ink/60">
              Or paste image URL
            </label>
            <input
              id="image"
              name="image"
              value={form.image}
              onChange={handleChange}
              className={fc('image')}
            />
          </div>
          {uploadError && <p className="text-xs text-clay">{uploadError}</p>}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="is_new"
          checked={form.is_new}
          onChange={handleChange}
          className="h-4 w-4 accent-ink"
        />
        <span className="text-sm">Mark as &ldquo;New&rdquo;</span>
      </label>

      {serverError && (
        <p className="rounded-sm bg-clay/10 px-4 py-3 text-sm text-clay">
          {serverError}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          $variant="primary"
          $size="lg"
          disabled={saving || uploading}
        >
          {saving ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
