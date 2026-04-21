import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const DeliveryForm = ({ onSubmit, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState(
    initialData || {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pinCode: '',
      isDefault: false,
    }
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.match(/^[6-9]\d{9}$/)) {
      newErrors.phone = 'Valid 10-digit phone number required';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.pinCode.match(/^\d{6}$/)) {
      newErrors.pinCode = 'Valid 6-digit PIN code required';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const inputClass = `w-full px-4 py-2 rounded-lg border bg-transparent dark:bg-blue-900/20 focus:outline-none focus:ring-2 transition-all duration-300 ${Object.keys(errors).length > 0
    ? 'border-red-500 focus:ring-red-500'
    : 'border-slate-300 dark:border-blue-600 focus:ring-blue-900 dark:focus:ring-blue-100'
    } text-blue-900 dark:text-blue-100 placeholder-slate-500 dark:placeholder-slate-400`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8"
    >
      <h3 className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-6">
        Delivery Address
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={inputClass}
          />
          {errors.fullName && (
            <motion.p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.fullName}
            </motion.p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            maxLength="10"
            className={inputClass}
          />
          {errors.phone && (
            <motion.p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </motion.p>
          )}
        </div>

        {/* Address Line 1 */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Address *
          </label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="House no., Street name"
            className={inputClass}
          />
          {errors.addressLine1 && (
            <motion.p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.addressLine1}
            </motion.p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Apartment, Suite, etc."
            className={inputClass}
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Bangalore"
              className={inputClass}
            />
            {errors.city && (
              <motion.p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.city}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Karnataka"
              className={inputClass}
            />
          </div>
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            PIN Code *
          </label>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            placeholder="6-digit PIN code"
            maxLength="6"
            className={inputClass}
          />
          {errors.pinCode && (
            <motion.p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.pinCode}
            </motion.p>
          )}
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="w-4 h-4 rounded border-slate-300 dark:border-blue-600 cursor-pointer"
          />
          <label
            htmlFor="isDefault"
            className="text-sm text-blue-900 dark:text-blue-100 cursor-pointer"
          >
            Save as default address
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
        >
          {loading ? 'Saving...' : 'Continue to Review'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DeliveryForm;
