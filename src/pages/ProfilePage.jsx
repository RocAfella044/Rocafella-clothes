import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../supabase/auth';
import { selectOrderHistory } from '../redux/slices/ordersSlice';
import { selectFavoriteIds } from '../redux/slices/favoritesSlice';
import { selectCartCount } from '../redux/slices/cartSlice';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function ProfilePage() {
  useDocumentTitle('My Profile');
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const orders = useSelector(selectOrderHistory);
  const favoriteIds = useSelector(selectFavoriteIds);
  const cartCount = useSelector(selectCartCount);

  const fullName =
    profile?.full_name || user?.user_metadata?.full_name || 'User';

  const initials =
    fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    { label: 'Orders placed', value: orders.length, to: '/orders' },
    { label: 'Saved items', value: favoriteIds.length, to: '/favorites' },
    { label: 'Items in cart', value: cartCount, to: '/cart' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      
      <div className="flex flex-col items-center gap-4 rounded-none border border-line bg-sand/40 px-6 py-10 text-center sm:flex-row sm:text-left sm:gap-8 sm:px-10">
        
        <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-ink text-canvas font-display text-2xl font-semibold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl truncate">
            {fullName}
          </h1>
          <p className="mt-1 text-sm text-ink/50">{user?.email}</p>
          <span
            className={`mt-2 inline-block font-mono text-[10px] uppercase tracking-widest2 px-2 py-1 ${
              profile?.role === 'admin'
                ? 'bg-clay/10 text-clay'
                : 'bg-moss/10 text-moss'
            }`}
          >
            {profile?.role || 'user'}
          </span>
        </div>
      </div>

      
      <div className="mt-4 grid grid-cols-3 divide-x divide-line border border-line">
        {stats.map(({ label, value, to }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center gap-1 py-5 hover:bg-sand transition-colors"
          >
            <span className="font-display text-3xl">{value}</span>
            <span className="eyebrow text-center">{label}</span>
          </Link>
        ))}
      </div>

      
      <div className="mt-8">
        <div className="max-w-md border border-line p-6">
          <p className="eyebrow mb-4">Account info</p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Member since</dt>
              <dd className="font-mono text-xs">
                {new Date(user?.created_at).toLocaleDateString()}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Account role</dt>
              <dd
                className={`font-mono text-xs uppercase ${profile?.role === 'admin' ? 'text-clay' : 'text-moss'}`}
              >
                {profile?.role || 'user'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Email verified</dt>
              <dd className="font-mono text-xs text-moss">✓ Verified</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
