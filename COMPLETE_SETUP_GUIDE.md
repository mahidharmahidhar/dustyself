# 🚀 Dusty Shelf - Complete Setup & Testing Guide

## ✅ System Status

### Servers Running
- **Backend**: http://localhost:5000 ✅
- **Frontend**: http://localhost:5173 ✅
- **Database**: SQLite (560+ books seeded) ✅

### Configuration
- **Backend Port**: 5000
- **Frontend Port**: 5173
- **API Base URL**: http://localhost:5000/api
- **Store Location**: Jain University, Jayanagar, Bangalore, India

---

## 📊 Database Content

### Books Populated: 560+

**Categories:**
- 🎓 **UG Courses** (45 books): C Programming, Java, Data Structures, DBMS, OS
- 🏆 **PG Courses** (12 books): AI, ML, Advanced Algorithms
- 💻 **Programming** (60+ books): Web Development, Design Patterns, Clean Code
- 📚 **Commerce** (24 books): Accounting, Economics, Business Law
- 🙏 **Mythology** (56+ books): Mahabharata, Ramayana, Bhagavad Gita, Bible, Quran
- 📖 **Fiction** (400+ books): Bestsellers, Classics, Contemporary

**Book Conditions:**
- Like New (₹ High)
- Good (₹ Medium)
- Acceptable (₹ Low)

**Price Range:** ₹200 - ₹500 (Indian Rupees)

---

## 🌐 API Endpoints

### Books API
```
GET  /api/books                    - Get all books with filters
GET  /api/books/featured           - Get 8 featured books
GET  /api/books/categories/list    - Get all categories
GET  /api/books/:id                - Get single book details
POST /api/books/search             - Search books
```

### Authentication API
```
POST /api/auth/register            - Register new user
POST /api/auth/login               - Login (returns JWT token)
POST /api/auth/logout              - Logout
POST /api/auth/refresh             - Refresh token
```

### Cart API
```
GET  /api/cart/:userId             - Get user's cart
POST /api/cart/:userId/add         - Add item to cart
PUT  /api/cart/item/:itemId        - Update quantity
DELETE /api/cart/item/:itemId      - Remove item
DELETE /api/cart/:userId/clear     - Clear entire cart
```

### Orders API
```
GET  /api/orders                   - Get all orders
POST /api/orders                   - Create new order
GET  /api/orders/:id               - Get order details
```

---

## 🖥️ Frontend Pages

### Implemented Pages

| Page | Route | Status | Features |
|------|-------|--------|----------|
| **Home** | `/` | ✅ | Hero, Featured Books, Testimonials |
| **Shop** | `/shop` | ✅ | Book Grid, Category Filter, Search, Price Filter |
| **About** | `/about` | ✅ | Store Info, Location (Jain University), Contact |
| **Cart** | `/cart` | ✅ | Cart Items, Checkout |
| **Checkout** | `/checkout` | ⚠️ | Address Form, Order Summary, Payment |
| **Login** | `/login` | ✅ | Email/Password Form |
| **Order Confirmation** | `/order-confirmation/:id` | ✅ | Order Details |
| **Book Detail** | `/book/:id` | ✅ | Individual Book Page |
| **404** | `*` | ✅ | Not Found Page |

---

## 🎨 UI Features

### Design System
- **Color Scheme**: Brown/Cream theme (dark mode support)
- **Typography**: Serif headings, clean sans-serif body
- **Responsive**: Mobile-first, works on all devices
- **Animations**: Smooth transitions with Framer Motion

### Component Library
- ✅ BookCard - Display book with details, rating, price
- ✅ BookGrid - Grid layout with loading/error states
- ✅ Navbar - Sticky navigation with search
- ✅ Footer - Company info and links
- ✅ Hero Section - Landing page banner
- ✅ Categories - Horizontal scrolling categories
- ✅ Button - Custom styled button component
- ✅ LoadingSpinner - CSS-based circular spinner

---

## 🧪 Testing Checklist

### Frontend Testing
- [ ] Home page loads with featured books
- [ ] Shop page displays all books with filters working
- [ ] Search functionality works correctly
- [ ] Category filter updates book list
- [ ] Condition filter works (Like New, Good, Acceptable)
- [ ] Price range filter works
- [ ] Book cards display with proper images and pricing
- [ ] Navigation between pages works smoothly
- [ ] About page shows location details
- [ ] Responsive design on mobile

### Backend Testing
- [ ] Health check: `curl http://localhost:5000/api/health`
- [ ] Get books: `curl http://localhost:5000/api/books?limit=5`
- [ ] Get featured: `curl http://localhost:5000/api/books/featured`
- [ ] Get categories: `curl http://localhost:5000/api/books/categories/list`
- [ ] Search books: `curl "http://localhost:5000/api/books/search?search=java"`

### Authentication Testing
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout functionality
- [ ] JWT token refresh

### Cart & Order Testing
- [ ] Add book to cart
- [ ] Update quantity in cart
- [ ] Remove from cart
- [ ] Proceed to checkout
- [ ] Place order with address
- [ ] View order confirmation

---

## 🐛 Troubleshooting

### Issue: Blank white screen
**Solution**: 
1. Check browser console (F12) for errors
2. Verify backend is running: `curl http://localhost:5000/api/health`
3. Check frontend console for API errors
4. Clear browser cache and reload

### Issue: Books not showing
**Solution**:
1. Verify database has books: Backend terminal shows "560 books created"
2. Check API response: `curl http://localhost:5000/api/books`
3. Verify frontend config: `.env` has correct `VITE_API_URL`
4. Check network tab in browser DevTools for API calls

### Issue: Images not loading
**Solution**:
1. Books use ISBN-based image URLs from Open Library
2. Fallback to placeholder if image unavailable
3. Check network tab for broken image URLs

### Issue: Port already in use
**Solution**:
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <pid> /F
```

---

## 📦 File Structure

```
pcl/
├── dusty-shelf/                (Frontend - React + Vite)
│   ├── src/
│   │   ├── components/         (Reusable UI components)
│   │   ├── pages/              (Route pages)
│   │   ├── hooks/              (useBooks, useCart, useAuth, etc.)
│   │   ├── config/             (API endpoints, constants)
│   │   ├── services/           (API calls)
│   │   ├── context/            (Global state)
│   │   └── styles/             (Tailwind CSS)
│   └── .env                    (Frontend configuration)
│
├── pageturners-backend/         (Backend - Node.js + Express)
│   ├── src/
│   │   ├── controllers/        (Business logic)
│   │   ├── routes/             (API endpoints)
│   │   ├── middleware/         (Auth, validation)
│   │   ├── services/           (Database queries)
│   │   └── server.js           (Entry point)
│   ├── prisma/
│   │   ├── schema.prisma       (Database schema)
│   │   └── dev.db              (SQLite database)
│   ├── scripts/
│   │   └── seed.js             (Populate books)
│   └── .env                    (Backend configuration)
│
└── ⚙️-CONFIG/
    ├── .env                    (Central config)
    └── requirements.txt        (Python deps - legacy)
```

---

## 🚀 Quick Start

### Restart Everything
```bash
# Terminal 1: Backend
cd c:\Users\Mahid\OneDrive\Desktop\pcl\pageturners-backend
npm run dev

# Terminal 2: Frontend
cd c:\Users\Mahid\OneDrive\Desktop\pcl\dusty-shelf
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- API Health: http://localhost:5000/api/health
- Books: http://localhost:5000/api/books

### Database Reset (if needed)
```bash
cd c:\Users\Mahid\OneDrive\Desktop\pcl\pageturners-backend
del prisma\dev.db
npx prisma migrate dev --name init
node scripts/seed.js
```

---

## 📝 Next Steps for Full Features

1. **Authentication**
   - Google OAuth integration
   - JWT token persistence
   - User profile pages

2. **Payment Integration**
   - Stripe integration
   - Demo payment simulation
   - Order status tracking

3. **Advanced Features**
   - Recommendation engine
   - Book reviews and ratings
   - Wishlist functionality
   - Seller dashboard

4. **Deployment**
   - Push to production
   - Setup HTTPS
   - Database migration to PostgreSQL
   - Image storage on CDN

---

**Last Updated**: April 20, 2026  
**Status**: Ready for Testing ✅
