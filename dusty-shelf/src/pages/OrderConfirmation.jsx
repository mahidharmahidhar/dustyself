import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Package, Calendar } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { pageTransition } from '../utils/animations';

export const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, clearCurrentOrder } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order details
    if (orderId) {
      const foundOrder = getOrder(orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [orderId, getOrder]);

  if (!order) {
    return (
      <motion.div {...pageTransition} className="min-h-screen bg-cream dark:bg-dark-brown pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 text-center py-16">
          <h1 className="text-3xl font-serif font-bold text-dark-brown dark:text-cream mb-4">
            Order Not Found
          </h1>
          <p className="text-neutral-gray dark:text-light-gray mb-8">
            We couldn't find your order. Please check the order ID.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-dark-brown text-cream rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-cream dark:bg-dark-brown pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-dark-brown dark:text-cream mb-3">
            Order Confirmed!
          </h1>
          <p className="text-lg text-neutral-gray dark:text-light-gray">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </motion.div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Order ID and Date */}
          <motion.div
            className="bg-white dark:bg-neutral-gray rounded-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-dark-brown dark:text-cream" />
              <h3 className="text-lg font-semibold text-dark-brown dark:text-cream">
                Order Details
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-neutral-gray dark:text-light-gray uppercase">
                  Order ID
                </p>
                <p className="text-lg font-mono font-bold text-dark-brown dark:text-cream break-all">
                  {order.orderId}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-gray dark:text-light-gray uppercase">
                  Order Date
                </p>
                <p className="text-dark-brown dark:text-cream">{formattedDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-gray dark:text-light-gray uppercase">
                  Status
                </p>
                <motion.div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-semibold mt-1 capitalize">
                  {order.status}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Order Total */}
          <motion.div
            className="bg-white dark:bg-neutral-gray rounded-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-dark-brown dark:text-cream" />
              <h3 className="text-lg font-semibold text-dark-brown dark:text-cream">
                Order Summary
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-gray dark:text-light-gray">Items ({order.items?.length})</span>
                <span className="font-semibold text-dark-brown dark:text-cream">
                  ₹{(
                    order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
                  ).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-gray dark:text-light-gray">Shipping</span>
                <span className="font-semibold text-dark-brown dark:text-cream">Free</span>
              </div>
              <div className="border-t border-light-gray dark:border-dark-brown pt-3 flex justify-between items-center">
                <span className="font-semibold text-dark-brown dark:text-cream">Total Amount</span>
                <span className="text-2xl font-serif font-bold text-dark-brown dark:text-cream">
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Items */}
        <motion.div
          className="bg-white dark:bg-neutral-gray rounded-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-serif font-bold text-dark-brown dark:text-cream mb-6">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items?.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-center justify-between pb-4 border-b border-light-gray dark:border-dark-brown last:border-b-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <div>
                  <p className="font-semibold text-dark-brown dark:text-cream">
                    Book ID: {item.bookId}
                  </p>
                  <p className="text-sm text-neutral-gray dark:text-light-gray">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-dark-brown dark:text-cream">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <motion.div
            className="bg-white dark:bg-neutral-gray rounded-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-dark-brown dark:text-cream" />
              <h2 className="text-2xl font-serif font-bold text-dark-brown dark:text-cream">
                Delivery Address
              </h2>
            </div>

            {order.deliveryAddress.fullName ? (
              <div className="space-y-3 text-neutral-gray dark:text-light-gray">
                <p>
                  <span className="font-semibold text-dark-brown dark:text-cream">Name:</span>{' '}
                  {order.deliveryAddress.fullName}
                </p>
                <p>
                  <span className="font-semibold text-dark-brown dark:text-cream">Phone:</span>{' '}
                  {order.deliveryAddress.phone}
                </p>
                <p>
                  <span className="font-semibold text-dark-brown dark:text-cream">Address:</span>{' '}
                  {order.deliveryAddress.addressLine1}
                  {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}
                </p>
                <p>
                  <span className="font-semibold text-dark-brown dark:text-cream">City/State:</span>{' '}
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}
                </p>
                <p>
                  <span className="font-semibold text-dark-brown dark:text-cream">PIN Code:</span>{' '}
                  {order.deliveryAddress.pinCode}
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-neutral-gray dark:text-light-gray">
                <p>
                  <span className="font-semibold text-dark-brown dark:text-cream">
                    Latitude:
                  </span>{' '}
                  {order.deliveryAddress.latitude?.toFixed(6)}°
                </p>
                <p>
                  <span className="font-semibold text-dark-brown dark:text-cream">
                    Longitude:
                  </span>{' '}
                  {order.deliveryAddress.longitude?.toFixed(6)}°
                </p>
                {order.deliveryAddress.accuracy && (
                  <p>
                    <span className="font-semibold text-dark-brown dark:text-cream">
                      Accuracy:
                    </span>{' '}
                    ±{Math.round(order.deliveryAddress.accuracy)} meters
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Order Tracking Timeline */}
        <motion.div
          className="bg-white dark:bg-neutral-gray rounded-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif font-bold text-dark-brown dark:text-cream mb-8">
            Order Tracking
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-light-gray dark:bg-dark-brown" />

            {/* Tracking Steps */}
            <div className="space-y-8">
              {[
                { step: 'Placed', description: 'Your order has been confirmed', active: true },
                { step: 'Shipped', description: 'Order is on the way to you', active: order.status !== 'placed' },
                { step: 'Out for Delivery', description: 'Order is out for delivery today', active: order.status === 'out_for_delivery' || order.status === 'delivered' },
                { step: 'Delivered', description: 'Order has been delivered', active: order.status === 'delivered' },
              ].map((track, idx) => (
                <motion.div
                  key={idx}
                  className="relative pl-16 flex flex-col"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    className={`absolute left-0 w-9 h-9 rounded-full border-4 flex items-center justify-center transition-all ${track.active
                        ? 'bg-green-500 border-green-600 dark:bg-green-600 dark:border-green-700'
                        : 'bg-light-gray dark:bg-neutral-gray border-light-gray dark:border-neutral-gray'
                      }`}
                    animate={{
                      boxShadow: track.active ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none'
                    }}
                  >
                    {track.active && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </motion.div>

                  {/* Step Content */}
                  <div>
                    <p className="font-semibold text-lg text-dark-brown dark:text-cream">
                      {track.step}
                    </p>
                    <p className="text-sm text-neutral-gray dark:text-light-gray">
                      {track.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <motion.div
            className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Current Status: <span className="capitalize">{order.status || 'placed'}</span>
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
              You will receive email updates as your order progresses through each stage.
            </p>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 bg-dark-brown text-cream rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 border border-dark-brown dark:border-cream text-dark-brown dark:text-cream rounded-lg font-semibold hover:bg-dark-brown hover:text-cream dark:hover:bg-cream dark:hover:text-dark-brown transition-all"
          >
            Print Order
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmation;
