import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, BookOpen, Users, Mail } from 'lucide-react';

export const Footer = () => {
  const footerLinks = {
    Company: ['About Us', 'Careers', 'Blog'],
    Support: ['Contact', 'FAQs', 'Shipping'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  };

  const socialLinks = [
    { icon: Star, label: 'Reviews' },
    { icon: BookOpen, label: 'Books' },
    { icon: Users, label: 'Community' },
    { icon: Mail, label: 'Email' },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 py-16 md:py-20 mt-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif italic text-blue-900 dark:text-blue-100 mb-3">Dusty Shelf</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Curating rare and authentic books for the discerning reader since 2024.
            </p>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (idx + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-serif italic text-blue-900 dark:text-blue-100 mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-100 transition-colors text-sm"
                      whileHover={{ x: 4 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800 my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.p
            className="text-slate-600 dark:text-slate-400 text-sm text-center md:text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            © 2024 Dusty Shelf. All rights reserved.
          </motion.p>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {socialLinks.map(({ icon: Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                aria-label={label}
              >
                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-100" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
