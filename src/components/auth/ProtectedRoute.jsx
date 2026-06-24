import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../common/Feedback';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Restoring session" />
      </div>
    );
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking permissions" />
      </div>
    );
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}
