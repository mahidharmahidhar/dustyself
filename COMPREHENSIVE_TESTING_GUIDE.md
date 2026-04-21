# 🧪 Complete Testing Guide: Authentication & All Pages

**Date**: April 20, 2026  
**Status**: Ready for Comprehensive Testing

---

## Part 1: Authentication Testing (Task 12)

### 1.1 Login Page Testing

**URL**: http://localhost:5173/login

#### Test Case 1: Valid Login
1. Navigate to login page
2. Enter valid email: `test@example.com`
3. Enter password: `password123`
4. Click "Sign In"
5. **Expected Result**:
   - ✅ Toast notification: "Login successful!"
   - ✅ Redirect to home page
   - ✅ User appears in navbar
   - ✅ localStorage contains user data

#### Test Case 2: Form Validation - Empty Fields
1. Leave email empty
2. Click "Sign In"
3. **Expected Result**:
   - ✅ Error: "Email is required"
   - ✅ Cannot submit form

#### Test Case 3: Form Validation - Invalid Email
1. Enter: `invalid-email`
2. Leave password empty
3. Click "Sign In"
4. **Expected Result**:
   - ✅ Error: "Invalid email"
   - ✅ Error: "Password is required"

#### Test Case 4: Form Validation - Short Password
1. Enter email: `test@example.com`
2. Enter password: `12345` (5 characters)
3. Click "Sign In"
4. **Expected Result**:
   - ✅ Error: "Password must be 6+ characters"

#### Test Case 5: Show/Hide Password
1. Enter password in password field
2. Click eye icon
3. **Expected Result**:
   - ✅ Password visible
   - ✅ Icon changes to eye-off
4. Click again
5. **Expected Result**:
   - ✅ Password hidden again
   - ✅ Icon changes to eye

#### Test Case 6: Remember Me Checkbox
1. Check "Remember me" checkbox
2. Enter credentials and login
3. **Expected Result**:
   - ✅ Checkbox can be checked/unchecked
   - ✅ Login still works

#### Test Case 7: Forgot Password Link
1. Click "Forgot password?" link
2. **Expected Result**:
   - ✅ Link is clickable (structure ready for implementation)

#### Test Case 8: Social Login Buttons
1. Click "Sign in with Google" button
2. Click "Sign in with Apple" button
3. **Expected Result**:
   - ✅ Buttons clickable (ready for OAuth integration)

#### Test Case 9: Sign Up Link
1. Click "Don't have an account? Sign up" link
2. **Expected Result**:
   - ✅ Navigates to register page
   - ✅ URL changes to `/register`

### 1.2 User State & Persistence

#### Test Case 10: User Persistence
1. Login with valid credentials
2. Refresh page (F5)
3. **Expected Result**:
   - ✅ User still logged in
   - ✅ No need to login again
   - ✅ localStorage shows user data

#### Test Case 11: Check localStorage
1. Open DevTools → Application → Local Storage
2. Look for key: `dusty-shelf-user`
3. **Expected Result**:
   - ✅ Contains user object with email and name

#### Test Case 12: Logout
1. After login, click user menu in navbar
2. Click "Logout" button
3. **Expected Result**:
   - ✅ User logged out
   - ✅ Redirect to home
   - ✅ localStorage cleared
   - ✅ Navbar shows "Login" option

### 1.3 Protected Routes (If Implemented)

#### Test Case 13: Access to User Account (Future)
1. Try to access account page while logged out
2. **Expected Result**:
   - ✅ Redirect to login
   - ✅ Show message: "Login required"

---

## Part 2: All Pages Testing (Task 13)

### 2.1 Home Page (/)

**URL**: http://localhost:5173/

**Test Items**:
- [ ] Page loads without errors
- [ ] Hero section displays
- [ ] "Featured Books" section shows 8 books
- [ ] Book cards display correctly
- [ ] Images load (or show placeholder)
- [ ] Prices show in ₹
- [ ] Conditions badges visible
- [ ] "Add to Cart" button works
- [ ] Categories section visible
- [ ] Testimonials section shows
- [ ] Navigation works
- [ ] Footer visible
- [ ] Dark mode toggle works
- [ ] Responsive on mobile
- [ ] Smooth animations

**Console Check**:
- ✅ No red errors
- ✅ No failed API calls

### 2.2 Shop Page (/shop)

**URL**: http://localhost:5173/shop

**Test Items**:
- [ ] Page loads with book grid
- [ ] Books load from API (20+ per page)
- [ ] Category filter shows all categories
- [ ] Condition filter shows (Like New, Good, Acceptable, Poor)
- [ ] Price range slider works
- [ ] Search box accepts input
- [ ] Single filter works (category only)
- [ ] Multiple filters work together
- [ ] Search updates results
- [ ] Loading spinner shows while loading
- [ ] "No books found" shows when no matches
- [ ] Pagination works (if implemented)
- [ ] "Add to Cart" buttons work
- [ ] Images load correctly
- [ ] Prices in ₹ format
- [ ] Responsive grid (1/2/3 columns)
- [ ] Mobile friendly

### 2.3 About Page (/about)

**URL**: http://localhost:5173/about

**Required Content**:
- [ ] Page title: "About Dusty Shelf"
- [ ] Store name: "Dusty Shelf"
- [ ] Location: "Jain University, Jayanagar, Bangalore, India"
- [ ] Store info/mission visible
- [ ] Contact information present
- [ ] Operating hours displayed
- [ ] Statistics section:
  - [ ] 560+ books count
  - [ ] Categories listed (UG, PG, Programming, Commerce, Mythology, Fiction)
  - [ ] Years in business
- [ ] Team information (if any)
- [ ] Store coordinates: 13.0350°N, 77.6245°E (if displayed)
- [ ] Professional layout
- [ ] Images (if any) display
- [ ] Dark mode support
- [ ] Responsive design

### 2.4 Book Detail Page (/book/:id)

**How to Access**: Click any book from Shop or Home page

**Test Items**:
- [ ] Page loads with book details
- [ ] Book title displays
- [ ] Author name shows
- [ ] Book description shows
- [ ] Book image displays
- [ ] Price in ₹ format
- [ ] Condition badge shows
- [ ] ISBN displays (if available)
- [ ] Publication year shows
- [ ] "Add to Cart" button works
- [ ] Quantity selector visible
- [ ] Back/navigation button works
- [ ] Related books section (if implemented)
- [ ] Reviews section (if implemented)
- [ ] Share button (if implemented)
- [ ] Responsive layout
- [ ] No console errors

### 2.5 Cart Page (/cart)

**How to Access**: Click cart icon in navbar or add item then view

**Test Items**:
- [ ] Added items display
- [ ] Item images show
- [ ] Item titles and authors visible
- [ ] Prices in ₹
- [ ] Quantity controls work
- [ ] Subtotal calculates correctly
- [ ] Shipping shows "Free"
- [ ] Tax shows "Included"
- [ ] Total calculates correctly
- [ ] Remove button works
- [ ] Clear cart button works
- [ ] Empty cart message shows
- [ ] Continue shopping link works
- [ ] Proceed to checkout works
- [ ] Cart persists on refresh
- [ ] Responsive design

### 2.6 Checkout Pages

**Step 1**: Review Cart (see Cart page tests above)

**Step 2**: Delivery Address
- [ ] Manual address form displays
- [ ] GPS geolocation option available
- [ ] Tab switching works
- [ ] Form validation working
- [ ] Back button functional
- [ ] Address submission works

**Step 3**: Order Summary
- [ ] Order items listed
- [ ] Address displayed correctly
- [ ] Total amount shown
- [ ] "Place Order" button works
- [ ] "Edit Address" button works

### 2.7 Order Confirmation Page

**URL**: http://localhost:5173/order-confirmation/ORD-[timestamp]

**Test Items**:
- [ ] Success header with checkmark
- [ ] "Order Confirmed!" message
- [ ] Order ID displayed
- [ ] Order date formatted correctly
- [ ] Order status shows ("pending")
- [ ] Items list complete
- [ ] Prices calculated correctly
- [ ] Delivery address displayed
- [ ] Total amount shown
- [ ] "Continue Shopping" button works
- [ ] "Print Order" button works
- [ ] Print preview shows order details
- [ ] Responsive layout

### 2.8 Login Page (/login)

**See Part 1: Authentication Testing** above

### 2.9 Navigation & Navbar

**Test Items**:
- [ ] Logo clickable (goes to home)
- [ ] Home link works
- [ ] Shop link works
- [ ] About link works
- [ ] Cart icon shows count
- [ ] Cart count updates
- [ ] Dark mode toggle works
- [ ] Mobile menu opens/closes
- [ ] All nav links functional on mobile
- [ ] Navbar sticky (follows scroll)
- [ ] Navbar responsive at breakpoints
- [ ] User menu shows when logged in
- [ ] Login link shows when logged out

### 2.10 Footer

**Test Items**:
- [ ] Footer appears on all pages
- [ ] Social links present
- [ ] Copyright year correct
- [ ] Links are clickable
- [ ] Newsletter signup (if available)
- [ ] Responsive on mobile

### 2.11 Error Pages

**404 Page** (*):
1. Navigate to non-existent URL: http://localhost:5173/nonexistent
2. **Expected Result**:
   - [ ] 404 page displays
   - [ ] Friendly message shows
   - [ ] Link back to home works

---

## Part 3: Full End-to-End Testing (Task 14)

### 3.1 Complete User Journey - New Customer

**Scenario**: New customer discovers store, browses books, makes first purchase

**Steps**:
1. ✅ Visit home page (http://localhost:5173)
2. ✅ Browse featured books
3. ✅ Click "Shop" or category
4. ✅ View all books in shop
5. ✅ Use filters (category, condition, price)
6. ✅ Search for specific book
7. ✅ Click on book to view details
8. ✅ Add book to cart
9. ✅ Continue shopping
10. ✅ Add more books
11. ✅ View cart
12. ✅ Update quantities
13. ✅ Proceed to checkout
14. ✅ Enter delivery address
15. ✅ Review order
16. ✅ Place order
17. ✅ See confirmation
18. ✅ Print order (optional)
19. ✅ Continue shopping

**Verify**:
- ✅ No errors in console
- ✅ All pages load smoothly
- ✅ Data accurate throughout
- ✅ Animations smooth
- ✅ Responsive at all breakpoints

### 3.2 Complete User Journey - Returning Customer

**Scenario**: Returning customer with existing items in cart

**Steps**:
1. ✅ Visit home page
2. ✅ Previous cart items still present
3. ✅ Login to account
4. ✅ View profile (if available)
5. ✅ Browse books
6. ✅ Add new items
7. ✅ View order history (if available)
8. ✅ Checkout with new address
9. ✅ Place order
10. ✅ Logout

### 3.3 Performance Testing

**Load Times**:
- [ ] Home page loads in < 2 seconds
- [ ] Shop page loads in < 2 seconds
- [ ] Book detail loads in < 1 second
- [ ] API responses in < 500ms

**Browser Metrics** (F12 → Performance):
- [ ] Smooth animations (60 fps)
- [ ] No memory leaks
- [ ] CPU usage reasonable

### 3.4 Cross-Browser Testing

**Test on**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if Mac available)
- [ ] Edge

**Expected Results**:
- ✅ Layout consistent
- ✅ Colors accurate
- ✅ Animations smooth
- ✅ Forms work
- ✅ No console errors

### 3.5 Mobile Responsiveness

**Test Sizes**:
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPad (768px)
- [ ] Tablet landscape (1024px)

**Expected Results**:
- ✅ Touch-friendly buttons
- ✅ Text readable
- ✅ No horizontal scroll
- ✅ Images responsive
- ✅ Layout adapts

### 3.6 Accessibility Testing

**Test Items**:
- [ ] Keyboard navigation works (Tab key)
- [ ] Color contrast sufficient
- [ ] Form labels associated
- [ ] Alt text on images
- [ ] Focus indicators visible
- [ ] Dark mode high contrast

### 3.7 Data Validation

**Verify**:
- [ ] All prices in ₹ format
- [ ] All dates formatted (en-IN locale)
- [ ] Book conditions correct
- [ ] ISBN formats valid
- [ ] Email formats validated
- [ ] Phone numbers validated
- [ ] PIN codes validated

### 3.8 Error Handling

**Test Error Scenarios**:
- [ ] API timeout handling
- [ ] Failed image loading (shows placeholder)
- [ ] Form validation errors
- [ ] Network connection loss
- [ ] Browser back/forward buttons

### 3.9 State Management Verification

**Check**:
- [ ] Cart persists on refresh
- [ ] User auth persists
- [ ] Order data correct
- [ ] Form data not lost

**localStorage Check**:
- [ ] `dusty-shelf-cart` updates
- [ ] `dusty-shelf-user` contains user
- [ ] Data not corrupted

### 3.10 API Integration Verification

**Endpoints to Test**:
- [ ] GET /api/health → 200 OK
- [ ] GET /api/books → Returns books
- [ ] GET /api/books/featured → Returns featured
- [ ] GET /api/books/categories/list → Returns categories
- [ ] GET /api/books?search=java → Returns results

**Commands** (in terminal):
```bash
# Health check
curl http://localhost:5000/api/health

# Get books
Invoke-WebRequest -Uri "http://localhost:5000/api/books?limit=5" -UseBasicParsing

# Get featured
Invoke-WebRequest -Uri "http://localhost:5000/api/books/featured" -UseBasicParsing

# Get categories
Invoke-WebRequest -Uri "http://localhost:5000/api/books/categories/list" -UseBasicParsing

# Search
Invoke-WebRequest -Uri "http://localhost:5000/api/books/search?search=java" -UseBasicParsing
```

---

## Summary Checklist

### Authentication ✅
- [ ] Login page displays
- [ ] Form validation works
- [ ] Successful login redirects
- [ ] User persists in localStorage
- [ ] Logout works
- [ ] Toast notifications appear

### Pages ✅
- [ ] Home page complete
- [ ] Shop page filters work
- [ ] About page has location details
- [ ] Book detail page loads
- [ ] Cart page functional
- [ ] Checkout complete
- [ ] Order confirmation displays
- [ ] 404 page works

### Features ✅
- [ ] Add to cart works
- [ ] Remove from cart works
- [ ] Quantities update
- [ ] Total calculates
- [ ] Orders created
- [ ] Data persists
- [ ] Navigation smooth
- [ ] Animations working

### Quality ✅
- [ ] No console errors
- [ ] No API failures
- [ ] Fast load times
- [ ] Responsive design
- [ ] Dark mode works
- [ ] Prices in ₹
- [ ] Professional appearance

---

**Status**: 🟢 READY FOR TESTING

This guide covers all remaining features for comprehensive testing. Follow through each test case and report any issues found.
