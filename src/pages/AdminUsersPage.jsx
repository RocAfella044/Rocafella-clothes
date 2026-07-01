import { useEffect, useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { listUsers, updateUserRole } from '../supabase/admin';
import { Button } from '../components/common/Button';
import {
  Spinner,
  ErrorMessage,
  EmptyState,
} from '../components/common/Feedback';

export function AdminUsersPage() {
  useDocumentTitle('Admin users');
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

  const handleRoleChange = async (userId, role) => {
    setStatus('loading');
    setError(null);
    try {
      const updated = await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updated : user)),
      );
      setStatus('succeeded');
    } catch (err) {
      setError(err?.message || 'Failed to update role');
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
          message="There are no registered users yet."
        />
      )}

      {status === 'succeeded' && users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
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
                  <span className="font-mono text-xs uppercase tracking-widest2 text-ink/60">
                    Role
                  </span>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="rounded border border-line bg-transparent px-3 py-2 text-sm focus:border-ink focus:outline-none"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
