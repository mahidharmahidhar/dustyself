import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,

  setAuth: (user, accessToken) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    set({ user, accessToken });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  }
}));

export const useCartStore = create((set) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],

  addItem: (book, quantity = 1) => {
    set(state => {
      const existing = state.items.find(i => i.id === book.id);
      let newItems;
      if (existing) {
        newItems = state.items.map(i =>
          i.id === book.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [...state.items, { ...book, quantity }];
      }
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (bookId) => {
    set(state => {
      const newItems = state.items.filter(i => i.id !== bookId);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  updateQuantity: (bookId, quantity) => {
    set(state => {
      const newItems = state.items.map(i =>
        i.id === bookId ? { ...i, quantity } : i
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  }
}));

// Convenience hook that exports useCartStore as useCart
export const useCart = useCartStore;

