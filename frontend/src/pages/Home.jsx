import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // URL-la irundhu selected category-ai eduthukkurom (e.g. ?category=Fashion)
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category') || 'For you';

  const categories = [
    { name: 'For you', icon: '✨' },
    { name: 'Appliances', icon: '📺' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Cooking', icon: '🍳' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Food', icon: '🍎' },
    { name: 'Furniture', icon: '🛋️' },
    { name: 'Sports', icon: '🏏' },
    { name: 'Toys', icon: '🧸' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      const productData = res.data.data || res.data;
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (catName) => {
    navigate(`/?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">

      {/* ================= CATEGORY ICONS (FIXED BELOW HEADER) ================= */}
      <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 py-3 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex space-x-6 sm:space-x-10 min-w-max items-center justify-start sm:justify-center overflow-x-auto no-scrollbar">

          {categories.map((cat, index) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <div
                key={index}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all shadow-md border ${
                  isSelected 
                    ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105 shadow-amber-500/20' 
                    : 'bg-slate-800 group-hover:bg-amber-500/20 border-slate-700 group-hover:border-amber-500 text-slate-100'
                }`}>
                  {cat.icon}
                </div>

                <span className={`text-xs mt-1.5 font-medium transition-colors ${
                  isSelected ? 'text-amber-400 font-bold' : 'text-slate-300 group-hover:text-amber-400'
                }`}>
                  {cat.name}
                </span>
              </div>
            );
          })}

        </div>
      </div>


      {/* ================= PROMOTIONAL BANNER ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 sm:p-10 shadow-2xl flex flex-col sm:flex-row items-center justify-between text-white">

          <div className="max-w-lg mb-6 sm:mb-0">
            <span className="bg-slate-950 text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Special Offer
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3 mb-2">
              New Launches - UP TO 40% OFF
            </h2>
            <p className="text-amber-100 text-sm sm:text-base mb-5">
              Explore top-quality products across food, toys, appliances, electronics, and fashion essentials.
            </p>
            <Link
              to="/products"
              className="inline-block bg-slate-950 hover:bg-slate-900 text-amber-400 font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg"
            >
              Shop Now →
            </Link>
          </div>

          <div className="w-full sm:w-1/3 bg-slate-950/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center shadow-inner flex flex-col items-center">
            <img
              src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=400&q=80"
              alt="Limited Time Mega Deals"
              className="w-full h-32 object-cover rounded-xl mb-3 border border-white/10 shadow-md"
            />
            <p className="text-sm font-bold text-amber-200">Limited Time Mega Deals</p>
            <p className="text-xs text-amber-100 mt-1">Grab your favorites before stock ends!</p>
          </div>

        </div>
      </div>


      {/* ================= PRODUCTS / CATEGORIES ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 mb-2">No products found in the database.</p>
          </div>
        ) : (
          categories
            .filter((cat) => {
              if (selectedCategory.toLowerCase() === 'for you') return true;
              return cat.name.toLowerCase() === selectedCategory.toLowerCase();
            })
            .map((cat) => {
              let categoryProducts = [];

              if (cat.name === 'For you') {
                categoryProducts = [...products].sort(() => 0.5 - Math.random());
              } else {
                categoryProducts = products.filter((p) => {
                  if (!p.category) return false;
                  let catName = '';
                  if (typeof p.category === 'object' && p.category !== null) {
                    catName = p.category.name || '';
                  } else if (typeof p.category === 'string') {
                    catName = p.category;
                  }
                  return catName.trim().toLowerCase() === cat.name.toLowerCase();
                });
              }

              if (categoryProducts.length === 0) {
                return (
                  <div key={cat.name} className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl">
                    <span className="text-4xl mb-3 block">{cat.icon}</span>
                    <p className="text-slate-400 text-base">No products available in {cat.name} category right now.</p>
                  </div>
                );
              }

              return (
                <div
                  key={cat.name}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {cat.name === 'For you' ? 'For You - Special Recommendations' : `${cat.name} Products`}
                      </h3>
                    </div>

                    <button
                      onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                      className="text-xs sm:text-sm text-amber-400 hover:underline font-semibold"
                    >
                      View All →
                    </button>
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {categoryProducts.map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition-all cursor-pointer"
                      >
                        <div className="h-44 overflow-hidden bg-slate-950 relative">
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0]
                                : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
                            }
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="p-4 flex flex-col flex-grow">
                          <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800/80">
                            <span className="text-base font-bold text-amber-400">
                              ₹{product.price}
                            </span>
                            <span className="text-amber-400 text-xs font-semibold group-hover:underline">
                              View Details →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                </div>
              );
            })
        )}

      </div>

    </div>
  );
};

Home.displayName = "Home";
export default Home;