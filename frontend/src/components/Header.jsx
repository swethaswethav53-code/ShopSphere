import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/profile', label: 'Profile' },
  { to: '/cart', label: 'Cart' },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(savedSearches);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const term = searchQuery.trim();
      let updatedSearches = [term, ...recentSearches.filter(item => item !== term)];
      if (updatedSearches.length > 5) updatedSearches = updatedSearches.slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      setShowDropdown(false);
      closeMenu();
      navigate(`/products?search=${encodeURIComponent(term)}`);
    }
  };

  const handleRecentClick = (term) => {
    setSearchQuery(term);
    setShowDropdown(false);
    closeMenu();
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Search box (desktop bar and mobile panel rendu idathulaiyum use aagum)
  const renderSearch = () => (
    <div className="relative w-full">
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner"
      >
        <span className="text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className="w-full min-w-0 bg-transparent px-2 py-1 text-base sm:text-sm text-slate-100 focus:outline-none placeholder-slate-500"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex-shrink-0"
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
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-800/80 cursor-pointer text-slate-300 text-sm border-b border-slate-800/50 last:border-none transition-colors"
            >
              <span className="text-slate-500 text-xs">🕒</span>
              <span className="truncate">{term}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">

        {/* 1. Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-lg sm:text-xl font-extrabold text-amber-500 tracking-wider flex-shrink-0"
        >
          ShopSphere
        </Link>

        {/* 2. Search (tablet + desktop-la mattum bar-la theriyum) */}
        <div className="hidden md:block flex-grow max-w-lg mx-2">
          {renderSearch()}
        </div>

        {/* 3. Desktop links (1024px+) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium flex-shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-slate-300 hover:text-amber-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl font-semibold transition-colors text-sm"
          >
            Login
          </Link>
        </nav>

        {/* 4. Hamburger (1024px-ku keezha) */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="lg:hidden btn-touch flex items-center justify-center rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition-colors"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile / Tablet dropdown panel */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-2xl max-h-[calc(100dvh-4rem)] overflow-y-auto safe-bottom">
          <div className="px-4 sm:px-6 py-4 space-y-4">

            {/* Search (mobile-la mattum; tablet-la already bar-la irukku) */}
            <div className="md:hidden">
              {renderSearch()}
            </div>

            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className="btn-touch flex items-center px-3 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-800 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={closeMenu}
                className="btn-touch mt-2 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-semibold transition-colors"
              >
                Login
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

Header.displayName = "Header";
export default Header;