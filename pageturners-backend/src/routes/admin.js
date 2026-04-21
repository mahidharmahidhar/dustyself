import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Admin stats
router.get('/stats', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const [totalBooks, totalOrders, totalUsers, totalRevenue] = await Promise.all([
      prisma.book.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { totalAmount: true }
      })
    ]);

    res.json({
      stats: {
        totalBooks,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue._sum.totalAmount || 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve pending books
router.put('/books/:id/approve', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const book = await prisma.book.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE' }
    });

    res.json({ book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all pending books
router.get('/books/pending', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { status: 'PENDING' },
      include: { seller: { select: { name: true, email: true } } }
    });

    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get('/users', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
