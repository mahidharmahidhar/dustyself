import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../config/api';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORIES = ['All', 'UG', 'PG', 'Programming', 'Commerce', 'Mythology', 'Fiction'];
const CONDITIONS = ['All', 'LIKE_NEW', 'GOOD', 'FAIR'];
const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popular'];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [allBooks, setAllBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['books', selectedCategory, selectedCondition, searchTerm, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: 100,
        page: 1,
        ...(selectedCategory !== 'All' && { category: selectedCategory }),
        ...(selectedCondition !== 'All' && { condition: selectedCondition }),
        ...(searchTerm && { search: searchTerm })
      });

      const res = await api.get(`/books?${params}`);
      return res.data;
    }
  });

  // Reset when filters change
  useEffect(() => {
    setAllBooks(data?.books || []);
    setDisplayedBooks((data?.books || []).slice(0, 12));
    setPage(1);
    setHasMore((data?.books || []).length > 12);
  }, [data]);

  // Load more handler
  const handleLoadMore = () => {
    const startIdx = page * 12;
    const endIdx = startIdx + 12;
    const newBooks = allBooks.slice(0, endIdx);

    setDisplayedBooks(newBooks);
    setPage(prev => prev + 1);
    setHasMore(endIdx < allBooks.length);
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
            <p style={{ color: '#111518', fontFamily: "'Montserrat', sans-serif", fontSize: '18px' }}>
              Error loading books: {error.message}
            </p>
            <button
              onClick={() => refetch()}
              style={{
                marginTop: '24px',
                backgroundColor: '#ff6310',
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e05500';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ff6310';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <section style={{ paddingTop: '64px', paddingBottom: '64px', textAlign: 'center', backgroundColor: '#f0f4f2', borderBottom: '1px solid rgba(255, 99, 16, 0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ color: '#ff6310', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
            Explore Books
          </p>
          <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, color: '#111518', fontSize: '48px', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Browse Our Collection
          </h1>
          <p style={{ fontFamily: "'Figtree', sans-serif", fontWeight: 400, color: '#687279', fontSize: '16px', opacity: 0.9 }}>
            Discover curated books across all categories
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px', '@media (min-width: 1024px)': { gridTemplateColumns: '280px 1fr', gap: '48px' } }}>

          {/* Sidebar Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'sticky', top: '100px' }}>

              {/* Search */}
              <div>
                <p style={{ color: '#ff6310', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
                  Search
                </p>
                <input
                  type="text"
                  placeholder="Title or author..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: '#f8f9fa',
                    color: '#111518',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    border: '1px solid rgba(255, 99, 16, 0.08)',
                    borderRadius: '8px',
                    transition: 'all 200ms ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#ff6310';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 99, 16, 0.08)';
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                />
              </div>

              {/* Sort */}
              <div>
                <p style={{ color: '#ff6310', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
                  Sort By
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: '#f8f9fa',
                    color: '#111518',
                    fontFamily: "'Figtree', sans-serif",
                    fontSize: '14px',
                    border: '1px solid rgba(255, 99, 16, 0.08)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt} value={opt} style={{ backgroundColor: '#ffffff', color: '#111518' }}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <p style={{ color: '#ff6310', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
                  Category
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setPage(1);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '13px',
                        transition: 'all 200ms ease',
                        border: '1px solid rgba(255, 99, 16, 0.08)',
                        borderRadius: '6px',
                        backgroundColor: selectedCategory === cat ? '#ff6310' : '#f8f9fa',
                        color: selectedCategory === cat ? '#ffffff' : '#687279',
                        cursor: 'pointer',
                        fontWeight: selectedCategory === cat ? 700 : 400
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <p style={{ color: '#ff6310', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>
                  Condition
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CONDITIONS.map(cond => (
                    <button
                      key={cond}
                      onClick={() => {
                        setSelectedCondition(cond);
                        setPage(1);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        fontFamily: "'Figtree', sans-serif",
                        fontSize: '13px',
                        transition: 'all 200ms ease',
                        border: '1px solid rgba(255, 99, 16, 0.08)',
                        borderRadius: '6px',
                        backgroundColor: selectedCondition === cond ? '#ff6310' : '#f8f9fa',
                        color: selectedCondition === cond ? '#ffffff' : '#687279',
                        cursor: 'pointer',
                        fontWeight: selectedCondition === cond ? 700 : 400
                      }}
                    >
                      {cond === 'All' ? 'All Conditions' : cond === 'LIKE_NEW' ? 'Like New' : cond === 'GOOD' ? 'Good' : 'Fair'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedCondition('All');
                  setSearchTerm('');
                  setSortBy('Newest');
                  setPage(1);
                }}
                style={{
                  padding: '10px 16px',
                  fontFamily: "'Figtree', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 99, 16, 0.2)',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#687279',
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 99, 16, 0.04)';
                  e.currentTarget.style.color = '#ff6310';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#687279';
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Books Grid */}
          <div>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
                <LoadingSpinner size="lg" text="Loading books..." />
              </div>
            ) : displayedBooks.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
                <p style={{ color: '#687279', fontFamily: "'Figtree', sans-serif", fontSize: '16px' }}>
                  No books found matching your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedCondition('All');
                    setSortBy('Newest');
                    setPage(1);
                  }}
                  style={{
                    marginTop: '24px',
                    backgroundColor: '#ff6310',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e05500';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff6310';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div style={{ marginBottom: '32px' }}>
                  <p style={{ color: '#687279', fontFamily: "'Figtree', sans-serif", fontSize: '13px' }}>
                    Showing {displayedBooks.length} of {allBooks.length} books
                  </p>
                </div>

                {/* Books Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                  {displayedBooks.map(book => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }} ref={loadMoreRef}>
                    <button
                      onClick={handleLoadMore}
                      style={{
                        backgroundColor: '#ff6310',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 40px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
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
                      Load More Books
                    </button>
                  </div>
                )}

                {/* End of Collection Message */}
                {!hasMore && displayedBooks.length > 0 && (
                  <div style={{ textAlign: 'center', paddingTop: '48px', paddingBottom: '48px' }}>
                    <p style={{ color: '#687279', fontFamily: "'Figtree', sans-serif", fontSize: '13px', fontStyle: 'italic' }}>
                      You've reached the end of our collection
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
