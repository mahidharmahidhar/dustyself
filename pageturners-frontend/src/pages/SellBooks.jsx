import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = 'pageturners-cloud';
const CLOUDINARY_UPLOAD_PRESET = 'pageturners-books';

export default function SellBooks() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    condition: 'GOOD',
    price: '',
    category: 'Fiction',
    language: 'English',
    pages: '',
    imageUrl: ''
  });

  const conditions = ['LIKE_NEW', 'VERY_GOOD', 'GOOD', 'FAIR'];
  const categories = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Self-Help', 'Biography', 'History', 'Science', 'Technology', 'Other'];
  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Create FormData for Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: uploadFormData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        imageUrl: data.secure_url
      }));
    } catch (err) {
      setError('Failed to upload image. You can manually enter an image URL instead.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title || !formData.author || !formData.price || !formData.condition) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const { data } = await api.post('/books', {
        ...formData,
        price: parseFloat(formData.price),
        pages: formData.pages ? parseInt(formData.pages) : null
      });

      if (data.success) {
        setSuccess(true);
        setFormData({
          title: '',
          author: '',
          isbn: '',
          description: '',
          condition: 'GOOD',
          price: '',
          category: 'Fiction',
          language: 'English',
          pages: '',
          imageUrl: ''
        });
        setTimeout(() => {
          navigate('/orders'); // Redirect to seller dashboard
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit book listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#111518',
          marginBottom: '8px'
        }}>
          📚 Sell Your Book
        </h1>
        <p style={{ color: '#687279', fontSize: '16px' }}>
          List a book for sale. Our team will review it and approve within 24 hours.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          ✓ Book submitted successfully! Redirecting to dashboard...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          ✗ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#f8f9fa',
        padding: '32px',
        borderRadius: '12px',
        border: '1px solid #e2e8e5'
      }}>
        {/* Row 1: Title and Author */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111518',
              marginBottom: '8px'
            }}>
              Book Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111518',
              marginBottom: '8px'
            }}>
              Author Name *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Row 2: ISBN and Pages */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111518',
              marginBottom: '8px'
            }}>
              ISBN (Optional)
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="ISBN-10 or ISBN-13"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111518',
              marginBottom: '8px'
            }}>
              Number of Pages
            </label>
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              placeholder="e.g., 320"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Row 3: Condition and Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111518',
              marginBottom: '8px'
            }}>
              Book Condition *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                backgroundColor: '#fff'
              }}
            >
              {conditions.map(cond => (
                <option key={cond} value={cond}>
                  {cond.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111518',
              marginBottom: '8px'
            }}>
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 299"
              step="0.01"
              min="0"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Row 4: Category and Language */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111518',
              marginBottom: '8px'
            }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                backgroundColor: '#fff'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111518',
              marginBottom: '8px'
            }}>
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8e5',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                backgroundColor: '#fff'
              }}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111518',
            marginBottom: '8px'
          }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the book, any highlights, or reasons to buy..."
            rows="6"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e2e8e5',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Image Upload - Cloudinary */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111518',
            marginBottom: '8px'
          }}>
            Book Cover Image (Optional)
          </label>

          {/* Image Preview */}
          {formData.imageUrl && (
            <div style={{ marginBottom: '12px' }}>
              <img
                src={formData.imageUrl}
                alt="Book cover preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '300px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8e5'
                }}
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                style={{
                  display: 'block',
                  marginTop: '8px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: '#991b1b',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remove Image
              </button>
            </div>
          )}

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #ff6310',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#fff4ef',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1,
              marginBottom: '12px'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>
              {uploading ? '⏳' : '📸'}
            </div>
            <p style={{
              color: '#111518',
              fontWeight: 600,
              marginBottom: '4px'
            }}>
              {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
            </p>
            <p style={{ color: '#687279', fontSize: '12px' }}>
              PNG, JPG, GIF up to 5MB
            </p>
          </div>

          {/* Manual URL Input */}
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            color: '#687279',
            marginBottom: '4px'
          }}>
            Or paste image URL:
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/book-cover.jpg"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e2e8e5',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Terms Checkbox */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            id="terms"
            required
            style={{ marginTop: '4px', cursor: 'pointer' }}
          />
          <label htmlFor="terms" style={{ fontSize: '14px', color: '#687279', cursor: 'pointer' }}>
            I confirm this is an authentic book in the condition described. Listings must comply with store policies.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#d1d5db' : '#ff6310',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#e05500';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#ff6310';
          }}
        >
          {loading ? 'Submitting...' : '✓ Submit for Review'}
        </button>

        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '16px',
          textAlign: 'center'
        }}>
          Your listing will be reviewed by our team within 24 hours and appear publicly once approved.
        </p>
      </form>
    </div>
  );
}
