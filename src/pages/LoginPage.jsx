import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signIn } from '../supabase/auth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/common/Button';

export function LoginPage() {
  useDocumentTitle('Sign in');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await signIn({ email: form.email, password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="mb-8 text-center">
        <p className="eyebrow mb-2">Welcome</p>
        <h1 className="font-display text-3xl">Sign in</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs text-ink/60">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs text-ink/60">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </div>
        {error && (
          <p className="rounded-sm bg-clay/10 px-4 py-3 text-sm text-clay">
            {error}
          </p>
        )}
        <Button
          type="submit"
          $variant="primary"
          $size="lg"
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Don&rsquo;t have an account?{' '}
        <Link to="/register" className="text-ink underline hover:text-moss">
          Create one
        </Link>
      </p>
    </div>
  );
}
