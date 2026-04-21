import React from 'react';
import { useCartStore } from '../store/index';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 text-lg mb-8">Add some books to get started!</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-dark-green transition text-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-green to-dark-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🛒 Shopping Cart</h1>
          <p className="text-light-green opacity-90">{items.length} book{items.length !== 1 ? 's' : ''} in cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 md:p-6"
              >
                <div className="flex gap-4 md:gap-6">
                  {/* Book Image */}
                  <div className="w-20 h-28 md:w-24 md:h-36 flex-shrink-0 bg-light-green rounded-lg overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">📖</span>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">by {item.author || 'Unknown'}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-block bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold">
                          {item.condition || 'Good'}
                        </span>
                        <span className="text-xs text-gray-500">{item.stockQty} in stock</span>
                      </div>
                    </div>

                    {/* Price */}
                    <p className="text-2xl font-bold text-brand-green">
                      ₹{item.price?.toFixed(0) || '0'}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-gray-600 hover:text-brand-green font-bold text-lg"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stockQty}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(item.stockQty, parseInt(e.target.value) || 1));
                          updateQuantity(item.id, val);
                        }}
                        className="w-12 text-center font-bold text-gray-900 bg-transparent border-0 outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(item.stockQty, item.quantity + 1))}
                        className="px-3 py-1 text-gray-600 hover:text-brand-green font-bold text-lg"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price & Remove */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm transition"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)} items):</span>
                  <span className="font-semibold">₹{items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="font-semibold">₹100</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (estimated):</span>
                  <span className="font-semibold">₹{(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.05).toFixed(0)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between text-2xl font-bold text-gray-900 mb-2">
                  <span>Total:</span>
                  <span className="text-brand-green">₹{(items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 100 + (items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.05)).toFixed(0)}</span>
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-dark-green transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 mb-3"
              >
                {loading ? '⏳ Processing...' : '✓ Proceed to Checkout'}
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full border-2 border-brand-green text-brand-green py-3 rounded-lg font-semibold hover:bg-light-green transition transform hover:scale-105 mb-3"
              >
                ← Continue Shopping
              </button>

              <button
                onClick={() => clearCart()}
                className="w-full border-2 border-red-400 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition text-sm"
              >
                🗑️ Clear Cart
              </button>

              {/* Info Box */}
              <div className="mt-6 bg-light-green rounded-lg p-4 text-sm text-gray-700">
                <p className="mb-2 font-semibold text-brand-green">💚 Secure Checkout</p>
                <p>Your books are reserved for 30 minutes. Complete your purchase to confirm order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
