import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center pt-20"
    >
      <div className="text-center px-4">
        <motion.h1
          className="text-8xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Page Not Found
        </motion.p>
        <motion.p
          className="text-slate-600 dark:text-slate-400 mb-8 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Sorry, the page you're looking for doesn't exist. Let's get you back to browsing books.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/">
            <Button size="lg">Go to Home</Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};
