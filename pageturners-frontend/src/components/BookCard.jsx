import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store';

export default function BookCard({ book }) {
  const [imageError, setImageError] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price || 0,
      quantity: 1
    });
  };

  const isbn = book.isbn || '';
  const coverUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null;

  const getConditionBadgeColor = () => {
    const conditions = {
      'LIKE_NEW': 'rgba(45,90,71,.85)',
      'GOOD': 'rgba(255,99,16,.85)',
      'FAIR': 'rgba(104,114,121,.85)',
    };
    return conditions[book.condition] || 'rgba(104,114,121,.85)';
  };

  const formatCondition = (condition) => {
    const conditionMap = {
      'LIKE_NEW': 'Like New',
      'GOOD': 'Good',
      'FAIR': 'Fair'
    };
    return conditionMap[condition] || condition;
  };

  const getRandomGradient = () => {
    const gradients = [
      ['#f0e6d8', '#e8d4bc'],
      ['#dce9f5', '#c5dce8'],
      ['#f5e8d8', '#f0d9b8'],
      ['#d8e9e0', '#c5dfd4'],
      ['#ebe3d8', '#e0d0b8'],
      ['#f5dcc8', '#e8c9a8'],
      ['#d8e3f0', '#c5d8e8'],
      ['#e8d8f0', '#e0c5e8'],
    ];
    const idx = Math.abs(book.id * 7) % gradients.length;
    return `linear-gradient(145deg,${gradients[idx][0]},${gradients[idx][1]})`;
  };

  return (
    <Link to={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.22s, box-shadow 0.22s',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8e5'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 40px rgba(17,21,24,.14)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Book Cover */}
        <div
          style={{
            height: '220px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: coverUrl && !imageError ? 'none' : getRandomGradient()
          }}
        >
          {/* Condition Badge */}
          {book.condition && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                fontSize: '0.58rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
                backgroundColor: getConditionBadgeColor(),
                color: '#fff',
                zIndex: 10
              }}
            >
              {formatCondition(book.condition)}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,.9)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s',
              zIndex: 2,
              fontSize: '14px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
            onClick={(e) => {
              e.stopPropagation();
              alert('Added to Wishlist!');
            }}
          >
            ❤️
          </button>

          {/* Book Cover Image or Fallback */}
          {coverUrl && !imageError ? (
            <img
              src={coverUrl}
              alt={book.title}
              onError={() => setImageError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.2rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,.95)',
                lineHeight: 1.3,
                marginBottom: '0.4rem'
              }}>
                {book.title}
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontStyle: 'italic',
                color: 'rgba(255,255,255,.65)'
              }}>
                {book.author}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '10px',
                fontSize: '2rem',
                opacity: 0.12
              }}>
                📚
              </div>
            </div>
          )}
        </div>

        {/* Book Info */}
        <div style={{ padding: '0.85rem 1rem 1rem' }}>
          <div style={{
            fontWeight: 700,
            fontSize: '0.88rem',
            color: '#111518',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: '0.1rem'
          }}>
            {book.title}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: '#687279',
            marginBottom: '0.5rem',
            fontStyle: 'italic'
          }}>
            {book.author}
          </div>

          <div style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#ff6310',
            marginBottom: '0.5rem'
          }}>
            {book.category || 'Books'}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '1rem',
                fontWeight: 800,
                color: '#111518'
              }}>
                ₹{(book.price || 299).toLocaleString('en-IN')}
              </span>
              <span style={{
                fontSize: '0.72rem',
                color: '#687279',
                textDecoration: 'line-through',
                marginLeft: '0.3rem'
              }}>
                {book.original_price ? `₹${book.original_price}` : ''}
              </span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#ff6310',
                backgroundColor: '#fff4ef',
                padding: '0.1rem 0.35rem',
                borderRadius: '3px',
                marginLeft: '0.3rem'
              }}>
                {book.discount || '20%'}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              style={{
                backgroundColor: '#111518',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.32rem 0.72rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.18s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff6310'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111518'}
            >
              + Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
