import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const cartCount = items?.length || 0;
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value.trim();
    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '0.45rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: '#687279',
        letterSpacing: '0.04em',
        borderBottom: '1px solid #e2e8e5'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/auth" style={{ textDecoration: 'none', color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = '#111518'} onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}>My Account</Link>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#111518'} onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}>Wishlist</a>
          <a href="#" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = '#111518'} onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}>Order Tracking</a>
        </div>
        <div style={{ display: 'flex', gap: '1.2rem' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.7rem' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>facebook</a>
          <a href="#" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.7rem' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'} onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}>twitter</a>
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e2e8e5',
        padding: '0.9rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 500,
        boxShadow: '0 2px 12px rgba(17,21,24,.06)'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 900,
          color: '#111518',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em'
        }}>
          <span style={{ color: '#ff6310' }}>Dusty</span>Shelf
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{
          flex: 1,
          maxWidth: '560px',
          display: 'flex',
          border: '1.5px solid #e2e8e5',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          transition: 'border-color 0.2s'
        }} onFocus={(e) => e.currentTarget.style.borderColor = '#ff6310'} onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8e5'}>
          <input
            type="text"
            name="search"
            placeholder="Search books, authors, categories…"
            style={{
              flex: 1,
              padding: '0.58rem 1rem',
              backgroundColor: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '0.88rem',
              color: '#111518',
              fontFamily: 'inherit'
            }}
          />
          <select style={{
            padding: '0.58rem 0.8rem',
            backgroundColor: 'none',
            border: 'none 1px #e2e8e5',
            outline: 'none',
            fontSize: '0.75rem',
            color: '#687279',
            cursor: 'pointer'
          }}>
            <option value="">All Categories</option>
            <option>Fiction</option>
            <option>Classic</option>
            <option>Self-Help</option>
          </select>
          <button type="submit" style={{
            padding: '0.58rem 1.1rem',
            backgroundColor: '#ff6310',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'background 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e05500'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6310'}>
            🔍
          </button>
        </form>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <Link to="/account" style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: '#687279',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'} onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}>
            <span style={{ fontSize: '20px' }}>👤</span>
            <span style={{ fontSize: '0.58rem', fontWeight: 600 }}>Account</span>
          </Link>
          <Link to="/seller-dashboard" style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: '#687279',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'} onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <span style={{ fontSize: '0.58rem', fontWeight: 600 }}>Seller Hub</span>
          </Link>
          <Link to="/orders" style={{
            position: 'relative',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: '#687279',
            fontSize: '0.78rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.15rem',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'} onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}>
            <span style={{ fontSize: '20px' }}>❤️</span>
            <span style={{ fontSize: '0.58rem', fontWeight: 600 }}>Wishlist</span>
          </Link>
          <Link to="/sell" style={{
            position: 'relative',
            backgroundColor: '#fff',
            color: '#ff6310',
            border: '2px solid #ff6310',
            borderRadius: '8px',
            padding: '0.4rem 0.8rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '0.4rem',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.75rem',
            fontWeight: 600
          }} onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ff6310';
            e.currentTarget.style.color = '#fff';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.color = '#ff6310';
          }}>
            <span style={{ fontSize: '16px' }}>📚</span>
            <span>Sell Book</span>
          </Link>
          <Link to="/cart" style={{
            position: 'relative',
            backgroundColor: '#ff6310',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e05500';
            e.currentTarget.style.color = '#fff';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ff6310';
            e.currentTarget.style.color = '#fff';
          }}>
            <span style={{ fontSize: '18px' }}>🛒</span>
            <span style={{ fontSize: '0.75rem' }}>Cart {cartCount > 0 && <span>({cartCount})</span>}</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ff6310',
                color: '#fff',
                fontSize: '0.55rem',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Category Nav */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e2e8e5',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        overflowX: 'auto'
      }}>
        {['All Books', 'Fiction', 'Classics', 'Self-Help', 'Non-Fiction', 'Biography'].map((cat, idx) => (
          <div key={idx} style={{
            padding: '0.7rem 1.1rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#687279',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            borderBottom: '2.5px solid transparent',
            transition: 'color 0.15s, border-color 0.15s',
            display: idx === 0 ? 'flex' : 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ff6310';
              e.currentTarget.style.borderBottomColor = '#ff6310';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#687279';
              e.currentTarget.style.borderBottomColor = 'transparent';
            }}
            onClick={() => idx === 0 ? navigate('/shop') : navigate(`/shop?cat=${cat}`)}
          >
            {cat}
          </div>
        ))}
      </div>
    </>
  );
}
