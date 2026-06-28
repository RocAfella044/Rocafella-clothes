import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../redux/slices/cartSlice';
import { CartLineItem } from '../components/cart/CartLineItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/common/Feedback';
import { Button } from '../components/common/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function groupByProduct(items) {
  const map = new Map();
  items.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, {
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        category: item.category,
        sizes: [],
      });
    }
    map.get(item.id).sizes.push({
      id: item.id,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    });
  });
  return Array.from(map.values());
}

export function CartPage() {
  useDocumentTitle('Cart');
  const items = useSelector(selectCartItems);
  const grouped = groupByProduct(items);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow mb-1">안녕하세요</p>
          <h1 className="font-display text-3xl sm:text-4xl">Your Cart</h1>
        </div>
        {items.length > 0 && (
          <p className="font-mono text-sm text-ink/50 mb-1">
            {items.reduce((s, i) => s + i.quantity, 0)} item
            {items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="Your cart is empty"
            message="Pieces you add will appear here, ready when you are."
            action={
              <Link to="/">
                <Button $variant="primary">Continue shopping</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            {grouped.map((product) => (
              <CartLineItem
                key={product.id}
                item={product}
                allSizes={product.sizes}
              />
            ))}

            <div className="mt-6 flex flex-wrap justify-center items-center gap-4 border-t border-line pt-6">
              <Link to="/">
                <Button $variant="primary">Continue shopping</Button>
              </Link>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
