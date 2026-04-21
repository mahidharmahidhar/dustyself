import React from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: "How are books conditioned graded?",
      answer: "We grade each book honestly: Like New (pristine, read once), Good (well-maintained with minor wear), and Acceptable (heavy use but fully readable). Every book is inspected by hand."
    },
    {
      question: "What is your return policy?",
      answer: "Books can be returned within 7 days of purchase if unopened or in the original condition. Once read, books cannot be returned but may be exchanged for store credit."
    },
    {
      question: "Do you offer shipping?",
      answer: "Currently, we operate as a physical store at Jain University, Jayanagar. We are exploring online shipping options. Contact us for custom requests."
    },
    {
      question: "Can I sell my books to Dusty Shelf?",
      answer: "Yes! We buy used books in good condition. Bring your books to our store or email us at dustyshelf@jain.edu with details. We offer instant quotes and payment."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, UPI, debit cards, and credit cards. Online payments are processed securely through our website."
    },
    {
      question: "Are there discounts for bulk purchases?",
      answer: "Yes! We offer special pricing for bulk orders (5+ books). Contact us for group purchase quotes, especially for academic institutions."
    },
    {
      question: "Do you have rare or out-of-print books?",
      answer: "We occasionally stock rare and out-of-print editions. Subscribe to our newsletter or visit regularly to discover new arrivals."
    },
    {
      question: "What are your store hours?",
      answer: "Monday to Saturday: 10:00 AM - 5:00 PM. Closed on Sundays and public holidays. We're located at Jain University, Jayanagar."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero */}
      <section style={{ backgroundColor: '#2A1F14', paddingTop: '80px', paddingBottom: '60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#F2EEE7', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '18px', color: '#E8E2D6', lineHeight: 1.6 }}>
            Find answers to common questions about Dusty Shelf
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F2EEE7',
                  padding: '32px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #C4A84A'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#151515', marginBottom: '12px', fontFamily: "'Montserrat', sans-serif" }}>
                  {faq.question}
                </h3>
                <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif" }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #E8E2D6' }}>
            <p style={{ fontSize: '16px', color: '#687279', marginBottom: '16px' }}>
              Didn't find your answer?
            </p>
            <a
              href="mailto:dustyshelf@jain.edu"
              style={{
                display: 'inline-block',
                backgroundColor: '#ff6310',
                color: '#ffffff',
                padding: '12px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e05500'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6310'}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
