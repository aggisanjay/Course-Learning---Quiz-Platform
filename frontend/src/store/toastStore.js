import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, message, type };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Direct helper functions for easy calling anywhere
export const toast = {
  success: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'success', duration }),
  error: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'error', duration }),
  warning: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'warning', duration }),
  info: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'info', duration }),
};
