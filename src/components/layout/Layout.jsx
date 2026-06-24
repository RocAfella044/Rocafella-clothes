import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from '../common/Toaster';

export function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
