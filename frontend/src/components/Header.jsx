import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(savedSearches);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const term = searchQuery.trim();
      let updatedSearches = [term, ...recentSearches.filter(item => item !== term)];
      if (updatedSearches.length > 5) updatedSearches = updatedSearches.slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      setShowDropdown(false);
      navigate(`/products?search=${encodeURIComponent(term)}`);
    }
  };

  const handleRecentClick = (term) => {
    setSearchQuery(term);
    setShowDropdown(false);
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* 1. ShopSphere Logo */}
        <Link to="/" className="text-xl font-extrabold text-amber-500 tracking-wider flex-shrink-0">
          ShopSphere
        </Link>

        {/* 2. Search Box */}
        <div className="flex-grow max-w-lg relative mx-2">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
            <span className="text-slate-400 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="Search for Products, Brands and More" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-transparent px-2 py-0.5 text-xs sm:text-sm text-slate-100 focus:outline-none placeholder-slate-500"
            />
            <button 
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-3 py-1 rounded-lg text-xs transition-colors flex-shrink-0"
            >
              Search
            </button>
          </form>

          {/* Recent Searches Dropdown */}
          {showDropdown && recentSearches.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-40 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-semibold bg-slate-950/50">
                <span>Recent Searches</span>
                <button 
                  type="button" 
                  onClick={clearRecentSearches} 
                  className="text-amber-400 hover:underline"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((term, index) => (
                <div 
                  key={index}
                  onClick={() => handleRecentClick(term)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800/80 cursor-pointer text-slate-300 text-xs sm:text-sm border-b border-slate-800/50 last:border-none transition-colors"
                >
                  <span className="text-slate-500 text-xs">🕒</span>
                  <span>{term}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Navigation Links (Home, Products, Profile, Cart, Login) */}
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium flex-shrink-0">
          <Link to="/" className="text-slate-300 hover:text-amber-400 transition-colors">Home</Link>
          <Link to="/products" className="text-slate-300 hover:text-amber-400 transition-colors">Products</Link>
          <Link to="/profile" className="text-slate-300 hover:text-amber-400 transition-colors">Profile</Link>
          <Link to="/cart" className="text-slate-300 hover:text-amber-400 transition-colors">Cart</Link>
          <Link to="/login" className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl font-semibold transition-colors text-xs sm:text-sm">Login</Link>
        </div>

      </div>
    </header>
  );
};

Header.displayName = "Header";
export default Header;