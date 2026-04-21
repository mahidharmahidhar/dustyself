# 🔍 API Testing & Debugging Guide

## 📊 Backend API Verification

### Step 1: Verify Backend is Running
```bash
# Check health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","timestamp":"2024-04-20T10:30:00.000Z"}
```

### Step 2: Test Database Connection
```bash
# Open Prisma Studio to visualize database
cd pageturners-backend
npx prisma studio

# This opens http://localhost:5555 in browser
# You can view all tables and records
```

### Step 3: Verify Books in Database
```bash
# Query books via API
curl "http://localhost:5000/api/books?limit=5"

# Expected response:
# {
#   "success": true,
#   "books": [
#     {
#       "id": "...",
#       "title": "Book Title",
#       "author": "Author Name",
#       "isbn": "1234567890",
#       "price": 299,
#       "condition": "GOOD",
#       "category": "Programming",
#       "imageUrl": "https://covers.openlibrary.org/b/isbn/1234567890-M.jpg",
#       "rating": 4.5,
#       "reviewCount": 12,
#       "stockQty": 5,
#       "description": "..."
#     }
#   ],
#   "pagination": {
#     "page": 1,
#     "limit": 5,
#     "total": 512,
#     "pages": 103
#   }
# }
```

---

## 🔐 Authentication Testing

### Test 1: Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'

# Expected response (status 201):
# {
#   "message": "Registration successful",
#   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
#   "user": {
#     "id": "user_12345",
#     "name": "Test User",
#     "email": "test@example.com",
#     "role": "BUYER"
#   }
# }
```

### Test 2: Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'

# Expected response (status 200):
# {
#   "message": "Login successful",
#   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
#   "user": {
#     "id": "user_12345",
#     "name": "Test User",
#     "email": "test@example.com",
#     "role": "BUYER"
#   }
# }
```

### Test 3: Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -b "refreshToken=your_refresh_token_here"

# Expected response:
# {
#   "accessToken": "eyJhbGciOiJIUzI1NiIs..."
# }
```

---

## 📚 Books API Testing

### Test 1: Get All Books
```bash
curl "http://localhost:5000/api/books?page=1&limit=12"
```

### Test 2: Filter by Category
```bash
curl "http://localhost:5000/api/books?category=Programming&limit=12"

# Valid categories: UG, PG, Programming, Commerce, Mythology, Fiction
```

### Test 3: Search Books
```bash
curl "http://localhost:5000/api/books?search=React&limit=12"
```

### Test 4: Sort Books
```bash
curl "http://localhost:5000/api/books?sortBy=price&limit=12"

# Valid sort options: createdAt, rating, price, reviewCount
```

### Test 5: Get Featured Books
```bash
curl http://localhost:5000/api/books/featured
```

### Test 6: Get Single Book
```bash
curl "http://localhost:5000/api/books/{bookId}"

# Response includes ISBN for image URL
```

### Test 7: Get Categories
```bash
curl http://localhost:5000/api/books/categories

# Expected response:
# {
#   "success": true,
#   "categories": [
#     {
#       "id": "1",
#       "name": "Programming",
#       "slug": "programming",
#       "description": "Programming & Computer Science books",
#       "bookCount": 78
#     },
#     ...
#   ]
# }
```

---

## 🛒 Cart API Testing

### Test 1: Add to Cart
```bash
USER_ID="user_12345"
TOKEN="your_jwt_token"

curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"bookId\": \"book_id_here\",
    \"quantity\": 1
  }"

# Expected response:
# {
#   "message": "Added to cart",
#   "item": {
#     "id": "cart_item_id",
#     "userId": "user_12345",
#     "bookId": "book_id",
#     "quantity": 1,
#     "book": { ... }
#   }
# }
```

### Test 2: Get Cart
```bash
USER_ID="user_12345"
TOKEN="your_jwt_token"

curl "http://localhost:5000/api/cart/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# [
#   {
#     "id": "cart_item_1",
#     "userId": "user_12345",
#     "bookId": "book_1",
#     "quantity": 2,
#     "book": {
#       "id": "book_1",
#       "title": "React Guide",
#       "price": 599,
#       "isbn": "1234567890",
#       ...
#     }
#   }
# ]
```

### Test 3: Update Cart Item
```bash
ITEM_ID="cart_item_id"
TOKEN="your_jwt_token"

curl -X PUT http://localhost:5000/api/cart/$ITEM_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity": 3}'

# Expected response:
# {
#   "message": "Cart updated",
#   "item": { ... }
# }
```

### Test 4: Remove from Cart
```bash
ITEM_ID="cart_item_id"
TOKEN="your_jwt_token"

curl -X DELETE http://localhost:5000/api/cart/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# {"message": "Removed from cart"}
```

### Test 5: Get Cart Total
```bash
USER_ID="user_12345"
TOKEN="your_jwt_token"

curl "http://localhost:5000/api/cart/$USER_ID/total" \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# {
#   "itemCount": 3,
#   "totalAmount": 1897,
#   "items": [ ... ]
# }
```

---

## 📦 Orders API Testing

### Test 1: Create Order
```bash
USER_ID="user_12345"
TOKEN="your_jwt_token"

curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "userId": "'$USER_ID'",
    "cartItems": [
      {"bookId": "book_1", "quantity": 2},
      {"bookId": "book_2", "quantity": 1}
    ],
    "deliveryAddress": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "latitude": 19.0760,
    "longitude": 72.8777
  }'

# Expected response (status 201):
# {
#   "message": "Order created",
#   "order": {
#     "id": "order_12345",
#     "buyerId": "user_12345",
#     "totalAmount": 1897,
#     "deliveryAddress": "123 Main St",
#     "city": "Mumbai",
#     "orderStatus": "PLACED",
#     "paymentStatus": "PENDING",
#     "createdAt": "2024-04-20T10:30:00.000Z",
#     "items": [
#       {
#         "id": "item_1",
#         "bookId": "book_1",
#         "quantity": 2,
#         "priceAtPurchase": 599,
#         "book": { ... }
#       }
#     ]
#   }
# }
```

### Test 2: Get All Orders (User)
```bash
USER_ID="user_12345"
TOKEN="your_jwt_token"

curl "http://localhost:5000/api/orders/user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# [
#   {
#     "id": "order_12345",
#     "totalAmount": 1897,
#     "orderStatus": "SHIPPED",
#     "paymentStatus": "COMPLETED",
#     "createdAt": "2024-04-20T10:30:00.000Z",
#     "items": [ ... ]
#   }
# ]
```

### Test 3: Get Single Order
```bash
ORDER_ID="order_12345"
TOKEN="your_jwt_token"

curl "http://localhost:5000/api/orders/$ORDER_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected response: Full order details
```

### Test 4: Update Order Status
```bash
ORDER_ID="order_12345"
TOKEN="your_jwt_token"

curl -X PUT http://localhost:5000/api/orders/$ORDER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"orderStatus": "SHIPPED"}'

# Valid statuses:
# - PLACED (initial)
# - CONFIRMED
# - SHIPPED
# - OUT_FOR_DELIVERY
# - DELIVERED
# - CANCELLED
```

---

## 🐛 Common Issues & Solutions

### Issue: Books Not Loading
**Symptoms:** API returns empty books or pagination shows 0

**Debug Steps:**
```bash
# 1. Check if database has books
npx prisma studio
# Navigate to Books table and verify records exist

# 2. Verify book data structure
curl "http://localhost:5000/api/books?limit=1" | jq '.'

# 3. Check for database errors in backend logs
# Look for Prisma errors in terminal running backend

# 4. Verify database file exists
ls -la pageturners-backend/prisma/dev.db
```

**Solutions:**
- Run seed script: `node scripts/seed.js`
- Verify `.env` DATABASE_URL is correct
- Check Prisma schema is migrated: `npx prisma migrate dev`

### Issue: Books Images Not Showing
**Symptoms:** Book cards show placeholder instead of cover images

**Debug Steps:**
```bash
# 1. Verify ISBN field exists in database
npx prisma studio
# Check Books table - ISBN column should have values

# 2. Test image URL directly
BOOK_ISBN="1234567890"
curl "https://covers.openlibrary.org/b/isbn/$BOOK_ISBN-M.jpg"

# 3. Check browser network tab for failed requests
# Open DevTools → Network → look for 404s on image URLs
```

**Solutions:**
- Ensure books have ISBN field populated
- Verify ISBN format (should be valid ISBN-10 or ISBN-13)
- Check Open Library covers API is accessible
- Add fallback image: `/public/placeholder-book.jpg`

### Issue: Authentication Failing
**Symptoms:** Login returns 401 or tokens not working

**Debug Steps:**
```bash
# 1. Check JWT_SECRET is set
echo $JWT_SECRET

# 2. Verify user exists in database
npx prisma studio
# Check Users table

# 3. Test password hashing
node -e "const bcrypt = require('bcryptjs'); bcrypt.compare('password', '$2a$12$...').then(console.log)"

# 4. Check token format
# Should be: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Solutions:**
- Set JWT_SECRET in `.env` (min 32 chars)
- Register user via `/auth/register`
- Clear localStorage and re-login
- Check token expiry: `jq -R 'split(".")[1] | @base64d | fromjson' <<< "your_token"`

### Issue: Cart Not Persisting
**Symptoms:** Items added to cart disappear on refresh

**Debug Steps:**
```bash
# 1. Verify cart items are saved
npx prisma studio
# Check cart_items table after adding to cart

# 2. Test cart endpoints
curl "http://localhost:5000/api/cart/user_id" \
  -H "Authorization: Bearer token"

# 3. Check authentication token is valid
# Decode token at jwt.io
```

**Solutions:**
- Ensure user is logged in before adding to cart
- Check token is stored in localStorage
- Verify cart endpoint returns items for user
- Clear browser storage and re-login

### Issue: CORS Errors
**Symptoms:** Browser console shows "CORS policy" errors

**Debug Steps:**
```bash
# 1. Check CORS is configured
grep -n "cors" pageturners-backend/src/server.js

# 2. Test with curl (CORS doesn't apply to curl)
curl "http://localhost:5000/api/books"
# If this works, issue is CORS config

# 3. Check frontend URL matches CORS origin
# Open browser console and check request headers
```

**Solutions:**
- Update CORS origin in backend: `process.env.FRONTEND_URL`
- Set FRONTEND_URL in `.env`: `FRONTEND_URL=http://localhost:5173`
- Add credentials: `credentials: true`
- Restart backend after changing `.env`

---

## 🧪 Frontend Testing Guide

### Test 1: Verify API Connection
Create test file: `dusty-shelf/src/test-api.js`

```javascript
// Test API connection
async function testAPI() {
  try {
    console.log('Testing API health...');
    const health = await fetch('http://localhost:5000/api/health');
    console.log('Health:', await health.json());

    console.log('\nTesting books API...');
    const books = await fetch('http://localhost:5000/api/books?limit=1');
    console.log('Books:', await books.json());

    console.log('\n✅ API is responding correctly');
  } catch (error) {
    console.error('❌ API Error:', error);
  }
}

testAPI();
```

Run in browser console:
```javascript
// Copy entire testAPI function and run in browser console
testAPI();
```

### Test 2: Check LocalStorage
```javascript
// In browser console
localStorage.getItem('authToken')  // Should show JWT token if logged in
JSON.parse(localStorage.getItem('user'))  // Should show user data
```

### Test 3: Monitor Network Requests
1. Open DevTools: F12
2. Go to Network tab
3. Filter by XHR (XMLHttpRequest)
4. Perform action (login, add to cart, etc.)
5. Click request and check:
   - Status: 200/201 (success)
   - Response: Should have expected data
   - Headers: Authorization bearer token included

### Test 4: Check Console Errors
```javascript
// In browser console, type:
// Any errors starting with❌ indicate issues
console.error('Test error message');

// Fix by checking:
// 1. API endpoint URLs are correct
// 2. Bearer token is included in headers
// 3. Request body matches backend expectations
```

---

## 📋 API Response Verification Checklist

### Books Endpoint
- [ ] Returns array of books
- [ ] Each book has: id, title, author, isbn, price, category, imageUrl
- [ ] Pagination includes: page, limit, total, pages
- [ ] Price is in paise (e.g., 29900 = ₹299)
- [ ] ISBN generates valid image URLs
- [ ] Image URLs are from covers.openlibrary.org

### Auth Endpoint
- [ ] Register creates user with hashed password
- [ ] Login returns valid JWT token
- [ ] Token expires after specified time (default 7d)
- [ ] Refresh token endpoint renews access token
- [ ] Logout clears refresh token cookie

### Cart Endpoint
- [ ] Add to cart creates CartItem
- [ ] Get cart returns items with book details
- [ ] Update quantity modifies CartItem
- [ ] Remove item deletes CartItem
- [ ] Cart total calculated correctly

### Order Endpoint
- [ ] Create order from cart items
- [ ] Order contains user, address, items
- [ ] Order status starts as PLACED
- [ ] Get orders returns user's orders
- [ ] Update status only allows valid transitions

---

## 🎯 Success Criteria

All tests pass when:
✅ Backend running on port 5000  
✅ Database has 512 books with ISBNs  
✅ Auth endpoints create/authenticate users  
✅ Book images display correctly from Open Library  
✅ Cart operations persist to database  
✅ Orders create and track status  
✅ All responses match expected format  
✅ No CORS errors in browser console  
✅ No SQL/Prisma errors in backend logs  
✅ Frontend successfully connects to backend APIs  

---

**Last Updated:** 2024-04-20  
**Status:** 🔍 Ready for Testing
