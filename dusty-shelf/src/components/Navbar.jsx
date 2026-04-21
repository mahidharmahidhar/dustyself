import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Moon, Sun, Menu, X, Search } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { useScroll } from '../hooks/useScroll';
import { useState } from 'react';

export const Navbar = () => {
  const { getItemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { isScrolled } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const itemCount = getItemCount();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
        ? 'bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-lg shadow-sm dark:shadow-none'
        : 'bg-transparent'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-screen-2xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Editorial Style */}
          <Link to="/" className="flex-shrink-0">
            <motion.h1
              className="text-2xl font-serif italic tracking-tight text-blue-900 dark:text-blue-100"
              whileHover={{ scale: 1.05 }}
            >
              Dusty Shelf
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <motion.span
                  className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300"
                  whileHover={{ color: '#1e40af' }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {/* Desktop Login */}
            <Link to="/login" className="hidden lg:block">
              <motion.span className="text-blue-900 dark:text-blue-100 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                Login
              </motion.span>
            </Link>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </motion.button>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-blue-900 dark:text-blue-100 md:hidden active:scale-95 duration-200 ease-in-out"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={
            isMobileMenuOpen
              ? { opacity: 1, height: 'auto' }
              : { opacity: 0, height: 0 }
          }
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="flex flex-col gap-2 py-4 px-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
              >
                <motion.span
                  className="text-slate-600 dark:text-slate-400 font-medium block py-2 px-3 hover:text-blue-800 dark:hover:text-blue-300 transition-colors rounded-lg"
                  whileHover={{ x: 4 }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}

            {/* Mobile Login Link */}
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <motion.span
                className="text-slate-600 dark:text-slate-400 font-medium block py-2 px-3 hover:text-blue-800 dark:hover:text-blue-300 transition-colors rounded-lg"
                whileHover={{ x: 4 }}
              >
                Login
              </motion.span>
            </Link>

            {/* Mobile Cart Link */}
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
              <motion.span
                className="text-slate-600 dark:text-slate-400 font-medium block py-2 px-3 hover:text-blue-800 dark:hover:text-blue-300 transition-colors rounded-lg flex items-center gap-2"
                whileHover={{ x: 4 }}
              >
                <ShoppingCart className="w-4 h-4" />
                Cart {itemCount > 0 && `(${itemCount})`}
              </motion.span>
            </Link>

            {/* Mobile Search */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 mt-2">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent ml-2 outline-none text-sm dark:text-blue-100 placeholder-slate-500 dark:placeholder-slate-400 w-full"
              />
            </div>

            {/* Mobile Theme Toggle */}
            <motion.button
              onClick={() => {
                toggleTheme();
              }}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium py-2 px-3 hover:text-blue-800 dark:hover:text-blue-300 transition-colors rounded-lg mt-2"
              whileHover={{ x: 4 }}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};
