# PageTurners - Full-Stack Second-Hand Bookstore

A modern, feature-rich marketplace for buying and selling second-hand books built with React, Node.js, PostgreSQL, and Stripe payments.

## 🚀 Features

- **Book Marketplace**: Browse, search, filter, and purchase second-hand books
- **Seller Dashboard**: List books for sale with image uploads to Cloudinary
- **Admin Panel**: Approve listings, manage users, view analytics
- **Secure Payments**: Stripe integration for safe transactions
- **User Authentication**: JWT-based auth with refresh tokens
- **Search & Filters**: Find books by title, author, genre, condition, price range
- **Order History**: Track all purchases and delivery status
- **Reviews**: Rate and review books
- **Responsive Design**: Tailwind CSS for mobile-friendly interface

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Axios + React Query
- React Hook Form
- Zustand (state management)
- Stripe.js

### Backend
- Node.js + Express.js
- PostgreSQL with Prisma ORM
- JWT Authentication
- bcryptjs for password hashing
- Multer for file uploads
- Nodemailer for emails
- Stripe for payments
- Redis (optional, for sessions)

### Deployment
- Frontend: Vercel
- Backend: Render or Railway
- Database: Supabase (PostgreSQL)
- Storage: Cloudinary

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Stripe account (free)
- Cloudinary account (free)
- Gmail account (for Nodemailer)

## ⚙️ Setup Instructions

### 1. Backend Setup

\`\`\`bash
cd pageturners-backend
npm install
\`\`\`

Create \`.env.local\`:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/pageturners"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="app-password"
FRONTEND_URL="http://localhost:5173"
PORT=5000
NODE_ENV="development"
\`\`\`

Setup database:
\`\`\`bash
npx prisma migrate dev --name init
npx prisma generate
\`\`\`

Start backend:
\`\`\`bash
npm run dev
\`\`\`

Backend runs on http://localhost:5000

### 2. Frontend Setup

\`\`\`bash
cd pageturners-frontend
npm install
\`\`\`

Create \`.env.local\`:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_...
\`\`\`

Start frontend:
\`\`\`bash
npm run dev
\`\`\`

Frontend runs on http://localhost:5173

## 📚 API Routes

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`POST /api/auth/refresh\` - Refresh access token
- \`POST /api/auth/logout\` - Logout user

### Books
- \`GET /api/books\` - Get all books with filters
- \`GET /api/books/featured\` - Get 8 featured books
- \`GET /api/books/:id\` - Get single book with reviews
- \`POST /api/books\` - Create new book listing (seller)
- \`PUT /api/books/:id\` - Update book listing

### Orders & Checkout
- \`POST /api/orders/checkout\` - Create Stripe checkout session
- \`POST /api/orders/webhook\` - Stripe webhook handler
- \`GET /api/orders/my-orders\` - Get user's orders

### Users
- \`GET /api/users/me\` - Get profile
- \`PUT /api/users/me\` - Update profile

### Admin
- \`GET /api/admin/stats\` - Get dashboard stats
- \`GET /api/admin/books/pending\` - Get pending book approvals
- \`PUT /api/admin/books/:id/approve\` - Approve book listing
- \`GET /api/admin/users\` - Get all users

## 🎨 Design System

- **Brand Green**: #4A7C59
- **Dark Green**: #2E5238
- **Light Green**: #E8F4EC
- **Accent Amber**: #C96A2B
- **Font**: Inter (Google Fonts)

## 📱 Pages

### Public
- **Home** - Hero, categories, featured books
- **Shop** - Full catalog with filters, search, pagination
- **Book Detail** - Images, info, reviews, add to cart
- **Cart** - Review items, checkout with Stripe
- **About** - Company info and stats
- **Contact** - Contact form

### Protected
- **Sell** - Form to list books (seller only)
- **Profile** - User profile management
- **Orders** - Order history and tracking

### Admin
- **Admin Dashboard** - Stats, approve books, manage users

## 🔐 Security Features

- JWT tokens with 15-min expiration
- Refresh tokens stored in httpOnly cookies
- Bcryptjs password hashing (12 rounds)
- Helmet.js for headers security
- CORS protection
- Rate limiting on auth routes
- Zod validation on all inputs
- Prisma prevents SQL injection

## 📦 Database Schema

### users
- id, name, email, passwordHash, role, phone, avatar, bio, createdAt

### books
- id, title, author, isbn, genre, condition, price, stockQty, description, imageUrl, sellerId, status, rating, reviewCount, createdAt

### orders
- id, buyerId, totalAmount, deliveryAddress, paymentStatus, orderStatus, stripeSessionId, createdAt

### order_items
- id, orderId, bookId, quantity, priceAtPurchase, createdAt

### reviews
- id, bookId, userId, rating, comment, createdAt

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Auto-deploy on push

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set environment variables
5. Deploy

### Database (Supabase)

1. Create project on Supabase
2. Run migrations: \`npx prisma migrate deploy\`
3. Update DATABASE_URL in backend

## 🤝 Contributing

Contributions welcome! Please follow the existing code style and create feature branches.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

For issues or questions, open a GitHub issue or contact support@pageturners.com

---

Happy selling and reading! 📖
