import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useAuth } from '../context/AuthContext';
import { listUsers, deleteUser } from '../supabase/admin';
import { Button } from '../components/common/Button';
import { Spinner, ErrorMessage, EmptyState } from '../components/common/Feedback';

export function AdminUsersPage() {
  useDocumentTitle('Admin users');
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      setStatus('loading');
      setError(null);
      try {
        const data = await listUsers();
        setUsers(data);
        setStatus('succeeded');
      } catch (err) {
        setError(err?.message || 'Failed to load users');
        setStatus('failed');
      }
    }
    loadUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setStatus('loading');
    setError(null);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setStatus('succeeded');
    } catch (err) {
      setError(err?.message || 'Failed to delete user');
      setStatus('failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="eyebrow">Admin</p>
        <h1 className="font-display text-4xl sm:text-5xl">Manage users</h1>
      </div>

      {status === 'loading' && <Spinner label="Loading users" />}
      {status === 'failed' && <ErrorMessage message={error} />}

      {status === 'succeeded' && users.length === 0 && (
        <EmptyState
          title="No users"
          message="There are no registered users yet now ."
        />
      )}

      {status === 'succeeded' && users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => {
            const isCurrentAdmin = authUser?.id === user.id;
            const isAdminUser = user.role === 'admin';

            return (
              <div
                key={user.id}
                className="rounded-xl border border-line bg-sand p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-sm">
                      {user.full_name || 'Unnamed user'}
                    </p>
                    <p className="mt-1 text-xs text-ink/50">{user.email}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm text-ink/60">
                      <span
                        className={`inline-block rounded-md border px-3 py-1.5 text-sm font-medium capitalize ${
                          isAdminUser
                            ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                            : 'border-line bg-transparent text-ink/80'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    {!isAdminUser && (
                      <Button
                        $variant="danger"
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isCurrentAdmin}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
