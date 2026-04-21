import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../store';
import api from '../config/api';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const { data } = await api.get(`/books/${id}`);
      setBook(data.book);
    } catch (err) {
      console.error('Failed to load book:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: book.id,
      title: book.title,
      price: book.price,
      quantity
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '24px', color: '#687279' }}>Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '24px', color: '#dc2626', marginBottom: '20px' }}>Book not found</div>
        <button
          onClick={() => navigate('/shop')}
          style={{
            backgroundColor: '#ff6310',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const getConditionColor = () => {
    const colors = {
      'LIKE_NEW': '#2d5a47',
      'VERY_GOOD': '#10B981',
      'GOOD': '#f59e0b',
      'FAIR': '#ef4444'
    };
    return colors[book.condition] || '#9ca3af';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '30px', fontSize: '14px' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#ff6310' }}>Home</span>
        <span style={{ color: '#687279' }}> / </span>
        <span onClick={() => navigate('/shop')} style={{ cursor: 'pointer', color: '#ff6310' }}>Shop</span>
        <span style={{ color: '#687279' }}> / {book.title}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '80px' }}>
        {/* Book Cover */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={book.imageUrl}
            alt={book.title}
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 8px 40px rgba(17,21,24,.14)',
              aspectRatio: '3/4',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Book Info */}
        <div>
          {/* Condition Badge */}
          <span
            style={{
              display: 'inline-block',
              backgroundColor: getConditionColor(),
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            {book.condition?.replace('_', ' ')}
          </span>

          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#111518',
            marginBottom: '8px',
            lineHeight: 1.2
          }}>
            {book.title}
          </h1>

          <div style={{
            fontSize: '18px',
            color: '#687279',
            marginBottom: '24px',
            fontStyle: 'italic'
          }}>
            by {book.author}
          </div>

          {/* Rating */}
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '18px' }}>
              {'⭐'.repeat(Math.round(book.rating || 0))}
            </div>
            <span style={{ color: '#687279', fontSize: '14px' }}>
              {book.rating?.toFixed(1) || 'No'} rating • {book.reviewCount} reviews
            </span>
          </div>

          {/* Price */}
          <div style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#ff6310',
            marginBottom: '30px'
          }}>
            ₹{book.price?.toLocaleString('en-IN') || 'N/A'}
          </div>

          {/* Description */}
          <div style={{
            color: '#687279',
            lineHeight: 1.8,
            marginBottom: '30px',
            fontSize: '15px'
          }}>
            {book.description}
          </div>

          {/* Book Details */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {book.author && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Author</div>
                  <div style={{ color: '#111518' }}>{book.author}</div>
                </div>
              )}
              {book.isbn && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>ISBN</div>
                  <div style={{ color: '#111518' }}>{book.isbn}</div>
                </div>
              )}
              {book.pages && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Pages</div>
                  <div style={{ color: '#111518' }}>{book.pages}</div>
                </div>
              )}
              {book.category && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Category</div>
                  <div style={{ color: '#111518' }}>{book.category}</div>
                </div>
              )}
              {book.language && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Language</div>
                  <div style={{ color: '#111518' }}>{book.language}</div>
                </div>
              )}
            </div>
          </div>

          {/* Seller Info */}
          {book.seller && (
            <div style={{
              backgroundColor: '#f0f4f2',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <div style={{ fontSize: '12px', color: '#687279', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>Sold by</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#dce9f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  👤
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#111518' }}>{book.seller.name}</div>
                  <div style={{ fontSize: '12px', color: '#687279' }}>{book.seller.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e2e8e5',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                −
              </button>
              <div style={{
                padding: '8px 16px',
                borderLeft: '1px solid #e2e8e5',
                borderRight: '1px solid #e2e8e5',
                minWidth: '40px',
                textAlign: 'center'
              }}>
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                backgroundColor: '#ff6310',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e05500'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6310'}
            >
              {addedToCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {book.reviews && book.reviews.length > 0 && (
        <div style={{ borderTop: '1px solid #e2e8e5', paddingTop: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '20px', color: '#111518' }}>
            Customer Reviews ({book.reviews.length})
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {book.reviews.map(review => (
              <div key={review.id} style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111518' }}>{review.user.name}</div>
                    <div style={{ fontSize: '14px', color: '#687279' }}>
                      {'⭐'.repeat(review.rating)} ({review.rating} rating)
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ color: '#687279', fontSize: '14px' }}>{review.comment}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
