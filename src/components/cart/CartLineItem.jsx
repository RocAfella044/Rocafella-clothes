import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { QuantityInput } from '../product/ProductFormControls';

export function CartLineItem({ item, allSizes }) {
  const dispatch = useDispatch();

  
  const productTotal = allSizes.reduce(
    (sum, s) => sum + s.price * s.quantity,
    0,
  );

  return (
    <div className="border-b border-line py-6">
      <div className="flex gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="h-28 w-24 flex-none bg-sand object-cover"
        />
        <div className="flex flex-1 flex-col gap-3">
       
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-base">{item.name}</p>
              <p className="mt-0.5 font-mono text-xs text-ink/50">
                NPR {item.price.toFixed(2)} each
              </p>
            </div>
            <p className="font-mono text-sm whitespace-nowrap">
              TOTAL NPR {productTotal.toFixed(2)}
            </p>
          </div>

         
          <div className="flex flex-col gap-2">
            {allSizes.map((sizeItem) => (
              <div
                key={sizeItem.size}
                className="flex items-center justify-between gap-4 border-t border-line/50 pt-3"
              >
                <div className="flex items-center gap-3">
                  <span className="border border-line px-2 py-1 font-mono text-xs min-w-[2.5rem] text-center">
                    {sizeItem.size}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <QuantityInput
                    value={sizeItem.quantity}
                    onChange={(q) =>
                      dispatch(
                        updateQuantity({
                          id: sizeItem.id,
                          size: sizeItem.size,
                          quantity: q,
                        }),
                      )
                    }
                  />
                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          id: sizeItem.id,
                          size: sizeItem.size,
                        }),
                      )
                    }
                    className="font-mono text-xs uppercase tracking-widest2 text-clay hover:underline whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
