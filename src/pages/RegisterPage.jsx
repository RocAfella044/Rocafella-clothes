import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signUp } from '../supabase/auth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Button } from '../components/common/Button';

function validate({ fullName, email, password, confirm }) {
  const errors = {};
  if (!fullName.trim()) errors.fullName = 'Full name is required.';
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter a valid email.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6)
    errors.password = 'Password must be at least 6 characters.';
  if (password !== confirm) errors.confirm = 'Passwords do not match.';
  return errors;
}

export function RegisterPage() {
  useDocumentTitle('Create account');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    try {
      await signUp({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
      });
      setSuccess(true);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <p className="eyebrow mb-2 text-moss">Account created</p>
        <h1 className="font-display text-3xl">Check your email</h1>
        <p className="mt-4 text-sm text-ink/60">
          We sent a confirmation link to <strong>{form.email}</strong>. Click it
          to activate your account, then sign in.
        </p>
        <Link to="/login" className="mt-6 inline-block">
          <Button $variant="primary">Go to sign in</Button>
        </Link>
      </div>
    );
  }

  const fc = (name) =>
    `w-full border bg-transparent px-4 py-3 text-sm focus:outline-none ${errors[name] ? 'border-clay' : 'border-line focus:border-ink'}`;

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      <div className="mb-8 text-center">
        <p className="eyebrow mb-2">Join Rocafella now!</p>
        <h1 className="font-display text-3xl">Create account</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {[
          { name: 'fullName', label: 'Full name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' },
          { name: 'confirm', label: 'Confirm password', type: 'password' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label htmlFor={name} className="mb-1 block text-xs text-ink/60">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              className={fc(name)}
            />
            {errors[name] && (
              <p className="mt-1 text-xs text-clay">{errors[name]}</p>
            )}
          </div>
        ))}
        {serverError && (
          <p className="rounded-sm bg-clay/10 px-4 py-3 text-sm text-clay">
            {serverError}
          </p>
        )}
        <Button
          type="submit"
          $variant="primary"
          $size="lg"
          disabled={loading}
          className="mt-2 w-full"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{' '}
        <Link to="/login" className="text-ink underline hover:text-moss">
          Sign in
        </Link>
      </p>
    </div>
  );
}
