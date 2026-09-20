import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../../api/userService';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setBusyId(targetUser._id);
    setError('');
    try {
      await updateUserRole(targetUser._id, newRole);
      setUsers(users.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading users...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u._id === currentUser._id;
              const isBusy = busyId === u._id;

              return (
                <tr key={u._id} className="border-t border-gray-100">
                  <td className="p-3 font-medium">
                    {u.name} {isSelf && <span className="text-gray-400 text-xs">(you)</span>}
                  </td>
                  <td className="p-3 text-gray-500">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                        u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRoleToggle(u)}
                        disabled={isBusy || isSelf}
                        className="text-blue-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        disabled={isBusy || isSelf}
                        className="text-red-500 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;