import { useEffect, useState } from 'react';
import { listUsers } from '../../supabase/auth';
import {
  Spinner,
  ErrorMessage,
  EmptyState,
} from '../../components/common/Feedback';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function AdminUsersPage() {
  useDocumentTitle('Users');
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    listUsers()
      .then((data) => {
        setUsers(data);
        setStatus('succeeded');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('failed');
      });
  }, []);

  if (status === 'loading') return <Spinner label="Loading users" />;
  if (status === 'failed') return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="eyebrow mb-1">Admin</p>
      <h1 className="font-display text-3xl">Users ({users.length})</h1>
      {users.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                {['Name', 'Email', 'Role', 'Joined'].map((h) => (
                  <th key={h} className="eyebrow pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 pr-4 font-display">
                    {user.full_name || '—'}
                  </td>
                  <td className="py-3 pr-4 text-ink/60">{user.email}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`font-mono text-xs uppercase tracking-widest2 ${user.role === 'admin' ? 'text-clay' : 'text-moss'}`}
                    >
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="py-3 text-ink/50">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
