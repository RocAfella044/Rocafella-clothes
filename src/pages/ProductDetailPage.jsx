import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProduct } from '../hooks/useFetchProduct';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Spinner, ErrorMessage } from '../components/common/Feedback';
import { RatingStars } from '../components/product/RatingStars';
import {
  SizeSelector,
  QuantityInput,
} from '../components/product/ProductFormControls';
import { Button } from '../components/common/Button';
import { addToCart, selectCartItems } from '../redux/slices/cartSlice';
import {
  toggleFavoriteAsync,
  selectIsFavorite,
} from '../redux/slices/favoritesSlice';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

export function ProductDetailPage() {
  const { id } = useParams();
  const { product, status, error } = useFetchProduct(id);
  const dispatch = useDispatch();
  const { showToast } = useUI();
  const { user, isAuthenticated } = useAuth();
  const isFavorite = useSelector(selectIsFavorite(id));
  const cartItems = useSelector(selectCartItems);

  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState('');

  useDocumentTitle(product?.name);

  useEffect(() => {
    if (product) {
      const existingItem = cartItems.find((item) => item.id === product.id);
      if (existingItem) {
        setSize(existingItem.size);
        setQuantity(existingItem.quantity);
      }
    }
  }, [product]);

  if (status === 'loading') return <Spinner label="Loading product" />;
  if (status === 'failed')
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorMessage message={error} />
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-widest2 underline"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  if (!product) return null;

  const alreadyInCart = size
    ? cartItems.some((item) => item.id === product.id && item.size === size)
    : false;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Sign in to add items to your cart', { type: 'info' });
      return;
    }
    if (!size) {
      setSizeError('Please select a size.');
      return;
    }
    setSizeError('');
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity,
      }),
    );
    showToast(`Added ${product.name} (${size}) to cart`, { type: 'success' });
  };
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      showToast('Sign in to save items', { type: 'info' });
      return;
    }
    dispatch(
      toggleFavoriteAsync({
        userId: user.id,
        productId: product.id,
        isFavorite,
      }),
    );
    showToast(isFavorite ? 'Removed from saved items' : 'Saved for later', {
      type: 'success',
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="font-mono text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink"
      >
        ← Back to shop
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden bg-sand">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3">
            <RatingStars rating={product.rating} />
          </div>
          <p className="mt-4 font-mono text-xl">NPR {product.price}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">
            {product.description}
          </p>
          <p className="mt-4 font-mono text-xs text-ink/50">
            Color: {product.color}
          </p>
          <form onSubmit={handleAddToCart} className="mt-8 flex flex-col gap-6">
            <SizeSelector
              sizes={product.sizes || []}
              value={size}
              onChange={(s) => {
                setSize(s);
                setSizeError('');
              }}
              error={sizeError}
            />
            {!alreadyInCart && (
              <QuantityInput value={quantity} onChange={setQuantity} />
            )}
            <div className="flex flex-wrap gap-3">
              {alreadyInCart ? (
  <div className="flex flex-wrap items-center gap-3">
    <div className="flex items-center gap-2 border border-moss px-4 py-2.5">
      <span className="text-moss">✓</span>
      <span className="font-mono text-xs uppercase tracking-widest2 text-moss">Already in cart</span>
    </div>
    <Link to="/cart">
      <Button type="button" $variant="secondary" $size="lg">Go to cart</Button>
    </Link>
  </div>
) : (
  <Button type="submit" $variant="primary" $size="lg">
    {isAuthenticated ? 'Add to cart' : 'Add item to cart'}
  </Button>
)}
              <Button
                type="button"
                $variant="secondary"
                $size="lg"
                onClick={handleToggleFavorite}
              >
                {isFavorite ? '♥ Saved' : '♡ Save'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
