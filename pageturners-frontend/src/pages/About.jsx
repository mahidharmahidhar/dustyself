import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section
        className="py-24 text-center"
        style={{ backgroundColor: '#2A1F14' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-gold text-xs font-sans font-light uppercase mb-6" style={{ letterSpacing: '0.28em' }}>
            Our Story
          </p>
          <h1
            className="font-serif font-black text-cream mb-6"
            style={{ fontSize: '3.125rem', letterSpacing: '-0.02em' }}
          >
            About Dusty Shelf
          </h1>
          <p className="font-serif italic font-light text-cream text-xl leading-relaxed" style={{ opacity: 0.9 }}>
            A student-first second-hand bookstore at Jain University, committed to affordable knowledge and sustainable reading.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left - Mission */}
            <div>
              <p className="text-gold text-xs font-sans font-light uppercase mb-4" style={{ letterSpacing: '0.28em' }}>
                Our Mission
              </p>
              <h2
                className="font-serif font-bold text-charcoal mb-8"
                style={{ fontSize: '2.875rem', letterSpacing: '-0.02em' }}
              >
                Knowledge for Every Student
              </h2>
              <p className="text-muted-ink font-sans font-light leading-relaxed mb-6">
                Dusty Shelf was founded with a singular belief: <span className="font-serif italic">every student deserves access to quality academic material without the burden of full retail pricing.</span>
              </p>
              <p className="text-muted-ink font-sans font-light leading-relaxed mb-8">
                We source, grade, and catalogue our collection by hand. Each book carries a history — from careful readers and engaged learners. When a book arrives at Dusty Shelf, it's been loved. When it leaves, it carries that love forward to a new reader.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-gold text-2xl mt-1">📚</span>
                  <div>
                    <p className="font-serif font-bold text-charcoal mb-1">Curated Collections</p>
                    <p className="text-muted-ink font-sans font-light text-sm">400+ books across academic, programming, mythology, fiction, and literary categories</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-gold text-2xl mt-1">💚</span>
                  <div>
                    <p className="font-serif font-bold text-charcoal mb-1">Sustainable Practices</p>
                    <p className="text-muted-ink font-sans font-light text-sm">Every second-hand book reduces waste and extends the life of quality literature</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-gold text-2xl mt-1">✨</span>
                  <div>
                    <p className="font-serif font-bold text-charcoal mb-1">Integrity First</p>
                    <p className="text-muted-ink font-sans font-light text-sm">Each book is condition-graded honestly. No compromises, no shortcuts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Stats */}
            <div
              className="p-12 rounded"
              style={{ backgroundColor: '#E8E2D6' }}
            >
              <p className="text-gold text-xs font-sans font-light uppercase mb-8" style={{ letterSpacing: '0.28em' }}>
                By The Numbers
              </p>

              <div className="space-y-8">
                <div className="border-l-2" style={{ borderLeftColor: '#C4A84A', paddingLeft: '1.5rem' }}>
                  <p className="font-serif font-light text-charcoal" style={{ fontSize: '2.25rem' }}>
                    400+
                  </p>
                  <p className="text-muted-ink font-sans font-light uppercase text-sm mt-2" style={{ letterSpacing: '0.18em' }}>
                    Books in Collection
                  </p>
                </div>

                <div className="border-l-2" style={{ borderLeftColor: '#C4A84A', paddingLeft: '1.5rem' }}>
                  <p className="font-serif font-light text-charcoal" style={{ fontSize: '2.25rem' }}>
                    100+
                  </p>
                  <p className="text-muted-ink font-sans font-light uppercase text-sm mt-2" style={{ letterSpacing: '0.18em' }}>
                    Academic Titles
                  </p>
                </div>

                <div className="border-l-2" style={{ borderLeftColor: '#C4A84A', paddingLeft: '1.5rem' }}>
                  <p className="font-serif font-light text-charcoal" style={{ fontSize: '2.25rem' }}>
                    ₹99
                  </p>
                  <p className="text-muted-ink font-sans font-light uppercase text-sm mt-2" style={{ letterSpacing: '0.18em' }}>
                    Starting Price
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-sans font-light uppercase mb-4" style={{ letterSpacing: '0.28em' }}>
              What We Offer
            </p>
            <h2
              className="font-serif font-bold text-charcoal"
              style={{ fontSize: '2.875rem', letterSpacing: '-0.02em' }}
            >
              Our Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              { icon: '🎓', name: 'Undergraduate', desc: 'C, Java, Data Structures, OS, DBMS, and more' },
              { icon: '📖', name: 'Postgraduate', desc: 'AI/ML, Advanced Algorithms, Research materials' },
              { icon: '💻', name: 'Programming', desc: 'Languages, frameworks, web development guides' },
              { icon: '📚', name: 'Fiction & Literary', desc: 'Classics, contemporary, mythology, short stories' },
              { icon: '💼', name: 'Commerce & Business', desc: 'Economics, management, accounting, finance' },
              { icon: '🔬', name: 'Science & History', desc: 'General science, history, social studies' }
            ].map((category, idx) => (
              <div
                key={idx}
                className="p-8 border"
                style={{ borderColor: 'rgba(21,21,21,0.12)', backgroundColor: '#F2EEE7' }}
              >
                <p className="text-4xl mb-4">{category.icon}</p>
                <h3 className="font-serif font-bold text-charcoal mb-3 text-lg">
                  {category.name}
                </h3>
                <p className="text-muted-ink font-sans font-light text-sm leading-relaxed">
                  {category.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Condition Grading */}
      <section className="bg-cream py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-sans font-light uppercase mb-4" style={{ letterSpacing: '0.28em' }}>
              Quality Assurance
            </p>
            <h2
              className="font-serif font-bold text-charcoal"
              style={{ fontSize: '2.875rem', letterSpacing: '-0.02em' }}
            >
              Book Condition Grading
            </h2>
          </div>

          <div className="space-y-6">

            {[
              {
                grade: 'Like New',
                color: '#C4A84A',
                desc: 'Pristine condition. Read once or twice. No marks, tears, or stains. Binding intact, pages clean.'
              },
              {
                grade: 'Good',
                color: '#8A7340',
                desc: 'Well-loved but well-maintained. Minor creases, slight shelf wear. All pages present and readable.'
              },
              {
                grade: 'Acceptable',
                color: '#5A5550',
                desc: 'Heavy use visible. May have markings, highlights, or dog-eared pages. Structurally sound and completely readable.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-6 p-6 border"
                style={{ borderColor: 'rgba(21,21,21,0.12)' }}
              >
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div>
                  <h3 className="font-serif font-bold text-charcoal text-lg mb-2">
                    {item.grade}
                  </h3>
                  <p className="text-muted-ink font-sans font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="bg-cream py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-sans font-light uppercase mb-4" style={{ letterSpacing: '0.28em' }}>
              Find Us
            </p>
            <h2
              className="font-serif font-bold text-charcoal"
              style={{ fontSize: '2.875rem', letterSpacing: '-0.02em' }}
            >
              Our Home
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div>
              <svg
                className="w-full max-w-sm"
                viewBox="0 0 300 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Building illustration */}
                <g stroke="#8A7340" strokeWidth="2" fill="none" strokeLinecap="round">
                  {/* Main building */}
                  <rect x="60" y="50" width="180" height="220" />
                  {/* Entrance */}
                  <rect x="125" y="250" width="50" height="30" />
                  {/* Windows */}
                  <rect x="80" y="80" width="25" height="25" />
                  <rect x="120" y="80" width="25" height="25" />
                  <rect x="160" y="80" width="25" height="25" />
                  <rect x="80" y="130" width="25" height="25" />
                  <rect x="120" y="130" width="25" height="25" />
                  <rect x="160" y="130" width="25" height="25" />
                  <rect x="80" y="180" width="25" height="25" />
                  <rect x="120" y="180" width="25" height="25" />
                  <rect x="160" y="180" width="25" height="25" />
                </g>
              </svg>
            </div>

            <div>
              <h3 className="font-serif font-bold text-charcoal text-2xl mb-6">
                Jain University, Bangalore
              </h3>

              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-gold text-sm font-sans uppercase font-light mb-2" style={{ letterSpacing: '0.18em' }}>
                    Location
                  </p>
                  <p className="text-charcoal font-serif text-lg mb-1">
                    Jayanagar, Bangalore
                  </p>
                  <p className="text-muted-ink font-sans font-light text-sm">
                    Postal Code: 560041
                  </p>
                </div>

                <div>
                  <p className="text-gold text-sm font-sans uppercase font-light mb-2" style={{ letterSpacing: '0.18em' }}>
                    Hours
                  </p>
                  <p className="text-charcoal font-serif text-lg mb-1">
                    Monday – Saturday
                  </p>
                  <p className="text-muted-ink font-sans font-light text-sm">
                    10:00 AM – 5:00 PM
                  </p>
                </div>

                <div>
                  <p className="text-gold text-sm font-sans uppercase font-light mb-2" style={{ letterSpacing: '0.18em' }}>
                    Contact
                  </p>
                  <p className="text-charcoal font-serif text-lg mb-1">
                    dustyshelf@jain.edu
                  </p>
                  <p className="text-muted-ink font-sans font-light text-sm">
                    +91 80 XXX XXXXX
                  </p>
                </div>
              </div>

              <Link
                to="/shop"
                className="btn-primary px-8 py-3 font-serif font-bold text-sm"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 text-center"
        style={{ backgroundColor: '#2A1F14' }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-gold text-xs font-sans font-light uppercase mb-4" style={{ letterSpacing: '0.28em' }}>
            Join Our Community
          </p>
          <h2 className="font-serif italic font-light text-cream text-2xl leading-relaxed mb-8">
            "A used book is a story shared twice — and it never loses meaning in the passing."
          </h2>
          <Link
            to="/shop"
            className="inline-block btn-primary px-10 py-4 font-serif font-bold"
          >
            Explore Now
          </Link>
        </div>
      </section>
    </div>
  );
}
