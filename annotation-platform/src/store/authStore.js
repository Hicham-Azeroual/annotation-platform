// src/store/authStore.js
import { create } from 'zustand';
import Cookies from 'js-cookie';
import { parseJwt, isTokenExpired } from '../utils/jwt';
import axios from '../api/axiosConfig';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (userData) => {
    if (!userData.token || isTokenExpired(userData.token)) {
      Cookies.remove('token');
      Cookies.remove('user');
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }

    Cookies.set('token', userData.token, { expires: 1, secure: true, sameSite: 'strict' });
    Cookies.set('user', JSON.stringify(userData), { expires: 1, secure: true, sameSite: 'strict' });

    set({
      user: userData,
      token: userData.token,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('token');
      Cookies.remove('user');
      delete axios.defaults.headers.common['Authorization'];
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      window.location.href = '/login';
    }
  },

  initialize: () => {
    const token = Cookies.get('token');
    const user = Cookies.get('user');

    if (token && user) {
      if (isTokenExpired(token)) {
        Cookies.remove('token');
        Cookies.remove('user');
        set({ user: null, token: null, isAuthenticated: false });
      } else {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({
          user: JSON.parse(user),
          token,
          isAuthenticated: true,
        });
      }
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;