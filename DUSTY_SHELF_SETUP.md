# Dusty Shelf - Complete E-Commerce Bookstore Setup Guide

## 📋 Prerequisites
- Node.js (v16+)
- PostgreSQL database
- npm or yarn

## 🚀 Backend Setup

### 1. Environment Variables
Create `.env` file in `pageturners-backend/`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dusty_shelf"

# JWT
JWT_SECRET="your_jwt_secret_key_here"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_here"
JWT_EXPIRE="15m"
JWT_REFRESH_EXPIRE="7d"

# Server
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# Optional
ADMIN_USER_ID="admin-default-id"
```

### 2. Install Dependencies
```bash
cd pageturners-backend
npm install
npx prisma generate
```

### 3. Database Migration
```bash
npx prisma migrate dev --name init
```

### 4. Populate Books (Optional)
```bash
node scripts/populateBooks.js
```

### 5. Start Backend
```bash
npm run dev  # Development with nodemon
# or
npm start   # Production
```

Backend runs on `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Environment Variables
Create `.env` file in `pageturners-frontend/`:

```bash
VITE_API_URL="http://localhost:5000/api"
VITE_APP_NAME="Dusty Shelf"
```

### 2. Install Dependencies
```bash
cd pageturners-frontend
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📚 Database Schema

### Tables
- **users**: User accounts with roles (BUYER, SELLER, ADMIN)
- **books**: Book listings with conditions (LIKE_NEW, GOOD, FAIR), prices in ₹
- **categories**: Book categories
- **cart_items**: Shopping cart items
- **orders**: Customer orders with GPS tracking
- **order_items**: Order line items
- **reviews**: Book reviews and ratings
- **api_keys**: API access keys for developers

---

## 🔑 API Endpoints

### Books
- `GET /api/books` - Get all books with filters
- `GET /api/books/featured` - Get featured books
- `GET /api/books/search?q=query` - Search books
- `GET /api/books/:id` - Get book details

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add to cart
- `PUT /api/cart/item/:itemId` - Update cart item
- `DELETE /api/cart/item/:itemId` - Remove from cart

### Orders
- `POST /api/orders/:userId/create` - Create order
- `GET /api/orders/:userId` - Get user's orders
- `GET /api/orders/:orderId/track` - Track order
- `POST /api/orders/:orderId/payment` - Process payment

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### API Keys
- `POST /api/keys/:userId/create` - Create API key
- `GET /api/keys/:userId` - Get all user's keys
- `POST /api/keys/validate` - Validate API key

---

## 🎨 UI Features

### Pages
- **Home**: Hero section, featured books, categories, newsletter signup
- **Shop**: Book grid with filters, search, pagination
- **About**: About Dusty Shelf & Jain University details
- **Cart**: Review items, update quantities, checkout
- **Login/Register**: User authentication
- **Contact**: Contact information

### Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ 400+ books with conditions (Like New, Good, Fair)
- ✅ Prices in Indian Rupees (₹)
- ✅ Book ratings and reviews
- ✅ Search and filtering
- ✅ Shopping cart functionality
- ✅ Order tracking with GPS
- ✅ Professional UI with Tailwind CSS

---

## 🔒 Authentication

### JWT Flow
1. User registers/logs in
2. Backend returns access token (15min) and refresh token (7 days)
3. Frontend stores tokens in localStorage/sessionStorage
4. Every API request includes `Authorization: Bearer <token>`
5. Refresh token used to get new access token when expired

### Google OAuth (Optional)
Can be integrated via Google Cloud Console

---

## 📊 Book Categories

- **UG**: C Programming, Java, Data Structures, DBMS, OS
- **PG**: AI, ML, Advanced Algorithms
- **Programming**: Web Dev, Python, JavaScript
- **Commerce**: Accounting, Economics, Business
- **Mythology**: Mahabharata, Ramayana, Bhagavad Gita, Bible, Quran
- **Fiction**: Romance, Mystery, Sci-Fi, Stories

---

## 🧪 Testing API with Postman

### Create API Key
```bash
POST http://localhost:5000/api/keys/{userId}/create
Headers:
  Authorization: Bearer {jwt_token}
Body:
{
  "name": "My API Key",
  "role": "DEVELOPER",
  "rateLimit": 1000
}
```

### Use API Key
```bash
GET http://localhost:5000/api/books
Headers:
  x-api-key: {api_key}
```

---

## 🐛 Troubleshooting

### Books not loading
- Check `DATABASE_URL` in `.env`
- Verify database migrations: `npx prisma migrate status`
- Check backend logs for errors

### Auth issues
- Verify `JWT_SECRET` is set
- Check token expiration
- Clear browser cookies/localStorage

### CORS errors
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS middleware in `server.js`

---

## 📞 Support

For issues, check:
- Backend logs in terminal
- Browser console for frontend errors
- Database connectivity with `psql`

---

## ✨ Features To Implement

### Phase 2
- [ ] Google OAuth integration
- [ ] Email verification
- [ ] Payment gateway (Razorpay/Stripe)
- [ ] Seller dashboard
- [ ] Admin panel
- [ ] Recommendation system enhancements
- [ ] Mobile app
- [ ] Analytics dashboard

---

**Last Updated**: April 2026
**Version**: 1.0.0
