import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            price: true,
            imageUrl: true,
            condition: true,
            stockQty: true
          }
        }
      }
    });

    const total = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

    res.json({ success: true, items: cartItems, total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId, quantity = 1 } = req.body;

    // Check if book exists and has stock
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found' });
    }
    if (book.stockQty < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient stock' });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_bookId: { userId, bookId } }
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
        include: { book: true }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, bookId, quantity },
        include: { book: true }
      });
    }

    res.json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be greater than 0' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { book: true }
    });

    res.json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.cartItem.deleteMany({ where: { userId } });

    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
