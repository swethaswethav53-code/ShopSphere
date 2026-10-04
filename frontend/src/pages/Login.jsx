import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Password show/hide state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] sm:min-h-[85vh] bg-slate-950 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-8 relative overflow-hidden">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Sign in to your ShopSphere account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs sm:text-sm mb-5 sm:mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-200 text-sm focus:outline-none"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-touch w-full bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-sm font-bold transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-400 mt-5 sm:mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-400 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;