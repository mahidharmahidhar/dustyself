import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8 } : {}}
      className={`bg-white dark:bg-slate-800 rounded-lg p-6 shadow-soft dark:shadow-md transition-shadow duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
