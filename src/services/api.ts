import axios from 'axios';

/**
 * Global Axios instance.
 * - baseURL is read from Vite environment variables so that swapping
 *   from a mock layer to the real PHP backend is a one-line .env change.
 * - Interceptors are stubbed and ready for token injection + error handling.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ── Request Interceptor ────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // TODO: Inject auth token from store when auth feature is implemented
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ───────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Global error handling (401 redirect, toast notifications, etc.)
    // if (error.response?.status === 401) {
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  },
);

export default api;
