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
    <div className="min-h-[60vh] sm:min-h-[85vh] bg-slate-950 py-6 sm:py-12 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">My Account</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage your personal information and account preferences</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5 sm:space-y-6">
          {/* User Info Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-full bg-amber-500 text-slate-950 font-bold text-xl sm:text-2xl flex items-center justify-center">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold break-words">{fullName}</h2>
                <p className="text-xs sm:text-sm text-slate-400 break-all">{emailAddress}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  isAdmin ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {userRole}
                </span>
              </div>
            </div>

            {/* Action Buttons: mobile-la 2 columns + Logout full width. Tablet+ la ore row */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 w-full lg:w-auto">
              <Link 
                to="/orders" 
                className="btn-touch bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 rounded-xl text-xs font-bold transition-all text-center shadow-md flex items-center justify-center gap-2"
              >
                📦 My Orders
              </Link>
              <Link 
                to="/wishlist" 
                className="btn-touch bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 rounded-xl text-xs font-bold transition-all text-center shadow-md flex items-center justify-center gap-2"
              >
                ❤️ Wishlist
              </Link>
              <button 
                onClick={handleLogout}
                className="btn-touch col-span-2 sm:col-span-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 rounded-xl text-xs font-bold transition-all text-center shadow-md flex items-center justify-center gap-2"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Details Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2 min-w-0">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm break-words">
                {fullName}
              </div>
            </div>

            <div className="space-y-2 min-w-0">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm break-all">
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