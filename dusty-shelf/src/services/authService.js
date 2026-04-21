import apiClient from './api.js';
import { API_ENDPOINTS } from '../config/config.js';

export const authService = {
  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name (optional)
   * @returns {Promise} { user, token }
   */
  async register(email, password, name = '') {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, {
        email,
        password,
        name: name || email.split('@')[0],
      });

      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} { user, token }
   */
  async login(email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }

      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT, {});
      localStorage.removeItem('auth_token');
      localStorage.removeItem('dusty-shelf-user');
    } catch (error) {
      // Still clear local storage even if API call fails
      localStorage.removeItem('auth_token');
      localStorage.removeItem('dusty-shelf-user');
    }
  },

  /**
   * Get current user (requires valid token)
   * @returns {Promise} { user }
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.LOGIN}me`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch current user');
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get stored token
   * @returns {string | null}
   */
  getToken() {
    return localStorage.getItem('auth_token');
  },

  /**
   * Get stored user data
   * @returns {Object | null}
   */
  getStoredUser() {
    const userStr = localStorage.getItem('dusty-shelf-user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Store user data
   * @param {Object} userData - User data to store
   */
  setStoredUser(userData) {
    localStorage.setItem('dusty-shelf-user', JSON.stringify(userData));
  },

  /**
   * Clear all auth data
   */
  clearAuthData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('dusty-shelf-user');
  },
};

export default authService;
