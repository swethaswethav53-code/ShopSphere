import { useState, useEffect } from 'react';
import { getCategories } from '../api/categoryService';

// Shared input style (text-base on mobile stops iOS zoom on focus)
const inputClass =
  'w-full bg-white border rounded px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-400';
const labelClass = 'block text-sm font-medium mb-1';

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
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">{error}</p>}

      <div>
        <label className={labelClass}>Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className={labelClass}>Price (₹)</label>
          <input
            type="number"
            inputMode="numeric"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input
            type="number"
            inputMode="numeric"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className={inputClass}
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
        <label className={labelClass}>
          Tags <span className="text-gray-400">(comma-separated)</span>
        </label>
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="running, sports, nike"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Image URLs <span className="text-gray-400">(comma-separated)</span>
        </label>
        <input
          type="text"
          name="images"
          value={form.images}
          onChange={handleChange}
          placeholder="https://example.com/img1.jpg"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-touch w-full sm:w-auto bg-black text-white px-6 rounded text-sm sm:text-base disabled:opacity-50"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;