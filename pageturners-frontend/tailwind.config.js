export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Dusty Shelf Primary Palette
        'cream': '#F2EEE7',
        'parchment': '#E8E2D6',
        'charcoal': '#151515',
        'charcoal-soft': '#2C2A27',
        'ink-brown': '#2A1F14',
        'muted-ink': '#5A5550',
        'gold': '#8A7340',
        'gold-light': '#C4A84A',
        'navy': '#1C2B40',
        'border-thin': 'rgba(21,21,21,0.12)',
        'border-gold': 'rgba(138,115,64,0.30)',
        // Brand colors
        'brand-green': '#ff6310',
        'dark-green': '#e05500',
        'light-green': '#fff4ef'
      },
      fontFamily: {
        'serif': ['Fraunces', 'serif'],
        'sans': ['DM Sans', 'sans-serif']
      },
      fontSize: {
        'label': '0.6875rem',  // 11px
        'eyebrow': '0.5625rem', // 9px
        'body-sm': '0.6875rem', // 11px
        'body': '0.9375rem',    // 15px
        'h6': '0.9375rem',      // 15px
        'h5': '1.0625rem',      // 17px
        'h4': '1.5rem',         // 24px
        'h3': '1.75rem',        // 28px
        'h2': '2.875rem',       // 46px
        'h1': '3.125rem'        // 50px
      },
      letterSpacing: {
        'tight': '-0.02em',
        'labels': '0.28em',
        'eyebrows': '0.28em',
        'nav': '0.22em',
        'footer': '0.14em'
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
        'spin-slow': 'spin 0.8s linear infinite'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    }
  },
  plugins: []
}
