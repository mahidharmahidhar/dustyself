import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useOrder } from '../context/OrderContext';
import { DeliveryForm } from '../components/DeliveryForm';
import { GeolocationWidget } from '../components/GeolocationWidget';
import { pageTransition } from '../utils/animations';

const CheckoutStep = ({ number, title, isActive, isCompleted }) => (
  <motion.div className="flex items-center">
    <motion.div
      className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all ${isCompleted
        ? 'bg-green-500 text-white'
        : isActive
          ? 'bg-blue-900 text-white dark:bg-blue-400 dark:text-blue-900'
          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
        }`}
    >
      {isCompleted ? <Check className="w-5 h-5" /> : number}
    </motion.div>
    <span
      className={`ml-3 font-semibold transition-colors ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-slate-600 dark:text-slate-400'
        }`}
    >
      {title}
    </span>
  </motion.div>
);

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotal } = useCart();
  const { currentOrder, deliveryAddress, setDeliveryInfo, createOrder } = useOrder();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState('manual');

  if (cart.length === 0) {
    return (
      <motion.div {...pageTransition} className="min-h-screen bg-surface dark:bg-slate-900 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-8 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-serif italic text-blue-900 dark:text-blue-100 mb-4">
            Your cart is empty
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Add books to your cart before proceeding to checkout.
          </p>
          <motion.button
            onClick={() => navigate('/cart')}
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 bg-blue-900 dark:bg-blue-950 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all"
          >
            Back to Cart
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const handleContinueToDelivery = () => {
    setCurrentStep(2);
  };

  const handleDeliverySubmit = (formData) => {
    setDeliveryInfo(formData);
    setCurrentStep(3);
  };

  const handleLocationSelect = (coords) => {
    setDeliveryInfo(coords);
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress) {
      alert('Please provide delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          bookId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        deliveryAddress,
        totalAmount: parseFloat(getTotal()),
      };

      const order = await createOrder(orderData);
      navigate(`/order-confirmation/${order.orderId}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Checkout
        </motion.h1>

        <motion.div
          className="mb-8 md:mb-12 flex items-center justify-between gap-2 md:gap-4 text-xs sm:text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CheckoutStep number="1" title="Review Cart" isActive={currentStep === 1} isCompleted={currentStep > 1} />
          <div className="flex-grow h-0.5 md:h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <CheckoutStep
            number="2"
            title="Delivery"
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
          />
          <div className="flex-grow h-0.5 md:h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <CheckoutStep number="3" title="Summary" isActive={currentStep === 3} isCompleted={false} />
        </motion.div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 md:p-8 mb-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-6">
                  Review Your Order
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Book Image */}
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x120?text=No+Image';
                          }}
                        />
                      )}

                      {/* Book Details */}
                      <div className="flex-grow">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {item.author}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t border-slate-300 dark:border-slate-600 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">₹{getTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Shipping:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 dark:border-slate-600 pt-2 mt-2">
                    <span className="font-bold text-blue-900 dark:text-blue-100">Total:</span>
                    <span className="font-bold text-lg text-blue-900 dark:text-blue-100">₹{getTotal()}</span>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleContinueToDelivery}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-blue-900 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-600 transition-all"
              >
                Continue to Delivery
              </motion.button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 mb-8"
            >
              {/* Delivery Options */}
              <div className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={showAddressOptions === 'manual'}
                      onChange={() => setShowAddressOptions('manual')}
                      className="w-4 h-4"
                    />
                    <span className="text-blue-900 dark:text-blue-100 font-semibold">
                      Enter Address Manually
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={showAddressOptions === 'geolocation'}
                      onChange={() => setShowAddressOptions('geolocation')}
                      className="w-4 h-4"
                    />
                    <span className="text-blue-900 dark:text-blue-100 font-semibold">
                      Use Current Location
                    </span>
                  </label>
                </div>

                {showAddressOptions === 'manual' && (
                  <DeliveryForm onSubmit={handleDeliverySubmit} loading={loading} />
                )}

                {showAddressOptions === 'geolocation' && (
                  <GeolocationWidget onLocationSelect={handleLocationSelect} />
                )}
              </div>

              {/* Back Button */}
              <motion.button
                onClick={() => setCurrentStep(1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 border border-blue-900 dark:border-blue-400 text-blue-900 dark:text-blue-100 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                Back to Review
              </motion.button>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 md:p-8 mb-8">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-6">
                  Order Summary
                </h2>

                {/* Items Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
                    Items ({cart.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-semibold text-blue-900 dark:text-blue-100">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-6 pb-6 border-b border-slate-300 dark:border-slate-600">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Delivery Address
                  </h3>
                  {deliveryAddress && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {deliveryAddress.fullName && (
                        <p><strong>{deliveryAddress.fullName}</strong></p>
                      )}
                      {deliveryAddress.addressLine1 && (
                        <p>{deliveryAddress.addressLine1}</p>
                      )}
                      {deliveryAddress.addressLine2 && (
                        <p>{deliveryAddress.addressLine2}</p>
                      )}
                      {deliveryAddress.city && deliveryAddress.pinCode && (
                        <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.pinCode}</p>
                      )}
                      {deliveryAddress.phone && (
                        <p>Phone: {deliveryAddress.phone}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">₹{getTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Shipping:</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-100">Free</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 dark:border-slate-600 pt-2 mt-2">
                    <span className="font-bold text-blue-900 dark:text-blue-100">Total:</span>
                    <span className="font-bold text-lg text-blue-900 dark:text-blue-100">₹{getTotal()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full px-6 py-3 bg-green-600 dark:bg-green-700 text-white rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </motion.button>

                  <motion.button
                    onClick={() => setCurrentStep(2)}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full px-6 py-3 border border-blue-900 dark:border-blue-400 text-blue-900 dark:text-blue-100 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Edit Delivery
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Checkout;
