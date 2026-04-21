import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dusty-shelf-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('dusty-shelf-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dusty-shelf-user');
    }
  }, [user]);

  // Login with email/password
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);

      // Store user data from response
      const userData = {
        id: response.user?.id || response.userId,
        email: response.user?.email || email,
        name: response.user?.name || email.split('@')[0],
        token: response.token,
      };

      authService.setStoredUser(userData);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register new user
  const register = useCallback(async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(email, password, name);

      // Store user data from response
      const userData = {
        id: response.user?.id || response.userId,
        email: response.user?.email || email,
        name: response.user?.name || name || email.split('@')[0],
        token: response.token,
      };

      authService.setStoredUser(userData);
      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      // Still clear user even if API call fails
      setUser(null);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user && !!localStorage.getItem('auth_token');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

