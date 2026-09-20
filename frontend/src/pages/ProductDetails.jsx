import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../api/productService';
import { addToCart } from '../api/cartService';
import { addToWishlist } from '../api/wishlistService';
import { getProductReviews, addReview, updateReview, deleteReview } from '../api/reviewService';
import { useAuth } from '../context/AuthContext';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  
  // New State for active selected image preview index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchProductAndReviews();
    setActiveImageIndex(0); // Reset image index on id change
  }, [id]);

  const fetchProductAndReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const productRes = await getProductById(id);
      const currentProduct = productRes.data;
      setProduct(currentProduct);

      const reviewsRes = await getProductReviews(id);
      setReviews(reviewsRes.data);

      // Fetch all products to filter related/same category items
      const allProdRes = await axios.get('http://localhost:5000/api/products');
      const prodData = allProdRes.data.data || allProdRes.data;
      
      if (Array.isArray(prodData)) {
        let currentCatName = '';
        if (currentProduct.category) {
          if (typeof currentProduct.category === 'object' && currentProduct.category !== null) {
            currentCatName = currentProduct.category.name || '';
          } else if (typeof currentProduct.category === 'string') {
            currentCatName = currentProduct.category;
          }
        }

        const otherProducts = prodData.filter((p) => p._id !== currentProduct._id);

        let sameCategoryProducts = otherProducts.filter((p) => {
          if (!p.category) return false;
          let pCatName = '';
          if (typeof p.category === 'object' && p.category !== null) {
            pCatName = p.category.name || '';
          } else if (typeof p.category === 'string') {
            pCatName = p.category;
          }
          return pCatName.trim().toLowerCase() === currentCatName.trim().toLowerCase();
        });

        if (sameCategoryProducts.length > 0) {
          setRelatedProducts(sameCategoryProducts);
        } else {
          setRelatedProducts(otherProducts);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setMessage('');
    try {
      await addToCart(product._id, quantity);
      setMessage('Added to cart successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const handleAddToWishlist = async () => {
    setMessage('');
    try {
      await addToWishlist(product._id);
      setMessage('Added to wishlist successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to wishlist.');
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    setError('');
    setMessage('');
    try {
      if (editingReview) {
        await updateReview(editingReview._id, reviewData);
        setMessage('Review updated successfully!');
        setEditingReview(null);
      } else {
        await addReview(product._id, reviewData);
        setMessage('Review added successfully!');
      }
      fetchProductAndReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleDeleteReview = async (reviewId) => {
    setError('');
    setMessage('');
    try {
      await deleteReview(reviewId);
      setMessage('Review deleted successfully!');
      if (editingReview && editingReview._id === reviewId) {
        setEditingReview(null);
      }
      fetchProductAndReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  if (loading) {
    return <div className="min-h-[80vh] bg-slate-950 flex items-center justify-center text-slate-400">Loading product details...</div>;
  }

  if (!product) {
    return <div className="min-h-[80vh] bg-slate-950 flex items-center justify-center text-red-400">Product not found.</div>;
  }

  const userReview = user ? reviews.find((r) => r.user?._id === user._id) : null;
  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="min-h-[80vh] bg-slate-950 text-slate-100 pb-28">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        {message && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>}

        {/* Product Main Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          
          {/* Image Gallery Container */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Thumbnail Selectors (Left side on desktop if multiple images exist) */}
            {hasImages && product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-slate-950 transition-all ${
                      activeImageIndex === idx ? 'border-amber-500 shadow-md shadow-amber-500/20' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Display Image */}
            <div className="relative flex-1 h-80 sm:h-96 bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800">
              {hasImages ? (
                <img 
                  src={product.images[activeImageIndex] || product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-contain transition-all duration-300" 
                />
              ) : (
                <span className="text-slate-500">No Image</span>
              )}
              
              {/* Wishlist & Share Action Icons on top of image */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleAddToWishlist}
                  className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-amber-400 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-sm"
                  title="Add to Wishlist"
                >
                  ❤️
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setMessage('Product link copied to clipboard!');
                  }}
                  className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-sm"
                  title="Share Product"
                >
                  🔗
                </button>
              </div>
            </div>
          </div>

          {/* Ratings & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {product.ratingsAverage > 0 ? (
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  ⭐ {product.ratingsAverage.toFixed(1)} ({product.numReviews} reviews)
                </span>
              ) : (
                <span className="text-slate-400 text-xs">No reviews yet</span>
              )}
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-2.5 py-1 bg-slate-800 rounded-md">
                {product.category?.name || product.category || 'General'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">{product.name}</h1>
            
            <p className="text-2xl font-bold text-amber-400">₹{product.price}</p>
            
            <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>

            <div className="pt-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${product.stock > 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
              <label className="text-sm font-medium text-slate-300">Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock || 1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        <div className="mb-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">You Might Also Like</h3>
          
          <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
            {relatedProducts.map((prod) => (
              <div
                key={prod._id}
                className="min-w-[240px] sm:min-w-[270px] max-w-[270px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 flex flex-col group hover:border-slate-700 transition-all"
              >
                <div className="h-44 overflow-hidden bg-slate-950 relative">
                  <img
                    src={
                      prod.images && prod.images.length > 0
                        ? prod.images[0]
                        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
                    }
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="font-semibold text-white text-sm mb-1 line-clamp-1">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                    {prod.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-800/80">
                    <span className="text-base font-bold text-amber-400">
                      ₹{prod.price}
                    </span>
                    <Link
                      to={`/products/${prod._id}`}
                      className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-800 pb-3">Customer Reviews</h2>
          <ReviewList
            reviews={reviews}
            currentUserId={user?._id}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
          />

          <div className="mt-8 pt-6 border-t border-slate-800">
            {user ? (
              <ReviewForm
                onSubmit={handleReviewSubmit}
                editingReview={editingReview}
                onCancel={() => setEditingReview(null)}
                hasAlreadyReviewed={!!userReview && !editingReview}
              />
            ) : (
              <p className="text-slate-400 text-sm">Please log in to write a review.</p>
            )}
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 p-4 backdrop-blur-md shadow-2xl z-50">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-md text-sm sm:text-base"
            >
              Add to cart
            </button>
            <button
              onClick={async () => {
                try {
                  await addToCart(product._id, quantity);
                  setTimeout(() => {
                    navigate('/checkout');
                  }, 300);
                } catch (err) {
                  setError(err.response?.data?.message || 'Failed to proceed to checkout.');
                }
              }}
              disabled={product.stock <= 0}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-lg text-sm sm:text-base"
            >
              Buy at ₹{product.price * quantity}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;