import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart } from '../api/cartService';
import { placeOrder } from '../api/orderService';

// Shared input styles (text-base on mobile stops iOS zoom on focus)
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2';
const inputClass =
  'w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-colors text-base sm:text-sm';
const payLabelClass = 'block text-xs font-semibold text-slate-400 mb-1';
const payInputClass =
  'w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-base sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500';

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
      <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 py-8 sm:py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 text-2xl sm:text-3xl">
            🛒
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
          <p className="text-slate-400 mb-6 text-sm">Add items to your cart before proceeding to checkout.</p>
          <Link 
            to="/products"
            className="btn-touch inline-flex items-center justify-center w-full sm:w-auto bg-amber-500 text-slate-950 px-6 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-md"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] sm:min-h-[80vh] bg-slate-950 py-6 sm:py-12">
      <div className="page-container">
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-5 sm:mb-8 tracking-wide">
          {step === 'address' ? 'Secure Checkout - Shipping Address' : 'Select Payment Method'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ================= FORM SECTION ================= */}
          <div className="lg:col-span-7 min-w-0 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 sm:p-8">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-5 sm:mb-6 text-sm">
                {error}
              </div>
            )}

            {/* STEP 1: SHIPPING ADDRESS */}
            {step === 'address' && (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6 pb-4 border-b border-slate-800 flex items-center gap-2">
                  <span>📍</span>
                  <span>Shipping Address</span>
                </h2>

                <form onSubmit={handleProceedToPayment} className="space-y-4 sm:space-y-5">
                  <div>
                    <label className={labelClass}>Address Line</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={address.addressLine}
                      onChange={handleChange}
                      required
                      placeholder="Street address, apartment, suite, unit"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className={labelClass}>City</label>
                      <input
                        type="text"
                        name="city"
                        list="cities-list"
                        value={address.city}
                        onChange={handleChange}
                        required
                        placeholder="City"
                        className={inputClass}
                      />
                      <datalist id="cities-list">
                        <option value="Salem" />
                        <option value="Chennai" />
                        <option value="Coimbatore" />
                        <option value="Madurai" />
                      </datalist>
                    </div>

                    <div>
                      <label className={labelClass}>State</label>
                      <select
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        required
                        className={inputClass}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className={labelClass}>Postal Code</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleChange}
                        required
                        placeholder="Postal / Zip code"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleChange}
                        required
                        placeholder="Phone number"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-touch w-full mt-4 sm:mt-6 bg-amber-500 text-slate-950 py-3.5 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-lg text-base"
                  >
                    Continue to Payment →
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: PAYMENT METHOD SELECTION */}
            {step === 'payment' && (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-5 sm:mb-6 pb-4 border-b border-slate-800 flex items-center gap-2">
                  <span>💳</span>
                  <span>Payment Options</span>
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-6">
                  {/* COD Option */}
                  <label 
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'COD' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl flex-shrink-0">💵</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm">Cash on Delivery (COD)</p>
                        <p className="text-xs text-slate-400">Pay cash when your order is delivered</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'COD'} 
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-amber-500 flex-shrink-0 w-4 h-4"
                    />
                  </label>

                  {/* Online Payment Main Option */}
                  <label 
                    onClick={() => setPaymentMethod('Online')}
                    className={`flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Online' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl flex-shrink-0">🌐</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm">Online Payment</p>
                        <p className="text-xs text-slate-400">UPI, Credit/Debit Cards, Net Banking</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'Online'} 
                      onChange={() => setPaymentMethod('Online')}
                      className="accent-amber-500 flex-shrink-0 w-4 h-4"
                    />
                  </label>

                  {/* Online Sub-Options */}
                  {paymentMethod === 'Online' && (
                    <div className="p-3 sm:p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 mt-2">
                      <div className="flex gap-2 border-b border-slate-800 pb-3">
                        {[
                          { id: 'upi', label: 'UPI ID' },
                          { id: 'card', label: 'Cards' },
                          { id: 'netbanking', label: 'Net Banking' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setOnlineType(tab.id)}
                            className={`btn-touch flex-1 sm:flex-none px-2 sm:px-4 rounded-lg text-xs font-medium text-center transition-colors ${
                              onlineType === tab.id ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
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
                            className={payInputClass}
                          />
                        </div>
                      )}

                      {/* Card Form */}
                      {onlineType === 'card' && (
                        <div className="space-y-3">
                          <div>
                            <label className={payLabelClass}>Card Number</label>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="123xxxxxxxx"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                              className={payInputClass}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={payLabelClass}>Expiry (MM/YY)</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                className={payInputClass}
                              />
                            </div>
                            <div>
                              <label className={payLabelClass}>CVV</label>
                              <input
                                type="password"
                                inputMode="numeric"
                                placeholder="CVV"
                                maxLength="4"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                className={payInputClass}
                              />
                            </div>
                          </div>
                          <div>
                            <label className={payLabelClass}>Cardholder Name</label>
                            <input
                              type="text"
                              placeholder="Name"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                              className={payInputClass}
                            />
                          </div>
                        </div>
                      )}

                      {/* Net Banking */}
                      {onlineType === 'netbanking' && (
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-slate-400">Select Your Bank</label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className={payInputClass}
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

                {/* Mobile: stacked (Place Order on top). Desktop: side by side */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="btn-touch w-full sm:w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3.5 rounded-lg transition-colors text-sm"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleFinalPlaceOrder}
                    className="btn-touch w-full sm:w-2/3 bg-amber-500 text-slate-950 py-3.5 rounded-lg font-semibold hover:bg-amber-400 transition-colors shadow-lg disabled:opacity-50 text-base"
                  >
                    {submitting ? 'Processing Order...' : 'Place Order Now 🚀'}
                  </button>
                </div>
              </>
            )}

          </div>

          {/* ================= ORDER SUMMARY ================= */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-white pb-4 border-b border-slate-800 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
                {cart.items.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  return (
                    <div key={product._id} className="flex justify-between items-center gap-3 text-sm pb-3 border-b border-slate-800/60">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-200 line-clamp-2">{product.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-amber-400 flex-shrink-0 whitespace-nowrap">
                        ₹{(product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 text-sm text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between gap-3">
                  <span>Subtotal</span>
                  <span className="font-medium text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-white">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between gap-3 text-base font-bold text-white">
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