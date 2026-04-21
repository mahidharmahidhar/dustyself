import React, { createContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('dusty-shelf-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('auth_token');
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('dusty-shelf-cart', JSON.stringify(cart));
  }, [cart]);

  // Monitor auth state changes
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);

    // If user just logged in, sync cart from backend
    if (token && cart.length === 0) {
      loadCartFromBackend();
    }
  }, []);

  // Load cart from backend
  const loadCartFromBackend = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      if (response.items) {
        setCart(response.items);
      }
    } catch (err) {
      console.error('Failed to load cart from backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (book) => {
    const token = localStorage.getItem('auth_token');

    // Always update local cart
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });

    // Sync to backend if authenticated
    if (token) {
      try {
        await cartService.addToCart(book.id, 1);
      } catch (err) {
        console.error('Failed to sync cart to backend:', err);
        setError(err.message);
      }
    }
  }, []);

  const removeFromCart = useCallback(async (bookId) => {
    const token = localStorage.getItem('auth_token');

    // Always update local cart
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));

    // Sync to backend if authenticated
    if (token) {
      try {
        await cartService.removeFromCart(bookId);
      } catch (err) {
        console.error('Failed to sync cart removal to backend:', err);
        setError(err.message);
      }
    }
  }, []);

  const updateQuantity = useCallback(async (bookId, quantity) => {
    const token = localStorage.getItem('auth_token');

    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    // Always update local cart
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );

    // Sync to backend if authenticated
    if (token) {
      try {
        await cartService.updateQuantity(bookId, quantity);
      } catch (err) {
        console.error('Failed to sync quantity update to backend:', err);
        setError(err.message);
      }
    }
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem('auth_token');

    // Always clear local cart
    setCart([]);

    // Sync to backend if authenticated
    if (token) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Failed to clear cart on backend:', err);
        setError(err.message);
      }
    }
  }, []);

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0).toFixed(2);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      isLoading,
      error,
      isAuthenticated,
      loadCartFromBackend,
    }}>
      {children}
    </CartContext.Provider>
  );
};
