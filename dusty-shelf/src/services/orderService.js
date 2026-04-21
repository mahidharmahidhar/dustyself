import apiClient from './api.js';
import { API_ENDPOINTS } from '../config/config.js';

export const orderService = {
  /**
   * Create a new order with delivery address
   * @param {Object} orderData - Order information
   * @param {Array} orderData.items - [{bookId, quantity, price}]
   * @param {Object} orderData.deliveryAddress - Delivery address details
   * @param {number} orderData.totalAmount - Total order amount
   * @returns {Promise} Created order with orderId
   */
  async createOrder(orderData) {
    return apiClient.post(API_ENDPOINTS.ORDERS, orderData);
  },

  /**
   * Get order details
   * @param {string} orderId - Order ID
   * @returns {Promise}
   */
  async getOrderDetail(orderId) {
    return apiClient.get(API_ENDPOINTS.ORDER_DETAIL(orderId));
  },

  /**
   * Get user's order history
   * @param {string} userId - User ID
   * @returns {Promise} Array of user's orders
   */
  async getUserOrders(userId) {
    return apiClient.get(API_ENDPOINTS.USER_ORDERS(userId));
  },

  /**
   * Track order status
   * @param {string} orderId - Order ID
   * @returns {Promise} Order with current status
   */
  async trackOrder(orderId) {
    return this.getOrderDetail(orderId);
  },

  /**
   * Cancel an order
   * @param {string} orderId - Order ID
   * @returns {Promise}
   */
  async cancelOrder(orderId) {
    return apiClient.put(`${API_ENDPOINTS.ORDERS}/${orderId}/cancel`, {});
  },
};

export default orderService;
