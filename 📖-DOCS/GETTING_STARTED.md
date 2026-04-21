# 🚀 PageTurners - Complete Getting Started Guide

## ✨ What You've Built

A **production-ready full-stack second-hand bookstore** with:
- React + Vite modern frontend with Tailwind CSS
- Node.js/Express.js REST API backend
- PostgreSQL database with Prisma ORM
- Stripe payment integration
- JWT authentication with refresh tokens
- Admin dashboard and seller listings
- Search, filters, and pagination
- Responsive design across all devices

---

## 🎯 Step 1: Local Development Setup (5-10 minutes)

### 1.1 Prerequisites
- Node.js 18+ ([download here](https://nodejs.org/))
- PostgreSQL 14+ ([download here](https://www.postgresql.org/))
- Git
- GitHub account (optional, for deployment)

### 1.2 Create Local PostgreSQL Database
```bash
# Open PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE pageturners;

# Exit
\q
```

### 1.3 Backend Setup
```bash
cd pageturners-backend

# Install dependencies
npm install

# Create .env.local with your PostgreSQL connection
# Replace 'username' and 'password' with your PostgreSQL credentials
cat > .env.local << EOF
DATABASE_URL="postgresql://username:password@localhost:5432/pageturners"
JWT_SECRET="dev-secret-key-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret"
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_placeholder"
CLOUDINARY_NAME="placeholder"
CLOUDINARY_API_KEY="placeholder"
CLOUDINARY_API_SECRET="placeholder"
SMTP_USER="placeholder@gmail.com"
SMTP_PASS="placeholder"
ADMIN_EMAIL="admin@pageturners.com"
FRONTEND_URL="http://localhost:5173"
PORT=5000
NODE_ENV="development"
EOF

# Setup database
npx prisma migrate dev --name init

# Start backend
npm run dev
```

✅ Backend running at **http://localhost:5000**

### 1.4 Frontend Setup
```bash
cd ../pageturners-frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_placeholder
EOF

# Start frontend
npm run dev
```

✅ Frontend running at **http://localhost:5173**

### 1.5 Test It Works
1. Open browser → http://localhost:5173
2. Click **Register** → Create account
3. Click **Shop** → Browse books (empty, but working!)
4. Check console (F12) for no errors

---

## 💳 Step 2: Integration Setup (15-20 minutes)

### 2.1 Stripe Setup
1. Go to [stripe.com](https://stripe.com)
2. Sign up for free account
3. Go to **Developers** → **API Keys**
4. Copy **Secret Key** (starts with `sk_test_`)
5. Copy **Publishable Key** (starts with `pk_test_`)
6. Update both `.env.local` files:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   VITE_STRIPE_KEY=pk_test_YOUR_KEY_HERE
   ```

### 2.2 Cloudinary Setup (Image Uploads)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to **Dashboard**
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Update backend `.env.local`:
   ```
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### 2.3 Gmail Setup (Email Notifications)
1. Enable 2FA on Gmail account
2. Create [App Password](https://myaccount.google.com/apppasswords)
3. Update backend `.env.local`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

---

## 🧪 Step 3: Test All Features Locally

### Test 1: User Registration & Login
```bash
# Open http://localhost:5173/register
# Fill form and submit
# Should redirect to home and show user name in navbar
```

### Test 2: Browse Books
```bash
# Navigate to /shop
# Filters should work (though no books in DB yet)
# Search, genre, condition filters functional
```

### Test 3: Add to Cart
```bash
# Add book to cart → Check localStorage in DevTools (F12)
# Items persist after refresh
```

### Test 4: Admin Dashboard
```bash
# Create user with ADMIN role in database (manual SQL)
# Login as admin
# Access /admin → View stats, manage books
```

---

## 📚 Step 4: Seed Sample Data

### Option A: Seed via Database
```bash
cd pageturners-backend

# Create seed file
cat > prisma/seed.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create sample books
  const books = await prisma.book.createMany({
    data: [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        condition: "GOOD",
        price: 8.99,
        stockQty: 5,
        description: "A classic novel set in Jazz Age New York",
        status: "ACTIVE",
        sellerId: "seller-id-here"
      },
      // Add more books...
    ]
  });

  console.log(`Created ${books.count} books`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
EOF

# Run seed
node prisma/seed.js
```

### Option B: Manually Add via Prisma Studio
```bash
npx prisma studio
# GUI interface opens → Add books manually
```

---

## 🌍 Step 5: Deployment (Production)

### Frontend → Vercel (Free)

1. **Push to GitHub**
```bash
cd pageturners-frontend
git init
git add .
git commit -m "Initial PageTurners frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pageturners-frontend.git
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select GitHub repo
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend.render.com/api
     VITE_STRIPE_KEY=pk_live_YOUR_LIVE_KEY
     ```
   - Deploy!

### Backend → Render (Free)

1. **Push to GitHub**
```bash
cd pageturners-backend
git init
git add .
git commit -m "Initial PageTurners backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pageturners-backend.git
git push -u origin main
```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Select GitHub repo
   - Set Build Command: `npm install && npx prisma migrate deploy`
   - Set Start Command: `npm start`
   - Add environment variables
   - Deploy!

### Database → Supabase (Free PostgreSQL)

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Create organization and project
   - Wait for provisioning

2. **Connect to Backend**
   - Copy DATABASE_URL from Supabase
   - Add to Render environment variables
   - Run migrations: `npx prisma migrate deploy`

---

## 🔑 Environment Variables Summary

### Backend (.env.local or Render)
```env
# Database (use Supabase in production)
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="change-me-in-production"
JWT_REFRESH_SECRET="change-me-in-production"

# Stripe (get from stripe.com/developers)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary (get from cloudinary.com/dashboard)
CLOUDINARY_NAME="your_name"
CLOUDINARY_API_KEY="your_key"
CLOUDINARY_API_SECRET="your_secret"

# Email (Gmail app password)
SMTP_USER="your-email@gmail.com"
SMTP_PASS="16-char-app-password"
ADMIN_EMAIL="admin@pageturners.com"

# URLs
FRONTEND_URL="https://your-vercel-app.vercel.app"
PORT=5000
NODE_ENV="production"
```

### Frontend (.env.local or Vercel)
```env
VITE_API_URL="https://your-render-backend.render.com/api"
VITE_STRIPE_KEY="pk_live_..."
```

---

## 📊 Database Schema Overview

Already created with Prisma migrations:
- ✅ Users (with roles: BUYER, SELLER, ADMIN)
- ✅ Books (with conditions & status)
- ✅ Orders (with payment tracking)
- ✅ OrderItems (line items)
- ✅ Reviews (1 per user per book)

---

## 🎨 Key Features Ready to Use

✅ **User Management**
- Registration, Login, Profile
- JWT auth with refresh tokens
- Role-based access (BUYER/SELLER/ADMIN)

✅ **Book Marketplace**
- List books with filters (genre, condition, price)
- Search books by title/author
- Pagination support
- Book detail page with reviews

✅ **Shopping**
- Add to cart (localStorage)
- View cart
- Stripe checkout
- Order tracking

✅ **Seller Tools**
- List new books
- Manage listings
- View sales

✅ **Admin Tools**
- Approve pending books
- View dashboard stats
- Manage users

✅ **Design System**
- Green color theme
- Responsive Tailwind CSS
- Reusable BookCard component
- Professional header/footer

---

## 🚨 Common Issues & Fixes

### "Cannot find module 'express'"
```bash
cd pageturners-backend
npm install
```

### "Connection refused" (Database)
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env.local
- Verify database exists: `psql -U postgres -l`

### "VITE_API_URL is undefined"
- Create `.env.local` in frontend folder
- Add: `VITE_API_URL=http://localhost:5000/api`
- Restart: `npm run dev`

### "Stripe key is invalid"
- Get keys from [stripe.com/developers](https://stripe.com/developers)
- Test keys start with `pk_test_` and `sk_test_`
- Live keys start with `pk_live_` and `sk_live_`

---

## 📱 Next Steps After Setup

### Week 1
- [ ] Setup all 3 integrations (Stripe, Cloudinary, Gmail)
- [ ] Add sample books to database
- [ ] Test full checkout flow
- [ ] Test admin approval workflow

### Week 2
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Setup production Stripe keys
- [ ] Test production deployment

### Week 3
- [ ] Add additional features:
  - Book recommendations
  - Wishlist functionality
  - Advanced search
  - User messaging

### Ongoing
- [ ] Monitor errors in production
- [ ] Add more books/sellers
- [ ] Gather user feedback
- [ ] Scale infrastructure as needed

---

## 📖 Documentation Files

- **README_PAGETURNERS.md** - Full project overview
- **pageturners-backend/README.md** - Backend API docs
- **pageturners-frontend/README.md** - Frontend docs
- **PAGETURNERS_STRUCTURE.md** - Project structure

---

## 🆘 Need Help?

### Common Questions

**Q: Can I run both frontend and backend on same machine?**
A: Yes! Frontend on 5173, backend on 5000. Both can run simultaneously.

**Q: Do I need separate GitHub repos?**
A: Not required, but recommended for easier deployment and team collaboration.

**Q: Can I add more features?**
A: Absolutely! The foundation is solid. Add features to match your needs.

**Q: How do I handle payments in production?**
A: Switch to Stripe live keys, add your bank account, and process real payments.

**Q: What about GDPR compliance?**
A: Add privacy policy, terms of service, and ensure proper data handling.

---

## 🎉 You're All Set!

You now have:
✅ Full-stack bookstore application
✅ Modern tech stack
✅ Production-ready code
✅ Deployment paths
✅ Comprehensive documentation

**Next action:** 
1. Setup integrations (Stripe, Cloudinary, Gmail)
2. Add sample books
3. Test locally
4. Deploy to production!

**Happy coding!** 📚🚀

---

**Built with ❤️ using React, Node.js, PostgreSQL, and Stripe**
