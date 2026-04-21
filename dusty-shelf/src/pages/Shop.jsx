import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { useBooks } from '../hooks/useBooks';
import { CURRENCY, BOOK_CONDITIONS } from '../config/config';
import { pageTransition } from '../utils/animations';

export const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [priceRange, setPriceRange] = useState([150, 600]);
  const [categories, setCategories] = useState(['All']);

  const { books, loading, error, filters, setFilters } = useBooks(1, 50, {});

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/books/categories/list');
        const data = await res.json();
        setCategories(['All', ...data.map(c => c.name || c)]);
      } catch (e) {
        console.error('Error fetching categories:', e);
        setCategories(['All', 'UG', 'PG', 'Programming', 'Commerce', 'Mythology', 'Fiction']);
      }
    };
    fetchCats();
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    if (category === 'All') {
      setFilters({ search: searchTerm });
    } else {
      setFilters({ category, search: searchTerm });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (filters.category && filters.category !== 'All') {
      setFilters({ category: filters.category, search: term });
    } else {
      setFilters({ search: term });
    }
  };

  const filteredBooks = books
    .filter(b => b.price >= priceRange[0] && b.price <= priceRange[1])
    .filter(b => selectedCondition === 'All' || b.condition === selectedCondition);

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-white dark:bg-slate-900 pt-24 pb-24">
      <div className="max-w-screen-2xl mx-auto px-8">
        {/* Editorial Header */}
        <section className="mb-20">
          <div className="max-w-4xl">
            <span className="text-blue-600 dark:text-blue-400 font-medium tracking-widest uppercase text-xs mb-4 block">
              Our Collection
            </span>
            <h1 className="text-6xl md:text-7xl font-serif italic tracking-tight leading-none mb-8 text-blue-900 dark:text-blue-100">
              Curated Volumes
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed max-w-2xl">
              A comprehensive selection of literary works across academic disciplines, from timeless classics to contemporary explorations.
            </p>
          </div>
        </section>

        {/* Main Content: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              {/* Categories */}
              <div>
                <h3 className="font-serif text-2xl italic mb-6 text-blue-900 dark:text-blue-100">
                  Categories
                </h3>
                <ul className="space-y-4">
                  {categories.map(cat => (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategoryChange(cat)}
                        className={`flex items-center justify-between w-full group transition-colors ${(filters.category === cat || (cat === 'All' && !filters.category))
                          ? 'text-blue-900 dark:text-blue-100 font-semibold border-b border-blue-900/30 pb-1'
                          : 'text-slate-600 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-300'
                          }`}
                      >
                        <span>{cat}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-serif text-2xl italic mb-6 text-blue-900 dark:text-blue-100">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="150"
                      max="600"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full accent-blue-900 dark:accent-blue-400"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Featured Card */}
              <div className="bg-blue-900 dark:bg-blue-950 p-8 rounded-lg text-white mt-12 relative overflow-hidden group">
                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold opacity-70 mb-2 block">
                    Featured Collection
                  </span>
                  <h4 className="font-serif text-xl italic mb-4">Rare Editions</h4>
                  <p className="text-sm opacity-80 mb-6 leading-relaxed">
                    Explore hand-picked rare books and special editions.
                  </p>
                  <a className="text-sm font-bold underline underline-offset-4" href="#">
                    Browse Now
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Book Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-900 dark:border-blue-400 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-slate-400">Loading collection...</p>
                </div>
              </div>
            ) : filteredBooks.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-20 mb-12">
                  {filteredBooks.map((book, idx) => (
                    <Link key={book.id} to={`/book/${book.id}`} className="no-underline">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-[3/4] mb-8 relative overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-lg shadow-[0px_20px_40px_rgba(27,27,28,0.06)] dark:shadow-none">
                          <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-100 px-8 py-3 rounded-full font-medium shadow-xl"
                            >
                              Quick View
                            </motion.button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-serif italic tracking-tight text-blue-900 dark:text-blue-100 line-clamp-2">
                              {book.title}
                            </h3>
                            <span className="text-lg font-light text-slate-600 dark:text-slate-400 ml-4 flex-shrink-0">
                              ₹{book.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold">
                            {book.category}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed pt-2">
                            {book.author}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 pt-12 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                    <span>← Previous</span>
                  </button>
                  <div className="flex gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 dark:bg-blue-950 text-white text-sm font-bold">
                      1
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                    <span>Next →</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-16">
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  No books found in your selection
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
