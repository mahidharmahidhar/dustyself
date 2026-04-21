import React from 'react';

export default function EditorialBand() {
  return (
    <div className="flex flex-col lg:flex-row">

      {/* Left Panel - Dark with Pull Quote */}
      <div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-20 text-center"
        style={{ backgroundColor: '#2A1F14' }}
      >
        <div className="max-w-md">
          <p className="text-gold text-xs font-sans font-light uppercase mb-8" style={{ letterSpacing: '0.28em' }}>
            The Dusty Shelf Standard
          </p>
          <p
            className="font-serif italic font-light text-cream leading-relaxed"
            style={{ fontSize: '1.75rem', opacity: 0.9 }}
          >
            "A used book is a story shared twice — and it never loses meaning in the passing."
          </p>
        </div>
      </div>

      {/* Right Panel - Parchment with Stats */}
      <div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-20"
        style={{ backgroundColor: '#E8E2D6' }}
      >
        <div className="max-w-md space-y-8">

          {/* Stat 1 */}
          <div
            className="pl-6 py-4"
            style={{ borderLeft: '1px solid #C4A84A', paddingLeft: '1.5rem' }}
          >
            <p className="font-serif font-light text-charcoal" style={{ fontSize: '1.75rem' }}>
              400+
            </p>
            <p className="text-muted-ink text-sm font-sans font-light uppercase mt-2" style={{ letterSpacing: '0.18em' }}>
              Books in Collection
            </p>
          </div>

          {/* Stat 2 */}
          <div
            className="pl-6 py-4"
            style={{ borderLeft: '1px solid #C4A84A', paddingLeft: '1.5rem' }}
          >
            <p className="font-serif font-light text-charcoal" style={{ fontSize: '1.75rem' }}>
              100+
            </p>
            <p className="text-muted-ink text-sm font-sans font-light uppercase mt-2" style={{ letterSpacing: '0.18em' }}>
              Academic Titles
            </p>
          </div>

          {/* Stat 3 */}
          <div
            className="pl-6 py-4"
            style={{ borderLeft: '1px solid #C4A84A', paddingLeft: '1.5rem' }}
          >
            <p className="font-serif font-light text-charcoal" style={{ fontSize: '1.75rem' }}>
              <span className="text-gold">₹</span>99
            </p>
            <p className="text-muted-ink text-sm font-sans font-light uppercase mt-2" style={{ letterSpacing: '0.18em' }}>
              Starting Price
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
