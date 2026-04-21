import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/index';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken);
      // Also store userId directly for convenience
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userRole', res.data.user.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(17, 21, 24, 0.08)', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '24px', textAlign: 'center', color: '#111518', fontFamily: "'Montserrat', sans-serif" }}>Login</h1>

        {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#111518' }}>Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              style={{ width: '100%', padding: '10px 16px', border: '1px solid #e2e8e5', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
              placeholder="your@email.com"
            />
            {errors.email && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#111518' }}>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              style={{ width: '100%', padding: '10px 16px', border: '1px solid #e2e8e5', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }}
              placeholder="••••••"
            />
            {errors.password && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', backgroundColor: loading ? '#ff6310cc' : '#ff6310', color: '#ffffff', padding: '12px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', transition: 'all 0.2s', fontSize: '14px' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#e05500')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#ff6310')}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', color: '#687279', fontSize: '14px' }}>
          Don't have an account? <a href="/register" style={{ color: '#ff6310', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}>Register</a>
        </p>
      </div>
    </div>
  );
}
