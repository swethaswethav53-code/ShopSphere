import { useState, useEffect } from 'react';
import { getCategories } from '../api/categoryService';

const ProductForm = ({ initialData, onSubmit, submitLabel = 'Save Product' }) => {
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    tags: '',
    images: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  // Pre-fill form when editing an existing product
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price ?? '',
        category: initialData.category?._id || '',
        stock: initialData.stock ?? '',
        tags: (initialData.tags || []).join(', '),
        images: (initialData.images || []).join(', '),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Convert comma-separated strings back into arrays, and numbers to actual numbers
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: form.images.split(',').map((i) => i.trim()).filter(Boolean),
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Tags <span className="text-gray-400">(comma-separated)</span>
        </label>
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="running, sports, nike"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Image URLs <span className="text-gray-400">(comma-separated)</span>
        </label>
        <input
          type="text"
          name="images"
          value={form.images}
          onChange={handleChange}
          placeholder="https://example.com/img1.jpg"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;