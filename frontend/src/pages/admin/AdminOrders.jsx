import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../../api/adminOrderService';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-gray-100">
                <td className="p-3">
                  <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline font-medium">
                    #{order._id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="p-3">
                  <p className="font-medium">{order.user?.name}</p>
                  <p className="text-gray-400 text-xs">{order.user?.email}</p>
                </td>
                <td className="p-3 text-gray-500">{order.items.length}</td>
                <td className="p-3 font-medium">₹{order.totalAmount.toFixed(2)}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize border-0 ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && <p className="text-gray-500 text-center py-10">No orders yet.</p>}
    </div>
  );
};

export default AdminOrders;