<!-- Dark Theme Component Examples & Color Palette -->
# Dark Theme Visual Reference

## Color Palette Reference

### Core Colors
```
MIDNIGHT (#030308) - Primary Background
████████████████████████████████
Used for: Page backgrounds, main containers

SURFACE (#191C21) - Secondary Background
████████████████████████████████
Used for: Cards, panels, elevated surfaces

SURFACE-LIGHT (#252B33) - Tertiary Background
████████████████████████████████
Used for: Hover states, nested containers

ACCENT-BLUE (#D6E6F5) - Primary Accent
████████████████████████████████
Used for: Buttons, links, highlights

TEXT-PRIMARY (#E8E8E8) - Main Text
████████████████████████████████
Contrast ratio: 15:1 on midnight

TEXT-SECONDARY (#A0A0A0) - Secondary Text
████████████████████████████████
Contrast ratio: 6.5:1 on midnight

TEXT-TERTIARY (#6B7280) - Hint/Disabled Text
████████████████████████████████
Contrast ratio: 2.8:1 on midnight (use sparingly)
```

### Status Colors
```
SUCCESS (#10B981) - Success/Good condition badges
████████████████████████████████

ERROR (#EF4444) - Error/Alert messages
████████████████████████████████

WARNING (#F59E0B) - Warning/Caution badges
████████████████████████████████

INFO (#3B82F6) - Info/General notifications
████████████████████████████████
```

## Component Examples

### 1. Button Variants

#### Primary Button (CTA)
```
┌─────────────────────────┐
│  Add to Cart            │  ← Accent Blue (#D6E6F5)
└─────────────────────────┘
  ↓ Hover: Darker shade #c5d9e8
  ↓ Active: Scale down
```

**Code:**
```jsx
<button style={{
  backgroundColor: 'var(--accent-blue)',
  color: 'var(--midnight)',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 700,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 200ms ease'
}}>
  Add to Cart
</button>
```

#### Secondary Button
```
┌──────────────────────────┐
│  Filter          (border)│
└──────────────────────────┘
  Background: Surface (#191C21)
  Border: 1px solid var(--border)
  Color: Accent Blue (#D6E6F5)
```

**Code:**
```jsx
<button style={{
  backgroundColor: 'var(--surface)',
  color: 'var(--accent-blue)',
  border: '1px solid var(--border)',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer'
}}>
  Filter
</button>
```

#### Ghost Button
```
┌──────────────────────────┐
│  More Options   (outline)│  ← No background
└──────────────────────────┘
  Border: 1px solid var(--border)
  Color: Accent Blue (#D6E6F5)
  Hover: Background fades in
```

### 2. Input Field

```
┌─────────────────────────────────────┐
│ Search books...                     │
└─────────────────────────────────────┘
  Background: Surface (#191C21)
  Border: 1px solid var(--border)
  Text: Text-primary (#E8E8E8)
  Placeholder: Text-tertiary (#6B7280)
  
  Focus state:
  ┌─────────────────────────────────────┐
  │ Search books...                     │
  └─────────────────────────────────────┘
  Border: Accent Blue (#D6E6F5)
  Shadow: 0 0 0 3px rgba(214,230,245,0.1)
```

**Code:**
```jsx
<input
  type="text"
  placeholder="Search books..."
  style={{
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px'
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = 'var(--accent-blue)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(214,230,245,0.1)';
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = 'var(--border)';
    e.currentTarget.style.boxShadow = 'none';
  }}
/>
```

### 3. Card Component

```
┌────────────────────────────────────┐
│  The Great Gatsby                  │ ← Text-primary
│  F. Scott Fitzgerald               │ ← Text-secondary
│                                    │
│  A classic tale of wealth and      │ ← Text-tertiary
│  ambition in Jazz Age New York.    │
│                                    │
│  ₹299  ┌─────────────────────────┐│
│        │  Add to Cart  (accent)  ││
│        └─────────────────────────┘│
└────────────────────────────────────┘
  Background: Surface (#191C21)
  Border: 1px solid var(--border)
  Border-radius: 8px
  
  Hover state:
  - Border becomes Accent Blue
  - Shadow: 0 8px 32px rgba(214,230,245,0.1)
  - Transform: translateY(-2px)
```

### 4. Badge Variants

#### Success Badge (Like New)
```
┌──────────────────┐
│ Like New  ✓      │  ← Green (#10B981)
└──────────────────┘
  Background: rgba(16, 185, 129, 0.15)
  Color: #10B981
```

#### Info Badge (Good)
```
┌──────────────────┐
│ Good  ℹ️         │  ← Blue (#3B82F6)
└──────────────────┘
  Background: rgba(59, 130, 246, 0.15)
  Color: #3B82F6
```

#### Warning Badge (Acceptable)
```
┌──────────────────┐
│ Acceptable ⚠️    │  ← Yellow (#F59E0B)
└──────────────────┘
  Background: rgba(245, 158, 11, 0.15)
  Color: #F59E0B
```

### 5. Loading Spinner

```
     ↗ Accent Blue
    ╱  ╲
   │    │ Border: 3px solid var(--border)
   │    │ Top: var(--accent-blue)
    ╲  ╱
     ↖
     
Animation: spin 0.8s linear infinite
```

**Sizes:**
- Small (sm): 32px with 2px border
- Medium (md): 40px with 3px border [default]
- Large (lg): 60px with 4px border

### 6. Header Navigation

```
┌────────────────────────────────────────────────────────┐
│ 📚 Dusty Shelf    [Home][Books][About]  🔍 [🛒 3]    │
└────────────────────────────────────────────────────────┘
  Background: rgba(3, 3, 8, 0.8) with backdrop filter blur(10px)
  Border-bottom: 1px solid var(--border)
  Sticky positioning: top 0, z-index 100
  
  Mobile view (< 768px):
  ┌────────────────────────────────────┐
  │ 📚 Dusty Shelf         🔍 [🛒] ☰  │
  └────────────────────────────────────┘
  [Mobile menu slides down]
  [Home]
  [Books]
  [About]
  [Close]
```

### 7. Footer

```
┌────────────────────────────────────────────────────┐
│                                                    │
│ 📚 Dusty Shelf      │ Shop      │ Company│ Legal  │
│ Second-Hand Books   │ Books     │ About  │Privacy │
│ Description...      │ Featured  │Contact │ Terms  │
│                     │ New       │ FAQ    │Shipping│
│                     │           │        │        │
│─────────────────────────────────────────────────────│
│ © 2024 Dusty Shelf. All rights reserved.           │
│                📱      𝕏      ✉️                     │
│                                                    │
└────────────────────────────────────────────────────┘
  Background: Surface (#191C21)
  Border-top: 1px solid var(--border)
  Columns responsive: 1 → 4 columns as viewport grows
```

## Typography Hierarchy

```
H1 (48px, 700, -0.06em)
────────────────────────

H2 (36px, 700, -0.06em)
────────────────────────────

H3 (28px, 600, -0.04em)
────────────────────────────

H4 (24px, 600, -0.02em)
────────────────────────────

H5 (18px, 600, -0.01em)
────────────────────────────

H6 (14px, 600, 0em)
────────────────────────────

Body (16px, 400, 0em) - Normal text color
Secondary text (16px, 400, 0em) - Text-secondary color
Small (14px, 400, 0em) - Text-tertiary or text-secondary
Extra small (12px, 400, 0.04em) - Labels, badges, hints
```

## Spacing Scale

```
4px   - Minimal spacing (gap between inline elements)
8px   - Tight spacing (button padding, small gaps)
12px  - Compact spacing (form field gaps)
16px  - Standard spacing (container padding, card content)
24px  - Comfortable spacing (section spacing)
32px  - Generous spacing (between sections)
48px  - Large spacing (major layout sections)
64px  - Extra large spacing (page sections)
```

## Border Radius

```
4px   - Subtle rounding (borders, dividers)
6px   - Small elements (badges, small buttons)
8px   - Standard (buttons, input, cards)
12px  - Large elements (panels, overlays)
16px  - Extra large (modals, large cards)
50%   - Circular (avatars, badges, pills)
```

## Animations - Timing Functions

```
Entry animations: cubic-bezier(0.4, 0, 0.2, 1)
Duration: 0.6s

Interactive feedback: cubic-bezier(0.4, 0, 0.2, 1)
Duration: 0.2s

Loading/indefinite: linear
Duration: 0.8s

Transitions: ease
Duration: 200ms
```

## Responsive Breakpoints

```
Mobile: 0px - 640px
   - Single column layouts
   - Hamburger menu
   - Full-width cards
   - Stacked forms

Tablet: 640px - 1024px
   - Two column layouts
   - Desktop navigation visible
   - Grid with 2-3 columns

Desktop: 1024px+
   - Multi-column layouts
   - Full navigation
   - Grid with 3-4+ columns
   - Hover states active
```

## Accessibility Checklist

✓ Contrast ratios:
  - Text on background: 9.2:1 (exceeds WCAG AAA)
  - Labels on backgrounds: 6.5:1 (meets WCAG AA)

✓ Focus states:
  - 2px outline in Accent Blue with 2px offset

✓ Hover states:
  - Clear visual feedback on interactive elements
  - Scale/color/shadow changes

✓ Color independence:
  - Status communicated with icons + text, not color alone

✓ Touch targets:
  - Minimum 44x44px for mobile buttons

✓ Font sizing:
  - Minimum 14px for body text
  - Sufficient line-height (1.6 on default)

## Quick Copy-Paste Template

```jsx
// Page Container
<div style={{
  backgroundColor: 'var(--midnight)',
  color: 'var(--text-primary)',
  minHeight: '100vh',
  padding: '24px'
}}>

  {/* Section */}
  <section style={{
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px'
  }}>
    
    {/* Heading */}
    <h2 style={{
      color: 'var(--text-primary)',
      marginBottom: '16px'
    }}>
      Section Title
    </h2>
    
    {/* Paragraph */}
    <p style={{
      color: 'var(--text-secondary)',
      marginBottom: '16px'
    }}>
      Description or content here
    </p>
    
    {/* Button */}
    <button style={{
      backgroundColor: 'var(--accent-blue)',
      color: 'var(--midnight)',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: 700,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 200ms ease'
    }}>
      Call to Action
    </button>
  </section>
  
</div>
```

This reference should help maintain consistency across all page updates!
