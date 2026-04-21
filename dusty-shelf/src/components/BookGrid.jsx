import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookCard } from './BookCard';
import { LoadingSpinner } from './common/LoadingSpinner';
import { Skeleton } from './common/Skeleton';
import { staggerContainer } from '../utils/animations';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export const BookGrid = ({
  books: initialBooks = [],
  title = 'Featured Books',
  showAddButton = true,
  useAPI = false,
  loading = false,
  error = null,
  page = 1,
  totalPages = 1,
  onPageChange = null,
  totalCount = 0,
}) => {
  const [displayBooks, setDisplayBooks] = useState(initialBooks);

  // Update display books when prop changes
  useEffect(() => {
    setDisplayBooks(initialBooks || []);
  }, [initialBooks]);

  // Show skeleton loaders while loading
  if (loading && displayBooks.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-3">
              {title}
            </h2>
            <div className="w-16 h-1 bg-blue-900 dark:bg-blue-100 rounded-full" />
          </motion.div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} width="w-full" height="h-96" className="rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-3">
              {title}
            </h2>
            <div className="w-16 h-1 bg-blue-900 dark:bg-blue-100 rounded-full" />
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 dark:bg-blue-950 dark:hover:bg-blue-900 transition-all"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (displayBooks.length === 0 && !loading) {
    return (
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-3">
              {title}
            </h2>
            <div className="w-16 h-1 bg-blue-900 dark:bg-blue-100 rounded-full" />
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-slate-600 dark:text-slate-400">
              No books found
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with count */}
        <motion.div
          className="mb-12 flex items-center justify-between flex-wrap gap-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-3">
              {title}
            </h2>
            <div className="w-16 h-1 bg-blue-900 dark:bg-blue-100 rounded-full" />
          </div>
          {useAPI && totalCount > 0 && (
            <span className="text-slate-600 dark:text-slate-400 text-sm">
              Showing {displayBooks.length} of {totalCount} books
            </span>
          )}
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {displayBooks.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`} className="no-underline">
              <BookCard
                book={book}
                showAddButton={showAddButton}
              />
            </Link>
          ))}
        </motion.div>

        {/* Loading indicator while fetching more */}
        {loading && displayBooks.length > 0 && (
          <motion.div
            className="flex justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSpinner size="md" />
          </motion.div>
        )}

        {/* Pagination Controls (if using API) */}
        {useAPI && totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => onPageChange && onPageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-900 dark:border-blue-100 text-blue-900 dark:text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900 hover:text-white dark:hover:bg-blue-100 dark:hover:text-blue-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page indicators */}
            <div className="flex items-center gap-2">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                if (totalPages > 5 && pageNum === 4) {
                  return <span key="ellipsis">...</span>;
                }
                if (totalPages > 5 && pageNum > 4) {
                  if (pageNum === totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => onPageChange && onPageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg transition-colors ${page === pageNum
                          ? 'bg-blue-900 text-white dark:bg-blue-100 dark:text-blue-900'
                          : 'border border-blue-900 dark:border-blue-100 text-blue-900 dark:text-blue-100 hover:bg-blue-900 hover:text-white dark:hover:bg-blue-100 dark:hover:text-blue-900'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange && onPageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg transition-colors ${page === pageNum
                      ? 'bg-blue-900 text-white dark:bg-blue-100 dark:text-blue-900'
                      : 'border border-blue-900 dark:border-blue-100 text-blue-900 dark:text-blue-100 hover:bg-blue-900 hover:text-white dark:hover:bg-blue-100 dark:hover:text-blue-900'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-900 dark:border-blue-100 text-blue-900 dark:text-blue-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-900 hover:text-white dark:hover:bg-blue-100 dark:hover:text-blue-900 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Page info */}
        {useAPI && totalPages > 1 && (
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
            Page {page} of {totalPages}
          </p>
        )}
      </div>
    </section>
  );
};
