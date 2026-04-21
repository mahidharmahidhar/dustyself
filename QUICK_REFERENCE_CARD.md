# ⚡ DUSTY SHELF - Quick Reference Card

**Status**: Ready for Implementation  
**Time to Complete**: 9-12 hours  
**Target**: Production-ready bookstore with all 11 objectives met

---

## 📋 OBJECTIVE CHECKLIST

Your 11 Requirements → Implementation Status:

1. ✅ **Fix Missing/Broken Features** → Phase 1-2
2. ✅ **Authentication (JWT)** → Phase 3
3. ✅ **Book Images (ISBN-based)** → Phase 4
4. ✅ **Book Card Info** → Phase 2 & 4
5. ✅ **Book Categories with Filters** → Phase 2 & 7
6. ✅ **Delivery System & Tracking** → Phase 6
7. ✅ **API Integration** → Phase 1-2
8. ✅ **Loading Spinner & Error Handling** → Phase 7
9. ✅ **Clean, Responsive UI** → Phase 7
10. ✅ **About Page (with Location)** → Phase 7
11. ✅ **Functional Buttons** → All Phases

---

## 🚀 QUICK START (15 MINUTES)

```bash
# Terminal 1: Backend
cd pageturners-backend
npm install
npm run seed
npm run dev

# Terminal 2: Frontend
cd dusty-shelf
npm install
npm run dev

# Terminal 3: Test
curl http://localhost:5000/api/health
```

Open: http://localhost:5173

---

## 🔑 CRITICAL CONFIGURATION

### Backend (.env)
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=<32+ random chars>
JWT_REFRESH_SECRET=<32+ random chars>
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STORE_LOCATION=Jain University, Jayanagar, Bangalore, India
```

---

## 📁 FILE STRUCTURE TO CREATE

### Backend Routes (5 files)
```
pageturners-backend/src/routes/
├── books.js       (GET all, featured, categories, single)
├── auth.js        (register, login, refresh, logout)
├── cart.js        (add, get, remove, clear)
├── orders.js      (create, get user orders, get single, update status)
└── services/
    ├── imageService.js (ISBN → Open Library URL)
```

### Frontend Pages (5 files)
```
dusty-shelf/src/pages/
├── Shop.jsx       (Books with filters)
├── Cart.jsx       (Cart items, quantities)
├── Checkout.jsx   (Delivery form + geolocation)
├── Orders.jsx     (Order history with status)
├── About.jsx      (Store info + location)
```

### Frontend Contexts (2 files)
```
dusty-shelf/src/context/
├── AuthContext.jsx    (User login state)
├── CartContext.jsx    (Cart items state)
```

### Frontend Services (2 files)
```
dusty-shelf/src/services/
├── api.js         (All API calls)

dusty-shelf/src/components/
├── BookCard.jsx         (Book display)
├── LoadingSpinner.jsx   (Loading state)
├── Toast/Toast.jsx      (Notifications)
```

---

## 🎯 IMPLEMENTATION PHASES (IN ORDER)

| Phase | Feature | Time | Files |
|-------|---------|------|-------|
| 1 | Infrastructure | 2-3h | .env, vite.config.js, server.js |
| 2 | Books & Categories | 2-3h | books.js, BookCard, Shop.jsx |
| 3 | Authentication | 2h | auth.js, AuthContext, Login |
| 4 | Book Images | 1h | imageService.js, ISBN handling |
| 5 | Cart & Checkout | 2h | cart.js, CartContext, Cart/Checkout |
| 6 | Delivery & Orders | 2h | orders.js, Checkout form, Orders page |
| 7 | UI/UX Polish | 1-2h | LoadingSpinner, Toast, responsive design |
| 8 | Testing | 1h | API tests, end-to-end testing |

---

## 🔄 DATA FLOW DIAGRAM

```
User Action
    ↓
React Component
    ↓
api.js function
    ↓
Backend Route Handler
    ↓
Prisma Query
    ↓
SQLite Database
    ↓
Response JSON
    ↓
Frontend State Update
    ↓
UI Re-render
```

---

## 🐛 TOP 5 COMMON ISSUES & FIXES

| # | Issue | Fix |
|---|-------|-----|
| 1 | CORS error | Check FRONTEND_URL in backend .env |
| 2 | Port in use | `taskkill /PID <pid> /F` |
| 3 | Empty database | `npm run seed` in backend |
| 4 | Images not loading | Verify ISBN in database |
| 5 | Login fails | Check JWT secrets in .env |

→ **See DEBUGGING_TROUBLESHOOTING_GUIDE.md for 50+ issues**

---

## 📊 API ENDPOINTS CHECKLIST

### Books (Read-only)
- [ ] `GET /api/books` - list with pagination
- [ ] `GET /api/books/featured` - featured books
- [ ] `GET /api/books/categories` - unique categories
- [ ] `GET /api/books/:id` - single book

### Authentication
- [ ] `POST /api/auth/register` - create account
- [ ] `POST /api/auth/login` - get JWT tokens
- [ ] `POST /api/auth/refresh` - refresh access token
- [ ] `POST /api/auth/logout` - logout

### Cart (Requires JWT)
- [ ] `GET /api/cart/:userId` - get cart items
- [ ] `POST /api/cart/:userId/add` - add item
- [ ] `DELETE /api/cart/:userId/remove/:itemId` - remove item
- [ ] `POST /api/cart/:userId/clear` - clear all

### Orders (Requires JWT)
- [ ] `POST /api/orders` - create order
- [ ] `GET /api/orders/user/:userId` - user's orders
- [ ] `GET /api/orders/:orderId` - single order
- [ ] `PATCH /api/orders/:orderId/status` - update status

---

## 💾 DATABASE SCHEMA OVERVIEW

```
User
├── id (PK)
├── email (unique)
├── password (hashed)
├── name
└── createdAt

Book
├── id (PK)
├── title
├── author
├── isbn
├── price
├── category
├── condition (Like New/Good/Acceptable)
├── imageUrl
└── description

CartItem
├── id (PK)
├── userId (FK)
├── bookId (FK)
└── quantity

Order
├── id (PK)
├── userId (FK)
├── totalAmount
├── deliveryAddress
├── latitude
├── longitude
├── status (Placed/Shipped/Out for Delivery/Delivered)
└── createdAt

OrderItem
├── id (PK)
├── orderId (FK)
├── bookId (FK)
├── quantity
└── price
```

---

## 🧪 TESTING CHECKLIST (Phase 8)

### Backend API
- [ ] All endpoints return 200 OK
- [ ] Books data has correct fields
- [ ] Auth tokens valid and refreshable
- [ ] Cart syncs with database
- [ ] Orders persist correctly
- [ ] Status updates work

### Frontend Features
- [ ] User can register → login → logout
- [ ] Browse books with working filters
- [ ] Images load from Open Library
- [ ] Add items to cart
- [ ] Checkout with delivery form
- [ ] Geolocation retrieves coordinates
- [ ] Orders display with status
- [ ] Prices in ₹ format

### UI/UX
- [ ] No duplicate components
- [ ] Loading spinners visible
- [ ] Error messages display
- [ ] Responsive on mobile/tablet/desktop
- [ ] Professional appearance
- [ ] All buttons functional

---

## 📱 UI/UX REQUIREMENTS

### Layout Structure (Every Page)
```
┌─────────────────────────────┐
│        NAVBAR               │
│  (Logo, Links, Cart Icon)   │
├─────────────────────────────┤
│                             │
│      PAGE CONTENT           │
│   (Books, Form, etc.)       │
│                             │
├─────────────────────────────┤
│        FOOTER               │
│  (Info, Links, Contact)     │
└─────────────────────────────┘
```

### Display Standards
- **Prices**: Format as ₹250 (Indian Rupees)
- **Conditions**: Like New, Good, Acceptable (color-coded badges)
- **Categories**: UG, PG, Programming, Commerce, Mythology, Fiction
- **Status**: Placed (blue), Shipped (yellow), Out for Delivery (purple), Delivered (green)

### Loading States
- Show circular spinner while fetching
- Disable buttons during loading
- Prevent double-clicking

### Error Handling
- Display toast notifications
- Show helpful error messages
- Fallback to default images
- Graceful empty states

---

## 🔐 SECURITY CHECKLIST

- [ ] Passwords hashed with bcrypt (10 rounds)
- [ ] JWT tokens used for auth
- [ ] CORS configured correctly
- [ ] API routes protected with middleware
- [ ] SQL injection prevented (using Prisma)
- [ ] Tokens cleared on logout
- [ ] No sensitive data in localStorage

---

## 🎓 ACADEMIC DEMO TALKING POINTS

**Project Overview:**
- Full-stack MERN-like application (React + Node.js)
- Real-world e-commerce use case
- 500+ book database
- Production-ready code quality

**Key Features to Highlight:**
1. JWT authentication system
2. ISBN-based book image integration
3. Geolocation API usage
4. Real-time cart synchronization
5. Order tracking with status updates
6. Responsive design for all devices

**Technical Architecture:**
- Frontend: React + Vite (single-page app)
- Backend: Express.js (RESTful API)
- Database: SQLite + Prisma ORM
- Authentication: JWT with refresh tokens

**Demo Flow:**
1. Register new account
2. Browse books with filters
3. Add book to cart
4. View cart with updated totals
5. Checkout with geolocation
6. View order with status
7. Show backend database (Prisma Studio)
8. Explain API responses (Thunder Client)

---

## 📞 SUPPORT RESOURCES

1. **Main Plan**: `COMPREHENSIVE_DEVELOPMENT_PLAN_DUSTY_SHELF.md`
2. **Checklist**: `IMPLEMENTATION_CHECKLIST.md`
3. **Debugging**: `DEBUGGING_TROUBLESHOOTING_GUIDE.md`
4. **Project Docs**: `/DOCS/` folder
5. **Backend README**: `pageturners-backend/README.md`
6. **Frontend README**: `dusty-shelf/README.md`

---

## ✅ SUCCESS CRITERIA

You're **DONE** when:

✅ Users can register and login  
✅ 500+ books visible and searchable  
✅ Book images display from Open Library  
✅ Cart adds/removes items correctly  
✅ Checkout collects delivery address  
✅ Geolocation button works  
✅ Orders save to database  
✅ Order status displays with updates  
✅ Prices show in ₹ format  
✅ Responsive on all screen sizes  
✅ No console errors  
✅ All buttons functional  

---

## 🚀 DEPLOYMENT READINESS

**Before going live:**
- [ ] All env variables set correctly
- [ ] Database backed up
- [ ] Tests passing
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security checklist complete

---

**Created**: April 20, 2026  
**Status**: ✅ Ready for implementation  
**Next Step**: Begin Phase 1 (start with infrastructure)  

---

### 💡 Pro Tips

1. **Use Prisma Studio** for data verification: `npx prisma studio`
2. **Test APIs** before frontend: `curl` or Thunder Client
3. **Save frequently**: Don't lose progress
4. **Clear cache** if seeing old data: Browser DevTools → Network → Disable Cache
5. **Check console**: F12 in browser for errors
6. **Use exact field names**: From API responses
7. **Test auth flow**: Register → Login → Token → Protected route
8. **Responsive design**: Test on mobile view (F12 → Toggle device toolbar)

Good luck! 🎉

