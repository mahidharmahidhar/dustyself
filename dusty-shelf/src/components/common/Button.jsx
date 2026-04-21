import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', ...props }) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:shadow-lg dark:from-blue-950 dark:to-blue-900 focus:ring-blue-500',
    secondary: 'bg-slate-100 text-blue-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-blue-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-blue-500',
    outline: 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50 dark:border-blue-100 dark:text-blue-100 dark:hover:bg-blue-950 focus:ring-blue-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
