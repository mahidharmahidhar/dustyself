import apiClient from './api.js';
import { API_ENDPOINTS, PAGINATION } from '../config/config.js';
import booksData from '../data/books.json';

export const bookService = {
  /**
   * Fetch paginated books with filters
   * @param {number} page - Page number (1-indexed)
   * @param {number} limit - Items per page
   * @param {string} category - Filter by category
   * @param {string} condition - Filter by condition (like-new, good, acceptable)
   * @param {string} search - Search query
   * @returns {Promise} { books: [], totalCount: 0, page: 1, totalPages: 1 }
   */
  async getBooks(page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, filters = {}) {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(filters.category && { category: filters.category }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.search && { search: filters.search }),
      });

      const url = `${API_ENDPOINTS.BOOKS}?${params}`;
      return apiClient.get(url);
    } catch (error) {
      // Fallback to local JSON data if backend is unavailable
      console.log('Backend unavailable, loading from local data...');
      return this.getBooksFromLocal(page, limit, filters);
    }
  },

  /**
   * Load books from local JSON file (fallback)
   */
  async getBooksFromLocal(page = 1, limit = 20, filters = {}) {
    let filteredBooks = [...booksData];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredBooks = filteredBooks.filter(b =>
        b.title.toLowerCase().includes(searchLower) ||
        b.author.toLowerCase().includes(searchLower) ||
        b.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      filteredBooks = filteredBooks.filter(b => b.category === filters.category);
    }

    // Apply condition filter
    if (filters.condition && filters.condition !== 'All') {
      filteredBooks = filteredBooks.filter(b => b.condition === filters.condition);
    }

    // Calculate pagination
    const totalCount = filteredBooks.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const paginatedBooks = filteredBooks.slice(startIdx, endIdx);

    return {
      data: paginatedBooks,
      books: paginatedBooks,
      totalCount,
      total: totalCount,
      totalPages,
      pages: totalPages,
      page,
      limit
    };
  },

  /**
   * Get single book details
   * @param {number} id - Book ID
   * @returns {Promise}
   */
  async getBookDetail(id) {
    return apiClient.get(API_ENDPOINTS.BOOK_DETAIL(id));
  },

  /**
   * Get all available categories
   * @returns {Promise} Array of categories
   */
  async getCategories() {
    try {
      return apiClient.get(API_ENDPOINTS.CATEGORIES);
    } catch (error) {
      // Fallback to extracting categories from local data
      console.log('Using local categories...');
      const uniqueCategories = [...new Set(booksData.map(b => b.category))];
      return uniqueCategories.map(cat => ({ name: cat }));
    }
  },

  /**
   * Search books by title, author, or ISBN
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @returns {Promise}
   */
  async searchBooks(query, page = 1) {
    return this.getBooks(page, PAGINATION.DEFAULT_LIMIT, { search: query });
  },

  /**
   * Get books by condition
   * @param {string} condition - like-new, good, acceptable
   * @param {number} page - Page number
   * @returns {Promise}
   */
  async getBooksByCondition(condition, page = 1) {
    return this.getBooks(page, PAGINATION.DEFAULT_LIMIT, { condition });
  },

  /**
   * Get books by category
   * @param {string} category - Category name
   * @param {number} page - Page number
   * @returns {Promise}
   */
  async getBooksByCategory(category, page = 1) {
    return this.getBooks(page, PAGINATION.DEFAULT_LIMIT, { category });
  },

  /**
   * Get featured books
   * @returns {Promise} Array of featured books
   */
  async getFeaturedBooks() {
    try {
      return apiClient.get(API_ENDPOINTS.FEATURED_BOOKS);
    } catch (error) {
      // Fallback: return top-rated books from local data
      console.log('Using local featured books...');
      const featured = booksData
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
      return featured;
    }
  },
};

export default bookService;
