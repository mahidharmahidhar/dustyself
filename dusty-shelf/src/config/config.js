// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Books
  BOOKS: `${API_BASE_URL}/books`,
  BOOK_DETAIL: (id) => `${API_BASE_URL}/books/${id}`,
  FEATURED_BOOKS: `${API_BASE_URL}/books/featured`,
  CATEGORIES: `${API_BASE_URL}/books/categories/list`,
  SEARCH_BOOKS: `${API_BASE_URL}/books/search`,

  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_DETAIL: (id) => `${API_BASE_URL}/orders/${id}`,
  USER_ORDERS: (userId) => `${API_BASE_URL}/orders/user/${userId}`,
  CREATE_ORDER: `${API_BASE_URL}/orders`,

  // Cart
  CART: `${API_BASE_URL}/cart`,

  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Geolocation settings
export const GEOLOCATION = {
  TIMEOUT: 10000, // 10 seconds
  ENABLE_HIGH_ACCURACY: true,
};

// Store location
export const STORE_LOCATION = {
  NAME: 'Dusty Shelf',
  ADDRESS: 'Jain University, Jayanagar, Bangalore, India',
  LATITUDE: 13.0350,
  LONGITUDE: 77.6245,
};

// Book conditions
export const BOOK_CONDITIONS = [
  'Like New',
  'Good',
  'Acceptable',
  'Poor'
];

// Currency
export const CURRENCY = '₹';

export default { API_ENDPOINTS, PAGINATION, GEOLOCATION, STORE_LOCATION, BOOK_CONDITIONS, CURRENCY };
