# 🔧 DUSTY SHELF - Detailed Debugging & Troubleshooting Guide

**Project**: Dusty Shelf Full-Stack Bookstore  
**Purpose**: Quick resolution of common issues during development  

---

## 🆘 Quick Reference - Most Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Blank page on frontend | Backend not running | Start backend: `npm run dev` |
| CORS error in console | Port mismatch | Verify backend port is 5000 |
| "Cannot GET /api/books" | Books endpoint not created | Create `src/routes/books.js` |
| Images not showing | ISBN format wrong | Check book data, test URL directly |
| Cart won't persist | No CartProvider in App | Add `<CartProvider>` to App.jsx |
| Login fails silently | JWT secret missing | Add JWT secrets to `.env` |
| Database empty | Seeds not run | Run `npm run seed` |
| Port already in use | Another process using port | Kill process using that port |

---

## 1. INFRASTRUCTURE & SERVER ISSUES

### Issue 1.1: Backend Server Won't Start

**Error Message**: `Port 5000 already in use` or `EADDRINUSE`

**Step 1: Check what's using port 5000**
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Note the PID number

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Step 2: Verify .env file exists**
```bash
cd pageturners-backend
# Check if .env exists
dir .env

# If missing, create it:
# PORT=5000
# DATABASE_URL=file:./prisma/dev.db
# FRONTEND_URL=http://localhost:5173
# JWT_SECRET=your32charminimumrandomstringhere
# JWT_REFRESH_SECRET=your32charminimumrandomstringhere
```

**Step 3: Check Node modules**
```bash
# Reinstall if corrupted
rm -r node_modules package-lock.json
npm install
npm run dev
```

**Step 4: Verify server.js exists and has correct structure**
```javascript
// Should have:
import express from 'express';
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(...));
```

---

### Issue 1.2: Frontend Server Won't Start

**Error Message**: `Port 5173 already in use` or build errors

**Solution:**
```bash
cd dusty-shelf

# Check port
netstat -ano | findstr :5173

# Kill if needed
taskkill /PID <PID> /F

# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

### Issue 1.3: CORS Error: "Access to XMLHttpRequest blocked"

**Error in Browser Console**: 
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Root Cause**: Incorrect CORS configuration on backend

**Fix Steps:**

1. **Check backend .env**
   ```env
   FRONTEND_URL=http://localhost:5173  # ← Exactly this format
   ```

2. **Check server.js CORS setup**
   ```javascript
   import cors from 'cors';
   
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

3. **Restart backend server**
   ```bash
   # Kill and restart
   cd pageturners-backend
   npm run dev
   ```

4. **Clear browser cache**
   - Press F12 → Clear cache/cookies
   - Or use Incognito window

---

### Issue 1.4: "Cannot connect to localhost:5000"

**Error**: Browser shows connection refused

**Check If Backend is Running:**
```bash
# Terminal 1: Check if server started
# Look for: ✅ Server running on http://localhost:5000

# Terminal 2: Test health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...}
```

**If Not Running:**
```bash
cd pageturners-backend
npm run dev

# Look for errors in console
# Common: PORT in use, missing .env, Node modules issue
```

---

## 2. DATABASE & SEEDING ISSUES

### Issue 2.1: Database Empty (No Books)

**Symptom**: Frontend shows no books, API returns empty array

**Step 1: Check database file exists**
```bash
cd pageturners-backend/prisma
dir dev.db  # Should exist
```

**Step 2: Run seeds**
```bash
cd pageturners-backend

# Option A: npm script
npm run seed

# Option B: Node directly
node scripts/seed.js

# Should output: "✅ Seeding complete" or similar
```

**Step 3: Verify books were added**
```bash
# Use Prisma Studio
npx prisma studio

# Opens browser: http://localhost:5555
# Check "Book" table - should see 500+ records

# Or use direct query
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.book.count().then(c => {
  console.log(\`Total books: \${c}\`);
  process.exit();
});
"
```

**Step 4: Seed Script Issues**

If `npm run seed` fails:

```bash
# Check seed.js file exists
ls scripts/seed.js

# Read the script to understand what it does
cat scripts/seed.js

# Run with error details
node scripts/seed.js 2>&1

# If error about database not existing:
npx prisma migrate dev --name init

# Then try seeding again
npm run seed
```

---

### Issue 2.2: Prisma Migration Errors

**Error**: `npx prisma migrate dev` fails

**Solution:**

```bash
# Option 1: Reset database (loses all data)
npx prisma migrate reset
# Press 'y' when asked to confirm

# Option 2: Create new migration
npx prisma migrate dev --name <migration_name>

# Option 3: Push schema (development only)
npx prisma db push

# Then seed:
npm run seed
```

---

### Issue 2.3: Wrong Database Type

**Symptom**: Using wrong database (PostgreSQL vs SQLite)

**Check DATABASE_URL in .env:**
```env
# SQLite (correct for this project):
DATABASE_URL="file:./prisma/dev.db"

# NOT PostgreSQL:
DATABASE_URL="postgresql://user:password@localhost/dbname"
```

**Fix:** Update .env to use SQLite format

---

## 3. API ENDPOINT ISSUES

### Issue 3.1: "Cannot GET /api/books"

**Error**: 404 Not Found when calling API

**Root Cause**: Books route not created or not imported

**Fix Steps:**

1. **Verify route file exists**
   ```bash
   ls pageturners-backend/src/routes/books.js
   ```

2. **If missing, create it** (copy from plan document)

3. **Check route is imported in server.js**
   ```javascript
   import bookRoutes from './routes/books.js';
   app.use('/api/books', bookRoutes);
   ```

4. **Restart backend**
   ```bash
   npm run dev
   ```

5. **Test endpoint**
   ```bash
   curl http://localhost:5000/api/books
   ```

---

### Issue 3.2: API Returns Empty Array or Wrong Data

**Symptom**: `GET /api/books` returns `[]` or `{books: []}`

**Step 1: Check database has data**
```bash
npx prisma studio
# Check "Book" table
```

**Step 2: Debug the endpoint**

Create test file `test-api.js`:
```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const books = await prisma.book.findMany({
  take: 5
});

console.log('Books found:', books.length);
console.log('First book:', books[0]);

await prisma.$disconnect();
```

Run it:
```bash
node test-api.js
```

**Step 3: Check endpoint logic**

Books endpoint should have:
```javascript
router.get('/', async (req, res) => {
  const books = await prisma.book.findMany({ take: 12 });
  // NOT: res.json([]);  ← Wrong!
  res.json({ books });  // ← Correct format
});
```

---

### Issue 3.3: API Returns 401 Unauthorized

**Error**: Endpoint requires auth but token missing

**Solution for Protected Routes:**

```javascript
// In endpoint that requires auth:
router.post('/api/cart/:userId/add', verifyAuth, async (req, res) => {
  // verifyAuth middleware checks JWT token
});

// Frontend must send token:
const token = localStorage.getItem('token');
fetch('/api/cart/1/add', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 4. AUTHENTICATION ISSUES

### Issue 4.1: Login Returns 401 "Invalid Credentials"

**Symptom**: Correct email/password but login fails

**Check 1: User exists in database**
```bash
npx prisma studio
# Go to "User" table, verify user exists
```

**Check 2: Password hashing working**
```javascript
// In auth route:
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

**Check 3: Backend endpoint logic**
```javascript
router.post('/login', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid' });
  
  res.json({ user, accessToken, refreshToken });
});
```

---

### Issue 4.2: "JWT Secret Not Found" or Tokens Not Working

**Error**: Registration/login fails with token error

**Step 1: Check .env has JWT secrets**
```env
JWT_SECRET=your32charminimumrandomstringhere
JWT_REFRESH_SECRET=your32charminimumrandomstringhere
```

**Step 2: Generate secure secrets**
```bash
# Terminal command to generate:
openssl rand -base64 32

# Use output for both secrets
```

**Step 3: Verify auth.js imports and uses them**
```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId },
  process.env.JWT_SECRET,  // ← Must exist
  { expiresIn: '7d' }
);
```

**Step 4: Restart backend after changing .env**
```bash
npm run dev
```

---

### Issue 4.3: Token Not Persisting in Frontend

**Symptom**: Login works but app logs user out after refresh

**Check: Are tokens saved to localStorage?**
```javascript
// After login API call, should save:
localStorage.setItem('token', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
localStorage.setItem('user', JSON.stringify(data.user));
```

**Check AuthContext.jsx:**
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // Restore user session
    setUser(JSON.parse(localStorage.getItem('user')));
  }
}, []);
```

---

## 5. CART & CHECKOUT ISSUES

### Issue 5.1: Add to Cart Button Doesn't Work

**Symptom**: Click "Add to Cart" → Nothing happens

**Check 1: Is user logged in?**
```javascript
// Button should require login:
const handleAddToCart = () => {
  if (!user) {
    alert('Please login first');
    return;
  }
  // Add to cart...
};
```

**Check 2: Is CartContext provided?**
```javascript
// In main.jsx or App.jsx:
<CartProvider>
  <App />
</CartProvider>
```

**Check 3: API endpoint working?**
```bash
# Test directly:
curl -X POST http://localhost:5000/api/cart/1/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"bookId": 1, "quantity": 1}'
```

---

### Issue 5.2: Cart Items Not Persisting

**Symptom**: Add item to cart → Refresh page → Cart empty

**Check 1: Items stored on backend?**
```bash
npx prisma studio
# Check "CartItem" table
```

**Check 2: Using sync with backend?**
```javascript
// Should call API, not just localStorage:
const addToCart = async (bookId, quantity) => {
  await api.addToCart(user.id, bookId, quantity);
  await loadCart(); // Reload from backend
};
```

**Check 3: User ID correct?**
```javascript
// When adding to cart:
const { user } = useAuth();
console.log('User ID:', user?.id); // Should not be null
```

---

### Issue 5.3: Checkout Fails

**Symptom**: "Place Order" button clicked → Nothing happens or error

**Check 1: Form validation**
```javascript
// Before submitting, verify:
if (!deliveryAddress) {
  alert('Please enter delivery address');
  return;
}
```

**Check 2: Backend order endpoint exists**
```bash
ls pageturners-backend/src/routes/orders.js
```

**Check 3: Test order creation**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "userId": 1,
    "cartItems": [{"id": 1, "quantity": 1, "price": 250}],
    "deliveryAddress": "123 Main St"
  }'
```

---

## 6. IMAGE ISSUES

### Issue 6.1: Book Images Not Loading

**Symptom**: All books show placeholder image instead of covers

**Check 1: ISBN field in database**
```bash
npx prisma studio
# Go to "Book" table
# Check "isbn" column has values like "9780123456789"
```

**Check 2: Test Open Library URL directly**
```bash
# In browser address bar, try:
https://covers.openlibrary.org/b/isbn/9780134685991-M.jpg

# Should show an image
# If 404, the ISBN doesn't have a cover on Open Library
```

**Check 3: Backend returning imageUrl**
```bash
curl http://localhost:5000/api/books/1

# Response should include:
# "imageUrl": "https://covers.openlibrary.org/b/isbn/..."
```

**Check 4: Frontend image tag**
```javascript
<img
  src={book.imageUrl}
  onError={() => setImageError(true)}  // Show placeholder on error
/>
```

---

### Issue 6.2: Some Images Work, Others Don't

**Root Cause**: Some ISBNs don't have covers on Open Library

**Solution**: Implement fallback

```javascript
const handleImageError = () => {
  setImageError(true);
  // Show placeholder
};

<img
  src={book.imageUrl || 'https://via.placeholder.com/300x400'}
  onError={handleImageError}
/>
```

---

## 7. GEOLOCATION ISSUES

### Issue 7.1: Geolocation Button Does Nothing

**Symptom**: Click "Get My Location" → No response

**Check 1: Browser permission**
- Browser must ask for location permission
- If denied, click address bar icon to re-enable

**Check 2: HTTPS requirement**
- Geolocation only works on HTTPS (except localhost)
- Dev environment (localhost) should work without HTTPS

**Check 3: Geolocation API in code**
```javascript
const handleGetLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  } else {
    alert('Geolocation not supported');
  }
};
```

---

## 8. FRONTEND PAGE & ROUTING ISSUES

### Issue 8.1: Page Shows "Blank" or "Not Found"

**Symptom**: Click link → Page is blank

**Check 1: Route defined in App.jsx**
```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/shop" element={<Shop />} />
  <Route path="/cart" element={<Cart />} />
  {/* All pages listed */}
</Routes>
```

**Check 2: Component file exists**
```bash
ls src/pages/Shop.jsx
ls src/pages/Cart.jsx
# etc.
```

**Check 3: Component exported correctly**
```javascript
export default Shop;  // ← Must have default export
```

**Check 4: No import errors**
- Open browser DevTools (F12)
- Check Console tab for red errors
- Look for "Module not found" or similar

---

### Issue 8.2: Navbar/Footer Shows Multiple Times

**Symptom**: Navigation bar appears twice on page

**Root Cause**: Component rendered in multiple places

**Fix:**
```javascript
// App.jsx should have ONE instance of navbar:
<Navbar />
<Routes>
  <Route path="/" element={<Home />} />
  {/* Don't include <Navbar> inside each page! */}
</Routes>
<Footer />
```

---

## 9. DATA DISPLAY ISSUES

### Issue 9.1: Book Data Shows as "undefined"

**Symptom**: Fields show "undefined" instead of actual data

**Check 1: API returns correct field names**
```bash
curl http://localhost:5000/api/books/1
# Look for exact field names in response
```

**Check 2: Frontend accessing correct field**
```javascript
// If API returns: { id, title, author }
// Access as: book.title  ✓
// Not: book.bookTitle  ✗
```

**Check 3: Component receives data**
```javascript
const BookCard = ({ book }) => {
  console.log('Book data:', book);  // ← Debug: see actual data
  return <h3>{book.title}</h3>;
};
```

---

### Issue 9.2: Prices Not Showing in ₹ Format

**Symptom**: Shows "250" instead of "₹250"

**Fix:**
```javascript
// Display with currency symbol and Indian formatting:
<div>₹{book.price.toLocaleString('en-IN')}</div>

// Or use constant:
const CURRENCY = '₹';
<div>{CURRENCY}{book.price.toLocaleString('en-IN')}</div>
```

---

### Issue 9.3: Categories Not Showing or Not Filtering

**Symptom**: Category dropdown empty or filter doesn't work

**Check 1: API returns categories**
```bash
curl http://localhost:5000/api/books/categories
# Should return: ["UG", "PG", "Programming", ...]
```

**Check 2: Frontend loading categories**
```javascript
useEffect(() => {
  loadCategories();
}, []);

const loadCategories = async () => {
  const cats = await api.getCategories();
  setCategories(cats);
};
```

**Check 3: Filter applied correctly**
```javascript
// When filter changes:
const filtered = await api.getBooks({ 
  category: selectedCategory 
});
```

---

## 10. PERFORMANCE & OPTIMIZATION ISSUES

### Issue 10.1: App Loading Slowly

**Symptom**: Frontend takes 5+ seconds to load

**Check 1: API response times**
```bash
# Time the request:
time curl http://localhost:5000/api/books
```

**Check 2: Database query performance**
- Using pagination: `skip: 0, take: 12`
- Not loading entire table

**Check 3: Browser DevTools**
- F12 → Network tab
- Check load times for images
- Check API call durations

**Optimization:**
```javascript
// Load only needed fields:
router.get('/books', async (req, res) => {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      imageUrl: true
      // Don't load: description, fullText, etc.
    },
    take: 12
  });
});
```

---

## 11. TYPESCRIPT/ESLINT ISSUES

### Issue 11.1: Red Squiggly Lines but App Works

**Symptom**: VS Code shows errors but `npm run dev` works

**This is usually safe to ignore during development**

**To fix eslint warnings:**
```bash
# In project directory:
npm run lint

# Auto-fix some issues:
npm run lint -- --fix
```

---

## 🆘 Emergency Troubleshooting

### Nuclear Option: Complete Reset

**If everything is broken:**

```bash
# Backend
cd pageturners-backend
rm -r node_modules
rm package-lock.json
npm install
rm prisma/dev.db
npx prisma migrate dev --name init
npm run seed
npm run dev

# Frontend (in another terminal)
cd dusty-shelf
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

---

### Getting Detailed Logs

**For debugging complex issues:**

```bash
# Backend: verbose logging
DEBUG=* npm run dev

# Frontend: check browser console
# F12 → Console tab → Look for errors
```

---

## 📞 When All Else Fails

1. **Check the plan document**
   - `COMPREHENSIVE_DEVELOPMENT_PLAN_DUSTY_SHELF.md`

2. **Review the checklist**
   - Did you complete Phase 1 fully?

3. **Verify configurations**
   - All `.env` files created?
   - All .env values correct?

4. **Database status**
   - `npx prisma studio` to verify data

5. **Server status**
   - Both running on correct ports?
   - Both show no errors on startup?

---

**This guide covers 90% of issues you'll encounter!**  
**Most problems are configuration related, not code related.**

Good luck! 🚀
