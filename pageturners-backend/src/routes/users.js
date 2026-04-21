import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getUserProfile,
  updateUserProfile,
  getUserReviews,
  addReview
} from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Get user profile
router.get('/:userId', getUserProfile);

// Update user profile
router.put('/:userId', updateUserProfile);

// Get user reviews
router.get('/:userId/reviews', getUserReviews);

// Add review for a book
router.post('/:userId/reviews', addReview);

export default router;
