import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message cannot be empty';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
      inquiries.push({
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('inquiries', JSON.stringify(inquiries));

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setFieldErrors({});

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcf9f0', color: '#1c1c17' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fcf9f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid #e5e2da'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          maxWidth: '100%'
        }}>
          <a href="/" style={{
            fontSize: '1.5rem',
            fontFamily: "'Newsreader', serif",
            fontWeight: 600,
            color: '#1A1A1B',
            textDecoration: 'none',
            letterSpacing: '-0.02em'
          }}>
            Dustyshelf
          </a>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff6310',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.3s',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 99, 16, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            ← Back to Shop
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ minHeight: 'calc(100vh - 60px)' }}>
        {/* Hero Section */}
        <section style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 0.75rem',
              backgroundColor: '#fdcbcb',
              color: '#795354',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              marginBottom: '1.5rem'
            }}>
              CORRESPONDENCE
            </div>
            <h1 style={{
              fontFamily: "'Newsreader', serif",
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '2rem'
            }}>
              Write to <br /> <span style={{ fontStyle: 'italic', color: '#7b5455' }}>The Curator.</span>
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#434656',
              lineHeight: 1.7,
              maxWidth: '500px'
            }}>
              Whether you are seeking a rare first edition or wish to share your thoughts, our doors are always open for thoughtful inquiry.
            </p>
          </div>

          {/* Image */}
          <div style={{ position: 'relative' }}>
            <div style={{
              aspectRatio: '4/5',
              backgroundColor: '#f1eee5',
              overflow: 'hidden',
              borderRadius: '0.5rem',
              border: '1px solid rgba(196, 197, 217, 0.1)',
              boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)'
            }}>
              <img
                alt="Vintage writing desk with fountain pen"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.9,
                  filter: 'grayscale(20%)',
                  transition: 'transform 0.7s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                src="https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=500&fit=crop"
              />
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section style={{
          backgroundColor: '#f1eee5',
          padding: '5rem 1.5rem'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '4rem'
          }}>
            {/* Form Card */}
            <div style={{
              backgroundColor: '#fcf9f0',
              padding: '2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)',
              border: '1px solid rgba(196, 197, 217, 0.2)'
            }}>
              {submitted && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '0.5rem',
                  color: '#065f46',
                  marginBottom: '1.5rem',
                  animation: 'slideIn 0.3s ease'
                }}>
                  <strong>✓ Success!</strong> Your message has been sent. We'll get back to you shortly.
                </div>
              )}

              {error && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  color: '#991b1b',
                  marginBottom: '1.5rem'
                }}>
                  <strong>✗ Error:</strong> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Name & Email Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#747688',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      aria-label="Your name"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#ebe8df',
                        border: `2px solid ${fieldErrors.name ? '#ba1a1a' : 'transparent'}`,
                        borderRadius: '0.25rem',
                        fontSize: '0.95rem',
                        fontFamily: "'Manrope', sans-serif",
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 99, 16, 0.2)';
                        e.currentTarget.style.borderColor = '#ff6310';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        if (!fieldErrors.name) e.currentTarget.style.borderColor = 'transparent';
                      }}
                    />
                    {fieldErrors.name && (
                      <span style={{ fontSize: '0.75rem', color: '#ba1a1a', marginTop: '0.25rem', display: 'block' }}>
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: '#747688',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      aria-label="Email address"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#ebe8df',
                        border: `2px solid ${fieldErrors.email ? '#ba1a1a' : 'transparent'}`,
                        borderRadius: '0.25rem',
                        fontSize: '0.95rem',
                        fontFamily: "'Manrope', sans-serif",
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 99, 16, 0.2)';
                        e.currentTarget.style.borderColor = '#ff6310';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                        if (!fieldErrors.email) e.currentTarget.style.borderColor = 'transparent';
                      }}
                    />
                    {fieldErrors.email && (
                      <span style={{ fontSize: '0.75rem', color: '#ba1a1a', marginTop: '0.25rem', display: 'block' }}>
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#747688',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>
                    SUBJECT OF INQUIRY
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    aria-label="Subject of inquiry"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#ebe8df',
                      border: '2px solid transparent',
                      borderRadius: '0.25rem',
                      fontSize: '0.95rem',
                      fontFamily: "'Manrope', sans-serif",
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 99, 16, 0.2)';
                      e.currentTarget.style.borderColor = '#ff6310';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <option>General Inquiry</option>
                    <option>Book Recommendation</option>
                    <option>Technical Support</option>
                    <option>Press & Media</option>
                    <option>Partnership</option>
                  </select>
                </div>

                {/* Message */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#747688',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>
                    MESSAGE *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind..."
                    rows="5"
                    aria-label="Your message"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#ebe8df',
                      border: `2px solid ${fieldErrors.message ? '#ba1a1a' : 'transparent'}`,
                      borderRadius: '0.25rem',
                      fontSize: '0.95rem',
                      fontFamily: "'Manrope', sans-serif",
                      outline: 'none',
                      transition: 'all 0.2s',
                      resize: 'vertical',
                      minHeight: '150px',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 99, 16, 0.2)';
                      e.currentTarget.style.borderColor = '#ff6310';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      if (!fieldErrors.message) e.currentTarget.style.borderColor = 'transparent';
                    }}
                  />
                  {fieldErrors.message && (
                    <span style={{ fontSize: '0.75rem', color: '#ba1a1a', marginTop: '0.25rem', display: 'block' }}>
                      {fieldErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Send correspondence"
                  style={{
                    width: '100%',
                    padding: '1rem 2rem',
                    backgroundColor: loading ? '#9ca3af' : '#ff6310',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.75rem',
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(255, 99, 16, 0.15)',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 99, 16, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 99, 16, 0.15)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? '⏳ Sending...' : '✉ Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div style={{ paddingTop: '1rem' }}>
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: '1.5rem',
                  fontStyle: 'italic',
                  marginBottom: '1rem'
                }}>
                  📍 Our Office
                </h3>
                <address style={{
                  fontStyle: 'normal',
                  color: '#434656',
                  lineHeight: 1.7
                }}>
                  PageTurners HQ<br />
                  123 Bookshelf Avenue<br />
                  New York, NY 10001
                </address>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: '1.5rem',
                  fontStyle: 'italic',
                  marginBottom: '1rem'
                }}>
                  ✉ Contact Info
                </h3>
                <p style={{ color: '#434656', lineHeight: 1.7 }}>
                  <a href="mailto:support@pageturners.com" style={{ color: '#ff6310', textDecoration: 'none', fontWeight: 600 }}>
                    support@pageturners.com
                  </a>
                  <br />
                  <a href="tel:1-800-BOOKS" style={{ color: '#ff6310', textDecoration: 'none', fontWeight: 600 }}>
                    1-800-BOOKS
                  </a>
                </p>
              </div>

              <div>
                <h3 style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: '1.5rem',
                  fontStyle: 'italic',
                  marginBottom: '1rem'
                }}>
                  🌐 Follow Us
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Twitter', 'Instagram', 'LinkedIn'].map(social => (
                    <a
                      key={social}
                      href="#"
                      aria-label={`Follow on ${social}`}
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        backgroundColor: '#ebe8df',
                        border: 'none',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontSize: '1.2rem',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#ff6310';
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ebe8df';
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {social[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
