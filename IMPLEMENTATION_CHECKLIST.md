# ✅ DUSTY SHELF - Implementation Checklist & Quick-Start Guide

**Project**: Dusty Shelf Full-Stack Bookstore  
**Status**: Ready for Development  
**Estimated Time**: 9-12 hours  

---

## 🚀 Quick-Start: Get Started in 15 Minutes

### Step 1: Verify Environment (2 min)
```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Navigate to project
cd c:\Users\Mahid\OneDrive\Desktop\pcl
```

### Step 2: Start Both Servers (5 min)
```bash
# Terminal 1: Backend
cd pageturners-backend
npm install  # if needed
npm run dev

# Terminal 2: Frontend
cd dusty-shelf
npm install  # if needed
npm run dev
```

### Step 3: Test Both Servers (3 min)
```bash
# Terminal 3: Test health check
curl http://localhost:5000/api/health

# Open browser
http://localhost:5173
```

### Step 4: Seed Database (3 min)
```bash
# Terminal 3: Backend directory
cd pageturners-backend
npm run seed
# or
node scripts/seed.js
```

✅ **If all working**: Continue to Phase 1 below

---

## 📋 Phase-by-Phase Checklist

## PHASE 1: Foundation & Infrastructure
**Duration**: 2-3 hours | **Priority**: CRITICAL

### 1.1 Backend Configuration
- [ ] Create `pageturners-backend/.env` file
- [ ] Set `PORT=5000`
- [ ] Set `FRONTEND_URL=http://localhost:5173`
- [ ] Set `DATABASE_URL=file:./prisma/dev.db`
- [ ] Generate JWT secrets (32+ random chars each):
  - [ ] `JWT_SECRET=...`
  - [ ] `JWT_REFRESH_SECRET=...`
- [ ] Test: `curl http://localhost:5000/api/health` → Returns 200

### 1.2 Frontend Configuration
- [ ] Create `dusty-shelf/.env.local` file
- [ ] Set `VITE_API_BASE_URL=http://localhost:5000/api`
- [ ] Set `VITE_STORE_LOCATION=Jain University, Jayanagar, Bangalore, India`
- [ ] Verify `vite.config.js` has correct port (5173) and proxy settings
- [ ] Test: `npm run dev` starts on http://localhost:5173

### 1.3 Database Setup
- [ ] Run migrations: `npx prisma migrate dev --name init`
- [ ] Run seed script: `npm run seed`
- [ ] Verify database: `npx prisma studio`
- [ ] Check: 560+ books in database

### 1.4 Server Verification
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] No CORS errors in browser console
- [ ] Health check endpoint working
- [ ] Both run on separate ports (5000, 5173)

**✅ Milestone 1 Complete**: Infrastructure working, both servers running, database populated

---

## PHASE 2: Core Features - Books & Categories
**Duration**: 2-3 hours | **Priority**: HIGH

### 2.1 Backend Books Endpoint
- [ ] Create `src/routes/books.js`
- [ ] Implement `GET /api/books` (with filters)
- [ ] Implement `GET /api/books/featured`
- [ ] Implement `GET /api/books/categories`
- [ ] Implement `GET /api/books/:id`
- [ ] Test all endpoints with Thunder Client/Postman

### 2.2 Frontend API Service
- [ ] Create `src/services/api.js`
- [ ] Implement `getBooks()` function
- [ ] Implement `getFeaturedBooks()` function
- [ ] Implement `getCategories()` function
- [ ] Test API calls in browser console

### 2.3 Book Display
- [ ] Update BookCard component to show:
  - [ ] Book title
  - [ ] Author name
  - [ ] Category badge
  - [ ] Condition badge (Like New/Good/Acceptable)
  - [ ] Price in ₹ format
  - [ ] Book image
- [ ] Create Shop page with book grid
- [ ] Verify books display correctly

**✅ Milestone 2 Complete**: Books showing on frontend, filters working, images displaying

---

## PHASE 3: Authentication & Security
**Duration**: 2 hours | **Priority**: CRITICAL

### 3.1 Backend Auth Endpoints
- [ ] Create `src/routes/auth.js`
- [ ] Implement `POST /api/auth/register`
- [ ] Implement `POST /api/auth/login`
- [ ] Implement `POST /api/auth/refresh`
- [ ] Implement `POST /api/auth/logout`
- [ ] Test endpoints with Postman:
  - [ ] Register new user
  - [ ] Login with credentials
  - [ ] Refresh token
  - [ ] Tokens stored properly

### 3.2 Backend Auth Middleware
- [ ] Create `src/middleware/auth.js`
- [ ] Implement JWT verification
- [ ] Add to protected routes
- [ ] Test protected endpoint access

### 3.3 Frontend Auth Context
- [ ] Create `src/context/AuthContext.jsx`
- [ ] Create `src/hooks/useAuth.js`
- [ ] Store tokens in localStorage
- [ ] Store user data in localStorage
- [ ] Add AuthProvider to App.jsx

### 3.4 Login/Register Pages
- [ ] Create/update Login page with email/password form
- [ ] Create/update Register page with validation
- [ ] Handle form submission to backend
- [ ] Store JWT tokens on success
- [ ] Redirect to home on successful login
- [ ] Test full auth flow end-to-end

**✅ Milestone 3 Complete**: Users can register and login, JWT tokens working

---

## PHASE 4: Book Management & Images
**Duration**: 1 hour | **Priority**: HIGH

### 4.1 ISBN-Based Image Service
- [ ] Create `src/services/imageService.js`
- [ ] Implement `getImageUrl(isbn, fallback)` function
- [ ] Returns Open Library URL: `https://covers.openlibrary.org/b/isbn/{ISBN}-M.jpg`
- [ ] Provides fallback for missing ISBNs

### 4.2 Backend Image Integration
- [ ] Update book endpoints to include image processing
- [ ] Append imageUrl to book responses
- [ ] Test image URLs valid for real books

### 4.3 Frontend Image Display
- [ ] Update BookCard component image handling
- [ ] Handle image load errors gracefully
- [ ] Display placeholder for missing images
- [ ] Test with multiple books:
  - [ ] Books with valid ISBN
  - [ ] Books with missing ISBN
  - [ ] Fallback image shows correctly

**✅ Milestone 4 Complete**: All book images showing from Open Library, with fallbacks

---

## PHASE 5: Shopping Cart & Checkout
**Duration**: 2 hours | **Priority**: HIGH

### 5.1 Backend Cart Endpoints
- [ ] Create `src/routes/cart.js`
- [ ] Implement `POST /api/cart/:userId/add`
- [ ] Implement `GET /api/cart/:userId`
- [ ] Implement `DELETE /api/cart/:userId/remove/:cartItemId`
- [ ] Implement `POST /api/cart/:userId/clear`
- [ ] Add JWT verification to all routes
- [ ] Test with authenticated requests

### 5.2 Frontend Cart Context
- [ ] Create `src/context/CartContext.jsx`
- [ ] Create `src/hooks/useCart.js`
- [ ] Implement `addToCart()` function
- [ ] Implement `removeFromCart()` function
- [ ] Implement `clearCart()` function
- [ ] Implement `getTotalPrice()` function
- [ ] Add CartProvider to App.jsx

### 5.3 Cart Page
- [ ] Create/update Cart page
- [ ] Display cart items with:
  - [ ] Book image
  - [ ] Title
  - [ ] Quantity
  - [ ] Price per item
  - [ ] Subtotal per item
- [ ] Add quantity adjustment buttons
- [ ] Add remove item button
- [ ] Show cart total
- [ ] Show "Proceed to Checkout" button
- [ ] Handle empty cart state

### 5.4 Cart Functionality
- [ ] Test adding items to cart
- [ ] Test quantity updates
- [ ] Test removing items
- [ ] Test cart persistence (localStorage)
- [ ] Verify totals calculate correctly

**✅ Milestone 5 Complete**: Cart fully functional, items persist, totals correct

---

## PHASE 6: Delivery System & Order Tracking
**Duration**: 2 hours | **Priority**: HIGH

### 6.1 Backend Order Endpoints
- [ ] Create `src/routes/orders.js`
- [ ] Implement `POST /api/orders` (create order)
- [ ] Implement `GET /api/orders/user/:userId` (user orders)
- [ ] Implement `GET /api/orders/:orderId` (single order)
- [ ] Implement `PATCH /api/orders/:orderId/status` (update status)
- [ ] Add JWT verification
- [ ] Test order creation and retrieval

### 6.2 Prisma Schema Updates
- [ ] Add Order table to schema
- [ ] Add OrderItem table to schema
- [ ] Define relationships correctly
- [ ] Run migration: `npx prisma migrate dev`
- [ ] Update services to use new tables

### 6.3 Frontend Checkout Page
- [ ] Create Checkout page
- [ ] Show order summary with total
- [ ] Show delivery form with fields:
  - [ ] Full Name
  - [ ] Email
  - [ ] Phone
  - [ ] Address
  - [ ] City
  - [ ] Postal Code
- [ ] Add option to use geolocation
- [ ] Implement geolocation button
- [ ] Show coordinates when location obtained
- [ ] Validate form before submission
- [ ] Send order to backend
- [ ] Clear cart after successful order
- [ ] Redirect to orders page

### 6.4 Frontend Orders Page
- [ ] Create Orders page
- [ ] Display user's order history
- [ ] Show for each order:
  - [ ] Order ID
  - [ ] Order date
  - [ ] Status badge (color-coded)
  - [ ] Items list
  - [ ] Delivery address
  - [ ] Total amount
- [ ] Order status displays: Placed, Shipped, Out for Delivery, Delivered
- [ ] Test fetching and displaying orders

### 6.5 Order Tracking
- [ ] Verify all 4 statuses display correctly
- [ ] Test status updates
- [ ] Verify color coding:
  - [ ] Placed: Blue
  - [ ] Shipped: Yellow
  - [ ] Out for Delivery: Purple
  - [ ] Delivered: Green

**✅ Milestone 6 Complete**: Orders creating, persisting, tracking, geolocation working

---

## PHASE 7: UI/UX Polish & Responsiveness
**Duration**: 1-2 hours | **Priority**: MEDIUM

### 7.1 Loading Spinner
- [ ] Create `src/components/LoadingSpinner.jsx`
- [ ] Add to all API-dependent components:
  - [ ] Books page
  - [ ] Cart page
  - [ ] Orders page
  - [ ] Checkout page
- [ ] Test spinner appears during loading

### 7.2 Toast Notifications
- [ ] Create/update `src/components/Toast/Toast.jsx`
- [ ] Add to actions:
  - [ ] Add to cart
  - [ ] Remove from cart
  - [ ] Create order
  - [ ] Errors
- [ ] Test notifications appear and auto-dismiss

### 7.3 Shop Page Filters
- [ ] Update Shop page with:
  - [ ] Category filter dropdown
  - [ ] Condition filter dropdown
  - [ ] Search input
  - [ ] Reset button
  - [ ] Results counter
- [ ] Test all filters work individually
- [ ] Test filters work together

### 7.4 About Page
- [ ] Create/update About page with:
  - [ ] Store mission statement
  - [ ] What we offer (4 sections)
  - [ ] Store location:
    - [ ] "Jain University, Jayanagar Campus, Bangalore"
    - [ ] Coordinates: 13.0350°N, 77.6245°E
    - [ ] Phone number
    - [ ] Email
    - [ ] Operating hours
  - [ ] Book categories list
  - [ ] Why Choose Us section
- [ ] Test page responsive on mobile/tablet/desktop

### 7.5 Responsive Design
- [ ] Test all pages on mobile (320px)
  - [ ] Layout adjusts
  - [ ] Text readable
  - [ ] Buttons clickable
- [ ] Test on tablet (768px)
  - [ ] Grid layout adapts
  - [ ] Navigation works
- [ ] Test on desktop (1200px)
  - [ ] Full width utilized
  - [ ] Proper spacing
- [ ] Test navigation between pages

### 7.6 Error Handling
- [ ] Display error messages for API failures
- [ ] Show validation errors on forms
- [ ] Handle network timeouts gracefully
- [ ] Display empty states appropriately

**✅ Milestone 7 Complete**: UI polished, responsive, error handling robust

---

## PHASE 8: Testing & QA
**Duration**: 1 hour | **Priority**: MEDIUM

### 8.1 Backend API Tests
Test each endpoint:
- [ ] GET /api/health
- [ ] GET /api/books
- [ ] GET /api/books/featured
- [ ] GET /api/books/categories
- [ ] GET /api/books/:id
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/refresh
- [ ] POST /api/cart/:userId/add
- [ ] GET /api/cart/:userId
- [ ] DELETE /api/cart/:userId/remove/:id
- [ ] POST /api/orders
- [ ] GET /api/orders/user/:userId

### 8.2 Frontend User Flow Tests
- [ ] User registration flow
- [ ] User login flow
- [ ] Browse books with filters
- [ ] Add item to cart
- [ ] View cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Checkout with manual address
- [ ] Checkout with geolocation
- [ ] View order history
- [ ] See order status updates

### 8.3 Data Validation
- [ ] Books have all required fields (title, author, price, category, condition, image)
- [ ] Prices display in ₹ format
- [ ] Conditions show: Like New, Good, Acceptable
- [ ] Categories display correctly
- [ ] Orders save delivery address
- [ ] Order items have correct prices
- [ ] Totals calculate correctly

### 8.4 Browser Console
- [ ] No JavaScript errors
- [ ] No CORS errors
- [ ] No 404 errors for images
- [ ] No network failures

### 8.5 Performance
- [ ] Pages load within 3 seconds
- [ ] API responses within 1 second
- [ ] Images load completely
- [ ] No memory leaks

**✅ Milestone 8 Complete**: All tests passing, app production-ready

---

## 🎯 Final Verification Checklist

### Critical Features
- [ ] Users can register with email/password
- [ ] Users can login with credentials
- [ ] JWT tokens stored and used for auth
- [ ] 500+ books visible in database
- [ ] Books display with correct images (Open Library)
- [ ] Book cards show: title, author, category, condition, ₹ price
- [ ] Category filters work and update UI
- [ ] Search functionality works
- [ ] Add to cart works (requires login)
- [ ] Cart persists items
- [ ] Checkout form collects delivery address
- [ ] Geolocation button works
- [ ] Orders create in database
- [ ] Orders display with status
- [ ] Status updates display (Placed → Shipped → Out for Delivery → Delivered)

### Technical Quality
- [ ] No console errors
- [ ] No CORS issues
- [ ] Responsive on mobile/tablet/desktop
- [ ] Loading states visible during API calls
- [ ] Error messages displayed
- [ ] Toast notifications work
- [ ] Database seeded properly
- [ ] Migrations run successfully

### UI/UX Quality
- [ ] Clean layout (Navbar → Hero → Categories → Grid → Footer)
- [ ] No duplicate components
- [ ] Proper spacing and alignment
- [ ] Professional appearance
- [ ] Intuitive navigation
- [ ] All buttons functional

---

## 🐛 Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| **CORS Error** | Check `FRONTEND_URL` in backend `.env` is correct |
| **Port 5173 in use** | Kill process: `lsof -ti:5173 \| xargs kill -9` |
| **Port 5000 in use** | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| **Database empty** | Run: `npm run seed` in backend directory |
| **Images not loading** | Verify ISBN format, test Open Library URL directly |
| **Login not working** | Check JWT secrets are set in `.env` |
| **Cart not saving** | Verify CartProvider wraps App in main.jsx |
| **Geolocation blocked** | Check browser permissions, needs HTTPS in production |
| **Totals incorrect** | Verify price field type in database (should be number) |

---

## 📊 Implementation Progress Tracker

```
PHASE 1: Foundation             ░░░░░░░░░░ 0%
PHASE 2: Books & Categories    ░░░░░░░░░░ 0%
PHASE 3: Authentication        ░░░░░░░░░░ 0%
PHASE 4: Book Images           ░░░░░░░░░░ 0%
PHASE 5: Cart & Checkout       ░░░░░░░░░░ 0%
PHASE 6: Delivery & Orders     ░░░░░░░░░░ 0%
PHASE 7: UI/UX Polish          ░░░░░░░░░░ 0%
PHASE 8: Testing & QA          ░░░░░░░░░░ 0%

OVERALL PROGRESS:              ░░░░░░░░░░ 0%
```

Update this as you complete each section!

---

## 🚀 When You're Done

All phases complete?

- [ ] Run full end-to-end test
- [ ] Have a friend test (fresh eyes!)
- [ ] Take screenshots for demo
- [ ] Prepare talking points
- [ ] Create demo script
- [ ] **Ready for PCL Demo! 🎓**

---

**Start Date**: ___________  
**Target Completion**: Within 2 days (9-12 hours total)  
**Actual Completion**: ___________  

Good luck! 🚀
