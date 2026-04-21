import { useState, useCallback } from 'react';
import locationService from '../services/locationService.js';

/**
 * Hook for handling geolocation operations
 * @returns {Object} { location, address, loading, error, requestLocation, clearLocation, requestAddress }
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Request user's current location
  const requestLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await locationService.getCurrentLocation();

      // Validate if location is in India
      if (!locationService.isInIndia(coords.latitude, coords.longitude)) {
        setError('Please enable location services for India');
        setLocation(null);
        return null;
      }

      setLocation(coords);
      return coords;
    } catch (err) {
      const errorMsg = err.message || 'Failed to get location';
      setError(errorMsg);
      setLocation(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get address from current location
  const requestAddress = useCallback(async (lat, lng) => {
    setLoading(true);
    setError(null);

    try {
      const addressData = await locationService.formatAddress(lat, lng);
      setAddress(addressData);
      return addressData;
    } catch (err) {
      const errorMsg = err.message || 'Failed to get address';
      setError(errorMsg);
      setAddress(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get address from current location (combined operation)
  const getCurrentLocationAndAddress = useCallback(async () => {
    const coords = await requestLocation();
    if (coords) {
      await requestAddress(coords.latitude, coords.longitude);
    }
    return { location: coords, address };
  }, [requestLocation, requestAddress, address]);

  // Clear location and address
  const clearLocation = useCallback(() => {
    setLocation(null);
    setAddress(null);
    setError(null);
  }, []);

  return {
    location,
    address,
    loading,
    error,
    requestLocation,
    requestAddress,
    getCurrentLocationAndAddress,
    clearLocation,
    hasLocation: !!location,
    hasAddress: !!address,
  };
};

export default useGeolocation;
