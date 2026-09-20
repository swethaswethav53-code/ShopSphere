import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reviews', label: 'Reviews' },
];

const AdminLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-56 bg-gray-900 text-white p-4 shrink-0">
        <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${
                  isActive ? 'bg-gray-700 font-medium' : 'hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;