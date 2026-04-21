import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast/useToast';
import { pageTransition } from '../utils/animations';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be 6+ characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please fix the errors below', 'error', 2000);
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        addToast('Login successful!', 'success', 2000);
        navigate('/');
        setFormData({ email: '', password: '' });
      } else {
        addToast(result.error || 'Login failed', 'error', 3000);
      }
    } catch (error) {
      addToast(error.message || 'Login failed', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border bg-transparent dark:bg-blue-900/20 focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email || errors.password
    ? 'border-red-500 focus:ring-red-500'
    : 'border-slate-300 dark:border-blue-600 focus:ring-blue-900 dark:focus:ring-blue-100'
    }`;

  return (
    <motion.div {...pageTransition} className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 pt-24 flex items-center justify-center">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lift p-8"
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-serif font-bold text-dark-brown dark:text-cream mb-2">
              Welcome Back
            </h1>
            <p className="text-neutral-gray dark:text-light-gray">
              Sign in to your Dusty Shelf account
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-dark-brown dark:text-cream mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-neutral-gray" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`pl-12 ${inputClass}`}
                />
              </div>
              {errors.email && (
                <motion.p className="text-red-500 text-xs mt-2">{errors.email}</motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-dark-brown dark:text-cream mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-neutral-gray" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`pl-12 pr-12 ${inputClass}`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  className="absolute right-4 top-3.5 text-neutral-gray hover:text-dark-brown dark:hover:text-cream transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p className="text-red-500 text-xs mt-2">{errors.password}</motion.p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-light-gray dark:border-neutral-gray"
                />
                <span className="text-sm text-neutral-gray dark:text-light-gray">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-sm text-dark-brown dark:text-cream hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </motion.form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-grow h-px bg-light-gray dark:bg-neutral-gray" />
            <span className="text-sm text-neutral-gray dark:text-light-gray">or</span>
            <div className="flex-grow h-px bg-light-gray dark:bg-neutral-gray" />
          </div>

          {/* Social Login */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="secondary" size="lg" className="w-full">
              Sign in with Google
            </Button>
            <Button variant="secondary" size="lg" className="w-full">
              Sign in with Apple
            </Button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            className="text-center text-sm text-neutral-gray dark:text-light-gray mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Don't have an account?{' '}
            <Link to="/register" className="text-dark-brown dark:text-cream font-semibold hover:underline">
              Sign up
            </Link>
          </motion.p>
        </motion.div>

        {/* Demo Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-white/50 dark:bg-neutral-gray/50 rounded-lg text-center text-sm text-neutral-gray dark:text-light-gray backdrop-blur-sm"
        >
          Demo Account: test@dustyshelf.com / password
        </motion.div>
      </div>
    </motion.div>
  );
};
