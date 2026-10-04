import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../api/wishlistService';
import { addToCart } from '../api/cartService';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist();
      // Backend response structure: { success: true, data: wishlist }
      const wishlistObj = response.data || response;
      setWishlist(wishlistObj || { products: [] });
    } catch (err) {
      setError('Failed to load wishlist items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    setError('');
    setMessage('');
    try {
      const response = await removeFromWishlist(productId);
      const wishlistObj = response.data || response;
      setWishlist(wishlistObj || { products: [] });
      setMessage('Item removed from wishlist.');
    } catch (err) {
      setError('Failed to remove item from wishlist.');
    }
  };

  const handleMoveToCart = async (productId) => {
    setError('');
    setMessage('');
    try {
      await addToCart(productId, 1);
      const response = await removeFromWishlist(productId);
      const wishlistObj = response.data || response;
      setWishlist(wishlistObj || { products: [] });
      setMessage('Item moved to cart successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to move item to cart.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  const products = wishlist.products || [];

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 py-8 sm:py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-2xl sm:text-3xl">
            ❤️
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Your Wishlist is Empty</h2>
          <p className="text-slate-400 mb-6 text-sm">Save items you love to your wishlist and revisit them anytime.</p>
          <Link 
            to="/products"
            className="btn-touch inline-flex items-center justify-center w-full sm:w-auto bg-amber-500 text-slate-950 px-6 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-md"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 py-6 sm:py-12">
      <div className="page-container">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-5 sm:mb-8 tracking-wide">My Wishlist</h1>

        {/* Messages: sticky so they stay visible while scrolling */}
        {error && (
          <div className="sticky top-20 z-40 bg-red-950/90 backdrop-blur-sm border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-5 sm:mb-6 text-sm shadow-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="sticky top-20 z-40 bg-emerald-950/90 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg mb-5 sm:mb-6 text-sm shadow-lg">
            {message}
          </div>
        )}

        <div className="product-grid">
          {products.map((product) => {
            if (!product) return null;

            return (
              <div 
                key={product._id} 
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  {/* Image Link */}
                  <Link to={`/products/${product._id}`} className="block">
                    <div className="w-full h-44 sm:h-48 bg-slate-950 border-b border-slate-800 flex items-center justify-center overflow-hidden relative">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="text-3xl">📦</span>
                      )}
                      <span className="absolute top-3 right-3 max-w-[60%] truncate px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-amber-400 border border-slate-800 backdrop-blur-sm">
                        ₹{product.price}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1 truncate">
                      {product.category?.name || product.category || 'General'}
                    </span>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-white font-bold text-base hover:text-amber-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0 flex flex-col gap-2">
                  <button
                    onClick={() => handleMoveToCart(product._id)}
                    className="btn-touch w-full bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-semibold transition-colors text-center shadow-md"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="btn-touch w-full bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700 rounded-lg text-sm font-semibold transition-colors text-center shadow-md"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Wishlist;