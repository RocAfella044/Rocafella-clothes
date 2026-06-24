import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { selectCartCount } from '../../redux/slices/cartSlice';
import { selectFavoriteIds } from '../../redux/slices/favoritesSlice';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../supabase/auth';

const navLinkClass = ({ isActive }) =>
  `eyebrow transition-colors hover:text-ink ${
    isActive ? 'text-ink' : 'text-ink/50'
  }`;

export function Header() {
  const cartCount = useSelector(selectCartCount);
  const favoriteIds = useSelector(selectFavoriteIds);

  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useUI();
  const { isAuthenticated, isAdmin, user, profile } = useAuth();

  const navigate = useNavigate();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const favoriteCount = isAuthenticated ? favoriteIds.length : 0;

  const initials = (() => {
    const name = profile?.full_name || user?.user_metadata?.full_name || '';
    return (
      name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'U'
    );
  })();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProfileMenuOpen(false);
    closeMobileNav();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-semibold tracking-tight"
          onClick={closeMobileNav}
        >
          Rocafella
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Shop
          </NavLink>

          <NavLink to="/favorites" className={navLinkClass}>
            Favorites{' '}
            {favoriteCount > 0 && (
              <span className="ml-1 text-moss">({favoriteCount})</span>
            )}
          </NavLink>

          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/cart"
            className="flex items-center gap-2 border border-ink px-3 py-2 font-mono text-xs uppercase tracking-widest2 hover:bg-ink hover:text-canvas transition-colors"
            aria-label={`Cart, ${cartCount} items`}
          >
            Cart
            {cartCount > 0 && (
              <span className="rounded-full bg-clay px-1.5 text-[10px] text-canvas leading-5">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-canvas font-mono text-sm font-semibold hover:bg-moss transition-colors"
                title="Account"
              >
                {initials}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-md border border-line bg-canvas shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="block px-4 py-3 text-sm hover:bg-sand transition-colors"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-3 text-left text-sm text-clay hover:bg-sand transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="eyebrow border border-ink px-4 py-2 hover:bg-ink hover:text-canvas transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/cart"
            className="flex items-center gap-1.5 border border-ink px-3 py-2 font-mono text-xs uppercase tracking-widest2 hover:bg-ink hover:text-canvas transition-colors"
          >
            Cart
            {cartCount > 0 && (
              <span className="rounded-full bg-clay px-1.5 text-[10px] text-canvas leading-5">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="border border-ink px-3 py-2 font-mono text-xs uppercase tracking-widest2"
            onClick={toggleMobileNav}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileNavOpen && (
        <nav className="flex flex-col border-t border-line px-4 py-3 md:hidden">
          {isAuthenticated && (
            <div className="mb-2 flex items-center gap-3 border-b border-line bg-sand/50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-canvas font-mono text-sm font-semibold">
                {initials}
              </div>

              <div>
                <p className="font-display text-sm">
                  {profile?.full_name ||
                    user?.user_metadata?.full_name ||
                    'My Account'}
                </p>

                <p className="text-xs text-ink/50">{user?.email}</p>
              </div>
            </div>
          )}

          <NavLink to="/" className={navLinkClass} end onClick={closeMobileNav}>
            <div className="py-2">Shop</div>
          </NavLink>

          <NavLink
            to="/favorites"
            className={navLinkClass}
            onClick={closeMobileNav}
          >
            <div className="py-2">
              Saved {favoriteCount > 0 && `(${favoriteCount})`}
            </div>
          </NavLink>

          <NavLink
            to="/orders"
            className={navLinkClass}
            onClick={closeMobileNav}
          >
            <div className="py-2">Orders</div>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={navLinkClass}
              onClick={closeMobileNav}
            >
              <div className="py-2">Admin</div>
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className={navLinkClass}
                onClick={closeMobileNav}
              >
                <div className="py-2">Profile</div>
              </NavLink>

              <button
                onClick={handleSignOut}
                className="py-2 text-left text-clay hover:text-clay/70 eyebrow"
              >
                Sign Out
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={navLinkClass}
              onClick={closeMobileNav}
            >
              <div className="py-2">Sign In</div>
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
