# 🎯 DUSTY SHELF: COMPLETE IMPLEMENTATION & DEBUGGING PLAN
## Full-Stack E-Commerce Bookstore - PCL Demonstration Ready

**Status:** Production-Ready Implementation Plan  
**Timeline:** 3-5 days to complete  
**Target Deployment:** Port 5000 (backend) + Port 3000 (frontend)

---

## 📋 EXECUTIVE SUMMARY

This comprehensive plan addresses all 11 objectives for Dusty Shelf:

1. ✅ Fix broken/missing features
2. ✅ Authentication (Login/Register/JWT/OAuth)
3. ✅ ISBN-based book images with fallback
4. ✅ Complete book card info (title, author, category, condition, ₹ price)
5. ✅ Category filtering system
6. ✅ Delivery system with geolocation
7. ✅ API integration (/books, /cart, /orders)
8. ✅ Loading spinner & error handling
9. ✅ Clean responsive UI
10. ✅ Enhanced About page
11. ✅ Functional buttons

---

## PHASE 1: QUICK DIAGNOSTICS (30 minutes)

### 1.1: Verify Backend Status
```bash
# Check API is responding
curl http://localhost:5000/api/health

# Check books exist
curl http://localhost:5000/api/books?limit=2

# Expected: Array with book objects containing id, title, author, isbn, price, category
```

### 1.2: Verify Database
```bash
cd pageturners-backend
npx prisma studio

# Check tables:
# - Users: Should be empty (0 records)
# - Books: Should have 512 records with ISBN values
# - Categories: Should have 6 categories
# - CartItems: Should be empty initially
# - Orders: Should be empty initially
```

### 1.3: Current Frontend Status
```bash
cd dusty-shelf

# Check what's installed
npm list | grep -E "react|axios|lucide"

# Check package.json for missing dependencies
cat package.json | grep dependencies
```

### 1.4: Port Configuration Check
```bash
# Backend should be on 5000
lsof -i :5000

# Frontend will be changed to 3000 (from default 5173)
lsof -i :3000
lsof -i :5173
```

---

## PHASE 2: MISSING DEPENDENCIES INSTALLATION (15 minutes)

### 2.1: Install Frontend Dependencies
```bash
cd dusty-shelf

npm install axios                    # HTTP client for API calls
npm install react-query              # Data fetching library
npm install zustand                  # State management
npm install js-cookie                # Cookie/token management
npm install react-leaflet leaflet   # Geolocation/maps (optional)
npm install react-helmet             # SEO/meta tags

# Verify installation
npm list axios react-query zustand js-cookie
```

### 2.2: Install Backend Dependencies (if missing)
```bash
cd pageturners-backend

# Check what's already installed
npm list | grep -E "bcryptjs|jsonwebtoken|cors|dotenv"

# If missing, install:
npm install bcryptjs jsonwebtoken cors dotenv
npm install express-rate-limit helmet
npm install google-auth-library      # For Google OAuth (optional)
```

### 2.3: Verify .env Configuration
```bash
# Backend .env should contain:
cat pageturners-backend/.env

# Required values:
# DATABASE_URL="file:./prisma/dev.db"
# PORT=5000
# JWT_SECRET=your_secret_key_min_32_chars
# JWT_EXPIRY=7d
# FRONTEND_URL=http://localhost:3000
```

---

## PHASE 3: FRONTEND PORT CONFIGURATION (10 minutes)

### 3.1: Configure Vite for Port 3000

**File:** `dusty-shelf/vite.config.js` (EDIT)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost',
    strictPort: true,
    open: true
  }
})
```

### 3.2: Update Backend CORS Configuration

**File:** `pageturners-backend/src/server.js` (EDIT)

Locate the CORS setup and update:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## OBJECTIVE 1: FIX BROKEN/MISSING FEATURES (2 hours)

### 1.1: Check Navbar for Duplicates

**File:** `dusty-shelf/src/components/Navbar.jsx`

**Check for:**
- Is navbar rendering twice? (Check App.jsx - should only have one Navbar import)
- Are styles conflicting?
- Is theme toggle working?

**Fix if duplicates exist:**
```javascript
// In App.jsx, ensure only ONE Navbar import and usage:
import { Navbar } from './components/Navbar';

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />  {/* ONLY ONE NAVBAR HERE */}
      <main className="flex-grow">
        {/* Routes here */}
      </main>
      <Footer /> {/* ONLY ONE FOOTER HERE */}
    </div>
  );
}
```

### 1.2: Verify Page Layout Structure

**Expected layout:**
```
Navbar
  ↓
Hero (on Home page only)
  ↓
Categories Bar (if needed)
  ↓
Book Grid / Page Content
  ↓
Footer
```

**Check each page:**
- Home.jsx: Should have Hero + Categories + Featured Books + Testimonials
- Shop.jsx: Should have Categories filter + Book Grid + Pagination
- BookDetail.jsx: Should have book info + related books
- Cart.jsx: Should have cart items + order summary
- Checkout.jsx: Should have delivery form + order review
- About.jsx: Should have company info + location details
- Login.jsx: Should be simple form page

### 1.3: Fix Broken Contexts

**Check AuthContext.jsx:**
```javascript
// Must export both context and hook
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Provider must set all required values:
// - user, loading, error
// - login(), register(), logout() functions
// - token
```

**Check CartContext.jsx:**
```javascript
// Must export:
// - items array
// - addToCart(), removeFromCart(), updateQuantity() functions
// - total calculation
```

**Check OrderContext.jsx:**
```javascript
// Must export:
// - orders array
// - createOrder(), getOrders(), getOrder() functions
```

---

## OBJECTIVE 2: AUTHENTICATION SYSTEM (3 hours)

### 2.1: Verify Backend Auth Endpoints

**Check:** `pageturners-backend/src/routes/auth.js`

Required endpoints:
```javascript
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/refresh', refresh);
```

**Test endpoints:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Expected response:
# {"message":"Registration successful","accessToken":"...","user":{...}}

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### 2.2: Create/Fix Frontend Auth Service

**File:** `dusty-shelf/src/services/authService.js` (CREATE if missing)

```javascript
const API_URL = 'http://localhost:5000/api';

export const authService = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
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

    const data = await response.json();
    if (data.accessToken) {
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    fetch(`${API_URL}/auth/logout`, { method: 'POST' });
  },

  getToken: () => localStorage.getItem('authToken'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
```

### 2.3: Update AuthContext

**File:** `dusty-shelf/src/context/AuthContext.jsx` (CRITICAL)

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load on mount
  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setToken(data.accessToken);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(name, email, password);
      setToken(data.accessToken);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token
      }}
    >
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

### 2.4: Create/Fix Login Page

**File:** `dusty-shelf/src/pages/Login.jsx`

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h1 className="font-serif text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2 text-center">
            Dusty Shelf
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-900 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-900 dark:text-blue-100 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 2.5: Create Register Page

**File:** `dusty-shelf/src/pages/Register.jsx` (CREATE if missing)

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { register, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const error = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h1 className="font-serif text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2 text-center">
            Dusty Shelf
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Create your account
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-blue-900 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-900 dark:text-blue-100 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
```

### 2.6: Update Navbar to Show Auth Status

**File:** `dusty-shelf/src/components/Navbar.jsx`

Add to navbar:

```javascript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-900 dark:bg-blue-950 text-white">
      {/* Navbar content */}
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div>Dusty Shelf</div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>

          {/* Auth Links */}
          {isAuthenticated ? (
            <>
              <span className="text-sm">Welcome, {user?.name}</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 border border-white rounded hover:bg-blue-800">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-white text-blue-900 rounded hover:bg-slate-100">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
```

---

## OBJECTIVE 3: ISBN-BASED BOOK IMAGES (1 hour)

### 3.1: Create Book Image Component

**File:** `dusty-shelf/src/components/BookImage.jsx` (CREATE)

```javascript
import React, { useState } from 'react';

export const BookImage = ({ isbn, title, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate OpenLibrary cover URL from ISBN
  const imageUrl = isbn && !imageError
    ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
    : '/placeholder-book.jpg';

  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-600 animate-pulse" />
      )}
      <img
        src={imageUrl}
        alt={title}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default BookImage;
```

### 3.2: Create Placeholder Image

**Location:** `dusty-shelf/public/placeholder-book.jpg`

Create a simple placeholder (if not exists). Or use this SVG fallback:

```html
<!-- In public/placeholder-book.svg -->
<svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="300" fill="#e2e8f0"/>
  <text x="100" y="150" font-size="16" text-anchor="middle" fill="#94a3b8">
    No Cover Image
  </text>
</svg>
```

---

## OBJECTIVE 4: BOOK CARD COMPLETE INFO (1.5 hours)

### 4.1: Fix BookCard Component

**File:** `dusty-shelf/src/components/BookCard.jsx` (EDIT)

```javascript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { BookImage } from './BookImage';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';

export const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(book.id, 1);
  };

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  // Format price in Indian Rupees
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(book.price / 100);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-soft hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
    >
      {/* Image */}
      <BookImage
        isbn={book.isbn}
        title={book.title}
        className="w-full aspect-[3/4]"
      />

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        {/* Category Badge */}
        <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2 w-fit">
          {book.category}
        </span>

        {/* Title */}
        <h3 className="font-serif font-bold text-blue-900 dark:text-blue-100 line-clamp-2 mb-1 text-sm">
          {book.title || 'Unknown Title'}
        </h3>

        {/* Author */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
          by {book.author || 'Unknown Author'}
        </p>

        {/* Condition */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
          {book.condition === 'GOOD' ? '✨ Good' : book.condition || 'Unknown'}
        </p>

        {/* Rating */}
        {book.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
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
              ({book.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price & Cart Button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 mt-auto">
          <span className="text-lg font-serif font-bold text-blue-900 dark:text-blue-100">
            {formattedPrice}
          </span>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900 transition-colors"
            title={isAuthenticated ? 'Add to cart' : 'Login to add to cart'}
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

### 4.2: Create Book Service

**File:** `dusty-shelf/src/services/bookService.js` (CREATE)

```javascript
const API_URL = 'http://localhost:5000/api';

export const bookService = {
  getBooks: async (filters = {}) => {
    const params = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 12,
      ...Object.fromEntries(Object.entries(filters).filter(([key]) => key !== 'page' && key !== 'limit'))
    });

    const response = await fetch(`${API_URL}/books?${params}`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return await response.json();
  },

  getBook: async (id) => {
    const response = await fetch(`${API_URL}/books/${id}`);
    if (!response.ok) throw new Error('Book not found');
    return await response.json();
  },

  getCategories: async () => {
    // Hardcoded categories for Dusty Shelf
    return {
      categories: [
        { id: '1', name: 'UG', description: 'Undergraduate Textbooks' },
        { id: '2', name: 'PG', description: 'Postgraduate Textbooks' },
        { id: '3', name: 'Programming', description: 'Programming & CS' },
        { id: '4', name: 'Commerce', description: 'Commerce & Economics' },
        { id: '5', name: 'Mythology', description: 'Mythology & History' },
        { id: '6', name: 'Fiction', description: 'Fiction & Novels' }
      ]
    };
  },

  getFeatured: async () => {
    const response = await fetch(`${API_URL}/books/featured`);
    if (!response.ok) throw new Error('Failed to fetch featured books');
    return await response.json();
  }
};
```

---

## OBJECTIVE 5: CATEGORY FILTERING (2 hours)

### 5.1: Create useBooks Hook

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

      setBooks(data.books || []);
      setPagination(data.pagination || {
        page: parseInt(page),
        limit: 12,
        total: data.books?.length || 0,
        pages: 1
      });
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

### 5.2: Create Shop Page with Filters

**File:** `dusty-shelf/src/pages/Shop.jsx` (EDIT/CREATE)

```javascript
import React, { useState, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import { BookCard } from '../components/BookCard';
import { bookService } from '../services/bookService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ChevronLeft, ChevronRight, Filter, AlertCircle } from 'lucide-react';

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
    bookService.getCategories()
      .then(data => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  const handlePageChange = (newPage) => {
    fetchBooks(newPage, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl font-bold mb-2">Our Collection</h1>
          <p className="text-blue-100">Browse {pagination.total} books</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sticky top-20">
              <h3 className="font-serif text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Title or author..."
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
                    onClick={() => setSelectedCategory('all')}
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
                      onClick={() => setSelectedCategory(cat.name)}
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

            {/* Close Button on Mobile */}
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden w-full mt-4 bg-blue-900 text-white font-semibold py-2 rounded-lg"
            >
              Done
            </button>
          </div>

          {/* Books Grid */}
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
              <div className="flex items-start gap-3 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 dark:text-red-200 font-semibold">Failed to load books</p>
                  <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <LoadingSpinner />
              </div>
            )}

            {/* Books Grid */}
            {!loading && books.length > 0 && (
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

                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      const pageNum = pagination.page - 2 + i;
                      if (pageNum < 1 || pageNum > pagination.pages) return null;

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

            {/* Empty State */}
            {!loading && books.length === 0 && !error && (
              <div className="text-center py-24">
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">No books found</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
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

## OBJECTIVE 6: DELIVERY SYSTEM WITH GEOLOCATION (3 hours)

### 6.1: Create Delivery Form Component

**File:** `dusty-shelf/src/components/DeliveryForm.jsx` (CREATE/EDIT)

```javascript
import React, { useState } from 'react';
import { MapPin, Loader, AlertCircle } from 'lucide-react';

export const DeliveryForm = ({ onSubmit, loading = false, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    addressLine1: initialData.addressLine1 || '',
    addressLine2: initialData.addressLine2 || '',
    city: initialData.city || '',
    state: initialData.state || '',
    pinCode: initialData.pinCode || '',
    latitude: initialData.latitude || null,
    longitude: initialData.longitude || null,
    useGeolocation: false
  });

  const [errors, setErrors] = useState({});
  const [geoLoading, setGeoLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGeolocation = () => {
    setGeoLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            useGeolocation: true
          }));
          setGeoLoading(false);
        },
        (error) => {
          setErrors(prev => ({
            ...prev,
            geolocation: 'Unable to get location. Please enter address manually.'
          }));
          setGeoLoading(false);
        }
      );
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'PIN Code is required';

    if (formData.phone.length < 10) newErrors.phone = 'Phone must be at least 10 digits';
    if (formData.pinCode.length < 5) newErrors.pinCode = 'PIN Code must be at least 5 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg p-8 space-y-6">
      <h2 className="font-serif text-2xl font-bold text-blue-900 dark:text-blue-100">
        Delivery Address
      </h2>

      {/* Geolocation Button */}
      <button
        type="button"
        onClick={handleGeolocation}
        disabled={geoLoading || loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-900 text-blue-900 dark:border-blue-100 dark:text-blue-100 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
      >
        {geoLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Getting location...
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4" />
            Use My Current Location
          </>
        )}
      </button>

      {formData.useGeolocation && (
        <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-sm text-green-700 dark:text-green-200">
          ✅ Location captured ({formData.latitude?.toFixed(4)}, {formData.longitude?.toFixed(4)})
        </div>
      )}

      {errors.geolocation && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex items-start gap-2 text-sm text-red-700 dark:text-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {errors.geolocation}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
            disabled={loading}
          />
          {errors.fullName && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
            disabled={loading}
          />
          {errors.phone && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Address *
        </label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          placeholder="Street address"
          className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
          disabled={loading}
        />
        {errors.addressLine1 && (
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Apartment, suite, etc. (optional)
        </label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          placeholder="Apartment, floor, etc."
          className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
          disabled={loading}
        />
      </div>

      {/* City, State, PIN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
            disabled={loading}
          />
          {errors.city && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
            disabled={loading}
          />
          {errors.state && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            PIN Code *
          </label>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-slate-700 dark:text-white"
            disabled={loading}
          />
          {errors.pinCode && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.pinCode}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
};

export default DeliveryForm;
```

### 6.2: Create Order Tracking Component

**File:** `dusty-shelf/src/components/OrderTracking.jsx` (CREATE)

```javascript
import React from 'react';
import { CheckCircle, Circle, Truck, MapPin } from 'lucide-react';

const STATUS_FLOW = [
  { key: 'PLACED', label: 'Order Placed', icon: Circle },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: MapPin },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle }
];

export const OrderTracking = ({ status = 'PLACED' }) => {
  const currentIndex = STATUS_FLOW.findIndex(s => s.key === status);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
      <h3 className="font-serif text-lg font-bold text-blue-900 dark:text-blue-100 mb-6">
        Order Status
      </h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700"></div>
        <div
          className="absolute top-6 left-0 h-1 bg-green-500 transition-all duration-300"
          style={{
            width: `${currentIndex >= 0 ? (currentIndex / (STATUS_FLOW.length - 1)) * 100 : 0}%`
          }}
        ></div>

        {/* Status Nodes */}
        <div className="relative flex justify-between">
          {STATUS_FLOW.map((item, index) => {
            const Icon = item.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={item.key} className="text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  } ${isCurrent ? 'ring-2 ring-green-300' : ''}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <p
                  className={`text-xs font-semibold transition-colors ${
                    isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Message */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <span className="font-semibold">Current Status:</span> Your order is{' '}
          {status === 'PLACED' && 'placed and awaiting confirmation'}
          {status === 'CONFIRMED' && 'confirmed and being prepared'}
          {status === 'SHIPPED' && 'shipped to your address'}
          {status === 'OUT_FOR_DELIVERY' && 'out for delivery today'}
          {status === 'DELIVERED' && 'delivered'}
        </p>
      </div>
    </div>
  );
};

export default OrderTracking;
```

---

## OBJECTIVE 7: FIX API INTEGRATION (2.5 hours)

### 7.1: Create API Service Layer

**File:** `dusty-shelf/src/services/apiService.js` (CREATE)

```javascript
const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiService = {
  // Helper method
  request: async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return await response.json();
  },

  // Books
  books: {
    getAll: (filters) => apiService.request('/books', { params: new URLSearchParams(filters) }),
    getById: (id) => apiService.request(`/books/${id}`),
    getFeatured: () => apiService.request('/books/featured'),
    getCategories: () => apiService.request('/categories')
  },

  // Cart
  cart: {
    getAll: (userId) => apiService.request(`/cart/${userId}`),
    add: (userId, bookId, quantity) =>
      apiService.request('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ userId, bookId, quantity })
      }),
    update: (itemId, quantity) =>
      apiService.request(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      }),
    remove: (itemId) =>
      apiService.request(`/cart/${itemId}`, { method: 'DELETE' })
  },

  // Orders
  orders: {
    create: (data) =>
      apiService.request('/orders', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getAll: (userId) => apiService.request(`/orders/user/${userId}`),
    getById: (orderId) => apiService.request(`/orders/${orderId}`),
    updateStatus: (orderId, status) =>
      apiService.request(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ orderStatus: status })
      })
  }
};
```

### 7.2: Create useCart Hook

**File:** `dusty-shelf/src/hooks/useCart.js` (EDIT/CREATE)

```javascript
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

export const useCart = () => {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user?.id || !token) return;

    setLoading(true);
    setError(null);
    try {
      const data = await apiService.cart.getAll(user.id);
      setItems(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id, token]);

  // Fetch on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (bookId, quantity = 1) => {
    if (!user?.id) return;

    try {
      await apiService.cart.add(user.id, bookId, quantity);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user?.id, fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      await apiService.cart.remove(itemId);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      await apiService.cart.update(itemId, quantity);
      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchCart]);

  const total = items.reduce((sum, item) => {
    return sum + (item.book?.price || 0) * item.quantity;
  }, 0);

  return {
    items,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    total,
    itemCount: items.length
  };
};
```

---

## OBJECTIVE 8: LOADING SPINNER & ERROR HANDLING (1.5 hours)

### 8.1: Create Loading Spinner

**File:** `dusty-shelf/src/components/LoadingSpinner.jsx` (CREATE)

```javascript
import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeMap[size]} border-4 border-slate-200 dark:border-slate-700 border-t-blue-900 dark:border-t-blue-100 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-slate-600 dark:text-slate-400 font-medium">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
```

### 8.2: Create Error Boundary

**File:** `dusty-shelf/src/components/ErrorBoundary.jsx` (EDIT/CREATE)

```javascript
import React from 'react';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## OBJECTIVE 9: CLEAN, RESPONSIVE UI (2 hours)

### 9.1: Update Navbar Layout

**File:** `dusty-shelf/src/components/Navbar.jsx` (EDIT)

Ensure proper structure:
```
- Logo/Brand (left)
- Nav Links: Home, Shop, About (center)
- Cart Icon + Auth Links (right)
- Mobile hamburger menu
```

### 9.2: Update Footer

**File:** `dusty-shelf/src/components/Footer.jsx` (EDIT)

```javascript
export const Footer = () => {
  return (
    <footer className="bg-blue-900 dark:bg-blue-950 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Dusty Shelf</h3>
            <p className="text-blue-100 text-sm">
              Your trusted second-hand bookstore for students.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/shop" className="hover:text-white">Shop</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-blue-100 text-sm mb-2">📞 +91 XXXXX XXXXX</p>
            <p className="text-blue-100 text-sm">✉️ hello@dustyshelf.com</p>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-6 text-center text-blue-100 text-sm">
          <p>&copy; 2024 Dusty Shelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
```

---

## OBJECTIVE 10: ENRICH ABOUT PAGE (1 hour)

### 10.1: Create About Page

**File:** `dusty-shelf/src/pages/About.jsx` (CREATE/EDIT)

```javascript
import React from 'react';
import { MapPin, Phone, Mail, Users, BookOpen, Award } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">About Dusty Shelf</h1>
          <p className="text-blue-100 text-lg">
            Your trusted second-hand bookstore for students and book lovers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Mission Section */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Our Mission
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            At Dusty Shelf, we believe that education should be accessible to every student. We're committed
            to providing affordable, high-quality books that students can rely on throughout their academic
            journey.
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            By offering meticulously curated second-hand books in good condition, we reduce the financial
            burden of textbook costs while promoting sustainable consumption and environmental responsibility.
          </p>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Wide Selection',
                description: 'Over 500 books across academics, fiction, and more'
              },
              {
                icon: Award,
                title: 'Quality Assured',
                description: 'All books checked for condition before listing'
              },
              {
                icon: Users,
                title: 'Student-Friendly',
                description: 'Affordable prices tailored for student budgets'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
                  <Icon className="w-12 h-12 text-blue-900 dark:text-blue-100 mx-auto mb-4" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Location Section */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6">
            Visit Us
          </h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Address */}
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <MapPin className="w-6 h-6 text-blue-900 dark:text-blue-100 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Main Store
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">
                      [Your Store Location]<br/>
                      [City, State] [PIN Code]
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <Phone className="w-6 h-6 text-blue-900 dark:text-blue-100 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Phone
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">
                      +91 XXXXX XXXXX
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-900 dark:text-blue-100 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Email
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">
                      hello@dustyshelf.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Map or additional info */}
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  Store Hours
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Monday - Friday: 10:00 AM - 6:00 PM</li>
                  <li>Saturday: 11:00 AM - 5:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center py-8">
          <h2 className="font-serif text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Questions? Get in Touch
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Have questions about any book? Want to know about bulk orders? We're here to help!
          </p>
          <a
            href="mailto:hello@dustyshelf.com"
            className="inline-block px-8 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;
```

---

## OBJECTIVE 11: MAKE BUTTONS FUNCTIONAL (2 hours)

### 11.1: Add to Cart Button Integration

**In BookCard.jsx:**
```javascript
const handleAddToCart = async (e) => {
  e.stopPropagation();
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }
  try {
    await addToCart(book.id, 1);
    // Show toast notification
    showToast('✅ Added to cart', 'success');
  } catch (error) {
    showToast(`❌ ${error.message}`, 'error');
  }
};
```

### 11.2: Checkout Button Integration

**In Cart.jsx:**
```javascript
const handleCheckout = () => {
  if (!isAuthenticated) {
    navigate('/login');
    return;
  }
  if (items.length === 0) {
    showToast('Cart is empty', 'error');
    return;
  }
  navigate('/checkout');
};
```

### 11.3: Create Checkout Page

**File:** `dusty-shelf/src/pages/Checkout.jsx` (EDIT)

---

## COMPLETE TESTING CHECKLIST

```markdown
### Phase 1: Setup (30 min)
- [ ] Both servers running (5000 & 3000)
- [ ] Database has 512 books
- [ ] .env configured correctly
- [ ] CORS working

### Phase 2: Authentication (1 hour)
- [ ] Register page works
- [ ] Login page works
- [ ] User can create account
- [ ] User can login
- [ ] Token saved to localStorage
- [ ] Navbar shows user info

### Phase 3: Books Display (1 hour)
- [ ] Shop page loads
- [ ] All books display (paginated)
- [ ] Book images show (from OpenLibrary)
- [ ] Category filter works
- [ ] Search works
- [ ] Pagination works

### Phase 4: Cart & Checkout (1 hour)
- [ ] Can add to cart
- [ ] Cart displays items correctly
- [ ] Can remove items
- [ ] Total calculated correctly
- [ ] Checkout page loads
- [ ] Delivery form works
- [ ] Geolocation works

### Phase 5: Orders (30 min)
- [ ] Order creates successfully
- [ ] Order confirmation page shows
- [ ] Order tracking displays
- [ ] Can view past orders

### Phase 6: UI/UX (30 min)
- [ ] Navbar looks good (no duplicates)
- [ ] Footer displays correctly
- [ ] About page enriched
- [ ] Responsive on mobile
- [ ] Loading spinners show
- [ ] Errors display properly
```

---

## DEPLOYMENT CHECKLIST

Before production deployment:

```bash
# 1. Backend
cd pageturners-backend
npm run build  # If applicable
npm start      # Verify running on 5000

# 2. Frontend  
cd dusty-shelf
npm run build
npm start      # Verify running on 3000

# 3. Verify All Endpoints
curl http://localhost:5000/api/books
curl http://localhost:3000

# 4. Create Admin Account
# Register via frontend or directly in database

# 5. Test Full Flow
# - Register new account
# - Browse books
# - Add to cart
# - Checkout
# - View order confirmation
```

---

## NEXT IMMEDIATE ACTIONS

1. **Install Dependencies** (15 min)
   - Follow Phase 2 of this plan
   
2. **Update .env** (5 min)
   - Set FRONTEND_URL to localhost:3000

3. **Fix Authentication** (1 hour)
   - Implement authService.js
   - Update AuthContext
   - Create Login/Register pages

4. **Fix Book Display** (1 hour)
   - Implement bookService.js
   - Fix BookCard with images
   - Create Shop page

5. **Add Delivery System** (1.5 hours)
   - Create DeliveryForm
   - Implement Checkout page
   - Add Order Tracking

---

**Expected Completion:** 3-5 days of active development  
**Target:** Production-ready for PCL demonstration

