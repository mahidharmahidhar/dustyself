import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <motion.div
      className={`${sizes[size]} border-3 border-slate-200 border-t-blue-900 rounded-full dark:border-blue-900/30 dark:border-t-blue-100`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
};
