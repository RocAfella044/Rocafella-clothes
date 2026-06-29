

A Frontend e-commerce frontend built with React, Vite, Redux Toolkit, and Supabase. Features a complete shopping experience with authentication, admin dashboard, cart management, favorites, and order history.

## Tech Stack

| Layer            | Technology |

| Framework        |React 18 + Vite |
| Routing          | React Router v6 |
| Global State     | Redux Toolkit |
| Styling          | Tailwind CSS + Styled Components |
| Backend          | Supabase (Auth, Database, Storage) |
| HTTP Client      | Axios |
| Language         | JavaScript (JSX) |


## Features

### Storefront
- Product listing with search, category filter, and sort
- Product detail page with size and quantity selection
- Add to cart with size tracking
- Same product with different sizes grouped in one cart card
- Favorite / save products (per user, synced to Supabase)

### Authentication
- Register with full name, email, password
- Auto login after registration (no email confirmation needed)
- Login with session persistence (stays logged in on refresh)
- Logout clears all user data from Redux state
- Protected routes redirect to login

### Cart & Orders
- Cart persists to localStorage
- Checkout with shipping form and validation
- Order history saved to Supabase per user
- Order detail / confirmation page

### Access Control
- Public — Shop, Product detail, Cart, Login, Register
- Protected (logged in) — Checkout, Favorites, Orders, Profile
- Admin only — Dashboard, Manage products, Users
