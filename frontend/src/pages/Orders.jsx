import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const res = await axios.get('http://localhost:5000/api/orders/myorders', config);
      const ordersData = res.data.data || res.data;
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, config);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  // Helper function to get status progress steps
  const getStepIndex = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status?.toLowerCase());
  };

  if (loading) {
    return <div className="min-h-[80vh] bg-slate-950 flex items-center justify-center text-slate-400">Loading your orders...</div>;
  }

  return (
    <div className="min-h-[80vh] bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 border-b border-slate-800 pb-3">My Orders</h1>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">{error}</div>}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl font-semibold transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIndex = getStepIndex(order.status);
              const isCancelled = order.status === 'cancelled';

              return (
                <div key={order._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  {/* Top Header: Order ID & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-4">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">Order ID: {order._id}</span>
                      <p className="text-xs text-slate-400 mt-1">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Flipkart Style Order Tracking Progress Bar (Skipped if cancelled) */}
                  {!isCancelled && (
                    <div className="mb-6 px-2 py-4 bg-slate-950/40 rounded-xl border border-slate-800/60">
                      <div className="flex items-center justify-between relative">
                        {/* Progress line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0 mx-8 hidden sm:block"></div>
                        
                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((stepName, sIdx) => {
                          const isDone = sIdx <= currentStepIndex;
                          return (
                            <div key={stepName} className="flex flex-col items-center relative z-10 flex-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone 
                                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}>
                                {sIdx + 1}
                              </div>
                              <span className={`text-[11px] mt-1.5 font-medium ${isDone ? 'text-amber-400' : 'text-slate-500'}`}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Ordered Items with Image */}
                  <div className="space-y-3 mb-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-4 text-sm bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image || 'https://via.placeholder.com/60'} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded-lg border border-slate-800 flex-shrink-0"
                          />
                          <div>
                            <span className="text-slate-200 font-medium block">{item.name}</span>
                            <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-semibold text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer: Total & Cancel Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-800 text-sm gap-4">
                    <div>
                      <span className="font-medium text-slate-400">Total Amount Paid: </span>
                      <span className="text-lg font-bold text-amber-400">₹{order.totalAmount}</span>
                    </div>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;