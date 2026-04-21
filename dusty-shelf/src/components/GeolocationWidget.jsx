import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { LoadingSpinner } from './common/LoadingSpinner';

export const GeolocationWidget = ({ onLocationSelect, initialLocation = null }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { location, address, loading, error, requestLocation, clearLocation } =
    useGeolocation();

  const handleUseLocation = async () => {
    const coords = await requestLocation();
    if (coords) {
      onLocationSelect(coords);
    }
  };

  const displayLocation = location || initialLocation;
  const displayAddress = address || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8"
    >
      <h3 className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-6">
        OR Use Your Current Location
      </h3>

      {!displayLocation ? (
        <div className="space-y-4">
          {error && (
            <motion.div
              className="flex items-center gap-3 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          <motion.button
            onClick={handleUseLocation}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Getting your location...</span>
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                <span>Use Current Location</span>
              </>
            )}
          </motion.button>

          <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
            We'll use your current location to find nearby delivery options.
            Your privacy is important to us.
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Location confirmed */}
          <motion.div
            className="flex items-center gap-3 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-800 dark:text-green-300">
              Location confirmed
            </p>
          </motion.div>

          {/* Location details */}
          <motion.div
            className="bg-slate-100 dark:bg-blue-900/20 rounded-lg p-4 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-900 dark:text-blue-100 flex-shrink-0 mt-1" />
              <div className="flex-grow">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Latitude: {displayLocation.latitude.toFixed(4)}°
                </p>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Longitude: {displayLocation.longitude.toFixed(4)}°
                </p>
                {displayLocation.accuracy && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Accuracy: ±{Math.round(displayLocation.accuracy)} meters
                  </p>
                )}
              </div>
            </div>

            {/* Reverse geocoded address */}
            {displayAddress && (
              <motion.div
                className="border-t border-slate-300/30 dark:border-blue-100/20 pt-3 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                  Address Details
                </p>
                <div className="space-y-1 text-sm text-blue-900 dark:text-blue-100">
                  {displayAddress.address && (
                    <p>{displayAddress.address}</p>
                  )}
                  {displayAddress.city && displayAddress.state && (
                    <p>
                      {displayAddress.city}, {displayAddress.state}{' '}
                      {displayAddress.pinCode}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Toggle details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showDetails ? 'Hide Details' : 'View Full Address'}
          </button>

          {/* Clear location button */}
          <motion.button
            onClick={clearLocation}
            className="w-full px-4 py-2 border border-slate-300 dark:border-blue-600 text-blue-900 dark:text-blue-100 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            Use Different Location
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GeolocationWidget;
