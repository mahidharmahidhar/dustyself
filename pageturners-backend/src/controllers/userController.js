import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, avatar, bio } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(bio && { bio })
      }
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        book: { select: { title: true, imageUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1-5' });
    }

    // Check if user has purchased this book
    const purchase = await prisma.orderItem.findFirst({
      where: {
        bookId,
        order: { buyerId: userId }
      }
    });

    if (!purchase) {
      return res.status(403).json({ success: false, error: 'You can only review books you have purchased' });
    }

    const review = await prisma.review.upsert({
      where: { bookId_userId: { bookId, userId } },
      update: { rating, comment },
      create: { bookId, userId, rating, comment }
    });

    // Update book rating
    const avgRating = await prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
      _count: true
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        rating: avgRating._avg.rating || 0,
        reviewCount: avgRating._count
      }
    });

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
