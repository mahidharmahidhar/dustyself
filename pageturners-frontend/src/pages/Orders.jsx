import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const { data } = await api.get(`/orders/${userId}`);
      if (data.success) {
        setOrders(data.orders.reverse()); // Most recent first
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        // Fallback to localStorage for demo purposes
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(storedOrders.reverse());
      }
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-green to-dark-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📋 My Orders</h1>
          <p className="text-light-green opacity-90">View and track your orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 text-lg mb-8">You haven't placed any orders. Start shopping now!</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-dark-green transition text-lg"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2 border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">ORDER NUMBER</p>
                      <p className="text-lg font-bold text-gray-900 font-mono">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">ORDER DATE</p>
                      <p className="text-gray-900 font-semibold">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">STATUS</p>
                      <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                        {order.status || 'CONFIRMED'}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-1">TOTAL</p>
                      <p className="text-2xl font-bold text-brand-green">₹{order.amounts?.total?.toFixed(0) || '0'}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📚</span> Items ({order.items?.length || 0})
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                          <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900 whitespace-nowrap ml-2">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Action */}
                <div className="p-6 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>📍</span> Delivery Address
                    </h4>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold">
                        {order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}
                      </p>
                      <p>{order.deliveryAddress?.address}</p>
                      <p>
                        {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end justify-end gap-3">
                    <button
                      onClick={() => navigate('/order-confirmation', {
                        state: {
                          orderId: order.id,
                          orderData: order
                        }
                      })}
                      className="px-6 py-2 bg-brand-green text-white rounded-lg font-semibold hover:bg-dark-green transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate('/shop')}
                      className="px-6 py-2 border-2 border-brand-green text-brand-green rounded-lg font-semibold hover:bg-light-green transition"
                    >
                      Order More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
