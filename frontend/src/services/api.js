import axios from 'axios';

// Determine the API URL based on environment
const getBaseURL = () => {
  // Production: Use Render backend URL
  if (import.meta.env.PROD) {
    return 'https://nmek53mkye.execute-api.us-east-1.amazonaws.com/prod/api';
  }
  // Development: Use Vite proxy
  return '/api';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // 15 seconds (Render free tier can be slow on cold start)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ 
        message: 'Request timed out. The server might be waking up, please try again.' 
      });
    }
    
    if (!error.response) {
      return Promise.reject({ 
        message: 'Network error. Please check your connection.' 
      });
    }
    
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

// Health check - useful to wake up the server
export const healthCheck = async () => {
  return api.get('/health');
};

// Wake up the server (call this on page load to reduce cold start time)
export const wakeUpServer = async () => {
  try {
    await api.get('/health');
    console.log('🟢 Server is awake');
    return true;
  } catch (error) {
    console.log('🟡 Server is waking up...');
    return false;
  }
};

export default api;