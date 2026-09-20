import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, removeFromCart } from '../api/cartService';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data || { items: [] });
    } catch (err) {
      setError('Failed to load cart items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const response = await removeFromCart(productId);
      setCart(response.data || { items: [] });
    } catch (err) {
      setError('Failed to remove item.');
    }
  };

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-slate-950 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-3xl">
            🛒
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-slate-400 mb-6 text-sm">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            to="/products"
            className="inline-block bg-amber-500 text-slate-950 px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-md"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-wide">Shopping Cart</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div key={product._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center space-x-4">
                    {/* Wrapped Image in Link so clicking it goes to product details */}
                    <Link to={`/products/${product._id}`} className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl overflow-hidden hover:border-slate-700 transition-colors">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>
                    </Link>

                    <div>
                      {/* Wrapped Product Name in Link so clicking it goes to product details */}
                      <Link to={`/products/${product._id}`}>
                        <h3 className="text-white font-semibold text-base hover:text-amber-400 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-slate-400 text-sm mt-0.5">Quantity: {item.quantity}</p>
                      <p className="text-amber-400 font-medium mt-1">₹{product.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto space-x-6">
                    <button 
                      onClick={() => handleRemove(product._id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg sticky top-24">
              <h2 className="text-xl font-bold text-white pb-4 border-b border-slate-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-white">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-amber-400">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full mt-6 bg-amber-500 text-slate-950 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-md text-center block"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;