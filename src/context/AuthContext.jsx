import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { getProfile } from '../supabase/auth';
import { store } from '../redux/store';
import { loadFavorites, clearFavorites } from '../redux/slices/favoritesSlice';
import { loadOrders, clearOrders } from '../redux/slices/ordersSlice';
import { initCart, resetCart } from '../redux/slices/cartSlice';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    try {
      const profileData = await getProfile(authUser.id);
      setProfile(profileData);
    } catch {
      setProfile(null);
    }
  }, []);

  const loadUserData = useCallback((authUser) => {
    if (authUser) {
      store.dispatch(initCart(authUser.id));
      store.dispatch(loadFavorites(authUser.id));
      store.dispatch(loadOrders(authUser.id));
    }
  }, []);

  const clearUserData = useCallback(() => {
    store.dispatch(resetCart());
    store.dispatch(clearFavorites());
    store.dispatch(clearOrders());
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      loadProfile(authUser).finally(() => setLoading(false));
      loadUserData(authUser);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      await loadProfile(authUser);
      setLoading(false);

      if (event === 'SIGNED_IN') loadUserData(authUser);
      if (event === 'SIGNED_OUT') clearUserData();
    });

    return () => subscription.unsubscribe();
  }, [loadProfile, loadUserData, clearUserData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: user!== null, 
        isAdmin: profile?.role === 'admin',
        refreshProfile: () => loadProfile(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
