import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — clear session and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/api/auth/signup', data),
  login:  (data) => api.post('/api/auth/login', data),
  deleteAccount: (password) => api.delete('/api/auth/account', { data: { password } }),
};

// ── URL API ───────────────────────────────────────────────
export const urlAPI = {
  create:  (data) => api.post('/api/urls', data),   // data: { originalUrl, expiry? }
  getAll:  ()     => api.get('/api/urls'),
  delete:  (id)   => api.delete(`/api/urls/${id}`),
};

// ── Analytics API ─────────────────────────────────────────
export const analyticsAPI = {
  getUrlAnalytics: (urlId) => api.get(`/api/analytics/${urlId}`),
};

export default api;
