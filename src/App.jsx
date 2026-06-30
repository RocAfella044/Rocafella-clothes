import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/checkout"element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}/>
        <Route path="/favorites"element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>}/>
        <Route path="/orders"element={  <ProtectedRoute> <OrdersPage /> </ProtectedRoute>} />
        <Route  path="/orders/:id"element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>}/>
        <Route path="/profile"element={<ProtectedRoute><ProfilePage /></ProtectedRoute> }/>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
