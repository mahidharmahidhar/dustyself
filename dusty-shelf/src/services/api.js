import { API_ENDPOINTS } from '../config/config.js';

// Custom error class for API errors
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

// API Client
class APIClient {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL || 'http://localhost:5000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Generic request method
  async request(url, options = {}) {
    const finalOptions = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      finalOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, finalOptions);

      // Handle response
      const data = response.ok ? await response.json() : await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new APIError(
          data.message || `HTTP ${response.status}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        error.message || 'Network error',
        0,
        null
      );
    }
  }

  // GET request
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  // POST request
  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
export { APIClient };
