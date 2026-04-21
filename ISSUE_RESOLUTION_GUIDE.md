# ⚠️ Issue Resolution & Debugging Guide

## 🔴 Critical Issues (Block Development)

### Issue #1: "Cannot find module 'axios'"
**Error Message:**
```
ModuleNotFoundError: Cannot find module 'axios'
```

**Location:** Frontend (dusty-shelf/) when trying to make API calls

**Cause:** Axios is not installed in node_modules

**Fix (Step-by-Step):**
```bash
# Navigate to frontend directory
cd dusty-shelf

# Install axios
npm install axios

# Verify installation
npm list axios

# Output should show: axios@1.x.x
```

**Verify Fix:**
```bash
# Try importing in a test file
npm run dev

# Open browser and check console for errors
```

---

### Issue #2: "CORS Error: Access-Control-Allow-Origin"
**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/books' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Location:** Browser console when frontend tries to call backend

**Cause:** Backend CORS configuration doesn't allow frontend URL

**Diagnosis:**
```bash
# 1. Check what CORS is set to
grep -A 5 "cors(" pageturners-backend/src/server.js

# 2. Verify FRONTEND_URL in .env
cat pageturners-backend/.env | grep FRONTEND_URL
```

**Fix (Step-by-Step):**
```bash
# 1. Navigate to backend
cd pageturners-backend

# 2. Edit .env file
nano .env

# 3. Make sure this line exists:
# FRONTEND_URL=http://localhost:5173

# 4. Save file (Ctrl+X, Y, Enter)

# 5. Restart backend
pkill -f "node src/server.js"
npm start

# Backend should restart and show:
# 🚀 PageTurners API running on http://localhost:5000
```

**Verify Fix:**
```bash
# Test with curl (CORS doesn't apply)
curl http://localhost:5000/api/health

# If this works, then CORS was the issue
# Now test frontend - should work in browser
```

---

### Issue #3: "Cannot GET /api/books" (404 Error)
**Error Message:**
```
{
  "error": "Cannot GET /api/books",
  "status": 404
}
```

**Location:** When calling API endpoints

**Cause:** Route not registered or server restarted improperly

**Diagnosis:**
```bash
# 1. Check if backend is running
curl http://localhost:5000/api/health

# If error, backend crashed. Check logs:
# Look at terminal where you ran npm start

# 2. Verify routes are imported
grep -n "import.*routes" pageturners-backend/src/server.js

# 3. Verify routes are registered
grep -n "app.use.*routes" pageturners-backend/src/server.js
```

**Fix (Step-by-Step):**
```bash
# 1. Stop backend
pkill -f "node src/server.js"

# 2. Check for syntax errors
cd pageturners-backend
npm start 2>&1 | head -50

# 3. If errors appear, fix them (usually import issues)

# 4. If no errors, backend should be running

# 5. Test endpoint
curl http://localhost:5000/api/health

# Should return: {"status":"OK","timestamp":"..."}
```

---

### Issue #4: "Error: DATABASE_URL is not set"
**Error Message:**
```
Error: DATABASE_URL is not set in environment variables
```

**Location:** Backend startup

**Cause:** `.env` file missing or DATABASE_URL not defined

**Diagnosis:**
```bash
# Check if .env exists
ls -la pageturners-backend/.env

# Check DATABASE_URL is in .env
grep DATABASE_URL pageturners-backend/.env
```

**Fix (Step-by-Step):**
```bash
# 1. Create or edit .env in backend directory
cd pageturners-backend
cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key_min_32_chars_long_here_2024
JWT_EXPIRY=7d
EOF

# 2. Verify file was created
cat .env

# 3. Initialize database
npx prisma migrate dev --name init

# 4. Seed database
node scripts/seed.js

# 5. Start backend
npm start
```

---

### Issue #5: "Prisma Migrations Pending"
**Error Message:**
```
The following migrations have not yet been applied:
  - 20240101000000_init

Run this command to apply pending migrations:
  npx prisma migrate deploy
```

**Location:** Backend startup or when trying to run app

**Cause:** Database schema not synchronized with migrations

**Diagnosis:**
```bash
# Check pending migrations
npx prisma migrate status

# Output will show which migrations haven't been applied
```

**Fix (Step-by-Step):**
```bash
# 1. Navigate to backend
cd pageturners-backend

# 2. Option A: Apply pending migrations
npx prisma migrate deploy

# 2. Option B: Sync schema (for development)
npx prisma db push

# 3. Verify database is updated
npx prisma studio

# 4. Restart backend
npm start
```

---

## 🟠 Major Issues (Cause Feature Failure)

### Issue #6: "400 Books Already in Database"
**Symptom:** Database has books but API returns empty results

**Cause:** Books table has old data or incorrect schema

**Fix (Step-by-Step):**
```bash
# 1. Open Prisma Studio
cd pageturners-backend
npx prisma studio

# 2. Check Books table
# - Look at data
# - Check if ISBN column is empty
# - Check if status field is correct

# 3. If data looks wrong, reset database
npx prisma migrate reset

# 4. This will:
# - Drop all tables
# - Rerun migrations
# - Run seed script (if exists)

# 5. Verify new data
curl "http://localhost:5000/api/books?limit=1" | jq '.'
```

**Verify Fix:**
```bash
# Should return books with:
# - Valid title, author, isbn
# - Status: "ACTIVE"
# - Price > 0
# - Category in: UG, PG, Programming, Commerce, Mythology, Fiction
```

---

### Issue #7: "Book Images Show as Broken"
**Symptom:** Book cards display placeholder image instead of cover

**Cause:** ISBN not in database or Open Library API not accessible

**Diagnosis:**
```bash
# 1. Check if books have ISBN
npx prisma studio
# Navigate to Books → check ISBN column

# 2. Test Open Library API directly
BOOK_ISBN="1234567890"
curl "https://covers.openlibrary.org/b/isbn/$BOOK_ISBN-M.jpg" -I

# Should return 200 OK (not 404)

# 3. Check browser network tab
# DevTools → Network → Filter by "covers.openlibrary"
# Look at each image request Status
```

**Fix (Step-by-Step):**
```bash
# Option 1: Use valid ISBNs
# Ensure books in database have real ISBNs

# Option 2: Add fallback image
# In BookCard.jsx:
const imageUrl = book.isbn 
  ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
  : '/public/placeholder-book.jpg';

// Use img with onerror handler:
<img 
  src={imageUrl}
  onError={(e) => e.target.src = '/public/placeholder-book.jpg'}
/>

# Option 3: Store image URL in database
# Run migration to add imageUrl field
# Populate with Open Library URLs
# Update seed script to fetch real images
```

---

### Issue #8: "Login Returns 401 Unauthorized"
**Symptom:** After entering credentials, login fails with 401

**Cause:** User doesn't exist or password is incorrect

**Diagnosis:**
```bash
# 1. Verify user exists in database
npx prisma studio
# Check Users table - look for test user email

# 2. Check password is hashed
# In Users table, passwordHash should start with $2a$ or $2b$

# 3. Test wrong password
# This should also return 401 (good security)
```

**Fix (Step-by-Step):**
```bash
# Option 1: Register new user first
# Go to /register page
# Fill in name, email, password
# Submit form
# Should see success message and token

# Option 2: Create user via API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Option 3: Create user in Prisma Studio
# Users table → Add record:
# - id: generate with cuid()
# - name: "Test"
# - email: "test@example.com"
# - passwordHash: use bcrypt (see below)
# - role: "BUYER"

# To create bcrypt hash in Node.js:
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('TestPassword123', 12).then(h => console.log(h))"
# Copy the output (starts with $2a$) and paste in passwordHash
```

---

### Issue #9: "Cart Items Not Saving"
**Symptom:** Add item to cart, page refreshes, item is gone

**Cause:** User not logged in or token not saved

**Diagnosis:**
```bash
# 1. Check if user is logged in
# Open browser console:
localStorage.getItem('authToken')  // Should be a JWT token

# 2. Check token is valid
# Go to jwt.io and paste token
# Should show: userId, email, role

# 3. Check cart items were created
npx prisma studio
# Navigate to cart_items table
# Should show items with userId and bookId
```

**Fix (Step-by-Step):**
```bash
# 1. Ensure user is logged in first
# Test authentication flow

# 2. Check token storage
# In browser console:
const token = localStorage.getItem('authToken');
console.log('Token exists:', !!token);
console.log('Token:', token);

# 3. Verify user ID is included in token
// Copy and run this in console:
const token = localStorage.getItem('authToken');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log('User ID:', decoded.userId);

# 4. Clear cart and retry
// In frontend code, add:
// Cart should be cleared after successful order
// Or user can manually clear: localStorage.removeItem('cart')

# 5. Check API response
// In network tab, click cart add request
// Response should have status 200 or 201
// Body should show created cart item
```

---

### Issue #10: "500 Internal Server Error"
**Error Message:**
```
{
  "error": "Internal Server Error"
}
```

**Location:** Any API endpoint

**Cause:** Unhandled error in backend (SQL, validation, etc.)

**Diagnosis:**
```bash
# 1. Check backend terminal for error
# Look at console output where you ran npm start

# 2. Common backend errors:
# - Prisma: "Unknown arg `xyz`" → Schema mismatch
# - Prisma: "Foreign key constraint" → Invalid relation
# - JWT: "JsonWebTokenError" → Token format issue
# - Validation: "Missing required field" → Body validation

# 3. Enable debug logging
# Add to backend code:
console.error('DEBUG:', req.body);
console.error('ERROR:', error);
```

**Fix (Step-by-Step):**
```bash
# 1. Read backend logs carefully
# Look for red text starting with "Error:"

# 2. Common fixes:
# - Prisma error: Run migrations
#   npx prisma db push

# - Invalid ID: Use actual IDs from database
#   npx prisma studio → copy real ID

# - Missing field: Check API request body
#   Ensure all required fields are present

# - Auth error: Check token format
#   Should be: Bearer eyJhbGciOi...

# 3. Add error handling to frontend
// In API calls:
try {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    console.error('API Error:', error);
    return; // Stop execution
  }
  return await res.json();
} catch (err) {
  console.error('Network Error:', err);
}
```

---

## 🟡 Minor Issues (Reduce UX)

### Issue #11: "Loading Spinner Never Stops"
**Symptom:** Page shows loading spinner forever

**Cause:** API call never completes or returns without resolving promise

**Fix:**
```javascript
// Add timeout to fetch:
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Request timeout')), 5000)
);

const response = await Promise.race([
  fetch(url, options),
  timeout
]);

// Or set fetch timeout:
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

const response = await fetch(url, { 
  ...options, 
  signal: controller.signal 
});

clearTimeout(timeoutId);
```

---

### Issue #12: "UI Looks Broken (Wrong Colors)"
**Symptom:** Theme colors don't match design

**Cause:** Tailwind classes not being applied correctly

**Fix:**
```bash
# 1. Verify Tailwind is configured
cat tailwind.config.js

# Should include:
# content: ['./src/**/*.{js,jsx}']
# theme: { extend: { colors: { ... } } }

# 2. Rebuild Tailwind
npm run build

# 3. Clear browser cache
# Ctrl+Shift+Delete → Clear all

# 4. Hard refresh
# Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

# 5. Restart dev server
# Stop: Ctrl+C
# Start: npm run dev
```

---

### Issue #13: "Sidebar/Menu Not Responsive"
**Symptom:** Mobile view shows desktop layout

**Cause:** Missing responsive Tailwind classes

**Fix:**
```javascript
// Use Tailwind responsive prefixes:
<div className="hidden md:block">
  {/* Hidden on mobile, visible on medium+ */}
</div>

<div className="md:hidden">
  {/* Visible on mobile, hidden on medium+ */}
</div>

// Breakpoints:
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px
```

---

### Issue #14: "Category Filter Not Working"
**Symptom:** Filter button doesn't change books shown

**Cause:** Query parameter not sent to API

**Fix:**
```javascript
// Example with category filter:
const [category, setCategory] = useState('all');

const handleFilter = async (selectedCategory) => {
  setCategory(selectedCategory);
  
  const url = selectedCategory === 'all'
    ? 'http://localhost:5000/api/books'
    : `http://localhost:5000/api/books?category=${selectedCategory}`;
  
  const response = await fetch(url);
  const data = await response.json();
  setBooks(data.books);
};

// In UI:
<button onClick={() => handleFilter('Programming')}>
  Programming
</button>
```

---

### Issue #15: "Duplicate Code in Multiple Files"
**Symptom:** API calls scattered across components

**Fix (Create Service File):**
```javascript
// File: dusty-shelf/src/services/api.js

const API_BASE = 'http://localhost:5000/api';

export const apiService = {
  // Books
  getBooks: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetch(`${API_BASE}/books?${params}`).then(r => r.json());
  },

  getBook: (id) => {
    return fetch(`${API_BASE}/books/${id}`).then(r => r.json());
  },

  getCategories: () => {
    return fetch(`${API_BASE}/categories`).then(r => r.json());
  },

  // Auth
  register: (data) => {
    return fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json());
  },

  login: (email, password) => {
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json());
  },

  // Cart
  getCart: (userId, token) => {
    return fetch(`${API_BASE}/cart/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
  },

  addToCart: (userId, bookId, quantity, token) => {
    return fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, bookId, quantity })
    }).then(r => r.json());
  },
};

// Usage in components:
import { apiService } from '../services/api';

// Instead of:
fetch('http://localhost:5000/api/books')...

// Use:
apiService.getBooks({ category: 'Programming' })...
```

---

## 🔧 Quick Fix Commands

### Reset Everything
```bash
# Start fresh (WARNING: Deletes all data)
cd pageturners-backend

# Reset database
npx prisma migrate reset

# Restart backend
npm start
```

### Clear Cache & Reinstall
```bash
# Frontend
cd dusty-shelf
rm -rf node_modules package-lock.json
npm install
npm run dev

# Backend
cd pageturners-backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Check All Services Running
```bash
# Check backend health
curl http://localhost:5000/api/health

# Check frontend runs
curl http://localhost:5173

# Check database exists
ls -la pageturners-backend/prisma/dev.db
```

---

## 📞 Support Matrix

| Issue | Check First | If Still Fails |
|-------|-------------|---|
| API not responding | Backend running? | Check port 5000 |
| Books empty | Database seeded? | Run scripts/seed.js |
| Images broken | ISBN in DB? | Check covers.openlibrary.org |
| Auth fails | User exists? | Create via /register |
| Cart empty | Logged in? | Check localStorage token |
| Colors wrong | Tailwind built? | npm run build && restart |
| CORS error | FRONTEND_URL set? | Check .env and restart backend |
| 500 errors | Check backend logs | Copy error and search docs |

---

**Last Updated:** 2024-04-20  
**Status:** 🆘 Comprehensive Troubleshooting Ready
