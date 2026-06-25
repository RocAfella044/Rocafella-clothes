# Rocafella — Clothing E-Commerce Frontend

A React + Vite frontend for a clothing store, built to demonstrate a full
set of modern React patterns end to end.

## Setup

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
```

## Where each requirement lives

- **React Router** — `src/App.jsx` (routes), `src/components/layout/Layout.jsx`
  (shared layout via `<Outlet />`), `NavLink` in `Header.jsx`.
- **Forms handling / controlled components** — `CheckoutPage.jsx` (full
  validated shipping form), `ProductFormControls.jsx` (size + quantity),
  `PriceRangeFilter.jsx`, `SearchBar.jsx`.
- **Context API** — `src/context/UIContext.jsx` provides toast notifications
  and mobile nav state, separate from Redux's data layer.
- **Component lifecycle** — `useFetchProduct.js` (fetch + cleanup on
  unmount/id change), `useDocumentTitle.js` (mount/unmount effect).
- **Custom hooks** — `useDebounce`, `useDocumentTitle`, `useFetchProduct`
  in `src/hooks/`.
- **API integration with Axios** — `src/services/api.js` wraps an axios
  instance around a mock catalogue (`mockData.js`) with simulated latency
  and failures, so loading/error states are real.
- **Tailwind CSS** — `tailwind.config.js`, `src/index.css`, used throughout.
- **Styled Components** — `src/components/common/Button.jsx` (variants via
  `styled-components` + `css` helper).
- **Redux Toolkit / global state** — `src/redux/store.js` and
  `src/redux/slices/`: `productsSlice` (catalogue + filters, async thunk),
  `cartSlice` (cart, persisted to localStorage), `favoritesSlice`
  (watchlist), `ordersSlice` (order placement + history, async thunk).
- **Reusable UI components** — `src/components/common/` (Button, Spinner,
  ErrorMessage, EmptyState, Toaster), `src/components/product/` (ProductCard,
  ProductGrid, RatingStars, form controls).
- **Loading/error handling** — `Spinner`, `ErrorMessage`, `EmptyState` used
  on `HomePage`, `ProductDetailPage`, `CheckoutPage`.
- **Responsive layouts** — `Layout.jsx`, `Header.jsx` (mobile nav), grid
  layouts throughout (`ProductGrid`, checkout, cart).
- **Product listing + filters/search** — `HomePage.jsx` with
  `SearchBar`, `CategoryFilter`, `PriceRangeFilter`, `SortSelect`, all
  driving `fetchProducts` via Redux.
- **Cart functionality** — `cartSlice.js`, `CartPage.jsx`,
  `CartLineItem.jsx`, `CartSummary.jsx`.
- **Order management** — `ordersSlice.js`, `CheckoutPage.jsx`,
  `OrdersPage.jsx`, `OrderDetailPage.jsx`.
- **Favorites/watchlist** — `favoritesSlice.js`, `FavoritesPage.jsx`, heart
  toggle on `ProductCard` and `ProductDetailPage`.

## Notes

- The "API" is mocked in `src/services/api.js` with artificial delay and an
  8% failure rate on order placement, so you can see loading spinners and
  error messages in action. Swap this file for real `axios` calls against a
  backend without touching any components.
- Cart, favorites, and order history persist to `localStorage`.
