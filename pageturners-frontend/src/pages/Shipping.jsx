import React from 'react';

export default function Shipping() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero */}
      <section style={{ backgroundColor: '#2A1F14', paddingTop: '80px', paddingBottom: '60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#F2EEE7', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.02em' }}>
            Shipping & Delivery
          </h1>
          <p style={{ fontSize: '18px', color: '#E8E2D6', lineHeight: 1.6 }}>
            Fast, reliable, and secure delivery of your books across Bangalore.
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
                Delivery Areas
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                We currently serve the following areas in Bangalore:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Jayanagar and surrounding localities</li>
                <li>Indiranagar</li>
                <li>Koramangala</li>
                <li>Whitefield</li>
                <li>Marathahalli</li>
                <li>Bellandur</li>
                <li>Central Bangalore (within 10km radius)</li>
              </ul>
              <p style={{ fontSize: '14px', color: '#ff6310', marginTop: '16px', fontWeight: 600 }}>
                For areas outside these zones, please contact us at dustyshelf@jain.edu for custom arrangements.
              </p>
            </div>

            {/* Section 2 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Delivery Timeline
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                Standard delivery times are:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li><strong>Standard Delivery:</strong> 3-5 business days from order confirmation</li>
                <li><strong>Express Delivery:</strong> 1-2 business days (available for selected areas)</li>
                <li><strong>Store Pickup:</strong> Same day or next day at Jain University, Jayanagar</li>
              </ul>
              <p style={{ fontSize: '14px', color: '#687279', marginTop: '12px' }}>
                Delivery times may vary during peak seasons or public holidays. We'll notify you of any delays.
              </p>
            </div>

            {/* Section 3 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Shipping Costs
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                Shipping charges vary based on order value and location:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li><strong>Orders below ₹500:</strong> ₹50 standard delivery, ₹100 express</li>
                <li><strong>Orders ₹500 - ₹1000:</strong> ₹30 standard delivery, ₹80 express</li>
                <li><strong>Orders above ₹1000:</strong> FREE standard delivery, ₹50 express</li>
                <li><strong>Store Pickup:</strong> FREE (available at Jain University, Jayanagar)</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Order Tracking
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                Track your order in real-time:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Login to your account and view "My Orders"</li>
                <li>Receive SMS and email updates at key stages</li>
                <li>Get delivery partner contact information 24 hours before delivery</li>
                <li>View estimated delivery window</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Packaging
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif" }}>
                We take great care in packaging your books. Each order is carefully packed using eco-friendly materials to ensure your books arrive in perfect condition. Books are wrapped individually and secured in durable boxes with padding to prevent any damage during transit.
              </p>
            </div>

            {/* Section 6 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                Damaged or Lost Orders
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif", marginBottom: '12px' }}>
                If your order arrives damaged or is lost:
              </p>
              <ul style={{ fontSize: '16px', color: '#687279', lineHeight: 1.8, fontFamily: "'Figtree', sans-serif", marginLeft: '20px' }}>
                <li>Report the issue within 48 hours of delivery</li>
                <li>Provide photo evidence of damage</li>
                <li>We will send a replacement immediately or issue a full refund</li>
                <li>No return of damaged books required for items under ₹500</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div style={{ backgroundColor: '#F2EEE7', padding: '32px', borderRadius: '12px', borderLeft: '4px solid #C4A84A' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#151515', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif" }}>
                International Shipping
              </h2>
              <p style={{ fontSize: '16px', color: '#687279', lineHeight: 1.6, fontFamily: "'Figtree', sans-serif" }}>
                We currently do not offer international shipping. However, if you have specific requirements for shipping outside India, please contact us at dustyshelf@jain.edu to discuss custom arrangements and costs.
              </p>
            </div>

            {/* Contact Section */}
            <div style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid #E8E2D6' }}>
              <p style={{ fontSize: '16px', color: '#687279', marginBottom: '16px' }}>
                Need help with your delivery?
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
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
