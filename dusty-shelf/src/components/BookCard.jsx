import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, AlertCircle, BookOpen } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useToast } from './Toast/useToast';
import { Skeleton } from './common/Skeleton';

// High-quality placeholder with book colors
const generatePlaceholder = (title, category) => {
  const colors = {
    'UG': '#3b82f6',
    'PG': '#8b5cf6',
    'Programming': '#ec4899',
    'Commerce': '#f59e0b',
    'Mythology': '#10b981',
    'Fiction': '#f43f5e',
    'Lifestyle': '#06b6d4',
  };
  const bgColor = colors[category] || '#6366f1';
  const encoded = encodeURIComponent(title.substring(0, 30));
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect fill='${bgColor}' width='300' height='400'/%3E%3Ctext x='50%25' y='40%25' font-size='14' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='serif'%3E${encoded}%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='48' fill='rgba(255,255,255,0.3)' text-anchor='middle' dominant-baseline='middle'%3E📚%3C/text%3E%3C/svg%3E`;
};

// Condition badge configuration
const CONDITION_BADGE = {
  'like-new': { label: 'Like New', color: 'bg-green-100 text-green-800' },
  'good': { label: 'Good', color: 'bg-blue-100 text-blue-800' },
  'acceptable': { label: 'Acceptable', color: 'bg-yellow-100 text-yellow-800' },
};

export const BookCard = ({ book, showAddButton = true }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (!book) {
    return <Skeleton width="w-full" height="h-96" className="rounded-lg" />;
  }

  // Initialize image URL on mount
  useEffect(() => {
    let url = generatePlaceholder(book.title, book.category);

    if (book.image && !imageError) {
      url = book.image;
    } else if (book.imageUrl && !imageError) {
      url = book.imageUrl;
    } else if (book.isbn && !imageError) {
      // Fallback to Open Library
      url = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
    }

    setImageUrl(url);
  }, [book, imageError]);

  const handleAddToCart = () => {
    addToCart(book);
    addToast(`"${book.title}" added to cart!`, 'success', 2000);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageUrl(generatePlaceholder(book.title, book.category));
      setImageLoaded(true);
    }
  };

  // Get condition badge info
  const conditionInfo = CONDITION_BADGE[book.condition?.toLowerCase()] || CONDITION_BADGE['good'];

  // Format price in Indian Rupees
  const formattedPrice = `₹${(book.price || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-shadow h-full flex flex-col group cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 aspect-[3/4]">
          {!imageLoaded && <Skeleton width="w-full" height="h-full" />}

          {imageUrl && (
            <motion.img
              key={imageUrl}
              src={imageUrl}
              alt={book.title}
              className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Stock Status Badge */}
          {book.stock !== undefined && (
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${book.stock > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
          )}

          {/* Condition Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${conditionInfo.color}`}>
              {conditionInfo.label}
            </span>
          </div>

          {/* Add to Cart Button - Slides in on Hover */}
          {showAddButton && book.stock > 0 && (
            <motion.button
              onClick={handleAddToCart}
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 dark:bg-blue-800"
            >
              <Plus className="w-4 h-4" />
              Add to Cart
            </motion.button>
          )}

          {/* Out of Stock Overlay */}
          {book.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
              <span className="text-white font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          <motion.span className="text-xs font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wide mb-2">
            {book.category || 'General'}
          </motion.span>

          {/* Title */}
          <h3 className="font-serif font-semibold text-lg text-blue-900 dark:text-blue-100 mb-1 line-clamp-2 flex-grow">
            {book.title || 'Untitled'}
          </h3>

          {/* Author */}
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            by {book.author || 'Unknown Author'}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(book.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 dark:text-slate-600'
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {book.rating ? `(${book.reviews || 0} reviews)` : 'No ratings'}
            </span>
          </div>

          {/* Price */}
          <motion.p
            className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {formattedPrice}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};
