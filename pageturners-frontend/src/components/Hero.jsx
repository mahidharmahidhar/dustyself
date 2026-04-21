import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left Panel - Dark Atmospheric */}
      <div
        className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #2A1F14, #1C1510, #0E0B08)'
        }}
      >
        {/* SVG Illustration */}
        <svg
          className="w-64 h-64 mb-12 opacity-20"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Open book illustration */}
          <g stroke="#C4A84A" strokeWidth="2" strokeLinecap="round">
            <path d="M 60 80 Q 100 60 140 80" />
            <path d="M 100 60 L 100 140" />
            <path d="M 60 80 L 60 130 Q 60 145 70 150" />
            <path d="M 140 80 L 140 130 Q 140 145 130 150" />
            <circle cx="100" cy="100" r="60" fill="none" />
          </g>
        </svg>

        {/* Caption Block */}
        <div className="text-center max-w-xs">
          <p className="text-gold text-xs font-sans font-light uppercase mb-4" style={{ letterSpacing: '0.28em' }}>
            Featured Collection
          </p>
          <h2
            className="font-serif italic font-light text-cream text-lg leading-relaxed"
            style={{ opacity: 0.85 }}
          >
            Curated Knowledge, Passed Through Hands
          </h2>
        </div>
      </div>

      {/* Right Panel - Cream */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16 py-20 bg-cream"
        style={{ borderLeft: '0.5px solid rgba(21,21,21,0.1)' }}
      >
        <div className="max-w-md">

          {/* Eyebrow */}
          <p className="text-gold text-xs font-sans font-light uppercase mb-6" style={{ letterSpacing: '0.28em' }}>
            Second-Hand Collection
          </p>

          {/* Main Heading */}
          <h1
            className="font-serif font-black text-charcoal mb-8 leading-tight"
            style={{ fontSize: '2.875rem', letterSpacing: '-0.02em' }}
          >
            Discover Books That Carry History
          </h1>

          {/* Italic Line */}
          <p className="font-serif italic font-light text-charcoal-soft mb-8 text-lg leading-relaxed">
            Knowledge that lives beyond its first reader
          </p>

          {/* Body with Gold Left Border */}
          <div
            className="mb-10 p-5 text-muted-ink text-sm leading-relaxed"
            style={{ borderLeft: '1px solid #C4A84A', paddingLeft: '1.5rem' }}
          >
            <p>
              Dusty Shelf is a student-first second-hand bookstore at Jain University, Jayanagar, Bangalore. We believe every student deserves access to quality academic material without the burden of full retail pricing. Our collection is carefully sourced, graded, and catalogued by hand.
            </p>
          </div>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link
              to="/shop"
              className="btn-primary px-8 py-3 font-serif font-bold text-sm"
            >
              Explore Books
            </Link>
            <Link
              to="/shop"
              className="btn-ghost text-charcoal"
            >
              Browse Categories →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
