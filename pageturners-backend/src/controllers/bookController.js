import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 100, category, search, sortBy = 'createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const where = { status: 'ACTIVE' };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search } },
            { author: { contains: search } },
            { description: { contains: search } }
          ]
        }
      ];
    }

    const orderByObj = {};
    try {
      orderByObj[sortBy] = 'desc';
    } catch {
      orderByObj['createdAt'] = 'desc';
    }

    const books = await prisma.book.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        price: true,
        condition: true,
        imageUrl: true,
        rating: true,
        reviewCount: true,
        category: true,
        stockQty: true,
        description: true
      },
      orderBy: orderByObj
    });

    const total = await prisma.book.count({ where });

    res.json({
      success: true,
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getFeaturedBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { status: 'ACTIVE' },
      take: 8,
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        price: true,
        condition: true,
        imageUrl: true,
        rating: true,
        reviewCount: true,
        category: true
      },
      orderBy: { rating: 'desc' }
    });

    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, avatar: true, email: true }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            user: { select: { name: true, avatar: true } },
            createdAt: true
          }
        }
      }
    });

    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, icon: true }
    });

    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { q, category } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ success: false, error: 'Search query too short' });
    }

    const where = { status: 'ACTIVE' };

    if (category) {
      where.category = category;
    }

    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { author: { contains: q, mode: 'insensitive' } }
    ];

    const books = await prisma.book.findMany({
      where,
      take: 20,
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        price: true,
        imageUrl: true,
        condition: true,
        category: true
      }
    });

    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.query;
    let where = { status: 'ACTIVE' };

    if (userId) {
      // Get user's favorite category from their purchases
      const userOrders = await prisma.order.findMany({
        where: { buyerId: userId },
        include: { items: { include: { book: true } } }
      });

      if (userOrders.length > 0) {
        const categories = {};
        userOrders.forEach(order => {
          order.items.forEach(item => {
            categories[item.book.category] = (categories[item.book.category] || 0) + 1;
          });
        });

        const topCategory = Object.keys(categories).sort((a, b) => categories[b] - categories[a])[0];
        if (topCategory) {
          where.category = topCategory;
        }
      }
    }

    const books = await prisma.book.findMany({
      where,
      take: 8,
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        price: true,
        imageUrl: true,
        condition: true,
        category: true,
        rating: true
      },
      orderBy: { rating: 'desc' }
    });

    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a new book listing (seller posting)
export const createBook = async (req, res) => {
  try {
    const { title, author, description, isbn, condition, price, category, language, pages } = req.body;
    const sellerId = req.user?.id; // From JWT token

    if (!sellerId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!title || !author || !price || !condition) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // For now, use placeholder image. Will wire Cloudinary later.
    const imageUrl = req.body.imageUrl || 'https://via.placeholder.com/300x400?text=Book+Cover';

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description: description || '',
        isbn: isbn || null,
        condition: condition.toUpperCase(),
        price: parseFloat(price),
        category: category || 'Uncategorized',
        language: language || 'English',
        pages: pages ? parseInt(pages) : null,
        imageUrl,
        sellerId,
        status: 'PENDING', // Admin must approve
        stockQty: 1,
        rating: 0,
        reviewCount: 0
      },
      include: {
        seller: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Book listing submitted for review',
      book
    });
  } catch (err) {
    console.error('Create book error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get seller's books
export const getSellerBooks = async (req, res) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const books = await prisma.book.findMany({
      where: { sellerId },
      select: {
        id: true,
        title: true,
        author: true,
        price: true,
        condition: true,
        imageUrl: true,
        status: true,
        createdAt: true,
        rating: true,
        reviewCount: true,
        stockQty: true,
        category: true,
        description: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, books });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const sellerId = req.user?.id;
    const { title, author, price, condition, status, stockQty, description, imageUrl } = req.body;

    // Check if book exists and belongs to seller
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    if (book.sellerId !== sellerId) {
      return res.status(403).json({ success: false, error: 'Unauthorized - you can only edit your own books' });
    }

    const updated = await prisma.book.update({
      where: { id: bookId },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(price && { price: parseFloat(price) }),
        ...(condition && { condition }),
        ...(status && { status }),
        ...(stockQty !== undefined && { stockQty: parseInt(stockQty) }),
        ...(description && { description }),
        ...(imageUrl && { imageUrl })
      }
    });

    res.json({ success: true, book: updated, message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const sellerId = req.user?.id;

    // Check if book exists and belongs to seller
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }

    if (book.sellerId !== sellerId) {
      return res.status(403).json({ success: false, error: 'Unauthorized - you can only delete your own books' });
    }

    await prisma.book.delete({ where: { id: bookId } });

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
