import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/productService';
import { deleteProduct } from '../../api/adminProductService';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading products...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          + Add Product
        </Link>
      </div>

      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-gray-100">
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3 text-gray-500">{product.category?.name}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">
                  <span className={product.stock === 0 ? 'text-red-600' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-3">
                  {product.numReviews > 0 ? `⭐ ${product.ratingsAverage.toFixed(1)}` : '—'}
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      disabled={deletingId === product._id}
                      className="text-red-500 hover:underline disabled:opacity-40"
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

      {products.length === 0 && (
        <p className="text-gray-500 text-center py-10">No products yet.</p>
      )}
    </div>
  );
};

export default AdminProducts;