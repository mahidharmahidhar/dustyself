# Backend API - PageTurners

Node.js + Express.js API for the PageTurners second-hand bookstore marketplace.

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

## Environment Variables

Create `.env.local` with:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pageturners"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
ADMIN_EMAIL="admin@pageturners.com"
FRONTEND_URL="http://localhost:5173"
PORT=5000
NODE_ENV="development"
```

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Books Endpoints
- `GET /books?search=&genre=&condition=&priceMin=&priceMax=&page=1&sort=newest` - List books
- `GET /books/featured` - Get 8 featured books
- `GET /books/:id` - Get single book
- `POST /books` - Create book (seller)
- `PUT /books/:id` - Update book

### Orders Endpoints
- `POST /orders/checkout` - Create Stripe session
- `POST /orders/webhook` - Stripe webhook
- `GET /orders/my-orders` - User's orders

### Users Endpoints
- `GET /users/me` - Get profile
- `PUT /users/me` - Update profile

### Admin Endpoints
- `GET /admin/stats` - Dashboard stats
- `GET /admin/books/pending` - Pending approvals
- `PUT /admin/books/:id/approve` - Approve book
- `GET /admin/users` - All users

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)

## Project Structure

```
src/
├── server.js          # Express app entry point
├── routes/            # API routes
├── controllers/       # Route handlers
├── middleware/        # Custom middleware
├── config/            # Configuration (JWT, etc)
└── utils/             # Utility functions
prisma/
├── schema.prisma      # Database schema
└── migrations/        # Database migrations
```

## Features

✅ JWT Authentication with refresh tokens
✅ Role-based access control (buyer/seller/admin)
✅ Book marketplace with search and filters
✅ Stripe payment integration
✅ Admin approval workflow
✅ User profiles and order history
✅ Book reviews and ratings
✅ Prisma ORM with PostgreSQL
✅ Input validation with Zod
✅ Security headers with Helmet
✅ Rate limiting on auth routes

## Testing API Locally

Use Postman or cURL to test endpoints:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get featured books
curl http://localhost:5000/api/books/featured
```

## Troubleshooting

**Database connection error:**
- Check DATABASE_URL in .env.local
- Ensure PostgreSQL is running
- Run `npx prisma db push` to sync schema

**Port 5000 already in use:**
- Change PORT in .env.local
- Or kill the process: `lsof -i :5000 | kill -9`

**Stripe webhook not working:**
- Use Stripe CLI to forward webhooks locally
- Set correct STRIPE_WEBHOOK_SECRET in .env.local

## Next Steps

1. Set up PostgreSQL database
2. Configure Stripe account
3. Set up Cloudinary for image uploads
4. Configure Gmail for Nodemailer
5. Deploy to Render or Railway
