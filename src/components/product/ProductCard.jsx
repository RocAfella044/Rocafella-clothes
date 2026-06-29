import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAsync,selectIsFavorite } from '../../redux/slices/favoritesSlice';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

export function ProductCard({ product }) {
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(product.id));
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useUI();

  const handleToggleFavorite = (e) => {
    e.preventDefault();
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
    showToast(
      isFavorite
        ? `Removed ${product.name} from saved`
        : `Saved ${product.name}`,
      { type: 'success' },
    );
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.is_new && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-widest2 text-canvas">
            New
          </span>
        )}
        <button
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'Remove from saved' : 'Save for later'}
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/90 text-base transition-transform hover:scale-110"
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-base leading-tight">{product.name}</p>
          <p className="mt-0.5 text-xs text-ink/50">
            {product.category} · {product.color}
          </p>
        </div>
        <p className="font-mono text-sm">NPR {product.price}</p>
      </div>
    </Link>
  );
}
