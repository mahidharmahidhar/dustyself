import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/common/Button';
import { pageTransition } from '../utils/animations';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-24">
      <div className="max-w-screen-2xl mx-auto px-8">
        <motion.h1 className="text-4xl md:text-5xl font-serif italic text-blue-900 dark:text-blue-100 mb-12">
          Shopping Cart
        </motion.h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-3 md:space-y-4">
                {cart.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-slate-800 rounded-lg p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 items-start shadow-sm"
                  >
                    {/* Image */}
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-blue-900 dark:text-blue-100 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-1">
                        {item.author}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm md:text-base">
                        <span className="text-blue-900 dark:text-blue-100 font-semibold">
                          ₹{(item.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto">
                      {/* Quantity */}
                      <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1 flex-1 sm:flex-none">
                        <motion.button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 hover:bg-blue-900 hover:text-white dark:hover:bg-blue-400 dark:hover:text-blue-900 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="w-6 sm:w-8 text-center font-semibold text-blue-900 dark:text-blue-100 text-sm">
                          {item.quantity}
                        </span>
                        <motion.button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 hover:bg-blue-900 hover:text-white dark:hover:bg-blue-400 dark:hover:text-blue-900 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Remove */}
                      <motion.button
                        onClick={() => removeFromCart(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Continue Shopping */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Link to="/shop">
                  <Button variant="outline" className="flex items-center gap-2">
                    Continue Shopping
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 sticky top-24 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100">
                  Order Summary
                </h2>

                <div className="space-y-3 border-b border-slate-200 dark:border-blue-900/30 pb-6">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{parseFloat(getTotal()).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Tax</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Total
                  </span>
                  <span className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100">
                    ₹{parseFloat(getTotal()).toLocaleString('en-IN')}
                  </span>
                </div>

                <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>

                <motion.button
                  onClick={clearCart}
                  whileHover={{ scale: 1.02 }}
                  className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 rounded transition-colors text-sm font-medium"
                >
                  Clear Cart
                </motion.button>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h2 className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-4">
              Your cart is empty
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Start shopping to add books to your cart
            </p>
            <Link to="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
