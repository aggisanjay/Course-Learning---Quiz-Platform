import { create } from 'zustand';
import { authApi } from '../services/authApi';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('learnflow_user') || 'null'),
  token: localStorage.getItem('learnflow_token') || null,
  isAuthenticated: !!localStorage.getItem('learnflow_token'),
  isLoading: true,
  error: null,

  initAuth: async () => {
    const token = localStorage.getItem('learnflow_token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        localStorage.setItem('learnflow_user', JSON.stringify(res.data.user));
        set({
          user: res.data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Failed to restore session');
      }
    } catch {
      localStorage.removeItem('learnflow_token');
      localStorage.removeItem('learnflow_user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      const res = await authApi.login({ email, password });
      const { user, token } = res.data;
      localStorage.setItem('learnflow_token', token);
      localStorage.setItem('learnflow_user', JSON.stringify(user));
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Login failed' });
      return { success: false, error: err.message };
    }
  },

  register: async (name, email, password) => {
    set({ error: null });
    try {
      const res = await authApi.register({ name, email, password });
      const { user, token } = res.data;
      localStorage.setItem('learnflow_token', token);
      localStorage.setItem('learnflow_user', JSON.stringify(user));
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      set({ error: err.message || 'Registration failed' });
      return { success: false, error: err.message };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout network errors
    } finally {
      localStorage.removeItem('learnflow_token');
      localStorage.removeItem('learnflow_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
