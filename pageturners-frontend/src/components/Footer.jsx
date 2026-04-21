import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e2e8e5',
        padding: '64px 24px 32px',
        marginTop: '96px'
      }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Brand Section */}
          <div>
            <Link
              to="/"
              style={{
                display: 'block',
                marginBottom: '24px',
                textDecoration: 'none'
              }}
            >
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '20px',
                fontWeight: 700,
                color: '#ff6310',
                marginBottom: '8px'
              }}>
                📚 Dusty Shelf
              </h3>
              <p style={{
                color: '#9ca3af',
                fontSize: '12px',
                fontWeight: 500
              }}>
                Second-Hand Books
              </p>
            </Link>
            <p style={{
              color: '#687279',
              fontSize: '14px',
              lineHeight: 1.6,
              marginTop: '16px'
            }}>
              Discover a world of affordable, pre-loved books for every reader. Quality reading, sustainably sourced.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <p style={{
              color: '#111518',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '16px',
              letterSpacing: '0.08em'
            }}>
              Shop
            </p>
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <Link
                to="/shop"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                All Books
              </Link>
              <Link
                to="/shop?featured=true"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                Featured
              </Link>
              <Link
                to="/shop"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <p style={{
              color: '#111518',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '16px',
              letterSpacing: '0.08em'
            }}>
              Company
            </p>
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <Link
                to="/about"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <p style={{
              color: '#111518',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '16px',
              letterSpacing: '0.08em'
            }}>
              Legal
            </p>
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <Link
                to="/privacy"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                Terms of Service
              </Link>
              <Link
                to="/shipping"
                style={{
                  color: '#687279',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
              >
                Shipping Info
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            borderTop: '1px solid #e2e8e5',
            paddingTop: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center'
          }}
        >
          <p style={{
            color: '#9ca3af',
            fontSize: '13px'
          }}>
            © {currentYear} Dusty Shelf. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '24px',
            fontSize: '18px'
          }}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#687279',
                textDecoration: 'none',
                transition: 'color 200ms ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
            >
              📱
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#687279',
                textDecoration: 'none',
                transition: 'color 200ms ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
            >
              𝕏
            </a>
            <a
              href="mailto:contact@dustyshelf.com"
              style={{
                color: '#687279',
                textDecoration: 'none',
                transition: 'color 200ms ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff6310'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#687279'}
            >
              ✉️
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
