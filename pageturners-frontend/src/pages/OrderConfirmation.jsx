import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get data from location state or localStorage
    if (location.state?.orderData) {
      setOrderData({
        id: location.state.orderId,
        ...location.state.orderData
      });
    } else {
      // Try to get from localStorage (in case of page reload)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      if (orders.length > 0) {
        // Get the most recent order
        setOrderData(orders[orders.length - 1]);
      }
    }
    setLoading(false);
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 text-lg mb-8">We couldn't find your order details.</p>
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const estimatedDelivery = new Date(new Date(orderData.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-brand-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4 animate-bounce">✓</div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-green-100 text-lg">Thank you for your purchase</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-gray-200">
            {/* Order Number & Date */}
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">ORDER NUMBER</p>
              <p className="text-2xl font-bold text-gray-900 font-mono">{orderData.id}</p>
              <p className="text-gray-600 text-sm mt-2">
                Placed on {formatDate(orderData.createdAt)}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-1">ORDER STATUS</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                  ✓ {orderData.status || 'CONFIRMED'}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Estimated delivery: {estimatedDelivery.toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📍</span> Delivery Address
            </h2>
            <div className="bg-light-green rounded-lg p-4">
              <p className="font-semibold text-gray-900">
                {orderData.deliveryAddress?.firstName} {orderData.deliveryAddress?.lastName}
              </p>
              <p className="text-gray-700">{orderData.deliveryAddress?.address}</p>
              <p className="text-gray-700">
                {orderData.deliveryAddress?.city}, {orderData.deliveryAddress?.state} {orderData.deliveryAddress?.zipCode}
              </p>
              <p className="text-gray-700">{orderData.deliveryAddress?.country}</p>
              {orderData.deliveryAddress?.email && (
                <p className="text-gray-600 text-sm mt-2">Email: {orderData.deliveryAddress?.email}</p>
              )}
              {orderData.deliveryAddress?.phone && (
                <p className="text-gray-600 text-sm">Phone: {orderData.deliveryAddress?.phone}</p>
              )}
            </div>
          </div>

          {/* Items Ordered */}
          <div className="mb-8 pb-8 border-b-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📚</span> Items Ordered ({orderData.items?.length || 0})
            </h2>
            <div className="space-y-3">
              {orderData.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                    <p className="text-gray-600 text-xs">₹{item.price.toFixed(0)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💰</span> Payment Summary
            </h2>
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{orderData.amounts?.subtotal?.toFixed(0) || '0'}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (5%):</span>
                <span className="font-semibold">₹{orderData.amounts?.tax?.toFixed(0) || '0'}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-semibold">₹{orderData.amounts?.shipping || '0'}</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-3 flex justify-between text-2xl font-bold">
                <span className="text-gray-900">Total Amount Paid:</span>
                <span className="text-brand-green">₹{orderData.amounts?.total?.toFixed(0) || '0'}</span>
              </div>
            </div>

            {/* Payment Status Badge */}
            <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-600 rounded-lg">
              <p className="text-green-700 font-semibold flex items-center gap-2">
                <span>✓</span> Payment Successful
              </p>
              <p className="text-green-600 text-sm mt-1">
                This is a demo store. Your order has been simulated. Payment status: PAID
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="font-bold text-gray-900 mb-2">Processing</h3>
            <p className="text-gray-600 text-sm">Your order is being prepared for shipment</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold text-gray-900 mb-2">Shipping</h3>
            <p className="text-gray-600 text-sm">Expected delivery: 3-5 business days</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-3">📬</div>
            <h3 className="font-bold text-gray-900 mb-2">Delivery</h3>
            <p className="text-gray-600 text-sm">Receive your books at the address above</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/shop')}
            className="bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-dark-green transition text-lg"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="border-2 border-brand-green text-brand-green py-3 rounded-lg font-bold hover:bg-light-green transition text-lg"
          >
            View All Orders
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 p-4 bg-light-green rounded-lg text-center">
          <p className="text-gray-700 mb-2">Need help with your order?</p>
          <p className="text-brand-green font-semibold">📧 support@dustyshelves.in | 📞 +91-1800-BOOKS-01</p>
          <p className="text-gray-600 text-sm mt-2">Available Monday - Sunday, 9 AM - 6 PM IST</p>
        </div>
      </div>
    </div>
  );
}
