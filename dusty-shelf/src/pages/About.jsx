import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Users, Heart } from 'lucide-react';
import { pageTransition } from '../utils/animations';

export const About = () => {
  const stats = [
    { icon: BookOpen, label: 'Books in Catalog', value: '500+' },
    { icon: Users, label: 'Student Community', value: 'Growing' },
    { icon: Award, label: 'Categories', value: '6+' },
    { icon: Heart, label: 'Condition Grades', value: '3' },
  ];

  const values = [
    {
      title: 'Affordable Learning',
      description:
        'Second-hand books at fraction of new prices. We believe every student deserves access to quality educational resources without breaking the bank.',
    },
    {
      title: 'Quality Assurance',
      description:
        'Each book is graded (Like New, Good, Acceptable) for honest assessment. Know exactly what you\'re getting before purchase.',
    },
    {
      title: 'Campus-First Service',
      description:
        'Serving Jain University students and the Jayanagar community. Fast delivery, local understanding, student support always.',
    },
    {
      title: 'Wide Selection',
      description:
        'From UG/PG academics to Programming, Commerce, Mythology, and Fiction. All the books students need for their journey.',
    },
  ];

  const categories = [
    { name: 'UG Academics', books: '120+' },
    { name: 'PG & Advanced', books: '80+' },
    { name: 'Programming', books: '100+' },
    { name: 'Commerce', books: '90+' },
    { name: 'Mythology', books: '60+' },
    { name: 'Fiction & Classics', books: '50+' },
  ];

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="pt-24 pb-20 md:pb-32 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-blue-600 dark:text-blue-400 font-medium tracking-widest uppercase text-xs mb-4 block">
                  Student-Centric Bookstore
                </span>
                <h1 className="text-6xl md:text-7xl font-serif italic text-blue-900 dark:text-blue-100 tracking-tight leading-none mb-8">
                  Dusty Shelf
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-light max-w-xl">
                  Your trusted second-hand bookstore for Jain University, Jayanagar. We provide affordable, quality educational books for students across all disciplines—UG, PG, Programming, Commerce, and beyond.
                </p>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-light max-w-xl">
                  📍 Jain University, Jayanagar, Bangalore
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    Explore Collection
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 border-2 border-blue-900 dark:border-blue-100 text-blue-900 dark:text-blue-100 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Get In Touch
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Featured Book Display */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative w-64 h-96 mx-auto bg-gradient-to-br from-blue-100 to-slate-100 dark:from-blue-900 dark:to-slate-800 rounded-lg shadow-2xl overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-20 bg-gradient-to-r from-blue-400 to-slate-400 opacity-20"
                  />
                  <div className="relative inset-0 flex items-center justify-center p-8">
                    <BookOpen className="w-32 h-32 text-blue-900 dark:text-blue-100 opacity-20" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-slate-800/50">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 text-blue-900 dark:text-blue-100 mx-auto mb-4" />
                  <p className="text-4xl md:text-5xl font-serif italic text-blue-900 dark:text-blue-100 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-screen-2xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-blue-600 dark:text-blue-400 font-medium tracking-widest uppercase text-xs mb-4 block">
              Our Values
            </span>
            <h2 className="text-5xl md:text-6xl font-serif italic text-blue-900 dark:text-blue-100 mb-6">
              What We Believe In
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-lg p-8"
              >
                <h3 className="text-2xl font-serif italic text-blue-900 dark:text-blue-100 mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-light">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-slate-800/50">
        <div className="max-w-screen-2xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-blue-600 dark:text-blue-400 font-medium tracking-widest uppercase text-xs mb-4 block">
              Meet the Team
            </span>
            <h2 className="text-5xl md:text-6xl font-serif italic text-blue-900 dark:text-blue-100 mb-6">
              The Minds Behind Dusty Shelf
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              A dedicated team of book lovers, curators, and logistics experts committed to bringing the best books to your hands.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-slate-900 rounded-lg p-8 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-slate-100 dark:from-blue-900 dark:to-slate-800 mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-10 h-10 text-blue-900 dark:text-blue-100" />
                </div>
                <h3 className="text-xl font-serif italic text-blue-900 dark:text-blue-100 mb-2">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">
                  {member.role}
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 md:py-24 bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-slate-900">
        <div className="max-w-screen-2xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for curated book recommendations, new arrivals, and exclusive stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-6 py-3 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-blue-400/30 focus:outline-none focus:border-blue-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-900 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
