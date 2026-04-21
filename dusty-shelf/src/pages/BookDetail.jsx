import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useToast } from '../components/Toast/useToast';
import booksData from '../data/books.json';
import { pageTransition } from '../utils/animations';
import { Skeleton } from '../components/common/Skeleton';

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

export const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = booksData.find(b => b.id === parseInt(id));
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Initialize image URL on mount
  useEffect(() => {
    if (!book) return;
    let url = generatePlaceholder(book.title, book.category);

    if (book.image) {
      url = book.image;
    } else if (book.imageUrl) {
      url = book.imageUrl;
    } else if (book.isbn) {
      // Fallback to Open Library
      url = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
    }

    setImageUrl(url);
  }, [book]);

  if (!book) {
    return (
      <motion.div {...pageTransition} className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-4">
            Book not found
          </h1>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </motion.div>
    );
  }

  const handleAddToCart = () => {
    addToCart(book);
    addToast(`"${book.title}" added to cart!`, 'success', 2000);
  };

  const relatedBooks = booksData.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-white dark:bg-slate-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-8 hover:opacity-70 transition-opacity"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Book Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lift aspect-[3/4]">
              {!imageLoaded && <Skeleton width="w-full" height="h-full" />}
              <motion.img
                src={imageUrl}
                alt={book.title}
                className={`w-full h-full object-cover transition-all ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <motion.span className="text-sm font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-widest mb-3">
              {book.category}
            </motion.span>

            <motion.h1 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-3">
              {book.title}
            </motion.h1>

            <motion.p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
              by {book.author}
            </motion.p>

            {/* Rating */}
            <motion.div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(book.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 dark:text-slate-600'
                      }`}
                  />
                ))}
              </div>
              <span className="text-slate-600 dark:text-slate-400">
                {book.rating} • {book.reviews} reviews
              </span>
            </motion.div>

            {/* Price */}
            <motion.div className="text-4xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-8">
              ₹{(book.price || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </motion.div>

            {/* Description */}
            <motion.p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {book.description}
            </motion.p>

            {/* Actions */}
            <motion.div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={handleAddToCart} className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="secondary">
                Add to Wishlist
              </Button>
            </motion.div>

            {/* Info Grid */}
            <motion.div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-blue-900/20 dark:border-blue-100/20">
              {[
                { label: 'Pages', value: '352' },
                { label: 'Format', value: 'Hardcover' },
                { label: 'Published', value: '2022' },
                { label: 'Language', value: 'English' },
              ].map((item, idx) => (
                <div key={idx}>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{item.label}</p>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-3xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-8">
              Related Books
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map(relatedBook => (
                <motion.div
                  key={relatedBook.id}
                  onClick={() => navigate(`/book/${relatedBook.id}`)}
                  whileHover={{ y: -8 }}
                  className="cursor-pointer"
                >
                  <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-soft h-full">
                    <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <img
                        src={relatedBook.image}
                        alt={relatedBook.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif font-semibold text-blue-900 dark:text-blue-100 line-clamp-2 mb-2">
                        {relatedBook.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {relatedBook.author}
                      </p>
                      <p className="text-xl font-serif font-bold text-blue-900 dark:text-blue-100">
                        ${relatedBook.price}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
