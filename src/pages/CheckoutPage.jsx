import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from '../redux/slices/cartSlice';
import { submitOrder, resetOrderStatus } from '../redux/slices/ordersSlice';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { ErrorMessage, EmptyState } from '../components/common/Feedback';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useUI } from '../context/UIContext';

const initialForm = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postcode: '',
  country: '',
};

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Enter a valid email.';
  if (!form.address.trim()) errors.address = 'Address is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.postcode.trim()) errors.postcode = 'Postcode is required.';
  if (!form.country.trim()) errors.country = 'Country is required.';
  return errors;
}

export function CheckoutPage() {
  useDocumentTitle('Checkout');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useUI();
  const { user } = useAuth();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const { status, error, lastOrder } = useSelector((state) => state.orders);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    dispatch(resetOrderStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && lastOrder) {
      dispatch(clearCart());
      showToast('Order placed successfully', { type: 'success' });
      navigate(`/orders/${lastOrder.id}`, { replace: true });
    }
  }, [status, lastOrder, dispatch, navigate, showToast]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    setTouched({
      fullName: true,
      email: true,
      address: true,
      city: true,
      postcode: true,
      country: true,
    });
    if (Object.keys(validation).length > 0) return;
    dispatch(submitOrder({ userId: user.id, customer: form, items, total }));
  };

  if (items.length === 0 && status !== 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="Nothing to check out"
          message="Add something to your cart first."
          action={
            <Link to="/">
              <Button $variant="primary">Browse the shop</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const fc = (name) =>
    `w-full border bg-transparent px-4 py-3 text-sm focus:outline-none ${touched[name] && errors[name] ? 'border-clay' : 'border-line focus:border-ink'}`;

  const fields = [
    { name: 'fullName', label: 'Full name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'address', label: 'Address', type: 'text' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl sm:text-4xl">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          noValidate
        >
          <p className="eyebrow">Shipping details</p>
          {fields.map(({ name, label, type }) => (
            <div key={name}>
              <label htmlFor={name} className="mb-1 block text-xs text-ink/60">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={fc(name)}
              />
              {touched[name] && errors[name] && (
                <p className="mt-1 text-xs text-clay">{errors[name]}</p>
              )}
            </div>
          ))}
          <div className="grid gap-5 sm:grid-cols-3">
            {['city', 'postcode', 'country'].map((name) => (
              <div key={name}>
                <label
                  htmlFor={name}
                  className="mb-1 block text-xs text-ink/60 capitalize"
                >
                  {name}
                </label>
                <input
                  id={name}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={fc(name)}
                />
                {touched[name] && errors[name] && (
                  <p className="mt-1 text-xs text-clay">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>
          {status === 'failed' && <ErrorMessage message={error} />}
          <Button
            type="submit"
            $variant="primary"
            $size="lg"
            disabled={status === 'loading'}
          >
            {status === 'loading'
              ? 'Placing order…'
              : `Place order — $${total.toFixed(2)}`}
          </Button>
        </form>
        <div className="border border-line p-6">
          <p className="eyebrow mb-4">Order ({items.length})</p>
          <ul className="space-y-3 text-sm">
            {items.map((item) => (
              <li
                key={`${item.id}-${item.size}`}
                className="flex justify-between gap-2"
              >
                <span className="text-ink/70">
                  {item.name} · {item.size} × {item.quantity}
                </span>
                <span className="font-mono">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-lg">
            <span>Total</span>
            <span className="font-mono">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
