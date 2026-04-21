import React from 'react';

export default function CategoryMarquee() {
  const categories = [
    'UG', 'PG', 'Programming', 'Commerce', 'Mythology',
    'Fiction', 'Literary', 'Science', 'History'
  ];

  // Duplicate for seamless loop
  const displayCategories = [...categories, ...categories];

  return (
    <div
      className="overflow-hidden py-3"
      style={{ backgroundColor: '#2A1F14' }}
    >
      <div className="marquee-container flex whitespace-nowrap">
        {displayCategories.map((category, idx) => (
          <span
            key={idx}
            className="flex items-center gap-6 mx-8 text-cream font-sans uppercase"
            style={{ fontSize: '0.625rem', letterSpacing: '0.22em' }}
          >
            {category}
            <span className="text-gold-light">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
