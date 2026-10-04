import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api/orderService';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 py-8 sm:py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-2xl sm:text-3xl">
            ⚠️
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-slate-400 mb-6 text-sm">{error || "We couldn't retrieve the requested order."}</p>
          <Link 
            to="/products"
            className="btn-touch inline-flex items-center justify-center w-full sm:w-auto bg-amber-500 text-slate-950 px-6 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-md"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-8 gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Order Confirmation</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Order ID: <span className="text-slate-200 font-mono break-all">{order._id}</span>
            </p>
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 capitalize w-fit flex-shrink-0">
            Status: {order.status || 'Processing'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
          
          {/* ================= ORDERED ITEMS ================= */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 min-w-0">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl">
              <h2 className="text-base sm:text-lg font-bold text-white pb-4 border-b border-slate-800 mb-4">Ordered Items</h2>
              
              {/* Mobile-la full list, sm+ la scroll */}
              <div className="space-y-4 sm:max-h-80 sm:overflow-y-auto sm:pr-1">
                {order.items?.map((item, index) => (
                  <div key={item.product || index} className="flex justify-between items-center gap-3 text-sm pb-3 border-b border-slate-800/60 last:border-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.image || '/default-product.png'} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 line-clamp-2">{item.name || 'Product Item'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                    <span className="font-medium text-amber-400 flex-shrink-0 whitespace-nowrap">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= ADDRESS + PAYMENT ================= */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6 min-w-0">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl">
              <h2 className="text-base sm:text-lg font-bold text-white pb-4 border-b border-slate-800 mb-4">Shipping Address</h2>
              <div className="text-sm text-slate-300 space-y-1.5 break-words">
                <p className="font-medium text-white">{order.shippingAddress?.addressLine}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl">
              <h2 className="text-base sm:text-lg font-bold text-white pb-4 border-b border-slate-800 mb-4">Payment Summary</h2>
              
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between gap-3">
                  <span>Total Amount Paid</span>
                  <span className="font-bold text-amber-400 text-base">₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <Link 
                to="/products"
                className="btn-touch w-full mt-6 bg-amber-500 text-slate-950 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-md flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;