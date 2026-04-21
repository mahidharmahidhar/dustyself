import { useState, useEffect, useCallback } from 'react';
import bookService from '../services/bookService.js';

/**
 * Hook for fetching and managing paginated books
 * @param {number} initialPage - Starting page (default: 1)
 * @param {number} limit - Books per page (default: 20)
 * @param {Object} initialFilters - Initial filters {category, condition, search}
 * @returns {Object} { books, loading, error, page, totalPages, totalCount, filters, goToPage, setFilters, refresh }
 */
export const useBooks = (initialPage = 1, limit = 20, initialFilters = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFiltersState] = useState(initialFilters);

  // Fetch books from API
  const fetchBooks = useCallback(async (pageNum, filterParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await bookService.getBooks(pageNum, limit, filterParams);

      // Handle different response formats from backend
      if (response.data) {
        setBooks(response.data);
      } else if (Array.isArray(response)) {
        setBooks(response);
      } else {
        setBooks(response.books || []);
      }

      // Set pagination info if provided by backend
      setTotalCount(response.totalCount || response.total || 0);
      setTotalPages(response.totalPages || response.pages || Math.ceil((response.totalCount || 0) / limit));
    } catch (err) {
      setError(err.message || 'Failed to fetch books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Effect: fetch books when page or filters change
  useEffect(() => {
    fetchBooks(page, filters);
  }, [page, filters, fetchBooks]);

  // Update filters
  const setFilters = useCallback((newFilters) => {
    setFiltersState(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  // Navigate to specific page
  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  // Refresh current page
  const refresh = useCallback(() => {
    fetchBooks(page, filters);
  }, [page, filters, fetchBooks]);

  return {
    books,
    loading,
    error,
    page,
    totalPages,
    totalCount,
    filters,
    setFilters,
    goToPage,
    refresh,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Hook for fetching featured books (max 8)
 * @returns {Object} { books, loading, error }
 */
export const useFeaturedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookService.getFeaturedBooks();
        if (Array.isArray(response)) {
          setBooks(response);
        } else if (response.books) {
          setBooks(response.books);
        } else if (response.data) {
          setBooks(response.data);
        } else {
          setBooks([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch featured books');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { books, loading, error };
};

/**
 * Hook for fetching a single book by ID
 * @param {string} id - Book ID
 * @returns {Object} { book, loading, error }
 */
export const useBookDetail = (id) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookService.getBookDetail(id);
        setBook(response.data || response);
      } catch (err) {
        setError(err.message || 'Failed to fetch book details');
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
};

export default useBooks;
