import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute, AdminRoute } from './components/auth/ProtectedRoute';

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

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminNewProductPage } from './pages/admin/AdminNewProductPage';
import { AdminEditProductPage } from './pages/admin/AdminEditProductPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <AdminRoute>
              <AdminNewProductPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <AdminRoute>
              <AdminEditProductPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
