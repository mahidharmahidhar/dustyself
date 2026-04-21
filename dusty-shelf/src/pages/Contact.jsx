import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { pageTransition } from '../utils/animations';

export const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending the form
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsLoading(false);

      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions about Dusty Shelf? We'd love to hear from you. Reach out to us anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-8">
              Contact Information
            </h2>

            {/* Location */}
            <motion.div
              className="flex gap-4"
              whileHover={{ x: 4 }}
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <MapPin className="h-6 w-6 text-blue-900 dark:text-blue-100" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Location</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Jain University<br />
                  Jayanagar, Bangalore<br />
                  Karnataka, India
                </p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              className="flex gap-4"
              whileHover={{ x: 4 }}
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Mail className="h-6 w-6 text-blue-900 dark:text-blue-100" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Email</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  <a href="mailto:support@dustyshelf.com" className="hover:text-blue-900 dark:hover:text-blue-100">
                    support@dustyshelf.com
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="flex gap-4"
              whileHover={{ x: 4 }}
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Phone className="h-6 w-6 text-blue-900 dark:text-blue-100" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Phone</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  <a href="tel:+919876543210" className="hover:text-blue-900 dark:hover:text-blue-100">
                    +91 98765 43210
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Business Hours
              </h3>
              <div className="text-slate-600 dark:text-slate-400 space-y-1">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-6">
              Send us a Message
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center"
              >
                <p className="text-green-800 dark:text-green-300 font-semibold">
                  ✓ Message sent successfully!
                </p>
                <p className="text-green-700 dark:text-green-400 text-sm mt-2">
                  We'll get back to you as soon as possible.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-900 dark:bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900 rounded-lg p-12 border border-blue-200/50 dark:border-blue-800/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-serif font-bold text-blue-900 dark:text-blue-100 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                How long does delivery take?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Orders are typically delivered within 3-5 business days depending on your location.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Can I return a book?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Yes, we offer returns within 7 days of delivery if the book is in like-new condition.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Do you offer wholesale?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Contact us directly for bulk order inquiries and wholesale pricing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We accept all major credit cards, debit cards, and digital payment methods.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
