import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('cashive_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

// ─── Stock ───────────────────────────────────────────────────────────────────

export const stockAPI = {
  getAll: () => api.get('/stock'),
  create: (data) => api.post('/stock', data),
  update: (id, data) => api.put(`/stock/${id}`, data),
  remove: (id) => api.delete(`/stock/${id}`),
};

// ─── Production ──────────────────────────────────────────────────────────────

export const productionAPI = {
  getStage: (stage) => api.get(`/production/${stage}`),
  pullFromStock: (data) => api.post('/production/pull/stock-to-store', data),
  pullBetweenStages: (from, to, data) => api.post(`/production/pull/${from}/${to}`, data),
  deleteItem: (stage, id) => api.delete(`/production/${stage}/${id}`),
};

export default api;
