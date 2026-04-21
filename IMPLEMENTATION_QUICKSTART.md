# 📋 Implementation Quick-Start Guide

## 🚀 Getting Started - Step by Step

### Prerequisites Check
- [ ] Node.js 18+ installed
- [ ] npm or yarn available
- [ ] Git repository initialized
- [ ] Backend and frontend folders created
- [ ] Database initialized (SQLite with Prisma)

---

## 🔧 STEP 1: Install Missing Dependencies

### Frontend (dusty-shelf/)
```bash
cd dusty-shelf

# Install missing HTTP client
npm install axios

# Install additional utilities
npm install react-query  # For data fetching
npm install zustand      # For state management
npm install js-cookie    # For token management
npm install react-toastify # For notifications
```

### Backend (pageturners-backend/)
```bash
cd pageturners-backend

# Install missing dependencies if not present
npm install jsonwebtoken bcryptjs dotenv
npm install google-auth-library # For OAuth
npm install stripe  # For payments (optional)
```

---

## 🗄️ STEP 2: Database Schema & Migration

### Verify Prisma Schema
```bash
cd pageturners-backend

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# View database in UI
npx prisma studio
```

### Seed Initial Data
```bash
# The schema should have these categories:
# - UG (Undergraduate)
# - PG (Postgraduate)
# - Programming
# - Commerce
# - Mythology
# - Fiction

node scripts/seed.js
```

---

## 🔐 STEP 3: Authentication System

### Create `.env` file in backend

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRY=7d

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Backend: auth.controller.js
```javascript
// File: pageturners-backend/src/controllers/auth.js

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'BUYER'
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.json({
      message: 'Registration successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const passwordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Frontend: AuthContext.jsx
```javascript
// File: dusty-shelf/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 📚 STEP 4: Books API & ISBN Image Handling

### Backend: books.controller.js
```javascript
// File: pageturners-backend/src/controllers/books.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBooks = async (req, res) => {
  try {
    const { category, condition, priceMin, priceMax, search, page = 1, limit = 12 } = req.query;
    
    const where = { status: 'ACTIVE' };
    
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin);
      if (priceMax) where.price.lte = parseFloat(priceMax);
    }

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: { seller: { select: { id: true, name: true } } }
      }),
      prisma.book.count({ where })
    ]);

    // Add ISBN-based image URL
    const booksWithImages = books.map(book => ({
      ...book,
      imageUrl: book.isbn 
        ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
        : '/placeholder-book.jpg'
    }));

    res.json({
      books: booksWithImages,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await prisma.book.findUnique({
      where: { id },
      include: { 
        seller: { select: { id: true, name: true, avatar: true } },
        reviews: {
          include: { user: { select: { name: true, avatar: true } } }
        }
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Add ISBN-based image URL
    const bookWithImage = {
      ...book,
      imageUrl: book.isbn 
        ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
        : '/placeholder-book.jpg'
    };

    res.json(bookWithImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    // Hardcoded categories for Dusty Shelf
    const categories = [
      { id: '1', name: 'UG', slug: 'ug', description: 'Undergraduate Textbooks' },
      { id: '2', name: 'PG', slug: 'pg', description: 'Postgraduate Textbooks' },
      { id: '3', name: 'Programming', slug: 'programming', description: 'Programming & CS Books' },
      { id: '4', name: 'Commerce', slug: 'commerce', description: 'Commerce & Economics' },
      { id: '5', name: 'Mythology', slug: 'mythology', description: 'Mythology & History' },
      { id: '6', name: 'Fiction', slug: 'fiction', description: 'Fiction & Novels' }
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Frontend: useBooks Hook
```javascript
// File: dusty-shelf/src/hooks/useBooks.js

import { useState, useEffect } from 'react';

export const useBooks = (filters = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 12, ...filters });
      const res = await fetch(`http://localhost:5000/api/books?${params}`);
      
      if (!res.ok) throw new Error('Failed to fetch books');
      
      const data = await res.json();
      setBooks(data.books);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        pages: data.pages
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, [JSON.stringify(filters)]);

  return { books, loading, error, pagination, fetchBooks };
};
```

---

## 🛒 STEP 5: Cart Management

### Backend: cart.controller.js
```javascript
// File: pageturners-backend/src/controllers/cart.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addToCart = async (req, res) => {
  try {
    const { userId, bookId, quantity = 1 } = req.body;

    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_bookId: { userId, bookId } }
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      return res.json({ message: 'Cart updated', item: updated });
    }

    const item = await prisma.cartItem.create({
      data: { userId, bookId, quantity },
      include: { book: true }
    });

    res.json({ message: 'Added to cart', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { 
        book: true
      }
    });

    // Add ISBN-based images
    const itemsWithImages = cartItems.map(item => ({
      ...item,
      book: {
        ...item.book,
        imageUrl: item.book.isbn 
          ? `https://covers.openlibrary.org/b/isbn/${item.book.isbn}-M.jpg`
          : '/placeholder-book.jpg'
      }
    }));

    res.json(itemsWithImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Frontend: useCart Hook
```javascript
// File: dusty-shelf/src/hooks/useCart.js

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useCart = () => {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user?.id || !token) return;
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  const addToCart = useCallback(async (bookId, quantity = 1) => {
    if (!user?.id || !token) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id, bookId, quantity })
      });
      
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  }, [user?.id, token, fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  }, [token, fetchCart]);

  return { items, loading, fetchCart, addToCart, removeFromCart };
};
```

---

## 📦 STEP 6: Order & Checkout System

### Backend: orders.controller.js
```javascript
// File: pageturners-backend/src/controllers/orders.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, deliveryAddress, city, state, zipCode, latitude, longitude } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const book = await prisma.book.findUnique({ where: { id: item.bookId } });
      if (!book) throw new Error(`Book ${item.bookId} not found`);
      
      totalAmount += book.price * item.quantity;
      orderItems.push({
        bookId: item.bookId,
        quantity: item.quantity,
        priceAtPurchase: book.price
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        totalAmount,
        deliveryAddress,
        city,
        state,
        zipCode,
        latitude,
        longitude,
        orderStatus: 'PLACED',
        items: {
          createMany: { data: orderItems }
        }
      },
      include: { items: { include: { book: true } } }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { userId } });

    res.json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      include: { items: { include: { book: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { book: true } }, buyer: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { orderStatus }
    });

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## 🎯 STEP 7: Frontend Components - BookCard

```javascript
// File: dusty-shelf/src/components/BookCard.jsx

import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = React.useState(false);

  const handleAddToCart = () => {
    addToCart(book.id, 1);
  };

  // Format price in Indian Rupees
  const formattedPrice = `₹${(book.price || 0).toLocaleString('en-IN')}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-soft hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative bg-slate-100 dark:bg-slate-700 aspect-[3/4] overflow-hidden">
        <img
          src={!imageError ? book.imageUrl : '/placeholder-book.jpg'}
          alt={book.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2">
          {book.category}
        </span>

        {/* Title */}
        <h3 className="font-serif font-bold text-blue-900 dark:text-blue-100 line-clamp-2 mb-1">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
          {book.author}
        </p>

        {/* Condition */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
          Condition: {book.condition || 'Good'}
        </p>

        {/* Rating */}
        {book.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(book.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
            <span className="text-xs text-slate-600 dark:text-slate-400">
              ({book.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100">
            {formattedPrice}
          </span>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

## ✅ Implementation Checklist

### Phase 1: Backend Setup
- [ ] Install dependencies
- [ ] Setup `.env` file
- [ ] Migrate database
- [ ] Seed initial data
- [ ] Implement auth routes
- [ ] Implement books routes
- [ ] Implement cart routes
- [ ] Implement orders routes
- [ ] Test all endpoints

### Phase 2: Frontend Setup
- [ ] Install axios and dependencies
- [ ] Create API service
- [ ] Setup AuthContext
- [ ] Create Login/Register pages
- [ ] Create Books page
- [ ] Create BookCard component
- [ ] Create Category filter
- [ ] Create Cart page

### Phase 3: Integration
- [ ] Connect frontend to backend APIs
- [ ] Test authentication flow
- [ ] Test book loading
- [ ] Test cart operations
- [ ] Test checkout flow

### Phase 4: Polish
- [ ] Add error handling
- [ ] Add loading spinners
- [ ] Implement responsive design
- [ ] Fix UI bugs
- [ ] Test on mobile/tablet

---

## 🆘 Troubleshooting

### Books not loading?
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Check books in database: `npx prisma studio`
3. Check browser console for errors
4. Check CORS configuration in backend

### Images not showing?
1. Verify ISBN is present in database
2. Check Open Library covers URL format
3. Check fallback image path
4. Check CORS headers

### Authentication failing?
1. Check JWT_SECRET is set in `.env`
2. Check token is being stored in localStorage
3. Check Authorization header format
4. Check user password is hashed correctly

### Cart not persisting?
1. Check user ID is correct
2. Check database cart_items table
3. Check useCart hook dependencies
4. Check auth token is valid

---

## 📞 API Endpoints Reference

```
Authentication:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

Books:
GET /api/books (filters: category, condition, priceMin, priceMax, search, page, limit)
GET /api/books/:id
GET /api/categories

Cart:
GET /api/cart/:userId
POST /api/cart/add
PUT /api/cart/:itemId
DELETE /api/cart/:itemId

Orders:
POST /api/orders
GET /api/orders/:userId
GET /api/orders/:id
PUT /api/orders/:id/status
```

---

## 🎓 Expected Learning Outcomes

After implementing this plan, you will have:
- ✅ Full authentication system
- ✅ Dynamic book catalog with filters
- ✅ Working shopping cart
- ✅ Complete checkout flow
- ✅ Order tracking system
- ✅ Responsive UI/UX
- ✅ Error handling
- ✅ Production-ready code

---

**Last Updated:** 2026-04-20  
**Status:** 📋 Ready for Implementation
