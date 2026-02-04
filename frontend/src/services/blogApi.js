import axios from 'axios';

// Determine the API URL based on environment
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return 'https://nmek53mkye.execute-api.us-east-1.amazonaws.com/prod/api';
  }
  return '/api';
};

// Create axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message, ...error.response?.data });
  }
);

// ============ PUBLIC BLOG API ============

export const blogAPI = {
  // Get all published posts
  getPosts: async (params = {}) => {
    return api.get('/posts', { params });
  },

  // Get single post by slug
  getPost: async (slug) => {
    return api.get(`/posts/${slug}`);
  },

  // Get categories
  getCategories: async () => {
    return api.get('/posts/categories');
  },

  // Get tags
  getTags: async () => {
    return api.get('/posts/tags');
  },
};

// ============ ADMIN BLOG API ============

export const adminBlogAPI = {
  // Store admin password in memory (not localStorage for security)
  _password: null,

  setPassword: (password) => {
    adminBlogAPI._password = password;
  },

  getPassword: () => {
    return adminBlogAPI._password;
  },

  clearPassword: () => {
    adminBlogAPI._password = null;
  },

  // Verify admin password
  authenticate: async (password) => {
    const response = await api.post('/posts/admin/auth', { password });
    if (response.success) {
      adminBlogAPI.setPassword(password);
    }
    return response;
  },

  // Get all posts (including drafts)
  getAllPosts: async (params = {}) => {
    return api.get('/posts/admin/all', {
      params,
      headers: { 'X-Admin-Password': adminBlogAPI._password }
    });
  },

  // Get post by ID
  getPost: async (id) => {
    return api.get(`/posts/admin/${id}`, {
      headers: { 'X-Admin-Password': adminBlogAPI._password }
    });
  },

  // Get statistics
  getStats: async () => {
    return api.get('/posts/admin/stats', {
      headers: { 'X-Admin-Password': adminBlogAPI._password }
    });
  },

  // Create new post
  createPost: async (data) => {
    return api.post('/posts/admin', data, {
      headers: { 'X-Admin-Password': adminBlogAPI._password }
    });
  },

  // Update post
  updatePost: async (id, data) => {
    return api.put(`/posts/admin/${id}`, data, {
      headers: { 'X-Admin-Password': adminBlogAPI._password }
    });
  },

  // Delete post
  deletePost: async (id) => {
    return api.delete(`/posts/admin/${id}`, {
      headers: { 'X-Admin-Password': adminBlogAPI._password }
    });
  },
};

export default api;
