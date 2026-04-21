import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { BookGrid } from '../components/BookGrid';
import { Testimonials } from '../components/Testimonials';
import { useBooks, useFeaturedBooks } from '../hooks/useBooks';
import { pageTransition } from '../utils/animations';

export const Home = () => {
  const { books: featuredBooks, loading, error } = useFeaturedBooks();

  return (
    <motion.div
      {...pageTransition}
      className="min-h-screen"
    >
      <Hero />
      <Categories />
      <BookGrid
        books={featuredBooks}
        title="Featured Books"
        showAddButton={true}
        loading={loading}
        error={error}
      />
      <Testimonials />
    </motion.div>
  );
};
