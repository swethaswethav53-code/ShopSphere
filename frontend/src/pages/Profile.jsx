import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Ippo backend & AuthContext-la irunthu varra actual name-ah direct-ah use panrom
  const fullName = user?.name || user?.fullName || 'User';
  const emailAddress = user?.email || 'No email provided';

  // Admin role check panrathu
  const emailIsAdmin = emailAddress.toLowerCase().includes('admin');
  const isAdmin = user?.role === 'admin' || user?.role === 'Admin' || user?.isAdmin === true || emailIsAdmin;
  const userRole = isAdmin ? 'Admin' : 'Customer';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[85vh] bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide">My Account</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your personal information and account preferences</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* User Info Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 font-bold text-2xl flex items-center justify-center">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{fullName}</h2>
                <p className="text-sm text-slate-400">{emailAddress}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  isAdmin ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {userRole}
                </span>
              </div>
            </div>

            {/* Action Buttons: My Orders, Wishlist & Logout */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link 
                to="/orders" 
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center shadow-md flex items-center justify-center gap-2"
              >
                📦 My Orders
              </Link>
              <Link 
                to="/wishlist" 
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center shadow-md flex items-center justify-center gap-2"
              >
                ❤️ Wishlist
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center shadow-md flex items-center justify-center gap-2"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Details Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm">
                {fullName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm">
                {emailAddress}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;