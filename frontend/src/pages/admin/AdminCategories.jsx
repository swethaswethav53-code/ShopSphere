import { useState, useEffect } from 'react';
import { getCategories } from '../../api/categoryService';
import { createCategory, updateCategory, deleteCategory } from '../../api/adminCategoryService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name, description: category.description || '' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex gap-3 items-end mb-6 max-w-2xl">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto max-w-2xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t border-gray-100">
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3 text-gray-500">{cat.description || '—'}</td>
                  <td className="p-3">
                    <div className="flex gap-3">
                      <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="text-gray-500 text-center py-10">No categories yet.</p>
      )}
    </div>
  );
};

export default AdminCategories;