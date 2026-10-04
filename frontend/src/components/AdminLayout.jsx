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
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">

      {/* Mobile/tablet: top swipe tabs (sticky). Desktop: left sidebar */}
      <aside className="w-full lg:w-56 bg-gray-900 text-white shrink-0 sticky top-16 z-30 lg:static">
        <h2 className="hidden lg:block text-lg font-bold px-4 pt-4 mb-6">Admin Panel</h2>

        <nav className="flex lg:block gap-2 lg:gap-0 lg:space-y-1 overflow-x-auto no-scrollbar px-3 py-2 lg:p-4 lg:pt-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block shrink-0 whitespace-nowrap px-3 py-2.5 rounded text-sm ${
                  isActive ? 'bg-gray-700 font-medium' : 'hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* min-w-0 stops wide tables from stretching the whole page */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;