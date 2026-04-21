import React from 'react';

export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero */}
      <section style={{ backgroundColor: '#2A1F14', paddingTop: '80px', paddingBottom: '60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#F2EEE7', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.02em' }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: '18px', color: '#E8E2D6', lineHeight: 1.6 }}>
            Please read these terms carefully before using Dusty Shelf.
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
                Acceptance of Terms
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif" }}>
                By accessing and using Dusty Shelf, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            {/* Section 2 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                User Accounts
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                When you create an account on Dusty Shelf, you agree to:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Provide accurate and complete information</li>
                <li>Keep your password confidential and secure</li>
                <li>Not share your account with others</li>
                <li>Not use the account for any unlawful purposes</li>
                <li>Be responsible for all activity on your account</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Product Information
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                All book descriptions, pricing, and availability information are provided on an "as-is" basis. We strive for accuracy but do not warrant that:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Product descriptions are accurate or complete</li>
                <li>Prices will be constant (we reserve the right to change prices)</li>
                <li>Products will remain available (first-come, first-served basis)</li>
                <li>Book conditions will exceed stated grades</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Orders and Payment
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                By placing an order, you agree to:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Pay the full amount displayed at checkout</li>
                <li>Provide accurate delivery address information</li>
                <li>Accept all applicable taxes and fees</li>
                <li>Not dispute legitimate transactions</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Return Policy
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                Our return policy is as follows:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Unopened books may be returned within 7 days of purchase for a full refund</li>
                <li>Books must be in their original condition</li>
                <li>Read books cannot be returned but may be exchanged for store credit</li>
                <li>Damaged or defective books should be reported immediately</li>
                <li>Return shipping costs are the buyer's responsibility</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Limitation of Liability
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif" }}>
                Dusty Shelf shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with your access to or use of this platform, including but not limited to loss of data, revenue, or profits.
              </p>
            </div>

            {/* Section 7 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Prohibited Activities
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                You agree not to engage in the following activities:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Hacking, phishing, or attempting unauthorized access</li>
                <li>Posting offensive, abusive, or illegal content</li>
                <li>Violating intellectual property rights</li>
                <li>Fraudulent or deceptive activities</li>
                <li>Spamming or harassing other users</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Termination
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif" }}>
                We reserve the right to suspend or terminate your account at any time for violation of these terms or for any reason we deem appropriate. Upon termination, your right to use the platform is immediately revoked.
              </p>
            </div>

            {/* Contact Section */}
            <div style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid #E8E2D6' }}>
              <p style={{ fontSize: '16px', color: '#687279', marginBottom: '16px' }}>
                Questions about our Terms & Conditions?
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
