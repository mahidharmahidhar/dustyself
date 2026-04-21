import React from 'react';

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero */}
      <section style={{ backgroundColor: '#2A1F14', paddingTop: '80px', paddingBottom: '60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#F2EEE7', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '18px', color: '#E8E2D6', lineHeight: 1.6 }}>
            Your privacy is important to us. Learn how Dusty Shelf protects your data.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* Section 1 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Information We Collect
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                We collect information you provide directly to us:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Account information (name, email, password)</li>
                <li>Delivery address and contact information</li>
                <li>Payment and transaction details</li>
                <li>Book preferences and browsing history</li>
                <li>Reviews and ratings you submit</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                How We Use Your Information
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                We use the information we collect to:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Process your orders and deliver books to your address</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you notifications about order status and updates</li>
                <li>Personalize your shopping experience and recommend books</li>
                <li>Prevent fraud and ensure account security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Data Security
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif" }}>
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All transactions are encrypted and sensitive data is stored securely. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            {/* Section 4 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Sharing Your Information
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Delivery partners to fulfill your orders</li>
                <li>Payment processors to handle transactions securely</li>
                <li>Service providers who assist us in operating our platform</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Cookies
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif" }}>
                We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and understand how you use our platform. You can disable cookies in your browser settings, but this may affect your experience on our website.
              </p>
            </div>

            {/* Section 6 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Your Rights
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                You have the right to:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability in a machine-readable format</li>
              </ul>
            </div>

            {/* Contact Section */}
            <div style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid #E8E2D6' }}>
              <p style={{ fontSize: '16px', color: '#687279', marginBottom: '16px' }}>
                Questions about our Privacy Policy?
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
        </div>
      </section>
    </div>
  );
}
