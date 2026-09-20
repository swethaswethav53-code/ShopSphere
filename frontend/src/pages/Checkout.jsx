import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart } from '../api/cartService';
import { placeOrder } from '../api/orderService';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [step, setStep] = useState('address'); // 'address' or 'payment'
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Online'
  
  // Online Payment Sub-options state
  const [onlineType, setOnlineType] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('');

  const [address, setAddress] = useState({
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        setCart(response.data);
      } catch (err) {
        setError('Failed to load your cart.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!address.addressLine || !address.city || !address.state || !address.postalCode || !address.phone) {
      setError('Please fill in all shipping address fields.');
      return;
    }
    setError('');
    setStep('payment');
  };

  const handleFinalPlaceOrder = async () => {
    setError('');

    // Online payment validation
    if (paymentMethod === 'Online') {
      if (onlineType === 'upi' && !upiId.trim()) {
        setError('Please enter a valid UPI ID.');
        return;
      }
      if (onlineType === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) {
        setError('Please fill in all card details.');
        return;
      }
      if (onlineType === 'netbanking' && !selectedBank) {
        setError('Please select a bank for net banking.');
        return;
      }
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        ...address,
        paymentMethod,
        paymentDetails: paymentMethod === 'Online' ? { type: onlineType, upiId, selectedBank } : { type: 'COD' }
      };

      const response = await placeOrder(orderPayload);
      navigate(`/orders/${response.data._id || response.data.data?._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
      setSubmitting(false);
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
          <p className="text-slate-400 font-medium">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-slate-950 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-3xl">
            🛒
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-slate-400 mb-6 text-sm">Add items to your cart before proceeding to checkout.</p>
          <Link 
            to="/products"
            className="inline-block bg-amber-500 text-slate-950 px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-md"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 tracking-wide">
          {step === 'address' ? 'Secure Checkout - Shipping Address' : 'Select Payment Method'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-8">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* STEP 1: SHIPPING ADDRESS */}
            {step === 'address' && (
              <>
                <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-slate-800 flex items-center space-x-2">
                  <span>📍</span>
                  <span>Shipping Address</span>
                </h2>

                <form onSubmit={handleProceedToPayment} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Address Line</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={address.addressLine}
                      onChange={handleChange}
                      required
                      placeholder="Street address, apartment, suite, unit"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        list="cities-list"
                        value={address.city}
                        onChange={handleChange}
                        required
                        placeholder="City"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      />
                      <datalist id="cities-list">
                        <option value="Salem" />
                        <option value="Chennai" />
                        <option value="Coimbatore" />
                        <option value="Madurai" />
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">State</label>
                      <select
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      >
                        <option value="" disabled>State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleChange}
                        required
                        placeholder="Postal / Zip code"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleChange}
                        required
                        placeholder="Phone number"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-amber-500 text-slate-950 py-3.5 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-lg text-base"
                  >
                    Continue to Payment →
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: PAYMENT METHOD SELECTION */}
            {step === 'payment' && (
              <>
                <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-slate-800 flex items-center space-x-2">
                  <span>💳</span>
                  <span>Payment Options</span>
                </h2>

                <div className="space-y-4 mb-6">
                  {/* COD Option */}
                  <label 
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'COD' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💵</span>
                      <div>
                        <p className="font-semibold text-white text-sm">Cash on Delivery (COD)</p>
                        <p className="text-xs text-slate-400">Pay cash when your order is delivered</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'COD'} 
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-amber-500"
                    />
                  </label>

                  {/* Online Payment Main Option */}
                  <label 
                    onClick={() => setPaymentMethod('Online')}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Online' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌐</span>
                      <div>
                        <p className="font-semibold text-white text-sm">Online Payment</p>
                        <p className="text-xs text-slate-400">UPI, Credit/Debit Cards, Net Banking</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'Online'} 
                      onChange={() => setPaymentMethod('Online')}
                      className="accent-amber-500"
                    />
                  </label>

                  {/* Flipkart / Amazon Style Online Sub-Options */}
                  {paymentMethod === 'Online' && (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 mt-2">
                      <div className="flex gap-2 border-b border-slate-800 pb-3">
                        <button
                          type="button"
                          onClick={() => setOnlineType('upi')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            onlineType === 'upi' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          UPI ID
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineType('card')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            onlineType === 'card' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          Cards
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineType('netbanking')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            onlineType === 'netbanking' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          Net Banking
                        </button>
                      </div>

                      {/* UPI Form */}
                      {onlineType === 'upi' && (
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-400">Enter UPI ID (GPay / PhonePe / Paytm)</label>
                          <input
                            type="text"
                            placeholder="username@okhdfcbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      )}

                      {/* Card Form */}
                      {onlineType === 'card' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Card Number</label>
                            <input
                              type="text"
                              placeholder="123xxxxxxxx"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-slate-400 mb-1">CVV</label>
                              <input
                                type="password"
                                placeholder="CVV Number"
                                maxLength="4"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Cardholder Name</label>
                            <input
                              type="text"
                              placeholder="Name"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Net Banking Bank List Dropdown */}
                      {onlineType === 'netbanking' && (
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-400">Select Your Bank</label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                          >
                            <option value="" disabled>-- Choose Bank --</option>
                            <option value="SBI">State Bank of India (SBI)</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="AXIS">Axis Bank</option>
                            <option value="KOTAK">Kotak Mahindra Bank</option>
                            <option value="PNB">Punjab National Bank</option>
                            <option value="BOB">Bank of Baroda</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3.5 rounded-lg transition-colors text-sm"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleFinalPlaceOrder}
                    className="w-2/3 bg-amber-500 text-slate-950 py-3.5 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-lg disabled:opacity-50 text-base"
                  >
                    {submitting ? 'Processing Order...' : 'Place Order Now 🚀'}
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white pb-4 border-b border-slate-800 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                {cart.items.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  return (
                    <div key={product._id} className="flex justify-between items-center text-sm pb-3 border-b border-slate-800/60">
                      <div>
                        <p className="font-semibold text-slate-200">{product.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-amber-400">
                        ₹{(product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 text-sm text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-white">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-amber-400">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

Checkout.displayName = "Checkout";
export default Checkout;