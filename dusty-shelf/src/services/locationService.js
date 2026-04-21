import apiClient from './api.js';
import { API_ENDPOINTS, GEOLOCATION } from '../config/config.js';

export const locationService = {
  /**
   * Get user's current location using browser geolocation
   * @returns {Promise} { latitude, longitude, accuracy }
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          const errorMessages = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout',
          };
          reject(new Error(errorMessages[error.code] || 'Unknown geolocation error'));
        },
        {
          timeout: GEOLOCATION.TIMEOUT,
          enableHighAccuracy: GEOLOCATION.ENABLE_HIGH_ACCURACY,
        }
      );
    });
  },

  /**
   * Reverse geocode coordinates to address
   * Uses backend service if available, otherwise uses Nominatim OSM
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise} Address object
   */
  async reverseGeocode(latitude, longitude) {
    try {
      // Try backend service first
      const response = await apiClient.get(
        `${API_ENDPOINTS.REVERSE_GEOCODE}?lat=${latitude}&lng=${longitude}`
      );
      return response;
    } catch (error) {
      // Fallback to Nominatim (free OSM service)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();

        if (data.address) {
          return {
            address: data.address.road || data.address.neighbourhood || '',
            city: data.address.city || data.address.town || '',
            state: data.address.state || '',
            pinCode: data.address.postcode || '',
            country: data.address.country || '',
            fullAddress: data.display_name,
          };
        }
        throw new Error('Could not reverse geocode location');
      } catch (fallbackError) {
        console.error('Reverse geocoding failed:', fallbackError);
        throw new Error('Failed to get address from coordinates');
      }
    }
  },

  /**
   * Format coordinates into readable address
   * @param {number} latitude
   * @param {number} longitude
   * @returns {Promise} Formatted address
   */
  async formatAddress(latitude, longitude) {
    const addressData = await this.reverseGeocode(latitude, longitude);
    return {
      ...addressData,
      coordinates: { latitude, longitude },
    };
  },

  /**
   * Validate if coordinates are within India
   * @param {number} latitude
   * @param {number} longitude
   * @returns {boolean}
   */
  isInIndia(latitude, longitude) {
    // India coordinates: roughly 8.4 to 37.6°N, 68.2 to 97.4°E
    return latitude >= 8.4 && latitude <= 37.6 && longitude >= 68.2 && longitude <= 97.4;
  },

  /**
   * Get distance between two coordinates in km
   * Uses Haversine formula
   * @param {number} lat1
   * @param {number} lon1
   * @param {number} lat2
   * @param {number} lon2
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
};

export default locationService;
