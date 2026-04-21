# PCL Bookstore Project - Complete Structure Analysis

## Executive Summary
The PageTurners bookstore is a **React/Express full-stack project** with a functional MVP implementation. The backend and frontend are largely integrated with core features partially implemented. Key issues include authentication token handling, image upload mechanics, missing Stripe integration, and incomplete checkout flow.

---

## 1. BACKEND SETUP (Node.js/Express)

### ✅ Server Architecture
- **File**: [pageturners-backend/src/server.js](pageturners-backend/src/server.js)
- **Port**: 5000 (configurable via PORT env var)
- **Framework**: Express 4.18.2
- **Key Setup**:
  - CORS configured (origin: `process.env.FRONTEND_URL || 'http://localhost:5000'`)
  - Helmet for security headers
  - Rate limiting: 100 req/15min global, 5 req/15min for auth
  - Static file serving from `pageturners-frontend/dist`
  - SPA catch-all route handling

### ✅ Route Structure
**Registered Routes**:
- `/api/auth` → [auth.js](pageturners-backend/src/routes/auth.js) (register, login, refresh, logout)
- `/api/books` → [books.js](pageturners-backend/src/routes/books.js) (CRUD + search)
- `/api/cart` → [cart.js](pageturners-backend/src/routes/cart.js) (cart management)
- `/api/orders` → [orders.js](pageturners-backend/src/routes/orders.js) (order creation & tracking)
- `/api/users` → [users.js](pageturners-backend/src/routes/users.js)
- `/api/keys` → [apiKeys.js](pageturners-backend/src/routes/apiKeys.js)
- `/api/admin` → [admin.js](pageturners-backend/src/routes/admin.js) (admin-only routes)
- `/api/health` → Health check endpoint

---

## 2. DATABASE SETUP (Prisma + SQLite)

### ✅ Data Models
**File**: [prisma/schema.prisma](pageturners-backend/prisma/schema.prisma)

#### User Model
```prisma
- id (cuid)
- name, email (unique), passwordHash, googleId
- role (BUYER|ADMIN)
- phone, avatar, bio
- Relations: books (as Seller), orders, reviews, cartItems, apiKeys
```

#### Book Model
```prisma
- id, title, author, isbn (unique), description
- price (Float), stockQty (Int, default 1)
- category, condition (LIKE_NEW|GOOD|FAIR)
- imageUrl, sellerId (User relation)
- status (ACTIVE|PENDING)
- rating, reviewCount
- Indexes: category, sellerId
```

#### Order Model
```prisma
- id, buyerId (User relation)
- totalAmount, orderStatus (PLACED|CONFIRMED|SHIPPED)
- paymentStatus (PENDING|COMPLETED|FAILED)
- deliveryAddress, city, state, zipCode
- latitude, longitude (geolocation)
- stripeSessionId
- Relations: items (OrderItem[]), buyer (User)
```

#### OrderItem Model
```prisma
- id, orderId, bookId (Book relation)
- quantity, priceAtPurchase
- onDelete: Cascade for order, Restrict for book
```

#### Additional Models
- **Review**: bookId, userId, rating (Int), comment
- **Category**: name, slug (unique), description, icon
- **CartItem**: userId, bookId, quantity (unique constraint on userId_bookId)
- **ApiKey**: (incomplete in schema view)

### ⚠️ Database Issues
1. **SQLite vs PostgreSQL mismatch**: Schema shows SQLite but memory docs claim PostgreSQL
   - Current: `provider = "sqlite"`, `url = env("DATABASE_URL")`
   - Migration file exists: `20260419120141_init/`
   
2. **Missing Stripe webhook model** for payment tracking
3. **No order tracking/status history table**
4. **No image metadata storage** (Cloudinary references only as URL)

---

## 3. AUTHENTICATION SYSTEM

### ✅ Implementation Status
- **Register**: ✅ Working (hashed passwords with bcryptjs)
- **Login**: ✅ Working (email/password validation)
- **Token Generation**: ✅ JWT + refresh tokens
- **Token Refresh**: ✅ Implemented in auth.js
- **Logout**: ✅ Token invalidation

### 📁 Key Files
- **Controller**: [auth.js](pageturners-backend/src/controllers/auth.js)
- **Routes**: [auth.js](pageturners-backend/src/routes/auth.js) (4 endpoints)
- **Middleware**: [middleware/auth.js](pageturners-backend/src/middleware/auth.js)
  - `authenticate`: Verifies JWT token
  - `authorize(...roles)`: Role-based access control
- **Token Logic**: [config/jwt.js](pageturners-backend/src/config/jwt.js)

### 🔑 Token Details
- **Access Token**: expires in 15m (configurable: `JWT_EXPIRE`)
- **Refresh Token**: expires in 7d (configurable: `JWT_REFRESH_EXPIRE`)
- **Stored in localStorage** (frontend) and HTTP-only cookies (backend)

### ⚠️ Auth Issues
1. **Frontend stores token in localStorage** (security risk - no httpOnly)
2. **CORS origin mismatch**: Backend expects `http://localhost:5000` but frontend is `http://localhost:5173`
3. **No logout route** that actually invalidates tokens (stateless JWT)
4. **No email verification** on registration
5. **No password reset functionality**
6. **No Google OAuth** despite googleId field in User model

---

## 4. API ENDPOINTS

### Books Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/books` | ❌ | Get all books with pagination/filters |
| GET | `/api/books/featured` | ❌ | Get top-rated books |
| GET | `/api/books/search` | ❌ | Search books by title/author |
| GET | `/api/books/recommendations` | ❌ | Get personalized recommendations |
| GET | `/api/books/categories/list` | ❌ | Get all categories |
| GET | `/api/books/:id` | ❌ | Get book details with reviews |
| POST | `/api/books` | ✅ | Create new book listing (seller) |
| GET | `/api/books/seller/my-books` | ✅ | Get seller's books |
| PUT | `/api/books/:bookId` | ✅ | Update book listing |
| DELETE | `/api/books/:bookId` | ✅ | Delete book listing |

### Cart Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/cart/:userId` | ✅ | Get user's cart |
| POST | `/api/cart/:userId/add` | ✅ | Add item to cart |
| PUT | `/api/cart/item/:itemId` | ✅ | Update cart item quantity |
| DELETE | `/api/cart/item/:itemId` | ✅ | Remove item from cart |
| DELETE | `/api/cart/:userId/clear` | ✅ | Clear entire cart |

### Orders Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/orders/:userId/create` | ✅ | Create order from cart |
| GET | `/api/orders/:userId` | ✅ | Get user's orders |
| GET | `/api/orders/detail/:orderId` | ✅ | Get order details |
| GET | `/api/orders/:orderId/track` | ✅ | Track order status |
| POST | `/api/orders/:orderId/payment` | ✅ | Process payment (SIMULATED) |
| PUT | `/api/orders/:orderId/status` | ✅ | Update order status (admin) |

### Admin Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/stats` | ✅ ADMIN | Get dashboard stats |
| PUT | `/api/admin/books/:id/approve` | ✅ ADMIN | Approve pending book |
| GET | `/api/admin/books/pending` | ✅ ADMIN | Get pending book approvals |
| GET | `/api/admin/users` | ✅ ADMIN | Get all users |

### Auth Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login with credentials |
| POST | `/api/auth/refresh` | ❌ | Refresh access token |
| POST | `/api/auth/logout` | ❌ | Logout user |

---

## 5. FRONTEND SETUP (React/Vite)

### ✅ Core Structure
- **Framework**: React 18.2.0 + Vite 5.0.0
- **Routing**: React Router DOM 6.20.0
- **State Management**: Zustand 4.4.0
- **Data Fetching**: React Query 5.0.0
- **Forms**: React Hook Form 7.48.0
- **Styling**: Tailwind CSS 3.3.0
- **Payment**: Stripe (React Stripe JS 2.4.0)

### 📁 Frontend Structure
```
pageturners-frontend/src/
├── App.jsx (main routing)
├── index.css (global styles)
├── main.jsx (entry point)
├── pages/ (20+ pages)
├── components/ (7 components)
├── store/ (index.js - Zustand stores)
├── config/ (api.js - axios instance)
├── hooks/ (React hooks)
├── styles/ (Tailwind components)
└── utils/ (helper functions)
```

### ✅ Pages Implemented
| Page | Status | Purpose |
|------|--------|---------|
| Home.jsx | ✅ | Landing page with hero, featured books |
| Shop.jsx | ✅ | Book listing with filters/search |
| BookDetail.jsx | ✅ | Individual book page with reviews |
| Cart.jsx | ✅ | Shopping cart with item management |
| Checkout.jsx | ⚠️ PARTIAL | Payment form (see issues below) |
| OrderConfirmation.jsx | ✅ | Order success page |
| Orders.jsx | ✅ | User's order history |
| Login.jsx | ✅ | Login form |
| Register.jsx | ✅ | Registration form |
| Account.jsx | ✅ | User profile page |
| Admin.jsx | ⚠️ PARTIAL | Admin dashboard (stats only) |
| SellBooks.jsx | ⚠️ PARTIAL | Seller book listing form |
| SellerDashboard.jsx | ✅ | Seller's books dashboard |
| About.jsx | ✅ | Static info page |
| Contact.jsx | ✅ | Contact form |
| FAQ.jsx | ✅ | FAQ page |
| Privacy.jsx | ✅ | Privacy policy |
| Terms.jsx | ✅ | Terms of service |
| Shipping.jsx | ✅ | Shipping info |
| APIKeys.jsx | ✅ | API key management |

### ✅ Components
- **Header.jsx**: Navigation bar with logo, search, cart icon
- **Footer.jsx**: Footer with links and copyright
- **BookCard.jsx**: Reusable book card component
- **CategoryMarquee.jsx**: Category carousel
- **EditorialBand.jsx**: Marketing banner
- **Hero.jsx**: Hero section
- **LoadingSpinner.jsx**: Loading indicator

### ✅ State Management (Zustand)
**File**: [store/index.js](pageturners-frontend/src/store/index.js)

```javascript
// useAuthStore
- user: { id, name, email, role }
- accessToken: JWT token
- setAuth(user, accessToken): Save auth state
- logout(): Clear auth state

// useCartStore
- items: Cart items array
- addItem(book, quantity): Add to cart
- removeItem(bookId): Remove from cart
- updateQuantity(bookId, quantity): Update quantity
- clearCart(): Empty cart
```

⚠️ **Issue**: No persistence for orders or seller data

---

## 6. ISSUES WITH BOOK IMAGES, PRICING, CATEGORIES

### 🖼️ Image Handling
**Current Status**: ⚠️ PARTIALLY IMPLEMENTED

**Frontend (SellBooks.jsx)**:
- Cloudinary upload configured but credentials hardcoded
- `CLOUDINARY_CLOUD_NAME = 'pageturners-cloud'`
- `CLOUDINARY_UPLOAD_PRESET = 'pageturners-books'`
- Upload endpoint: `https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload`
- ⚠️ **Issue**: No error handling for failed uploads

**Backend (createBook)**:
- Line 256: Fallback to placeholder image
- `imageUrl = req.body.imageUrl || 'https://via.placeholder.com/300x400?text=Book+Cover'`
- ⚠️ **Issue**: No actual Cloudinary integration on backend
- No multipart form-data middleware (multer)

### 💰 Pricing Issues
**Current Implementation**:
- Price stored as Float in database ✅
- Tax calculation: 5% of subtotal
- Shipping: Fixed at ₹100
- ⚠️ **Issue**: No tax/shipping configuration endpoints
- ⚠️ **Issue**: Pricing logic only on frontend, not enforced on backend

### 🏷️ Categories
**Current State**: ✅ Working but needs data
- 6 categories in seed: UG, PG, Programming, Commerce, Mythology, Fiction
- Categories model with name, slug, description, icon
- ⚠️ **Issue**: Categories not displayed on frontend Shop page
- Seed creates categories but no migration to auto-populate

---

## 7. DELIVERY/CHECKOUT FUNCTIONALITY

### ✅ Checkout Flow (Partially)
**File**: [Checkout.jsx](pageturners-frontend/src/pages/Checkout.jsx)

**Implemented**:
1. Cart validation (must have items)
2. Delivery form fields:
   - Name, email, phone
   - Address, city, state, zipCode
   - Country (hardcoded to India)
3. Card details form (NO actual payment)
4. Form validation with regex
5. Tax and shipping calculation

**🚨 CRITICAL ISSUES**:

1. **No Backend Integration**
   - Form submits to `/api/orders/:userId/create` but:
   - No delivery address handling in POST body
   - Frontend sends card details (NEVER do this!)
   - No Stripe session creation

2. **Payment Processing BROKEN**
   - Code attempts payment validation but submits nowhere
   - Simulated success response (see orderController line 130)
   - No actual Stripe integration

3. **Missing Delivery Options**
   - No delivery speed options
   - No shipping calculator
   - No address validation API

### 📦 Order Creation Flow
**Backend (orderController.js)**:
```javascript
POST /api/orders/:userId/create
- Validates cart not empty
- Calculates total from cart items
- Creates Order record with:
  - buyerId, totalAmount
  - deliveryAddress, city, state, zipCode
  - latitude/longitude (geolocation)
- Creates OrderItems
- Clears cart
```

⚠️ **Issue**: Expects delivery fields in request but Checkout form doesn't send them

---

## 8. CURRENT PROJECT STATUS

### ✅ WORKING & COMPLETE
- User authentication (register/login)
- Book listing and search
- Cart management (local storage)
- Order creation from cart
- Admin stats dashboard
- Book display with images (placeholder or uploaded)
- Seller dashboard (view own books)
- Static pages (About, FAQ, Terms, etc.)

### ⚠️ PARTIALLY IMPLEMENTED
- Book uploading by sellers (form works, no validation)
- Admin book approval (backend only, no UI)
- Payment processing (simulated only)
- Checkout form (no backend integration)
- Order tracking (basic endpoints only)
- Seller book editing/deletion (API only)
- Reviews (model exists, no UI)
- Ratings (fields exist, not calculated)

### ❌ MISSING/BROKEN
- **Stripe integration** (no real payments)
- **Image upload** (Cloudinary creds needed)
- **Email notifications** (nodemailer installed but unused)
- **Geolocation** (delivery coordinates collected but unused)
- **Real payment simulation** (90% random success rate)
- **Order status tracking** (PLACED → SHIPPED → DELIVERED)
- **Seller ratings/verification**
- **Book reviews UI** (model exists)
- **Advanced search filters** (category, condition not working)
- **Wishlist functionality**
- **Book notifications**
- **Admin email verification**
- **Password reset**
- **Order invoice generation**
- **Refund handling**
- **Mobile app**

---

## 9. CRITICAL MISSING PIECES

### 🔴 SECURITY ISSUES
1. **JWT tokens in localStorage** → XSS vulnerable
2. **Card details transmitted in requests** → NEVER do this (PCI violation)
3. **No HTTPS enforcement** (runs on HTTP)
4. **No input sanitization** on book creation
5. **Admin authorization weak** (checked only by role string)
6. **Cloudinary credentials in frontend code**

### 🔴 FUNCTIONAL ISSUES
1. **Checkout doesn't save to database** (form data lost)
2. **No backend order creation endpoint** integration
3. **Stripe webhook not implemented**
4. **Cart API requires userId** (should use session/auth)
5. **No inventory management** (can oversell books)
6. **No order history persistence** (only shows created orders)
7. **Admin approval workflow incomplete** (no UI for sellers to see status)

### 🔴 DATA ISSUES
1. **No default admin user created** on first run
2. **Seed script references API** that may not exist
3. **Category assignments disconnected** (seed doesn't use categoryId)
4. **No book validation** on create (price can be negative)

---

## 10. TECHNOLOGY STACK

### Backend
```json
{
  "@prisma/client": "^5.0.0",
  "bcryptjs": "^2.4.3",
  "cloudinary": "^1.40.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-rate-limit": "^7.0.0",
  "helmet": "^7.0.0",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5",
  "nodemailer": "^6.9.6",
  "redis": "^4.6.10",
  "stripe": "^13.7.0",
  "zod": "^3.22.4"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.48.0",
  "@stripe/react-stripe-js": "^2.4.0",
  "zustand": "^4.4.0"
}
```

---

## 11. ENVIRONMENT VARIABLES NEEDED

### Backend
```env
DATABASE_URL=sqlite:./prisma/dev.db
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 12. KEY FILE LOCATIONS

### Backend Files
- **Main**: [src/server.js](pageturners-backend/src/server.js)
- **Auth**: [src/controllers/auth.js](pageturners-backend/src/controllers/auth.js)
- **Books**: [src/controllers/bookController.js](pageturners-backend/src/controllers/bookController.js)
- **Orders**: [src/controllers/orderController.js](pageturners-backend/src/controllers/orderController.js)
- **Routes**: [src/routes/](pageturners-backend/src/routes/) (7 route files)
- **Database**: [prisma/schema.prisma](pageturners-backend/prisma/schema.prisma)

### Frontend Files
- **Main**: [src/App.jsx](pageturners-frontend/src/App.jsx)
- **Store**: [src/store/index.js](pageturners-frontend/src/store/index.js)
- **Config**: [src/config/api.js](pageturners-frontend/src/config/api.js)
- **Pages**: [src/pages/](pageturners-frontend/src/pages/) (20+ pages)

---

## SUMMARY TABLE

| Component | Status | Quality | Issues |
|-----------|--------|---------|--------|
| Backend Server | ✅ | Good | CORS origin mismatch |
| Database Schema | ✅ | Good | SQLite vs PostgreSQL mismatch |
| Authentication | ✅ | Good | Tokens in localStorage, no logout invalidation |
| Book API | ✅ | Good | Image upload not functional |
| Cart API | ✅ | Good | Uses localStorage instead of server |
| Orders API | ⚠️ | Fair | Simulated payment, no real integration |
| Checkout UI | ⚠️ | Fair | Captures payment data unsafely |
| Payment Processing | ❌ | Poor | Simulated, no Stripe integration |
| Admin Dashboard | ⚠️ | Fair | Stats only, no book approval UI |
| Seller Features | ⚠️ | Fair | Upload form works, image upload broken |
| Image Upload | ⚠️ | Fair | Cloudinary configured but not integrated |
| Frontend Routing | ✅ | Good | Protected routes working |
| UI Components | ✅ | Good | Responsive, well-organized |
| Styling | ✅ | Good | Tailwind CSS properly configured |

---

## NEXT STEPS RECOMMENDED

**Priority 1 - Critical Fixes**:
1. Fix Stripe integration (currently simulated)
2. Fix image upload to Cloudinary
3. Integrate checkout form with backend
4. Move JWT tokens to httpOnly cookies

**Priority 2 - Functional Completion**:
1. Complete admin book approval UI
2. Implement order tracking
3. Add seller book editing
4. Create review system UI

**Priority 3 - Enhancement**:
1. Add email notifications
2. Implement geolocation delivery
3. Add payment refunds
4. Create analytics dashboard

