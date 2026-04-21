import apiClient from './api.js';
import { API_ENDPOINTS } from '../config/config.js';

export const cartService = {
  /**
   * Get user's cart from backend
   * @returns {Promise} { items: [] }
   */
  async getCart() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART);
      return response;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Return empty cart on error
      return { items: [] };
    }
  },

  /**
   * Add item to cart
   * @param {string} bookId - Book ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise}
   */
  async addToCart(bookId, quantity = 1) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CART}/add`, {
        bookId,
        quantity,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add item to cart');
    }
  },

  /**
   * Remove item from cart
   * @param {string} bookId - Book ID
   * @returns {Promise}
   */
  async removeFromCart(bookId) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CART}/remove`, {
        bookId,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to remove item from cart');
    }
  },

  /**
   * Update item quantity in cart
   * @param {string} bookId - Book ID
   * @param {number} quantity - New quantity
   * @returns {Promise}
   */
  async updateQuantity(bookId, quantity) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.CART}/${bookId}`, {
        quantity,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update cart');
    }
  },

  /**
   * Clear entire cart
   * @returns {Promise}
   */
  async clearCart() {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CART}/clear`, {});
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to clear cart');
    }
  },

  /**
   * Get cart total
   * @returns {Promise} { total: number }
   */
  async getCartTotal() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CART}/total`);
      return response;
    } catch (error) {
      console.error('Failed to fetch cart total:', error);
      return { total: 0 };
    }
  },
};

export default cartService;
