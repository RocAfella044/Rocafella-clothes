import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { QuantityInput } from '../product/ProductFormControls';

export function CartLineItem({ item }) {
  const dispatch = useDispatch();
  return (
    <div className="flex gap-4 border-b border-line py-6">
      <img
        src={item.image}
        alt={item.name}
        className="h-28 w-24 flex-none bg-sand object-cover"
      />
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-base">{item.name}</p>
            <p className="mt-1 font-mono text-xs text-ink/50">
              Size {item.size}
            </p>
          </div>
          <p className="font-mono text-sm">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <QuantityInput
            value={item.quantity}
            onChange={(q) =>
              dispatch(
                updateQuantity({ id: item.id, size: item.size, quantity: q }),
              )
            }
          />
          <button
            onClick={() =>
              dispatch(removeFromCart({ id: item.id, size: item.size }))
            }
            className="font-mono text-xs uppercase tracking-widest2 text-clay hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
