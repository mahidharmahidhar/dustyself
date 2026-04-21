import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, BookMarked, Palette, Sparkles } from 'lucide-react';

export const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'Fiction',
      icon: BookOpen,
      color: 'from-blue-400 to-blue-600',
      count: '2.4K books',
    },
    {
      id: 2,
      name: 'Academic',
      icon: BookMarked,
      color: 'from-green-400 to-green-600',
      count: '1.8K books',
    },
    {
      id: 3,
      name: 'Classics',
      icon: Palette,
      color: 'from-purple-400 to-purple-600',
      count: '892 books',
    },
    {
      id: 4,
      name: 'Kids',
      icon: Sparkles,
      color: 'from-pink-400 to-pink-600',
      count: '3.2K books',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 md:py-24 bg-surface dark:bg-slate-900">
      <div className="max-w-screen-2xl mx-auto px-8">
        {/* Editorial Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 dark:text-blue-400 font-medium tracking-widest uppercase text-xs mb-4 block">
            Browse by Category
          </span>
          <h2 className="text-6xl md:text-7xl font-serif italic text-blue-900 dark:text-blue-100 tracking-tight leading-none mb-8">
            Explore by Genre
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-light">
            Discover literary works across our curated collections and find your next favorite book.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-950 dark:to-slate-800 h-64">
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      scale: idx === hoveredIndex ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-16 h-16 text-white/80" />
                  </motion.div>
                </div>
                <h3 className="text-2xl md:text-3xl font-serif italic text-blue-900 dark:text-blue-100 mb-2">
                  {category.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {category.count}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
