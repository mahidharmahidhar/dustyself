import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  processPayment,
  updateOrderStatus,
  trackOrder
} from '../controllers/orderController.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Create new order from cart
router.post('/:userId/create', createOrder);

// Get user's orders
router.get('/:userId', getOrders);

// Get specific order
router.get('/detail/:orderId', getOrderById);

// Track order status
router.get('/:orderId/track', trackOrder);

// Process payment for order
router.post('/:orderId/payment', processPayment);

// Update order status (admin only)
router.put('/:orderId/status', updateOrderStatus);

export default router;
