# 🏪 Dusty Shelf - Comprehensive Development & Debugging Plan

## Project Overview
**Application:** Full-Stack E-Commerce Bookstore for Second-Hand Books  
**Frontend:** React 18 + Vite + TailwindCSS  
**Backend:** Node.js + Express + Prisma + SQLite  
**Target Audience:** College Students (UG/PG)  
**Location:** [To be specified by user]

---

## Phase 1: Assessment & Architecture Setup

### 1.1 Current State Analysis
- [x] Blue Editorial Design Theme Applied
- [ ] Authentication System (Login/Register) - TODO
- [ ] Google OAuth Integration - TODO
- [ ] JWT Token Management - TODO
- [ ] Book Image System - TODO (ISBN-based)
- [ ] Book Data Schema - TODO (validate all fields)
- [ ] Category Filter System - TODO
- [ ] Delivery/Checkout System - TODO
- [ ] Order Management - TODO
- [ ] Error Handling & Loading States - TODO

### 1.2 Backend Architecture Required

```
pageturners-backend/
├── src/
│   ├── server.js (main entry)
│   ├── config/
│   │   ├── database.js (Prisma setup)
│   │   └── auth.js (JWT config)
│   ├── controllers/
│   │   ├── auth.controller.js (Login/Register)
│   │   ├── books.controller.js (Book CRUD)
│   │   ├── cart.controller.js (Cart management)
│   │   ├── orders.controller.js (Order management)
│   │   └── users.controller.js (User profile)
│   ├── middleware/
│   │   ├── auth.middleware.js (JWT verification)
│   │   └── errorHandler.js (Global error handling)
│   └── routes/
│       ├── auth.routes.js
│       ├── books.routes.js
│       ├── cart.routes.js
│       └── orders.routes.js
├── prisma/
│   └── schema.prisma (Data model)
└── scripts/
    └── seed.js (Populate database)
```

### 1.3 Frontend Architecture Required

```
dusty-shelf/src/
├── components/
│   ├── common/ (Reusable: Button, Card, Modal, etc.)
│   ├── Auth/ (Login, Register, OAuth)
│   ├── Books/ (BookCard, BookGrid, CategoryFilter)
│   ├── Cart/ (CartItem, CartSummary)
│   ├── Checkout/ (DeliveryForm, OrderReview, Payment)
│   └── Order/ (OrderTracking, OrderHistory)
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── BookDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── About.jsx
├── hooks/
│   ├── useAuth.js (Authentication)
│   ├── useBooks.js (Book fetching)
│   ├── useCart.js (Cart management)
│   ├── useOrders.js (Order management)
│   └── useGeolocation.js (Location)
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── OrderContext.jsx
├── services/
│   ├── api.js (Axios instance)
│   ├── auth.js (Auth APIs)
│   ├── books.js (Book APIs)
│   └── orders.js (Order APIs)
└── store/ (Redux or Zustand if needed)
```

---

## Phase 2: Database Schema & Data Model

### 2.1 Prisma Schema Definition

**Required Models:**
```prisma
model User {
  id String @id @default(cuid())
  email String @unique
  password String? (hashed)
  googleId String?
  name String
  phone String?
  addresses Address[]
  orders Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Book {
  id String @id @default(cuid())
  title String
  author String
  isbn String @unique
  category Category
  condition String (Like New/Good/Acceptable)
  price Int (in paise, display as ₹)
  description String?
  imageUrl String? (ISBN-based: https://covers.openlibrary.org/b/isbn/{ISBN}-M.jpg)
  quantity Int @default(1)
  cartItems CartItem[]
  orderItems OrderItem[]
}

model Category {
  id String @id @default(cuid())
  name String @unique (UG, PG, Programming, Commerce, Mythology, Fiction)
  description String?
  books Book[]
}

model Cart {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]
}

model CartItem {
  id String @id @default(cuid())
  cartId String
  cart Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)
  bookId String
  book Book @relation(fields: [bookId], references: [id])
  quantity Int @default(1)
  addedAt DateTime @default(now())
}

model Address {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName String
  phone String
  addressLine1 String
  addressLine2 String?
  city String
  state String
  pinCode String
  isDefault Boolean @default(false)
}

model Order {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  items OrderItem[]
  shippingAddress Address
  totalAmount Int (in paise)
  status OrderStatus @default(PLACED)
  paymentMethod String
  paymentStatus String
  trackingNumber String?
  notes String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OrderItem {
  id String @id @default(cuid())
  orderId String
  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  bookId String
  book Book @relation(fields: [bookId], references: [id])
  quantity Int
  price Int (in paise)
}

enum OrderStatus {
  PLACED
  CONFIRMED
  SHIPPED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}
```

---

## Phase 3: Backend Implementation Roadmap

### 3.1 Authentication System

**Tasks:**
- [ ] Setup JWT token generation (HS256)
- [ ] Implement password hashing (bcrypt)
- [ ] Create User registration endpoint (/auth/register)
- [ ] Create User login endpoint (/auth/login)
- [ ] Setup Google OAuth (optional)
- [ ] Implement token refresh mechanism
- [ ] Create auth middleware for protected routes
- [ ] Logout endpoint

**Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/google (OAuth)
```

### 3.2 Books API

**Tasks:**
- [ ] Create /books endpoint with pagination
- [ ] Filter by category
- [ ] Filter by condition (Like New/Good/Acceptable)
- [ ] Filter by price range
- [ ] Search functionality (title/author)
- [ ] Book detail endpoint (/books/:id)
- [ ] Validate ISBN-based image URLs
- [ ] Implement fallback images

**Endpoints:**
```
GET /api/books (with filters: category, condition, price, search, page, limit)
GET /api/books/:id
GET /api/categories
GET /api/books/search?q=query
```

### 3.3 Cart Management

**Tasks:**
- [ ] Add item to cart
- [ ] Remove item from cart
- [ ] Update quantity
- [ ] Get cart items
- [ ] Clear cart

**Endpoints:**
```
GET /api/cart
POST /api/cart/add
PUT /api/cart/:itemId
DELETE /api/cart/:itemId
DELETE /api/cart (clear all)
```

### 3.4 Orders & Checkout

**Tasks:**
- [ ] Create order from cart
- [ ] Store delivery address with order
- [ ] Update order status
- [ ] Get user orders
- [ ] Get order details with tracking
- [ ] Implement order status tracking

**Endpoints:**
```
POST /api/orders (create)
GET /api/orders (user's orders)
GET /api/orders/:id (order detail)
PUT /api/orders/:id/status (update status)
GET /api/orders/:id/tracking
```

### 3.5 Address Management

**Tasks:**
- [ ] Add delivery address
- [ ] Update delivery address
- [ ] Get user addresses
- [ ] Set default address

**Endpoints:**
```
POST /api/addresses
GET /api/addresses
PUT /api/addresses/:id
DELETE /api/addresses/:id
```

---

## Phase 4: Frontend Implementation Roadmap

### 4.1 Authentication Flow

**Components to Build:**
- [ ] Login page with email/password
- [ ] Register page
- [ ] Google OAuth button
- [ ] Protected route wrapper
- [ ] Session management
- [ ] Auth context with useAuth hook

**Features:**
- JWT token storage (localStorage with secure flag)
- Auto-logout on token expiry
- Login state persistence
- Redirect unauthorized users to login

### 4.2 Book Display System

**Components to Build:**
- [ ] BookCard component
  - Display: Title, Author, Category, Condition, Price (₹)
  - ISBN-based image: `https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg`
  - Fallback image for missing ISBN
  - Add to Cart button
- [ ] BookGrid component with pagination
- [ ] CategoryFilter component
- [ ] Search functionality
- [ ] Sorting options

### 4.3 Cart System

**Components to Build:**
- [ ] Cart context provider
- [ ] useCart hook
- [ ] Cart page
- [ ] Cart items list
- [ ] Cart summary
- [ ] Proceed to checkout button

### 4.4 Checkout & Delivery

**Components to Build:**
- [ ] Delivery address form
  - Manual entry fields
  - OR Geolocation button
  - Saved addresses selector
- [ ] Address validation
- [ ] Order review page
- [ ] Payment method selector (COD initially)
- [ ] Order confirmation page

### 4.5 Order Management

**Components to Build:**
- [ ] Orders history page
- [ ] Order detail page
- [ ] Order tracking display
  - Status: Placed → Confirmed → Shipped → Out for Delivery → Delivered
  - Timeline view
  - Estimated delivery date

---

## Phase 5: Implementation Sequence

### Sprint 1: Core Backend APIs (Days 1-3)
1. Setup database schema & migrations
2. Implement authentication (Register/Login)
3. Implement books API with ISBN image handling
4. Seed database with books data

### Sprint 2: Frontend Authentication & Books (Days 4-6)
1. Build Login/Register pages
2. Setup Auth context
3. Build BookCard and BookGrid components
4. Implement category filters
5. Display books with ISBN-based images

### Sprint 3: Cart & Checkout (Days 7-9)
1. Implement cart API endpoints
2. Build Cart context and useCart hook
3. Build cart page and checkout flow
4. Implement delivery address system
5. Build checkout page with address form & geolocation

### Sprint 4: Orders & Finalization (Days 10-12)
1. Implement order creation API
2. Implement order status tracking
3. Build order history and tracking pages
4. Error handling and loading states
5. UI polish and responsiveness

---

## Phase 6: Critical Bug Fixes

### 6.1 Image System
- [ ] Fix: ISBN-based image URL construction
- [ ] Fix: Fallback image for missing ISBN
- [ ] Fix: Image loading states

### 6.2 Data Mapping
- [ ] Fix: Book condition field (undefined → Like New/Good/Acceptable)
- [ ] Fix: Price formatting (₹ symbol and decimals)
- [ ] Fix: Category field mapping from backend

### 6.3 API Integration
- [ ] Fix: useEffect dependencies to prevent infinite loops
- [ ] Fix: Empty loading states
- [ ] Fix: Error state handling
- [ ] Fix: Null/undefined data handling

### 6.4 UI/UX Issues
- [ ] Fix: Duplicate navbars
- [ ] Fix: Layout spacing and alignment
- [ ] Fix: Responsive design issues
- [ ] Fix: Button linking to APIs

### 6.5 Loading & Error States
- [ ] Implement circular loading spinner
- [ ] Implement error boundaries
- [ ] Implement error toast notifications
- [ ] Implement retry mechanisms

---

## Phase 7: About Page Content

**To be filled:**
- Store name: "Dusty Shelf"
- Location: [User to provide]
- Description: "Your go-to second-hand bookstore for affordable college textbooks and novels"
- Mission statement
- Features highlight
- Contact information

---

## Phase 8: Testing & Quality Assurance

### 8.1 Manual Testing Checklist
- [ ] User Registration flow
- [ ] User Login flow
- [ ] Browse books by category
- [ ] Add items to cart
- [ ] Remove items from cart
- [ ] Checkout with manual address
- [ ] Checkout with geolocation
- [ ] Order confirmation
- [ ] Order tracking page
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark mode toggle
- [ ] Error handling (invalid inputs, network errors)

### 8.2 API Testing
- [ ] All endpoints return valid JSON
- [ ] Proper error codes (400, 401, 404, 500)
- [ ] Authentication required for protected routes
- [ ] Data validation on backend
- [ ] Database transactions for order creation

### 8.3 Performance
- [ ] Book list pagination working
- [ ] Images load efficiently
- [ ] Cart operations responsive
- [ ] No infinite loading loops

---

## Phase 9: Deployment Checklist

### Backend
- [ ] Environment variables configured (.env)
- [ ] Database migrations applied
- [ ] CORS configured properly
- [ ] Error logging setup
- [ ] Rate limiting configured

### Frontend
- [ ] Build optimization
- [ ] API endpoints updated to production
- [ ] Environment variables configured
- [ ] Error tracking setup
- [ ] Analytics (optional)

---

## Success Criteria

✅ **User Authentication:**
- Login/Register functional
- JWT tokens valid and refreshing correctly
- Protected routes working

✅ **Book Display:**
- All books visible with correct data
- ISBN-based images displaying
- Categories filtering correctly
- Search functionality working

✅ **Shopping:**
- Add to cart functional
- Cart persisting across sessions
- Checkout flow complete

✅ **Delivery:**
- Address entry working
- Geolocation integration working
- Order created with delivery info

✅ **Tracking:**
- Order status displayed
- Order history visible
- Tracking page functional

✅ **UI/UX:**
- No broken layouts
- Responsive across devices
- Loading states visible
- Error messages clear
- All buttons functional

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.x |
| Frontend Build | Vite | 8.x |
| Frontend Styling | TailwindCSS | 3.x |
| Frontend Animation | Framer Motion | Latest |
| Backend | Node.js | 18+ |
| Backend Framework | Express | 4.x |
| Database | SQLite (Prisma) | Latest |
| Authentication | JWT + bcrypt | Latest |
| API Client | Axios | Latest |

---

## Notes for Developer

1. **Priority Order:** Fix existing issues first, then add new features
2. **Testing:** Test each component locally before integration
3. **Git:** Commit after each completed task
4. **Documentation:** Keep README updated with API documentation
5. **Environment:** Use `.env` files for sensitive data
6. **Code Quality:** Follow ESLint and Prettier configuration
7. **Error Handling:** Never let promises reject silently
8. **Logging:** Use consistent logging across frontend and backend

---

## Next Steps

1. Read this document completely
2. Check current codebase status
3. Set up backend database schema
4. Implement authentication
5. Build book display system
6. Implement cart and checkout
7. Test and deploy

---

**Status:** 📋 Planning Phase  
**Last Updated:** 2026-04-20  
**Target Completion:** 2026-04-30
