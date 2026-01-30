import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message, ...error.response?.data });
  }
);

// Contact API endpoints
export const contactAPI = {
  // Submit contact form
  submit: async (data) => {
    return api.post('/contacts', data);
  },

  // Get all contacts (admin)
  getAll: async (params = {}) => {
    return api.get('/contacts', { params });
  },

  // Get contact statistics (admin)
  getStats: async () => {
    return api.get('/contacts/stats');
  },

  // Get single contact (admin)
  getById: async (id) => {
    return api.get(`/contacts/${id}`);
  },

  // Update contact status (admin)
  updateStatus: async (id, status) => {
    return api.patch(`/contacts/${id}`, { status });
  },

  // Delete contact (admin)
  delete: async (id) => {
    return api.delete(`/contacts/${id}`);
  },
};

// Health check
export const healthCheck = async () => {
  return api.get('/health');
};

export default api;
