import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/productService';
import { getCategories } from '../../api/categoryService';
import { getAllUsers } from '../../api/userService';
import axiosInstance from '../../api/axiosInstance';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, usersRes, ordersRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getAllUsers(),
          axiosInstance.get('/orders'),
        ]);

        const orders = ordersRes.data.data;
        const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        setStats({
          products: productsRes.data.length,
          categories: categoriesRes.data.length,
          users: usersRes.data.length,
          orders: orders.length,
          revenue,
        });
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, link: '/admin/products', color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Categories', value: stats.categories, link: '/admin/categories', color: 'bg-purple-50 text-purple-700' },
    { label: 'Total Users', value: stats.users, link: '/admin/users', color: 'bg-green-50 text-green-700' },
    { label: 'Total Orders', value: stats.orders, link: '/admin/orders', color: 'bg-orange-50 text-orange-700' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(2)}`, link: '/admin/orders', color: 'bg-pink-50 text-pink-700' },
  ];

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className={`rounded-lg p-4 ${card.color} hover:opacity-80 transition`}
          >
            <p className="text-sm font-medium">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;