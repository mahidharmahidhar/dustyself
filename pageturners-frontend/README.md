# Frontend - PageTurners

React 18 + Vite frontend for the PageTurners second-hand bookstore.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_YOUR_STRIPE_PUBLIC_KEY
```

## Pages

- `/` - Home (hero, featured books)
- `/shop` - Book catalog with filters
- `/books/:id` - Book detail page
- `/cart` - Shopping cart
- `/login` - User login
- `/register` - User registration
- `/sell` - Seller dashboard (protected)
- `/profile` - User profile (protected)
- `/admin` - Admin dashboard (admin only)
- `/about` - About us
- `/contact` - Contact form

## Design System

**Colors:**
- Brand Green: `#4A7C59`
- Dark Green: `#2E5238`
- Light Green: `#E8F4EC`
- Accent Amber: `#C96A2B`

**Font:** Inter (via Google Fonts)

## Components

### Layout
- `Header` - Sticky navbar with logo, nav, cart, user menu
- `Footer` - Dark footer with 3 columns + copyright

### Shared
- `BookCard` - Reusable book display card with image, info, add-to-cart

### Pages
- `Home` - Hero, categories, featured books
- `Shop` - Filter sidebar, book grid, pagination
- `Cart` - Cart items, summary, checkout
- `Login` / `Register` - Auth forms
- `Admin` - Stats, pending approvals, user management
- `About` - Company info and stats
- `Contact` - Contact form

## State Management (Zustand)

### useAuthStore
```javascript
const { user, accessToken, setAuth, logout } = useAuthStore();
```

### useCartStore
```javascript
const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();
```

## API Configuration

Auto-configured in `src/config/api.js`:
- Axios instance with base URL
- JWT token management
- Auto refresh token on 401
- CORS with credentials

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Build & Deploy

### Build
```bash
npm run build
```

Generates `dist/` folder ready for deployment.

### Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Auto-deploys on push

### Environment Variables for Production

```env
VITE_API_URL=https://pageturners-api.render.com/api
VITE_STRIPE_KEY=pk_live_YOUR_LIVE_STRIPE_KEY
```

## Features

✅ Modern React 18 with hooks
✅ Client-side routing with React Router
✅ State management with Zustand
✅ Form handling with React Hook Form
✅ Data fetching with React Query
✅ Responsive Tailwind CSS
✅ Stripe Checkout integration
✅ Protected routes
✅ JWT token refresh
✅ LocalStorage for cart persistence

## Troubleshooting

**API calls returning 401:**
- Check `VITE_API_URL` in `.env.local`
- Ensure backend is running on port 5000
- Verify JWT token in localStorage

**Stripe not loading:**
- Check `VITE_STRIPE_KEY` is valid public key
- Ensure key starts with `pk_test_` or `pk_live_`

**Styles not applying:**
- Restart dev server after tailwind changes
- Clear cache: `rm -rf node_modules/.cache`

## Next Steps

1. Implement book detail page view
2. Add seller book listing page
3. Integrate Cloudinary for image uploads
4. Add book reviews
5. Implement order tracking
