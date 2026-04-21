# Dark Theme Page Update Guide

## Quick Start Process

For each page, follow these steps:

### Step 1: Identify Elements to Update
- Search for these className patterns:
  - `bg-cream` → Midnight/Surface bg
  - `text-charcoal` → Text-primary
  - `text-gold` → Accent-blue
  - `text-muted-ink` → Text-secondary
  - Any custom color classes

### Step 2: Replace Classnames with Inline Styles
- Remove className attributes
- Add style={{}} objects with CSS variable references
- Test in browser after each change

### Step 3: Test & Verify
- Check normal state
- Check hover states
- Check mobile responsive (use DevTools)
- Check form inputs focus states

### Step 4: Commit & Move to Next Page

---

## Priority 1: Critical Pages (Week 1)

### 1. Home Page (Home_new.jsx)

**Estimated Time**: 30 minutes

**Key Sections**:

#### Hero Section
```jsx
// FROM:
<div className="bg-cream text-charcoal">

// TO:
<div style={{
  backgroundColor: 'var(--midnight)',
  backgroundImage: 'linear-gradient(135deg, var(--surface) 0%, var(--midnight) 100%)',
  color: 'var(--text-primary)',
  padding: '96px 24px',
  minHeight: '600px'
}}>
```

#### Features Grid
```jsx
// Each feature card
<div className="bg-charcoal-soft border border-gold" style={{
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '24px',
  transition: 'all 200ms ease'
}}>
  {/* content */}
</div>
```

#### CTA Buttons
```jsx
// FROM: className="bg-gold text-charcoal"
// TO:
<button style={{
  backgroundColor: 'var(--accent-blue)',
  color: 'var(--midnight)',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 700,
  cursor: 'pointer'
}}>
  Get Started
</button>
```

#### Text Elements
```jsx
// Headings
<h1 style={{ color: 'var(--text-primary)' }}>
  Welcome to Dusty Shelf
</h1>

// Body text
<p style={{ color: 'var(--text-secondary)' }}>
  Find your next favorite book...
</p>

// Secondary text
<p style={{ color: 'var(--text-tertiary)' }}>
  Curated collection
</p>
```

**Checklist**:
- [ ] Hero background updated
- [ ] Feature cards styled
- [ ] CTA buttons styled
- [ ] Text colors applied
- [ ] Tested on mobile
- [ ] Tested hover states

---

### 2. Shop Page (Shop.jsx)

**Estimated Time**: 45 minutes

**Key Sections**:

#### Filter Sidebar
```jsx
<aside style={{
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '24px',
  height: 'fit-content',
  position: 'sticky',
  top: '100px'
}}>
  {/* Filter controls */}
</aside>
```

#### Filter Controls
```jsx
// Filter buttons
<button style={{
  backgroundColor: 'var(--surface-light)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border)',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 200ms ease'
}}
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = 'var(--accent-blue)';
  e.currentTarget.style.color = 'var(--midnight)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = 'var(--surface-light)';
  e.currentTarget.style.color = 'var(--text-primary)';
}}
>
  Fiction
</button>
```

#### Product Grid
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '24px',
  backgroundColor: 'var(--midnight)',
  padding: '24px'
}}>
  {books.map(book => (
    <BookCard key={book.id} book={book} />
  ))}
</div>
```

#### Pagination
```jsx
<div style={{
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  marginTop: '32px'
}}>
  <button style={{
    backgroundColor: 'var(--surface)',
    color: 'var(--accent-blue)',
    border: '1px solid var(--border)',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  }}>
    Previous
  </button>
  {/* Page numbers */}
  <button style={{
    backgroundColor: 'var(--surface)',
    color: 'var(--accent-blue)',
    border: '1px solid var(--border)',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  }}>
    Next
  </button>
</div>
```

**Checklist**:
- [ ] Filter sidebar styled
- [ ] Filter buttons work
- [ ] Product grid displays correctly
- [ ] BookCard components showing
- [ ] Pagination buttons styled
- [ ] Mobile filter layout (collapse sidebar)
- [ ] Tested all interactions

---

### 3. Cart Page (Cart.jsx)

**Estimated Time**: 35 minutes

**Key Sections**:

#### Cart Header
```jsx
<div style={{
  backgroundColor: 'var(--midnight)',
  borderBottom: '1px solid var(--border)',
  padding: '24px'
}}>
  <h1 style={{ color: 'var(--text-primary)' }}>Shopping Cart</h1>
</div>
```

#### Cart Items List
```jsx
<div style={{
  backgroundColor: 'var(--midnight)',
  padding: '24px'
}}>
  {items.map(item => (
    <div key={item.id} style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      display: 'flex',
      gap: '16px',
      alignItems: 'center'
    }}>
      {/* Item image */}
      {/* Item details */}
      {/* Remove button */}
      <button style={{
        backgroundColor: 'transparent',
        color: 'var(--error)',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 700
      }}>
        Remove
      </button>
    </div>
  ))}
</div>
```

#### Order Summary
```jsx
<div style={{
  backgroundColor: 'var(--surface-light)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '24px',
  maxWidth: '400px',
  marginLeft: 'auto'
}}>
  <h3 style={{ 
    color: 'var(--text-primary)',
    marginBottom: '16px'
  }}>
    Order Summary
  </h3>
  
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--text-secondary)',
    marginBottom: '8px'
  }}>
    <span>Subtotal:</span>
    <span>₹{subtotal}</span>
  </div>
  
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--text-secondary)',
    marginBottom: '16px'
  }}>
    <span>Tax (5%):</span>
    <span>₹{tax}</span>
  </div>
  
  <div style={{
    borderTop: '1px solid var(--border)',
    paddingTop: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--text-primary)',
    fontWeight: 700,
    fontSize: '18px',
    marginBottom: '24px'
  }}>
    <span>Total:</span>
    <span>₹{total}</span>
  </div>
  
  <button style={{
    backgroundColor: 'var(--accent-blue)',
    color: 'var(--midnight)',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    width: '100%'
  }}>
    Proceed to Checkout
  </button>
</div>
```

#### Empty Cart Message
```jsx
{items.length === 0 && (
  <div style={{
    textAlign: 'center',
    padding: '64px 24px',
    color: 'var(--text-secondary)'
  }}>
    <p style={{ fontSize: '18px', marginBottom: '16px' }}>
      Your cart is empty
    </p>
    <Link to="/shop" style={{
      color: 'var(--accent-blue)',
      textDecoration: 'none',
      fontWeight: 600
    }}>
      Continue Shopping
    </Link>
  </div>
)}
```

**Checklist**:
- [ ] Cart header styled
- [ ] Cart items display correctly
- [ ] Remove buttons work
- [ ] Order summary styled
- [ ] Checkout button primary color
- [ ] Empty cart message styled
- [ ] Tested quantity updates
- [ ] Mobile layout stacks properly

---

### 4. Checkout Page (Checkout.jsx)

**Estimated Time**: 45 minutes

**Key Sections**:

#### Progress Indicator
```jsx
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'var(--midnight)',
  padding: '24px',
  marginBottom: '32px'
}}>
  {['Cart', 'Shipping', 'Payment', 'Review'].map((step, idx) => (
    <div key={idx} style={{
      display: 'flex',
      alignItems: 'center',
      flex: 1
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: idx <= currentStep ? 'var(--accent-blue)' : 'var(--surface)',
        color: idx <= currentStep ? 'var(--midnight)' : 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        marginRight: '8px'
      }}>
        {idx + 1}
      </div>
      <span style={{
        color: idx <= currentStep ? 'var(--accent-blue)' : 'var(--text-secondary)'
      }}>
        {step}
      </span>
      {idx < 3 && (
        <div style={{
          flex: 1,
          height: '2px',
          backgroundColor: idx < currentStep ? 'var(--accent-blue)' : 'var(--border)',
          margin: '0 16px'
        }} />
      )}
    </div>
  ))}
</div>
```

#### Form Section
```jsx
<form style={{
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '24px',
  maxWidth: '600px',
  margin: '0 auto'
}}>
  <h3 style={{
    color: 'var(--text-primary)',
    marginBottom: '24px'
  }}>
    Shipping Address
  </h3>
  
  <div style={{ marginBottom: '16px' }}>
    <label style={{
      display: 'block',
      color: 'var(--text-primary)',
      marginBottom: '8px',
      fontWeight: 600,
      fontSize: '14px'
    }}>
      Full Name
    </label>
    <input
      type="text"
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: 'var(--midnight)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        borderRadius: '6px'
      }}
      placeholder="John Doe"
    />
  </div>
  
  {/* More form fields */}
  
  <button style={{
    width: '100%',
    backgroundColor: 'var(--accent-blue)',
    color: 'var(--midnight)',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    marginTop: '24px'
  }}>
    Continue to Payment
  </button>
</form>
```

**Checklist**:
- [ ] Progress indicator styled
- [ ] Form fields styled
- [ ] Form labels colored properly
- [ ] Input backgrounds use midnight
- [ ] Buttons styled correctly
- [ ] Error messages display
- [ ] Success states show
- [ ] Mobile form layout works

---

## Priority 2: Important Pages (Week 2)

### 5. Login & Register Pages (Login.jsx, Register.jsx)

**Time**: 20 minutes each

**Template**:
```jsx
<div style={{
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--midnight)'
}}>
  <div style={{
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '32px',
    maxWidth: '400px',
    width: '100%'
  }}>
    <h1 style={{
      color: 'var(--text-primary)',
      marginBottom: '24px',
      textAlign: 'center'
    }}>
      {isLogin ? 'Sign In' : 'Create Account'}
    </h1>
    
    {/* Form fields */}
    
    <button style={{
      width: '100%',
      backgroundColor: 'var(--accent-blue)',
      color: 'var(--midnight)',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer'
    }}>
      {isLogin ? 'Sign In' : 'Register'}
    </button>
    
    <p style={{
      textAlign: 'center',
      color: 'var(--text-secondary)',
      marginTop: '16px'
    }}>
      {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
      <Link to={isLogin ? '/register' : '/login'} style={{
        color: 'var(--accent-blue)',
        textDecoration: 'none'
      }}>
        {isLogin ? 'Register' : 'Sign In'}
      </Link>
    </p>
  </div>
</div>
```

---

### 6. Orders Page (Orders.jsx)

**Time**: 25 minutes

**Key Pattern**:
```jsx
<div style={{
  backgroundColor: 'var(--midnight)',
  padding: '24px',
  minHeight: '100vh'
}}>
  {orders.map(order => (
    <div key={order.id} style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h4 style={{ color: 'var(--text-primary)' }}>
          Order #{order.id}
        </h4>
        <span style={{
          backgroundColor: order.status === 'delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          color: order.status === 'delivered' ? '#10B981' : '#3B82F6',
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '12px'
        }}>
          {order.status}
        </span>
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>
        {order.date} • ₹{order.total}
      </p>
    </div>
  ))}
</div>
```

---

### 7. About & Contact Pages (About.jsx, Contact.jsx)

**Time**: 30 minutes each

**About Page Structure**:
- Hero section
- Mission/Vision sections (alternate backgrounds)
- Team section (if applicable)
- CTA section

**Contact Page Structure**:
- Contact form
- Info boxes (email, phone, address)
- Map (if applicable)

---

## Priority 3: Optional Pages (Week 3)

### 8. Admin Page (Admin.jsx)
- Dashboard cards
- Data tables
- Action buttons
- Modal dialogs

### 9. Order Confirmation (OrderConfirmation.jsx)
- Success message
- Order details
- Next steps CTA

---

## Common Issues & Solutions

### Issue: Text not visible
```jsx
// Check you're using text color variables
style={{ color: 'var(--text-primary)' }}
```

### Issue: Buttons don't look clickable
```jsx
// Add cursor and hover effects
cursor: 'pointer',
transition: 'all 200ms ease',
onMouseEnter: (e) => { /* change styles */ }
```

### Issue: Forms look broken
```jsx
// Ensure inputs have proper background and border
backgroundColor: 'var(--midnight)',
border: '1px solid var(--border)',
```

### Issue: Mobile layout broken
```jsx
// Use media queries in inline styles or check responsive design
// Better: Test with DevTools mobile view before committing
```

---

## Testing Checklist (For Each Page)

- [ ] Normal state displays correctly
- [ ] All text is readable (contrast check)
- [ ] Hover states work on desktop
- [ ] Mobile layout responsive (test at 375px, 768px, 1024px)
- [ ] Form inputs work
- [ ] Buttons are clickable
- [ ] Links navigate correctly
- [ ] No console errors
- [ ] Images load properly
- [ ] Animations smooth (no jank)

---

## Quick Commit Messages

After each page:
```
feat: convert [PageName] to dark theme

- Updated background colors to use CSS variables
- Applied text color hierarchy (primary/secondary/tertiary)
- Updated button and form styling
- Tested responsive layout
```

---

## Performance Tips

1. **Minimize re-renders**: Use CSS variables instead of JS state for colors
2. **Hardware acceleration**: Use transform/opacity for animations, not top/left
3. **Lazy load**: Consider lazy loading images on Shop/Home
4. **Optimize**: Remove unused CSS classes after migration

---

## Next Steps After All Pages Updated

1. **Remove old CSS**: Delete cream, charcoal, gold color classes from Tailwind
2. **Audit**: Check for any remaining light-theme references
3. **Test**: Full end-to-end testing on production build
4. **Monitor**: Check analytics for any issues
5. **Gather feedback**: Ask users about theme preferences

Good luck with the updates! 🚀
