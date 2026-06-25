import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartTotal, selectCartCount } from '../../redux/slices/cartSlice';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

const SHIPPING_THRESHOLD = 150;

export function CartSummary({ checkoutTo = '/checkout' }) {
  const subtotal = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);
  const { isAuthenticated } = useAuth();
  const total = subtotal ;

  return (
    <div className="border border-line p-6">
      <p className="eyebrow mb-4">Order Summary</p>
      <dl className="space-y-2 text-sm">
        
      </dl>
      <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-lg">
        <span>Total</span>
        <span className="font-mono">NPR {total.toFixed(2)}</span>
      </div>

      {count === 0 ? (
        <Button $variant="primary" $size="lg" disabled className="mt-6 w-full">
          Checkout
        </Button>
      ) : !isAuthenticated ? (
        <Link to="/login" className="mt-6 block">
          <Button $variant="primary" $size="lg" className="w-full">
            Sign in to checkout
          </Button>
        </Link>
      ) : (
        <Link to={checkoutTo} className="mt-6 block">
          <Button $variant="primary" $size="lg" className="w-full">
            Checkout
          </Button>
        </Link>
      )}
    </div>
  );
}
