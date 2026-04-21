import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useGeolocation } from '../hooks/useGeolocation';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { location, loading: geoLoading, error: geoError, getLocation } = useGeolocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useGeolocationData, setUseGeolocationData] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const shipping = 100;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">📦</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 text-lg mb-8">Add books to your cart before checkout</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-dark-green transition text-lg"
          >
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.firstName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Phone validation
      const phoneRegex = /^[0-9]{10}$/;
      if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate card details
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        throw new Error('Please fill in all card details');
      }

      // Validate card number (simple validation)
      if (formData.cardNumber.replace(/\s/g, '').length < 13) {
        throw new Error('Please enter a valid card number');
      }

      // Validate expiry date format MM/YY
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        throw new Error('Please enter expiry date in MM/YY format');
      }

      // Validate CVV
      if (!/^\d{3,4}$/.test(formData.cvv)) {
        throw new Error('Please enter a valid CVV');
      }

      // Simulate Stripe payment processing
      // In production, you would use @stripe/react-stripe-js to load the Stripe.js library
      // and @stripe/stripe-js to handle payment processing

      const stripeToken = btoa(JSON.stringify({
        cardNumber: '****' + formData.cardNumber.slice(-4),
        expiryDate: formData.expiryDate,
        cvv: '***',
        amount: total,
        currency: 'INR',
        timestamp: new Date().toISOString()
      }));

      // Simulate payment success with 95% probability
      const isSuccess = Math.random() < 0.95;

      if (!isSuccess) {
        throw new Error('Payment failed. Please try again or use a different card.');
      }

      // Try to create order via API
      const userId = localStorage.getItem('userId');
      const orderData = {
        deliveryAddress: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        latitude: useGeolocationData && location ? location.latitude : null,
        longitude: useGeolocationData && location ? location.longitude : null,
        orderStatus: 'PLACED',
        paymentStatus: 'COMPLETED'
      };

      let orderId = null;
      try {
        if (userId) {
          const { data } = await api.post(`/orders/${userId}/create`, orderData);
          if (data.success) {
            orderId = data.order.id;
          }
        }
      } catch (apiErr) {
        console.log('API order creation failed, falling back to localStorage');
      }

      // If API creation failed, store in localStorage for demo
      if (!orderId) {
        orderId = `ORD-${Date.now()}`;
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push({
          id: orderId,
          items: items.map(item => ({
            bookId: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price
          })),
          deliveryAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          },
          amounts: {
            subtotal,
            tax,
            shipping,
            total
          },
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'Card',
          stripeToken,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('orders', JSON.stringify(orders));
      }

      // Clear cart
      clearCart();

      // Redirect to confirmation
      navigate('/order-confirmation', {
        state: {
          orderId,
          orderData
        }
      });
    } catch (err) {
      setError(err.message || 'An error occurred during checkout. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <LoadingSpinner size="lg" text="Processing Payment..." />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-brand-green to-dark-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📦 Checkout</h1>
          <p className="text-light-green opacity-90">Review your order and complete payment</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg">
                  <p className="text-red-700 font-semibold">⚠️ {error}</p>
                </div>
              )}

              {/* Personal Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="text-2xl">📍</span> Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        City <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                        placeholder="Mumbai"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Zip Code <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                        placeholder="400001"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  {/* Geolocation Button */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">📍 Geolocation</label>
                    <button
                      type="button"
                      onClick={getLocation}
                      disabled={geoLoading}
                      className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {geoLoading ? 'Getting Location...' : 'Use My Location'}
                    </button>
                    {location && (
                      <p className="text-green-600 text-sm mt-2 font-semibold">
                        ✓ Location captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </p>
                    )}
                    {geoError && (
                      <p className="text-red-600 text-sm mt-2">Error: {geoError}</p>
                    )}
                    <label className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        checked={useGeolocationData}
                        onChange={(e) => setUseGeolocationData(e.target.checked)}
                        disabled={!location}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">Use captured location for delivery</span>
                    </label>
                  </div>
                </div>
              </div>
              {/* Payment Details Section */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">💳 Payment Details</h3>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '').slice(0, 16);
                      const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                      handleInputChange({ target: { name: 'cardNumber', value: formatted } });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition font-mono"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-1">Demo: Use any 16-digit number</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        handleInputChange({ target: { name: 'expiryDate', value } });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition font-mono"
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleInputChange({ target: { name: 'cvv', value } });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none transition font-mono"
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-green to-dark-green text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? '⏳ Processing Payment...' : '✓ Place Order - ₹' + total.toFixed(0)}
              </button>

              {/* Info */}
              <div className="mt-6 p-4 bg-light-green rounded-lg text-sm text-gray-700">
                <p className="font-semibold text-brand-green mb-2">🔒 Secure Payment</p>
                <p>This is a demo store. Payment processing is simulated with ~90% success rate for testing purposes.</p>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-right whitespace-nowrap ml-2">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%):</span>
                  <span className="font-semibold">₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="font-semibold">₹{shipping}</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-brand-green">₹{total.toFixed(0)}</span>
                </div>
              </div>

              {/* Back to Cart Button */}
              <button
                onClick={() => navigate('/cart')}
                className="w-full border-2 border-brand-green text-brand-green py-3 rounded-lg font-semibold hover:bg-light-green transition"
              >
                ← Back to Cart
              </button>

              {/* Additional Info */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-xl">🚚</span>
                  <div>
                    <p className="font-semibold text-gray-900">Delivery</p>
                    <p className="text-gray-600 text-xs">3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900">Secure Payment</p>
                    <p className="text-gray-600 text-xs">Demo store - ~90% success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
