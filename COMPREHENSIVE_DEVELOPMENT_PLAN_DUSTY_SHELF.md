# 🚀 DUSTY SHELF - Comprehensive Development & Debugging Plan
## Full-Stack E-Commerce Bookstore Implementation Guide

**Project**: Dusty Shelf  
**Status**: Active Development & Bug Fixes  
**Target**: Production-Ready Academic Demonstration  
**Last Updated**: April 20, 2026

---

## 📋 Table of Contents
1. [Pre-Flight Checklist](#pre-flight-checklist)
2. [Architecture Overview](#architecture-overview)
3. [Phase 1: Foundation & Infrastructure](#phase-1-foundation--infrastructure)
4. [Phase 2: Core Features](#phase-2-core-features)
5. [Phase 3: Authentication & Security](#phase-3-authentication--security)
6. [Phase 4: Book Management & Images](#phase-4-book-management--images)
7. [Phase 5: Shopping Cart & Checkout](#phase-5-shopping-cart--checkout)
8. [Phase 6: Delivery System & Order Tracking](#phase-6-delivery-system--order-tracking)
9. [Phase 7: UI/UX Polish & Responsiveness](#phase-7-uiux-polish--responsiveness)
10. [Phase 8: Testing & Quality Assurance](#phase-8-testing--quality-assurance)
11. [Deployment & Go-Live](#deployment--go-live)

---

## 🎯 Pre-Flight Checklist

### Environment Verification
```bash
# Verify Node.js version (required: 18+)
node --version

# Verify npm version
npm --version

# Verify SQLite/database tools
# (Project uses SQLite - no additional setup needed)

# Check workspace structure
# ✅ /dusty-shelf (Vite + React frontend)
# ✅ /pageturners-backend (Express backend)
# ✅ /pageturners-frontend (Alternative frontend - may consolidate)
```

### Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
- **Prettier - Code formatter** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)
- **Thunder Client** or **REST Client** (for API testing)
- **Prisma** (prisma.prisma)
- **SQLite Viewer** (qwtel.sqlite-viewer)

---

## 🏗️ Architecture Overview

### Current Stack
```
┌─────────────────────────────────────────────────────────┐
│                   DUSTY SHELF BOOKSTORE                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐          ┌──────────────────┐   │
│  │    FRONTEND      │          │    BACKEND       │   │
│  │ React + Vite     │◄────────►│ Express + Node   │   │
│  │ Port: 5173       │ API Calls│ Port: 5000       │   │
│  │ (dusty-shelf)    │          │ (pageturners-b)  │   │
│  └──────────────────┘          └──────────────────┘   │
│                                         │               │
│                                         ▼               │
│                              ┌──────────────────┐       │
│                              │   SQLite DB      │       │
│                              │ (prisma/dev.db)  │       │
│                              └──────────────────┘       │
│                                                         │
│  External Services:                                    │
│  • Open Library API (book covers via ISBN)            │
│  • Browser Geolocation API (delivery addresses)       │
│  • localStorage (cart & user session)                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
```
User Action → React Component → API Call → Express Endpoint → Prisma Query → SQLite → Response → State Update → UI Render
```

---

## 🔧 Phase 1: Foundation & Infrastructure

### Objective
Establish stable communication between frontend and backend, fix port mismatches, ensure both servers run reliably.

### 1.1 Fix Backend Configuration

**File**: `pageturners-backend/.env`

```env
# DATABASE
DATABASE_URL="file:./prisma/dev.db"

# SERVER
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173

# JWT (Generate secure secrets)
JWT_SECRET=your_jwt_secret_key_min_32_characters_here
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_characters_here
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d

# OPTIONAL: Google OAuth (for future implementation)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**Action Items**:
- [ ] Create `.env` file if it doesn't exist
- [ ] Generate secure JWT secrets (min 32 random characters)
- [ ] Verify DATABASE_URL points to correct SQLite path
- [ ] Ensure PORT=5000 and FRONTEND_URL=http://localhost:5173

### 1.2 Fix Frontend Configuration

**File**: `dusty-shelf/.env.local`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Dusty Shelf
VITE_STORE_LOCATION=Jain University, Jayanagar, Bangalore, India
VITE_STORE_COORDINATES=13.0350,77.6245
VITE_CURRENCY=INR
VITE_CURRENCY_SYMBOL=₹
```

**File**: `dusty-shelf/vite.config.js` - verify it has this structure:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

**Action Items**:
- [ ] Create `dusty-shelf/.env.local` with correct API base URL
- [ ] Verify vite.config.js has correct port and proxy settings
- [ ] Test that both services start without port conflicts

### 1.3 Backend Server Startup & Health Check

**File**: `pageturners-backend/src/server.js` - verify this structure:

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes (to be imported)
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

**Action Items**:
- [ ] Verify `server.js` has CORS and health check endpoint
- [ ] Test backend startup: `cd pageturners-backend && npm run dev`
- [ ] Test health check: `curl http://localhost:5000/api/health`

### 1.4 Database Initialization & Seeding

**Action Items**:
- [ ] Verify Prisma schema exists: `pageturners-backend/prisma/schema.prisma`
- [ ] Run migrations: `cd pageturners-backend && npx prisma migrate dev --name init`
- [ ] Populate database: `npm run seed` or `node scripts/seed.js`
- [ ] Verify database: `npx prisma studio` or use SQLite viewer

---

## 🎨 Phase 2: Core Features - Book Data & Categories

### Objective
Ensure books are properly fetched, displayed, and categorized. Fix data inconsistencies.

### 2.1 Backend: Book Endpoints

**File**: `pageturners-backend/src/routes/books.js`

```javascript
import express from 'express';
import { prisma } from '../config/prisma.js';

const router = express.Router();

// Get all books with filters
router.get('/', async (req, res) => {
  try {
    const { category, condition, search, skip = 0, take = 12 } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } }
      ];
    }

    const books = await prisma.book.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(take),
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        price: true,
        condition: true,
        category: true,
        description: true,
        imageUrl: true,
        createdAt: true
      }
    });

    const total = await prisma.book.count({ where });

    res.json({ books, total, skip: parseInt(skip), take: parseInt(take) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get featured books
router.get('/featured', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        price: true,
        condition: true,
        category: true,
        imageUrl: true
      }
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get categories list
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.book.findMany({
      select: { category: true },
      distinct: ['category']
    });
    const uniqueCategories = [...new Set(categories.map(c => c.category))];
    res.json(uniqueCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        title: true,
        author: true,
        isbn: true,
        price: true,
        condition: true,
        category: true,
        description: true,
        imageUrl: true
      }
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

**Action Items**:
- [ ] Create/update `pageturners-backend/src/routes/books.js` with above code
- [ ] Test endpoints with Thunder Client or curl:
  - `GET http://localhost:5000/api/books`
  - `GET http://localhost:5000/api/books/featured`
  - `GET http://localhost:5000/api/books/categories`

### 2.2 Frontend: Create API Service

**File**: `dusty-shelf/src/services/api.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = {
  // BOOKS
  getBooks: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/books?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  },

  getFeaturedBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/books/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured books');
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/books/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getBook: async (id) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) throw new Error('Failed to fetch book');
    return response.json();
  },

  // AUTH
  register: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  // CART
  getCart: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return response.json();
  },

  addToCart: async (userId, bookId, quantity = 1) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookId, quantity })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return response.json();
  },

  removeFromCart: async (userId, cartItemId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/remove/${cartItemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return response.json();
  },

  // ORDERS
  createOrder: async (orderData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  getOrders: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }
};
```

**Action Items**:
- [ ] Create `dusty-shelf/src/services/api.js` with above code
- [ ] Ensure API_BASE_URL matches environment variable

---

## 🔐 Phase 3: Authentication & Security

### Objective
Implement secure JWT-based authentication with email/password login and register.

### 3.1 Backend: Authentication Routes

**File**: `pageturners-backend/src/routes/auth.js`

```javascript
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

const router = express.Router();

// Helper: Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' }
  );
  return { accessToken, refreshToken };
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split('@')[0]
      }
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REFRESH TOKEN
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
```

**Action Items**:
- [ ] Install dependencies: `npm install bcryptjs jsonwebtoken`
- [ ] Create `pageturners-backend/src/routes/auth.js` with above code
- [ ] Test endpoints with Thunder Client or Postman

### 3.2 Frontend: Authentication Context & Hooks

**File**: `dusty-shelf/src/context/AuthContext.jsx`

```javascript
import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (email, password) => {
    try {
      setError(null);
      const data = await api.register(email, password);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await api.login(email, password);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**File**: `dusty-shelf/src/hooks/useAuth.js`

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Action Items**:
- [ ] Create/update `dusty-shelf/src/context/AuthContext.jsx`
- [ ] Create/update `dusty-shelf/src/hooks/useAuth.js`
- [ ] Update `dusty-shelf/src/App.jsx` to include `<AuthProvider>`

---

## 📚 Phase 4: Book Management & Images (ISBN-Based)

### Objective
Implement ISBN-based book image retrieval from Open Library API with fallback images.

### 4.1 Backend: Image URL Service

**File**: `pageturners-backend/src/services/imageService.js`

```javascript
export const getImageUrl = (isbn, fallbackImageUrl) => {
  if (isbn && isbn.trim()) {
    // Open Library ISBN cover API
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
  }
  // Fallback image
  return fallbackImageUrl || 'https://via.placeholder.com/300x400?text=No+Image';
};

export const validateImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
```

### 4.2 Backend: Update Book Endpoint

**File**: `pageturners-backend/src/routes/books.js` - Update the book response:

```javascript
import { getImageUrl } from '../services/imageService.js';

// Modify the books response:
const booksWithImages = books.map(book => ({
  ...book,
  imageUrl: getImageUrl(book.isbn, book.imageUrl)
}));

res.json({ 
  books: booksWithImages, 
  total, 
  skip: parseInt(skip), 
  take: parseInt(take) 
});
```

### 4.3 Frontend: BookCard Component with Image Handling

**File**: `dusty-shelf/src/components/BookCard.jsx`

```javascript
import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Toast from './Toast/Toast';

const BookCard = ({ book, onViewDetails }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddToCart = async () => {
    if (!user) {
      setToastMessage('Please login to add items to cart');
      setShowToast(true);
      return;
    }

    try {
      await addToCart(book.id, 1);
      setToastMessage(`✅ Added "${book.title}" to cart!`);
      setShowToast(true);
    } catch (error) {
      setToastMessage(`❌ Failed to add to cart: ${error.message}`);
      setShowToast(true);
    }
  };

  const fallbackImage = 'https://via.placeholder.com/300x400?text=No+Book+Image';
  const imageUrl = imageError ? fallbackImage : book.imageUrl;

  return (
    <>
      <div className="border rounded-lg shadow-md hover:shadow-xl transition-shadow p-3 bg-white">
        {/* Image Container */}
        <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-3">
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          {imageError && (
            <div className="flex items-center justify-center h-full bg-gray-200 text-gray-600">
              No Image Available
            </div>
          )}
        </div>

        {/* Book Information */}
        <div className="flex-grow">
          <h3 className="font-bold text-lg line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-1">by {book.author}</p>

          {/* Category & Condition */}
          <div className="flex gap-2 mb-2 text-xs">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {book.category}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {book.condition}
            </span>
          </div>

          {/* Price */}
          <div className="text-xl font-bold text-green-700 mb-3">
            ₹{book.price?.toLocaleString('en-IN')}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onViewDetails(book)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded transition"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default BookCard;
```

**Action Items**:
- [ ] Create `pageturners-backend/src/services/imageService.js`
- [ ] Update backend book endpoints to include image processing
- [ ] Update `dusty-shelf/src/components/BookCard.jsx` with image handling
- [ ] Test image loading with ISBN-based URLs

---

## 🛒 Phase 5: Shopping Cart & Checkout

### Objective
Implement functional cart, checkout process, and order creation.

### 5.1 Backend: Cart Routes

**File**: `pageturners-backend/src/routes/cart.js`

```javascript
import express from 'express';
import { prisma } from '../config/prisma.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Get cart items
router.get('/:userId', verifyAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parseInt(userId) },
      include: { book: true }
    });

    const total = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

    res.json({ cartItems, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to cart
router.post('/:userId/add', verifyAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId, quantity } = req.body;

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: parseInt(userId),
        bookId: parseInt(bookId)
      }
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
        include: { book: true }
      });
      return res.json(updated);
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: parseInt(userId),
        bookId: parseInt(bookId),
        quantity: quantity || 1
      },
      include: { book: true }
    });

    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from cart
router.delete('/:userId/remove/:cartItemId', verifyAuth, async (req, res) => {
  try {
    const { cartItemId } = req.params;

    await prisma.cartItem.delete({
      where: { id: parseInt(cartItemId) }
    });

    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear cart
router.post('/:userId/clear', verifyAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.cartItem.deleteMany({
      where: { userId: parseInt(userId) }
    });

    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

### 5.2 Frontend: Cart Context

**File**: `dusty-shelf/src/context/CartContext.jsx`

```javascript
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await api.getCart(user.id);
      setCartItems(data.cartItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (bookId, quantity = 1) => {
    try {
      setError(null);
      await api.addToCart(user.id, bookId, quantity);
      await loadCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setError(null);
      await api.removeFromCart(user.id, cartItemId);
      await loadCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const cartItemIds = cartItems.map(item => item.id);
      for (const id of cartItemIds) {
        await api.removeFromCart(user.id, id);
      }
      setCartItems([]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        reloadCart: loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
```

**File**: `dusty-shelf/src/hooks/useCart.js`

```javascript
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
```

**Action Items**:
- [ ] Create `pageturners-backend/src/middleware/auth.js` (JWT verification)
- [ ] Create `pageturners-backend/src/routes/cart.js`
- [ ] Create/update `dusty-shelf/src/context/CartContext.jsx`
- [ ] Create/update `dusty-shelf/src/hooks/useCart.js`
- [ ] Update `dusty-shelf/src/App.jsx` to include `<CartProvider>`

---

## 📦 Phase 6: Delivery System & Order Tracking

### Objective
Implement complete delivery system with geolocation support and order tracking.

### 6.1 Backend: Order Routes

**File**: `pageturners-backend/src/routes/orders.js`

```javascript
import express from 'express';
import { prisma } from '../config/prisma.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', verifyAuth, async (req, res) => {
  try {
    const { userId } = req;
    const { cartItems, deliveryAddress, latitude, longitude } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ error: 'Delivery address required' });
    }

    // Calculate total
    const orderTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: orderTotal,
        deliveryAddress,
        latitude: latitude || null,
        longitude: longitude || null,
        status: 'Placed',
        orderItems: {
          create: cartItems.map(item => ({
            bookId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { orderItems: { include: { book: true } } }
    });

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's orders
router.get('/user/:userId', verifyAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: { orderItems: { include: { book: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order
router.get('/:orderId', verifyAuth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { orderItems: { include: { book: true } } }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (admin only)
router.patch('/:orderId/status', verifyAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
      include: { orderItems: { include: { book: true } } }
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

### 6.2 Frontend: Checkout Component with Geolocation

**File**: `dusty-shelf/src/pages/Checkout.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { api } from '../services/api';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryAddress: ''
  });

  const [useGeolocation, setUseGeolocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setToastMessage('✅ Location obtained!');
          setShowToast(true);
          setLoading(false);
        },
        (error) => {
          setToastMessage(`❌ Error: ${error.message}`);
          setShowToast(true);
          setLoading(false);
        }
      );
    } else {
      setToastMessage('Geolocation not supported');
      setShowToast(true);
    }
  };

  const buildDeliveryAddress = () => {
    if (useGeolocation && location) {
      return `Coordinates: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    return `${formData.address}, ${formData.city}, ${formData.postalCode}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const deliveryAddress = buildDeliveryAddress();

      await api.createOrder({
        cartItems: cartItems.map(item => ({
          id: item.book.id,
          quantity: item.quantity,
          price: item.book.price
        })),
        deliveryAddress,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null
      });

      await clearCart();
      setToastMessage('✅ Order placed successfully!');
      setShowToast(true);

      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      setToastMessage(`❌ Error: ${error.message}`);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p>Please login to checkout</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.book.title} × {item.quantity}</span>
                <span>₹{(item.book.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Delivery Information</h2>

          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Geolocation Option */}
          <div className="border p-4 rounded">
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={useGeolocation}
                onChange={(e) => setUseGeolocation(e.target.checked)}
              />
              <span className="ml-2">Use Current Location</span>
            </label>

            {useGeolocation && (
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2"
              >
                {loading ? 'Getting Location...' : 'Get My Location'}
              </button>
            )}

            {location && (
              <p className="text-sm text-green-600">
                ✅ Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            )}
          </div>

          {!useGeolocation && (
            <>
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required={!useGeolocation}
              />

              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required={!useGeolocation}
              />

              <input
                type="text"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                required={!useGeolocation}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? <LoadingSpinner /> : 'Place Order'}
          </button>
        </form>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Checkout;
```

### 6.3 Frontend: Order Tracking Page

**File**: `dusty-shelf/src/pages/Orders.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await api.getOrders(user.id);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    'Placed': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-yellow-100 text-yellow-800',
    'Out for Delivery': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  if (!user) {
    return <div className="p-6">Please login to view orders</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div className="p-6">No orders yet</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-6 bg-white shadow">
            {/* Order Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold mb-3">Items:</h3>
              {order.orderItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm mb-2">
                  <span>{item.book.title} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="border-t pt-4">
              <p className="text-sm font-semibold">Delivery Address:</p>
              <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
            </div>

            {/* Total */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
```

**Action Items**:
- [ ] Create `pageturners-backend/src/routes/orders.js`
- [ ] Update Prisma schema to add Order and OrderItem tables
- [ ] Run migration: `npx prisma migrate dev`
- [ ] Create `dusty-shelf/src/pages/Checkout.jsx`
- [ ] Create `dusty-shelf/src/pages/Orders.jsx`
- [ ] Update `dusty-shelf/src/App.jsx` routing

---

## 🎨 Phase 7: UI/UX Polish & Responsiveness

### Objective
Create clean, professional UI with proper loading states, error handling, and responsive design.

### 7.1 Loading Spinner Component

**File**: `dusty-shelf/src/components/LoadingSpinner.jsx`

```javascript
import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export default LoadingSpinner;
```

### 7.2 Toast Component

**File**: `dusty-shelf/src/components/Toast/Toast.jsx`

```javascript
import React, { useEffect } from 'react';

const Toast = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
      {message}
    </div>
  );
};

export default Toast;
```

### 7.3 Updated Shop Page with Filters

**File**: `dusty-shelf/src/pages/Shop.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast/Toast';

const Shop = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    search: '',
    skip: 0,
    take: 12
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load books and categories
  useEffect(() => {
    loadBooks();
    loadCategories();
  }, [filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await api.getBooks(filters);
      setBooks(data.books);
    } catch (err) {
      setError(err.message);
      setToastMessage(`Error: ${err.message}`);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      skip: 0
    });
  };

  const conditions = ['Like New', 'Good', 'Acceptable'];

  if (error && !loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Shop</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search books..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="border px-4 py-2 rounded"
        />

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Condition Filter */}
        <select
          value={filters.condition}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Conditions</option>
          {conditions.map(cond => (
            <option key={cond} value={cond}>{cond}</option>
          ))}
        </select>

        {/* Reset Button */}
        <button
          onClick={() => setFilters({
            category: '',
            condition: '',
            search: '',
            skip: 0,
            take: 12
          })}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset Filters
        </button>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default Shop;
```

### 7.4 Updated About Page with Location Details

**File**: `dusty-shelf/src/pages/About.jsx`

```javascript
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const About = () => {
  const storeLocation = {
    name: 'Dusty Shelf - Jain University Campus',
    address: 'Jain University, Jayanagar Campus, Bangalore',
    city: 'Bangalore, India',
    coordinates: '13.0350°N, 77.6245°E',
    phone: '+91-XXXXXXXXXX',
    email: 'contact@dustyshelf.com',
    hours: 'Mon-Fri: 10:00 AM - 6:00 PM, Sat-Sun: 11:00 AM - 5:00 PM'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">About Dusty Shelf</h1>
          <p className="text-xl">Your trusted second-hand bookstore for students</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Dusty Shelf is dedicated to making quality education affordable for every student.
            We provide a curated collection of second-hand academic books, fiction, and reference materials at prices that won't break the bank.
            Located within Jain University's Jayanagar campus, we serve thousands of students with their reading needs.
          </p>
        </section>

        {/* What We Offer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">📚 Diverse Collection</h3>
              <p className="text-gray-600">UG & PG courses, programming books, commerce, fiction, and mythology</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">💰 Affordable Pricing</h3>
              <p className="text-gray-600">Save up to 60% on textbooks compared to new bookstore prices</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">✅ Quality Assurance</h3>
              <p className="text-gray-600">Like New, Good, and Acceptable condition ratings for transparency</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">🚚 Fast Delivery</h3>
              <p className="text-gray-600">Order online or visit our store on campus for immediate delivery</p>
            </div>
          </div>
        </section>

        {/* Store Location */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Visit Us</h2>
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-gray-600">{storeLocation.name}</p>
                  <p className="text-gray-600">{storeLocation.address}</p>
                  <p className="text-gray-600">{storeLocation.coordinates}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-gray-600">{storeLocation.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-gray-600">{storeLocation.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-gray-600">{storeLocation.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Book Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Book Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['UG Courses', 'PG Courses', 'Programming', 'Commerce', 'Mythology', 'Fiction'].map(cat => (
              <div key={cat} className="bg-blue-50 p-4 rounded text-center">
                <p className="font-semibold text-gray-800">{cat}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Why Choose Dusty Shelf?</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Carefully selected books for quality and relevance</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Transparent pricing with no hidden charges</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Easy online ordering with geolocation-based delivery</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Support local - buy from a student-run bookstore</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <span>Track your orders in real-time</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
```

**Action Items**:
- [ ] Create `dusty-shelf/src/components/LoadingSpinner.jsx`
- [ ] Create/update `dusty-shelf/src/components/Toast/Toast.jsx`
- [ ] Create/update `dusty-shelf/src/pages/Shop.jsx`
- [ ] Create/update `dusty-shelf/src/pages/About.jsx`
- [ ] Add Tailwind CSS animations to `dusty-shelf/tailwind.config.js`:

```javascript
// In theme.extend.animation
animation: {
  'fade-in': 'fadeIn 0.3s ease-in',
  'spin': 'spin 1s linear infinite'
},
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  }
}
```

---

## 8. Phase 8: Testing & Quality Assurance

### 8.1 API Testing Checklist

```markdown
## Backend API Tests

### Health Check
- [ ] GET /api/health → Returns 200 with status: "OK"

### Books API
- [ ] GET /api/books → Returns list of books with pagination
- [ ] GET /api/books?category=Programming → Filters by category
- [ ] GET /api/books?search=React → Search functionality works
- [ ] GET /api/books/featured → Returns featured books
- [ ] GET /api/books/categories → Returns unique categories
- [ ] GET /api/books/1 → Returns single book details

### Authentication
- [ ] POST /api/auth/register → Creates new user
- [ ] POST /api/auth/login → Returns JWT tokens
- [ ] POST /api/auth/refresh → Refreshes access token
- [ ] POST /api/auth/logout → Clears tokens

### Cart API
- [ ] POST /api/cart/1/add → Adds item to cart
- [ ] GET /api/cart/1 → Returns cart items
- [ ] DELETE /api/cart/1/remove/1 → Removes item from cart
- [ ] POST /api/cart/1/clear → Clears all items

### Orders API
- [ ] POST /api/orders → Creates order
- [ ] GET /api/orders/user/1 → Returns user orders
- [ ] GET /api/orders/1 → Returns single order
- [ ] PATCH /api/orders/1/status → Updates order status
```

### 8.2 Frontend Testing Checklist

```markdown
## Frontend UI Tests

### Pages
- [ ] Home page loads and displays featured books
- [ ] Shop page shows all books with correct images
- [ ] Shop filters work (category, condition, search)
- [ ] Cart page displays added items
- [ ] Checkout page shows form and geolocation option
- [ ] Orders page displays order history with status
- [ ] About page displays location and contact details
- [ ] Login/Register pages functional

### Features
- [ ] Add to cart requires login
- [ ] Cart totals calculate correctly
- [ ] Images load from Open Library ISBN URLs
- [ ] Geolocation retrieves user coordinates
- [ ] Loading spinner shows during API calls
- [ ] Error messages display properly
- [ ] Toast notifications appear on actions
- [ ] Prices display in ₹ format

### Responsive Design
- [ ] Mobile (320px) - all pages responsive
- [ ] Tablet (768px) - layout adjusts properly
- [ ] Desktop (1200px) - full width utilized
```

---

## 🚀 Deployment & Go-Live

### Final Checklist

**Before Deploying:**

- [ ] All environment variables set correctly
- [ ] Database seeded with 560+ books
- [ ] All API endpoints tested and working
- [ ] Frontend pages responsive on all devices
- [ ] Authentication flow complete
- [ ] Cart and checkout functional
- [ ] Order tracking working
- [ ] Images displaying correctly
- [ ] Error handling in place
- [ ] Loading states visible
- [ ] No console errors

**Production Setup:**

1. **Backend Deployment**
   ```bash
   # Set production environment
   NODE_ENV=production
   PORT=5000
   
   # Use production database (PostgreSQL recommended)
   DATABASE_URL=postgres://...
   
   # Generate secure JWT secrets
   JWT_SECRET=<32+ char random string>
   JWT_REFRESH_SECRET=<32+ char random string>
   
   # Start server
   npm run build
   npm start
   ```

2. **Frontend Deployment**
   ```bash
   # Build for production
   npm run build
   
   # Serve dist folder via web server (Nginx/Apache/Vercel)
   # Update VITE_API_BASE_URL to production backend URL
   ```

3. **Database**
   - Backup SQLite database
   - Or migrate to PostgreSQL for production
   - Run final migration: `npx prisma migrate deploy`

---

## 📞 Support & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| API calls blocked (CORS) | Verify `FRONTEND_URL` in backend `.env` |
| Images not loading | Check ISBN format, test Open Library URL directly |
| Cart not syncing | Ensure JWT token stored in localStorage |
| Orders not saving | Check backend order route authentication |
| Database empty | Run `npm run seed` in backend directory |
| Port already in use | Change port in `.env` or kill process |
| Geolocation blocked | Ask browser permission, test on HTTPS |

---

## 📊 Success Metrics

Your bookstore is **production-ready** when:

✅ Users can register and login  
✅ Browse 500+ books with working filters  
✅ See correct book images from Open Library  
✅ Add items to cart and checkout  
✅ Enter delivery address or use geolocation  
✅ Create and track orders  
✅ All prices display in ₹  
✅ No console errors  
✅ Responsive on mobile/tablet/desktop  
✅ All buttons functional and linked to APIs  

---

## 📅 Implementation Timeline

**Phase 1-3**: Foundation & Auth (2-3 hours)  
**Phase 4-5**: Books & Cart (2-3 hours)  
**Phase 6**: Delivery & Orders (2 hours)  
**Phase 7**: UI Polish (1-2 hours)  
**Phase 8**: Testing (1 hour)  

**Total: 9-12 hours** for full implementation

---

## 🎓 Academic Demonstration Notes

**For PCL Demo:**
- Demonstrate user registration and login
- Show book browsing with live category filters
- Add book to cart and complete checkout
- Show order tracking with status updates
- Highlight ISBN-based book images
- Display geolocation-based delivery
- Show database with 500+ books
- Emphasize clean, professional UI

**Key Talking Points:**
- Full-stack React + Node.js + SQLite
- JWT authentication for security
- RESTful API architecture
- Real-time data syncing
- Responsive design
- Open Library integration
- Browser geolocation API

---

**Status**: Ready for Implementation  
**Last Updated**: April 20, 2026  
**Next Step**: Begin Phase 1 - Foundation & Infrastructure
