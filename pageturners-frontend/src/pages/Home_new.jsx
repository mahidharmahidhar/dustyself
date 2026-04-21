import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../config/api';
import Hero from '../components/Hero';
import CategoryMarquee from '../components/CategoryMarquee';
import EditorialBand from '../components/EditorialBand';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [displayBooks, setDisplayBooks] = useState([]);

  const { data: allBooks, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      try {
        const res = await api.get('/books');
        return res.data.books || [];
      } catch (err) {
        console.error('Error fetching books:', err);
        return [];
      }
    }
  });

  useEffect(() => {
    if (allBooks && allBooks.length > 0) {
      setDisplayBooks(allBooks.slice(0, 12));
    }
  }, [allBooks]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>

      {/* Hero Section */}
      <Hero />

      {/* Category Marquee */}
      <CategoryMarquee />

      {/* New Arrivals Section */}
      <section style={{ backgroundColor: '#ffffff', paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

          {/* Section Header */}
          <div style={{ marginBottom: '48px' }}>
            <p style={{
              color: '#ff6310',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '16px',
              letterSpacing: '0.1em'
            }}>
              Fresh Collection
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'flex-start',
              '@media (min-width: 768px)': {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }
            }}>
              <h2 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                color: '#111518',
                fontSize: '40px',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
                margin: 0
              }}>
                New Arrivals
              </h2>
              <Link
                to="/shop"
                style={{
                  color: '#ff6310',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 200ms ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#e05500';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ff6310';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                View All Books →
              </Link>
            </div>
          </div>

          {/* Books Grid */}
          {isLoading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '80px',
              paddingBottom: '80px'
            }}>
              <LoadingSpinner size="lg" text="Loading books..." />
            </div>
          ) : displayBooks && displayBooks.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '48px'
            }}>
              {displayBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
              <p style={{ color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
                No books available at the moment. Check back soon!
              </p>
            </div>
          )}

          {/* View All Button */}
          {displayBooks && displayBooks.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link
                to="/shop"
                style={{
                  backgroundColor: '#ff6310',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 40px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e05500';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 99, 16, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff6310';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Explore More Books
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Editorial Band */}
      <EditorialBand />

      {/* About Preview Section */}
      <section style={{ backgroundColor: '#f0f4f2', paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px',
            alignItems: 'center',
            '@media (min-width: 1024px)': {
              gridTemplateColumns: '1fr 1fr'
            }
          }}>

            {/* Left - Visual */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              order: 2,
              '@media (min-width: 1024px)': {
                order: 1
              }
            }}>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                backgroundColor: '#2d5a47',
                borderRadius: '12px',
                border: '1px solid rgba(45, 90, 71, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '64px',
                  marginBottom: '16px'
                }}>
                  📚
                </div>
                <p style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Your destination for curated, affordable books
                </p>
              </div>
            </div>

            {/* Right - Content */}
            <div style={{ order: 1, '@media (min-width: 1024px)': { order: 2 } }}>
              <p style={{
                color: '#ff6310',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '16px',
                letterSpacing: '0.1em'
              }}>
                About Dusty Shelf
              </p>

              <h2 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                color: '#111518',
                fontSize: '40px',
                letterSpacing: '-0.02em',
                marginBottom: '24px',
                lineHeight: '1.2'
              }}>
                Your Source for Knowledge
              </h2>

              <p style={{
                color: '#687279',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '15px',
                lineHeight: '1.8',
                marginBottom: '20px'
              }}>
                Dusty Shelf is a student-first second-hand bookstore dedicated to making quality academic material accessible and affordable.
              </p>

              <p style={{
                color: '#687279',
                fontFamily: "'Figtree', sans-serif",
                fontSize: '15px',
                lineHeight: '1.8',
                marginBottom: '32px'
              }}>
                From undergraduate essentials to postgraduate research, fiction to programming — we curate, grade, and deliver books for every discipline and passion.
              </p>

              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <span style={{ fontSize: '20px', marginTop: '4px' }}>📍</span>
                  <div>
                    <p style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 700,
                      color: '#111518',
                      fontSize: '13px',
                      margin: '0 0 4px 0'
                    }}>Location</p>
                    <p style={{
                      color: '#687279',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '13px',
                      margin: 0
                    }}>
                      Jain University, Jayanagar, Bangalore
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <span style={{ fontSize: '20px', marginTop: '4px' }}>💡</span>
                  <div>
                    <p style={{
                      fontFamily: "'Figtree', sans-serif",
                      fontWeight: 700,
                      color: '#111518',
                      fontSize: '13px',
                      margin: '0 0 4px 0'
                    }}>Mission</p>
                    <p style={{
                      color: '#687279',
                      fontFamily: "'Figtree', sans-serif",
                      fontSize: '13px',
                      margin: 0
                    }}>
                      Affordable Knowledge. No Compromises.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#ff6310',
                  color: '#fff',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                  border: '1px solid #ff6310'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e05500';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 99, 16, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff6310';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
