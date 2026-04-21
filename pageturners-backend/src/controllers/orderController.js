import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { deliveryAddress, city, state, zipCode, latitude, longitude } = req.body;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { book: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        totalAmount,
        deliveryAddress,
        city,
        state,
        zipCode,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        orderStatus: 'PLACED',
        paymentStatus: 'PENDING',
        items: {
          createMany: {
            data: cartItems.map(item => ({
              bookId: item.bookId,
              quantity: item.quantity,
              priceAtPurchase: item.book.price
            }))
          }
        }
      },
      include: {
        items: { include: { book: true } },
        buyer: { select: { name: true, email: true } }
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { userId } });

    res.json({
      success: true,
      order,
      message: 'Order placed successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        items: { include: { book: { select: { title: true, imageUrl: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.order.count({ where: { buyerId: userId } });

    res.json({
      success: true,
      orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { book: true } },
        buyer: { select: { name: true, email: true, phone: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { method = 'card', amount } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Simulate payment processing
    const paymentId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const success = Math.random() > 0.1; // 90% success rate for demo

    if (success) {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          orderStatus: 'CONFIRMED'
        },
        include: { items: { include: { book: true } } }
      });

      res.json({
        success: true,
        payment: {
          paymentId,
          orderId,
          amount: order.totalAmount,
          method,
          status: 'COMPLETED',
          timestamp: new Date().toISOString()
        },
        order: updatedOrder,
        message: 'Payment processed successfully'
      });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED' }
      });

      res.status(400).json({
        success: false,
        error: 'Payment failed',
        payment: {
          paymentId,
          status: 'FAILED'
        }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus },
      include: { items: { include: { book: true } } }
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderStatus: true,
        paymentStatus: true,
        deliveryAddress: true,
        city: true,
        state: true,
        zipCode: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        items: { select: { quantity: true, book: { select: { title: true } } } }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const statusTimeline = {
      PLACED: order.createdAt,
      CONFIRMED: order.orderStatus !== 'PLACED' ? new Date(order.updatedAt) : null,
      SHIPPED: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus) ? new Date(order.updatedAt) : null,
      OUT_FOR_DELIVERY: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus) ? new Date(order.updatedAt) : null,
      DELIVERED: order.orderStatus === 'DELIVERED' ? new Date(order.updatedAt) : null
    };

    res.json({
      success: true,
      tracking: {
        orderId: order.id,
        currentStatus: order.orderStatus,
        statusTimeline,
        deliveryAddress: order.deliveryAddress,
        location: { latitude: order.latitude, longitude: order.longitude },
        items: order.items
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
