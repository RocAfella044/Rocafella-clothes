import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartCount } from '../../redux/slices/cartSlice'
import { selectFavoriteIds } from '../../redux/slices/favoritesSlice'
import { useUI } from '../../context/UIContext'

const navLinkClass = ({ isActive }) =>
  `eyebrow transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-ink/50'}`

export function Header() {
  const cartCount = useSelector(selectCartCount)
  const favoriteCount = useSelector(selectFavoriteIds).length
  const { mobileNavOpen, toggleMobileNav, closeMobileNav } = useUI()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight" onClick={closeMobileNav}>
          Rocafella
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Shop
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Saved {favoriteCount > 0 && `(${favoriteCount})`}
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 border border-ink px-3 py-2 font-mono text-xs uppercase tracking-widest2 hover:bg-ink hover:text-canvas transition-colors"
            aria-label={`Cart, ${cartCount} items`}
          >
            Cart
            {cartCount > 0 && (
              <span className="rounded-full bg-clay px-1.5 text-[10px] text-canvas leading-5">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="md:hidden border border-ink px-3 py-2 font-mono text-xs uppercase tracking-widest2"
            onClick={toggleMobileNav}
            aria-expanded={mobileNavOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden">
          <NavLink to="/" className={navLinkClass} end onClick={closeMobileNav}>
            <div className="py-2">Shop</div>
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass} onClick={closeMobileNav}>
            <div className="py-2">Saved {favoriteCount > 0 && `(${favoriteCount})`}</div>
          </NavLink>
          <NavLink to="/orders" className={navLinkClass} onClick={closeMobileNav}>
            <div className="py-2">Orders</div>
          </NavLink>
        </nav>
      )}
    </header>
  )
}
