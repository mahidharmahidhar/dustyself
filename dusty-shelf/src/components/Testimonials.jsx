import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Book Enthusiast',
      content: 'Dusty Shelf has completely transformed how I discover books. The recommendations are spot-on!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Student',
      content: 'The selection of academic books is impressive and the interface is so easy to navigate.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Teacher',
      content: 'I love the curated collections. Found the perfect books for my classroom reading list!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-widest mb-3">
            Reviews
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-blue-900 dark:text-blue-100">
            What Our Readers Say
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 rounded-lg p-8 md:p-12 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/30"
            >
              <div className="text-center mb-6">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-xl md:text-2xl font-serif text-blue-900 dark:text-blue-100 mb-6 italic">
                  "{testimonials[current].content}"
                </p>

                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonials[current].image}
                    alt={testimonials[current].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      {testimonials[current].name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full border border-blue-900 dark:border-blue-100 text-blue-900 dark:text-blue-100 hover:bg-blue-900 hover:text-white dark:hover:bg-blue-100 dark:hover:text-blue-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-blue-900 dark:bg-blue-100' : 'bg-blue-300 dark:bg-blue-700'
                    }`}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full border border-blue-900 dark:border-blue-100 text-blue-900 dark:text-blue-100 hover:bg-blue-900 hover:text-white dark:hover:bg-blue-100 dark:hover:text-blue-900 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
