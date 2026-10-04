import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shared input style (text-base on mobile stops iOS zoom on focus)
const inputClass =
  'w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-500';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] sm:min-h-[85vh] bg-slate-950 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-8 relative overflow-hidden">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">Create Account</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Join ShopSphere to start shopping today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs sm:text-sm mb-5 sm:mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-touch w-full bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-sm font-bold transition-colors shadow-lg disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-400 mt-5 sm:mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;