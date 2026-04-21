# PageTurners Project Structure

## 📁 Directory Layout

```
pcl/
├── pageturners-backend/          # Node.js Express API
│   ├── src/
│   │   ├── server.js             # Express app entry
│   │   ├── routes/               # API route handlers
│   │   ├── controllers/          # Business logic
│   │   ├── middleware/           # Auth, validation
│   │   └── config/               # JWT config
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   ├── package.json
│   ├── .env.local               # Environment variables
│   └── README.md
│
├── pageturners-frontend/         # React + Vite
│   ├── src/
│   │   ├── main.jsx             # Entry point
│   │   ├── App.jsx              # Main component & routing
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── store/               # Zustand stores
│   │   ├── config/              # API config
│   │   ├── constants.js         # Constants & enums
│   │   └── index.css            # Tailwind styles
│   ├── public/                  # Static assets
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.local              # Environment variables
│   └── README.md
│
├── README_PAGETURNERS.md        # Full project guide
└── .gitignore
```

## 🚀 Quick Start Commands

### Backend
```bash
cd pageturners-backend
npm install
npx prisma migrate dev --name init
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd pageturners-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## 🔧 Setup Checklist

- [ ] Create PostgreSQL database named 'pageturners'
- [ ] Create `.env.local` files with required variables
- [ ] Run `npx prisma migrate dev` to setup database
- [ ] Get Stripe API keys from stripe.com
- [ ] Get Cloudinary credentials from cloudinary.com
- [ ] Set up Gmail app password for Nodemailer
- [ ] Install npm dependencies for both frontend and backend
- [ ] Start both servers and verify at http://localhost:5173

## 📦 Dependencies Summary

### Backend
- express, cors, helmet, dotenv
- @prisma/client, postgresql
- jsonwebtoken, bcryptjs
- stripe, nodemailer, cloudinary, multer
- zod, express-rate-limit, redis

### Frontend
- react, react-dom, react-router-dom
- axios, @tanstack/react-query, zustand
- react-hook-form
- @stripe/react-stripe-js, @stripe/stripe-js
- tailwindcss

## 🎯 Next Development Steps

### High Priority
1. Add book detail page (/books/:id) with full info + reviews
2. Implement seller book listing form with image upload
3. Add user profile page for profile management
4. Implement order tracking page
5. Add Cloudinary integration for image uploads
6. Complete Stripe webhook handling
7. Setup email notifications with Nodemailer

### Medium Priority
8. Add book reviews and ratings system
9. Implement admin book approval workflow
10. Add admin analytics dashboard
11. Implement search autocomplete
12. Add wishlist functionality
13. Implement user messaging system
14. Add order cancellation/refunds

### Lower Priority
15. Add book recommendations algorithm
16. Implement social sharing features
17. Add book reading list/collection features
18. Setup CI/CD with GitHub Actions
19. Add Docker deployment
20. Mobile app (React Native)

## 🌐 Deployment Targets

### Frontend → Vercel
- Auto-deploy from GitHub
- Environment variables in Vercel dashboard
- CDN global distribution
- Zero-downtime deployments

### Backend → Render or Railway
- Connect GitHub repo
- Environment variables in dashboard
- Auto-redeploy on push
- Automatic SSL certificates

### Database → Supabase
- PostgreSQL managed service
- Automatic backups
- Vector search capabilities
- Real-time subscriptions

## 📊 Database Schema (Ready to Deploy)

✅ Users (buyer/seller/admin roles)
✅ Books (with seller relationship)
✅ Orders & OrderItems
✅ Reviews (1 per user per book)
✅ Status enums (BookStatus, PaymentStatus, OrderStatus, Condition)

## 🔐 Security Features Already Implemented

✅ JWT with 15-min expiration + 7-day refresh
✅ Bcryptjs password hashing (12 rounds)
✅ Helmet.js security headers
✅ CORS configured
✅ Rate limiting on auth
✅ Zod input validation
✅ SQL injection prevention (Prisma)
✅ Role-based access control

## 📚 Key Features Ready

✅ User authentication & authorization
✅ Book marketplace with search/filters
✅ Stripe payment integration
✅ Admin dashboard
✅ Seller book listings (pending admin approval)
✅ Order history
✅ Reviews system
✅ Responsive design (Tailwind)
✅ Protected routes

## 🎨 Branding Applied

- Green (#4A7C59) - Primary brand color
- Dark Green (#2E5238) - Secondary
- Light Green (#E8F4EC) - Backgrounds
- Amber (#C96A2B) - Accent/CTA
- Inter font - Modern, clean typography
