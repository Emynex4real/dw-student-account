import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Global Axios instance pointing at the PHP backend.
 * Base URL reads from .env (VITE_API_BASE_URL) with a fallback to localhost XAMPP.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/students/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ── Request Interceptor — attach JWT token + clear Content-Type for FormData ──
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let Axios set the correct multipart boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor — handle 401 (token expired / invalid) ────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
