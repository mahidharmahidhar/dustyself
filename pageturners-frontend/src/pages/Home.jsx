import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const { data: allBooks } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await api.get('/books');
      return res.data.books || [];
    }
  });

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  // Get featured books (first 12)
  const featuredBooks = allBooks && allBooks.length > 0
    ? allBooks.slice(0, 12)
    : [];

  return (
    <div className="min-h-screen bg-pale-bg">
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-screen bg-gradient-to-b from-light-blue via-sky-blue to-pale-bg overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cline x1=\'0\' y1=\'0\' x2=\'100\' y2=\'0\' stroke=\'%23000\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")',
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <p className="text-sm tracking-widest text-dark-blue font-semibold uppercase mb-4">
            Curated Literary Collection
          </p>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-dark-blue leading-tight mb-6">
            PageTurners
          </h1>
          <p className="text-xl text-dark-blue opacity-80 mb-8 max-w-2xl mx-auto">
            Discover thousands of books from the world's best publishers and independent sellers.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="inline-block border-b-4 border-dark-blue text-dark-blue font-bold hover:opacity-70 transition pb-2 text-lg"
          >
            BUY NOW
          </button>
        </div>
      </section>

      {/* ===== BIO/ABOUT SECTION ===== */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-3xl md:text-4xl font-serif font-bold text-dark-blue mb-20 pb-8 border-b-2 border-dark-blue">
            BIO
          </h2>

          <div className="grid md:grid-cols-3 gap-12 items-center">
            {/* Image */}
            <div className="md:col-span-1">
              <div className="bg-gray-300 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <div className="text-6xl">📚</div>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2 space-y-4 text-gray-800 leading-relaxed">
              <p className="text-lg">
                I'm a paragraph. Click here to add your own text and edit me. It's easy. Just click "Edit Text" or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I'm a great place for you to tell your readers a story.
              </p>
              <p className="text-lg">
                Let your users know a little more about you. This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED BOOKS SECTION ===== */}
      <section className="bg-pale-bg py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-3xl md:text-4xl font-serif font-bold text-dark-blue mb-20">
            Featured Collection
          </h2>

          {/* Books Grid - 3 columns for featured items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {featuredBooks && featuredBooks.length > 0 ? (
              featuredBooks.map((book, idx) => (
                <div
                  key={book.id || idx}
                  className="group cursor-pointer transform transition-all hover:scale-105"
                  onClick={() => navigate(`/shop`)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg h-80 bg-gradient-to-br from-light-blue to-sky-blue flex items-center justify-center mb-6">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="text-6xl">📖</div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      {book.author || 'Unknown Author'}
                    </p>
                    <h3 className="font-serif text-xl font-bold text-dark-blue mb-3">
                      {book.title}
                    </h3>
                    <p className="text-lg font-bold text-brand-blue">
                      ${(book.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Loading books...</p>
              </div>
            )}
          </div>

          {/* View More Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/shop')}
              className="inline-block border-2 border-dark-blue text-dark-blue px-12 py-4 rounded-lg font-bold hover:bg-dark-blue hover:text-white transition-all"
            >
              Browse All {allBooks ? allBooks.length : 400}+ Books
            </button>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm text-dark-blue mb-4">Contact information</p>
            <p className="text-lg text-gray-700 mb-8">
              For any inquiries about our collection, please reach out to us:
            </p>
            <p className="text-gray-700 mb-2">
              Tel: +1 (555) 123-4567 | Email: hello@pageturners.com
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-blue mb-8">
              Sign Up for News & Updates
            </h2>

            <form onSubmit={handleNewsletterSignup} className="max-w-2xl mx-auto">
              <div className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email here *"
                  required
                  className="w-full px-6 py-4 border-2 border-gray-300 focus:border-dark-blue outline-none text-gray-800"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm text-dark-blue cursor-pointer">
                    Yes, subscribe me to your newsletter. *
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="px-12 py-4 border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER LINKS SECTION ===== */}
      <section className="bg-pale-bg py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <a href="#" className="text-dark-blue font-semibold hover:opacity-70 transition underline">
              FAQ
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-dark-blue font-semibold hover:opacity-70 transition underline">
              Shipping & Returns
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-dark-blue font-semibold hover:opacity-70 transition underline">
              Terms & Conditions
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-dark-blue font-semibold hover:opacity-70 transition underline">
              Payment Methods
            </a>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <a href="#" className="text-gray-600 hover:text-dark-blue transition">
              📘 Facebook
            </a>
            <a href="#" className="text-gray-600 hover:text-dark-blue transition">
              𝕏 Twitter
            </a>
            <a href="#" className="text-gray-600 hover:text-dark-blue transition">
              💼 LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ===== COPYRIGHT SECTION ===== */}
      <section className="bg-white border-t-2 border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2026 by PageTurners. Powered by passionate book lovers.
          </p>
        </div>
      </section>
    </div>
  );
}
