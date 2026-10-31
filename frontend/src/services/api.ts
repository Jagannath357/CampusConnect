import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Revocation & Suspension
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Account Suspended (Decision Table 1 & 8)
      if (status === 403 && data?.accountStatus === 'SUSPENDED') {
        localStorage.removeItem('cc_token');
        localStorage.removeItem('cc_user');
        if (window.location.pathname !== '/suspended') {
          window.location.href = '/suspended';
        }
      }

      // Token Revoked or Expired
      if (status === 401) {
        // If not already on auth/landing pages
        const publicPaths = ['/', '/login', '/register', '/grievance/track', '/grievance/submit'];
        if (!publicPaths.includes(window.location.pathname)) {
          localStorage.removeItem('cc_token');
          localStorage.removeItem('cc_user');
          window.location.href = '/login?session_expired=1';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
