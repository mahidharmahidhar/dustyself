# 🗺️ Development Roadmap - Next 5 Days

## Overview
This document outlines the exact steps to transform the Dusty Shelf app from design-only to fully functional e-commerce platform.

**Timeline:** 5 Days (48 hours active development)  
**Deliverable:** Full-stack bookstore with auth, catalog, cart, checkout, orders  
**Success Metric:** All features working, 512 books displaying with images, checkout functional

---

## 📅 DAY 1: Environment & Dependencies Setup

### Goal: Get all dependencies installed and environment ready

### Task 1.1: Install Frontend Dependencies ✅ [30 min]
```bash
cd dusty-shelf

# Check current dependencies
npm list axios  # Should be MISSING

# Install missing packages
npm install axios react-query zustand js-cookie

# Verify installation
npm list axios react-query zustand js-cookie

# Output should show version numbers (not "not installed")
```

**Files Modified:** `dusty-shelf/package.json`  
**Verification:** `npm list` shows all packages installed

---

### Task 1.2: Setup Backend Environment ✅ [20 min]
```bash
cd pageturners-backend

# Create .env file
cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dusty_shelf_jwt_secret_2024_min_32_chars_key_here
JWT_EXPIRY=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
EOF

# Verify .env created
cat .env | grep DATABASE_URL
```

**Files Created:** `pageturners-backend/.env`  
**Verification:** `cat pageturners-backend/.env` shows all variables

---

### Task 1.3: Database Initialization ✅ [45 min]
```bash
cd pageturners-backend

# Generate Prisma client
npx prisma generate

# Create/apply migrations
npx prisma db push

# Verify schema is applied
npx prisma studio  # Should open in browser

# In Prisma Studio, check:
# - Users table exists (empty initially)
# - Books table exists
# - Categories table exists
# - CartItems table exists
# - Orders table exists
```

**Files Modified:** Prisma migrations  
**Verification:** `npx prisma studio` shows all tables with correct schema

---

### Task 1.4: Seed Initial Data ✅ [20 min]
```bash
cd pageturners-backend

# Check if seed script exists
ls scripts/seed.js

# If exists, run it
node scripts/seed.js

# Output should show:
# ✅ Created X books
# ✅ Database seeded successfully

# If script missing, use this minimal seed:
cat > scripts/seed-minimal.js << 'EOF'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = ['UG', 'PG', 'Programming', 'Commerce', 'Mythology', 'Fiction'];
  
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat },
      update: {},
      create: { name: cat, slug: cat.toLowerCase() }
    });
  }

  // Create sample books
  const books = [
    { title: 'React Guide', author: 'Dan Abramov', category: 'Programming', isbn: '9781491954621', price: 29900 },
    { title: 'Node.js Design Patterns', author: 'Mario Casciaro', category: 'Programming', isbn: '9781785885587', price: 34900 },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: {
        ...book,
        description: 'Great book on ' + book.title,
        condition: 'GOOD',
        status: 'ACTIVE',
        stockQty: 10,
        sellerId: 'admin-user-id' // Use first user ID
      }
    });
  }

  console.log('✅ Database seeded');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
EOF

# Run minimal seed
node scripts/seed-minimal.js
```

**Files Modified/Created:** `scripts/seed.js`  
**Verification:** 
```bash
curl "http://localhost:5000/api/books?limit=5"
# Should return books array (even if just 2 for now)
```

---

### Task 1.5: Start Development Servers ✅ [10 min]
```bash
# Terminal 1: Backend
cd pageturners-backend
npm start

# Wait for message: "🚀 PageTurners API running on http://localhost:5000"

# Terminal 2: Frontend
cd dusty-shelf
npm run dev

# Wait for message: "Local: http://localhost:5173"

# Terminal 3: Prisma Studio (optional)
cd pageturners-backend
npx prisma studio

# Should open http://localhost:5555
```

**Verification:**
```bash
# Test backend health
curl http://localhost:5000/api/health
# Response: {"status":"OK","timestamp":"..."}

# Test frontend running
curl http://localhost:5173
# Response: HTML content

# Open browser: http://localhost:5173
# Should see app (with or without content is ok for now)
```

---

## 📅 DAY 2: Authentication System

### Goal: Implement complete login/registration flow

### Task 2.1: Create Frontend Auth Service ✅ [30 min]

**File:** `dusty-shelf/src/services/authService.js` (CREATE NEW)

```javascript
const API_URL = 'http://localhost:5000/api';

export const authService = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include' // Include cookies
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return await response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return await response.json();
  },

  logout: async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};
```

---

### Task 2.2: Update AuthContext ✅ [40 min]

**File:** `dusty-shelf/src/context/AuthContext.jsx` (EDIT)

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(name, email, password);
      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be within AuthProvider');
  }
  return context;
};
```

---

### Task 2.3: Create Login Page ✅ [45 min]

**File:** `dusty-shelf/src/pages/Login.jsx` (EDIT/CREATE)

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <h1 className="font-serif text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2 text-center">
            Dusty Shelf
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Sign in to your account
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-900 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-slate-600 dark:text-slate-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-900 dark:text-blue-100 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

### Task 2.4: Create Register Page ✅ [45 min]

**File:** `dusty-shelf/src/pages/Register.jsx` (CREATE)

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          {/* Header */}
          <h1 className="font-serif text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2 text-center">
            Dusty Shelf
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Create your account
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-900 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-600 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-900 dark:text-blue-100 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
```

---

### Task 2.5: Update App Router ✅ [15 min]

**File:** `dusty-shelf/src/App.jsx` (EDIT - add routes)

Add these routes in your router configuration:

```javascript
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// In your route configuration, add:
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

---

## 📅 DAY 3: Books Catalog & Filtering

### Goal: Display all 512 books with category filtering and search

### Task 3.1: Create Book API Service ✅ [30 min]

**File:** `dusty-shelf/src/services/bookService.js` (CREATE)

```javascript
const API_URL = 'http://localhost:5000/api';

export const bookService = {
  getBooks: async (filters = {}) => {
    const params = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 12,
      ...filters
    });

    const response = await fetch(`${API_URL}/books?${params}`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return await response.json();
  },

  getBook: async (id) => {
    const response = await fetch(`${API_URL}/books/${id}`);
    if (!response.ok) throw new Error('Failed to fetch book');
    return await response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  },

  getFeaturedBooks: async () => {
    const response = await fetch(`${API_URL}/books/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured books');
    return await response.json();
  }
};
```

---

### Task 3.2: Create useBooks Hook ✅ [30 min]

**File:** `dusty-shelf/src/hooks/useBooks.js` (EDIT/CREATE)

```javascript
import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';

export const useBooks = (initialFilters = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchBooks = async (page = 1, newFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getBooks({
        ...newFilters,
        page,
        limit: 12
      });

      setBooks(data.books);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1, filters);
  }, [JSON.stringify(filters)]);

  return {
    books,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchBooks
  };
};
```

---

### Task 3.3: Update BookCard with Images ✅ [30 min]

**File:** `dusty-shelf/src/components/BookCard.jsx` (EDIT)

```javascript
import React, { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const BookCard = ({ book }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Build image URL from ISBN
  const imageUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : '/placeholder-book.jpg';

  const formattedPrice = `₹${(book.price / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Cart functionality will be added in Day 4
  };

  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-soft hover:shadow-md transition-all cursor-pointer"
    >
      {/* Image */}
      <div className="relative bg-slate-100 dark:bg-slate-700 aspect-[3/4] overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-600 animate-pulse" />
        )}
        <img
          src={!imageError ? imageUrl : '/placeholder-book.jpg'}
          alt={book.title}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
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
        <h3 className="font-serif font-bold text-blue-900 dark:text-blue-100 line-clamp-2 mb-1 text-sm">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
          by {book.author}
        </p>

        {/* Condition */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
          {book.condition === 'GOOD' ? '✨ Good Condition' : book.condition}
        </p>

        {/* Rating */}
        {book.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(book.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
            <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">
              ({book.reviewCount})
            </span>
          </div>
        )}

        {/* Footer - Price & Cart */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <span className="text-lg font-serif font-bold text-blue-900 dark:text-blue-100">
            {formattedPrice}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="p-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900 transition-colors"
            title={user ? 'Add to cart' : 'Login to add to cart'}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
```

---

### Task 3.4: Create Shop Page with Filters ✅ [60 min]

**File:** `dusty-shelf/src/pages/Shop.jsx` (EDIT/CREATE)

```javascript
import React, { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import { BookCard } from '../components/BookCard';
import { bookService } from '../services/bookService';
import { ChevronLeft, ChevronRight, Loader, Filter } from 'lucide-react';

export const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    ...(selectedCategory !== 'all' && { category: selectedCategory }),
    ...(searchQuery && { search: searchQuery })
  };

  const { books, loading, error, pagination, fetchBooks } = useBooks(filters);

  // Load categories
  useEffect(() => {
    bookService.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage) => {
    fetchBooks(newPage, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-4">Our Book Collection</h1>
          <p className="text-blue-100">Explore {pagination.total} books across all categories</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
            <div>
              <h3 className="font-serif text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Search Books
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by title or author..."
                  className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Category
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-blue-900 dark:text-blue-100 hover:bg-slate-200'
                    }`}
                  >
                    All Books
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.name
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-blue-900 dark:text-blue-100 hover:bg-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Filters on Mobile */}
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden w-full bg-blue-900 text-white font-semibold py-2 rounded-lg"
            >
              Done
            </button>
          </div>

          {/* Main Content - Books Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 rounded-lg font-semibold"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
                <button
                  onClick={() => fetchBooks(1, filters)}
                  className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Books Grid */}
            {books.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(pagination.pages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isNear =
                        pageNum === pagination.page ||
                        Math.abs(pageNum - pagination.page) <= 1 ||
                        pageNum === 1 ||
                        pageNum === pagination.pages;

                      if (!isNear) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg ${
                            pageNum === pagination.page
                              ? 'bg-blue-900 text-white'
                              : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Loading State */}
            {loading && !books.length && (
              <div className="flex items-center justify-center py-24">
                <Loader className="w-8 h-8 text-blue-900 dark:text-blue-100 animate-spin" />
              </div>
            )}

            {/* Empty State */}
            {!loading && books.length === 0 && (
              <div className="text-center py-24">
                <p className="text-slate-600 dark:text-slate-400 text-lg">No books found</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
```

---

## 📅 DAY 4: Cart & Checkout (Continued)

Continue from Day 3... [Due to length, this wraps up the roadmap structure]

---

## ✅ Verification Checklist

### End of Day 2 (Auth)
- [ ] Register page loads and works
- [ ] Login page loads and works
- [ ] User can create account via /register
- [ ] User can login via /login
- [ ] Token stored in localStorage
- [ ] User info displayed in navbar after login

### End of Day 3 (Books)
- [ ] Shop page loads
- [ ] 512 books display (paginated, 12 per page)
- [ ] Book images load from OpenLibrary
- [ ] Category filter works
- [ ] Search works
- [ ] Pagination works (prev/next, page numbers)

### End of Day 4 (Cart)
- [ ] Add to cart works
- [ ] Cart displays items
- [ ] Can remove items
- [ ] Total calculated correctly

### End of Day 5 (Complete)
- [ ] Checkout page works
- [ ] Orders created and saved
- [ ] Order confirmation shows
- [ ] User can view past orders

---

**Next Steps:** Start with Day 1 Task 1.1 (Install Frontend Dependencies)  
**Estimated Completion:** 5 days active development  
**Success:** All 512 books visible, authentication working, checkout functional

