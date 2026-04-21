import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getAllBooks,
  getFeaturedBooks,
  getBookById,
  getCategories,
  searchBooks,
  getRecommendations,
  createBook,
  getSellerBooks,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';

const router = express.Router();

// Public routes
router.get('/', getAllBooks);
router.get('/featured', getFeaturedBooks);
router.get('/search', searchBooks);
router.get('/recommendations', getRecommendations);
router.get('/categories/list', getCategories);
router.get('/:id', getBookById);

// Protected routes - Seller
router.post('/', authenticate, createBook);
router.get('/seller/my-books', authenticate, getSellerBooks);
router.put('/:bookId', authenticate, updateBook);
router.delete('/:bookId', authenticate, deleteBook);

export default router;
