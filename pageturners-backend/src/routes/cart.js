import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// Get user's cart
router.get('/:userId', getCart);

// Add item to cart
router.post('/:userId/add', addToCart);

// Update cart item quantity
router.put('/item/:itemId', updateCartItem);

// Remove item from cart
router.delete('/item/:itemId', removeFromCart);

// Clear entire cart
router.delete('/:userId/clear', clearCart);

export default router;
