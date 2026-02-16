import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ceresense-backend-2.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  forgotPassword: async ({ email }) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  verifyOtp: async ({ email, otp }) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  },
  resetPassword: async ({ email, otp, newPassword }) => {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  },
};

// Gallery API methods
export const galleryApi = {
  // Get all gallery items - FIXED: Convert page and limit to numbers
  getAll: async (params = {}) => {
    // Convert page and limit to numbers to fix backend validation
    const processedParams = { ...params };
    
    if (processedParams.page !== undefined) {
      processedParams.page = Number(processedParams.page) || 1;
    }
    if (processedParams.limit !== undefined) {
      processedParams.limit = Number(processedParams.limit) || 10;
    }
    
    const response = await api.get('/gallery', { 
      params: processedParams,
      paramsSerializer: {
        indexes: null // Ensures arrays are not indexed
      }
    });
    return response.data;
  },
  
  // Get single item
  getById: async (id) => {
    const response = await api.get(`/gallery/${id}`);
    return response.data;
  },
  
  // Get featured items
  getFeatured: async () => {
    const response = await api.get('/gallery/featured');
    return response.data;
  },
  
  // Get by category
  getByCategory: async (category) => {
    const response = await api.get(`/gallery/category/${category}`);
    return response.data;
  },
  
  // Upload image
  upload: async (formData) => {
    const response = await api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // Update item
  update: async (id, data) => {
    const cleanData = {
      ...data,
      tags: Array.isArray(data.tags) ? data.tags : [],
      featured: Boolean(data.featured)
    };
    
    console.log('Sending update data:', cleanData);
    const response = await api.put(`/gallery/${id}`, cleanData);
    return response.data;
  },
  
  // Delete item
  delete: async (id) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
  
  // Toggle featured status
  toggleFeatured: async (id) => {
    const response = await api.put(`/gallery/${id}/featured`);
    return response.data;
  },
  
  // Increment views
  incrementViews: async (id) => {
    const response = await api.put(`/gallery/${id}/views`);
    return response.data;
  },
  
  // Increment downloads
  incrementDownloads: async (id) => {
    const response = await api.put(`/gallery/${id}/downloads`);
    return response.data;
  },
  
  // Get stats
  getStats: async () => {
    const response = await api.get('/gallery/stats');
    return response.data;
  },
  
  // Get category stats
  getCategoryStats: async () => {
    const response = await api.get('/gallery/categories/stats');
    return response.data;
  },
};

// Blog API methods
export const blogApi = {
  // Get all blog posts
  getAll: async (params = {}) => {
    // Convert page and limit to numbers
    const processedParams = { ...params };
    
    if (processedParams.page !== undefined) {
      processedParams.page = Number(processedParams.page) || 1;
    }
    if (processedParams.limit !== undefined) {
      processedParams.limit = Number(processedParams.limit) || 10;
    }
    
    const response = await api.get('/blog', { 
      params: processedParams,
      paramsSerializer: {
        indexes: null
      }
    });
    return response.data;
  },
  
  // Get single post
  getById: async (id) => {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },
  
  // Get blog stats
  getStats: async () => {
    const response = await api.get('/blog/stats');
    return response.data;
  },
  
  // Get category stats
  getCategoryStats: async () => {
    const response = await api.get('/blog/categories/stats');
    return response.data;
  },
  
  // Create blog post
  create: async (data) => {
    // Ensure tags is an array
    const cleanData = {
      ...data,
      tags: Array.isArray(data.tags) ? data.tags : 
            (typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
      isPublished: data.status === 'published'
    };
    
    console.log('Creating blog post:', cleanData);
    const response = await api.post('/blog', cleanData);
    return response.data;
  },
  
  // Update blog post
  update: async (id, data) => {
    // Ensure tags is an array
    const cleanData = {
      ...data,
      tags: Array.isArray(data.tags) ? data.tags : 
            (typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
      isPublished: data.status === 'published'
    };
    
    console.log('Updating blog post:', cleanData);
    const response = await api.put(`/blog/${id}`, cleanData);
    return response.data;
  },
  
  // Delete blog post
  delete: async (id) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },
  
  // Like blog post
  like: async (id) => {
    const response = await api.post(`/blog/${id}/like`);
    return response.data;
  },
  
  // Get comments for post
  getComments: async (postId) => {
    const response = await api.get(`/blog/${postId}/comments`);
    return response.data;
  },
  
  // Create comment
  createComment: async (postId, data) => {
    const response = await api.post(`/blog/${postId}/comments`, data);
    return response.data;
  },
  
  // Like comment
  likeComment: async (commentId) => {
    const response = await api.post(`/blog/comments/${commentId}/like`);
    return response.data;
  },
  
  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/blog/comments/${commentId}`);
    return response.data;
  },
  
  // Upload cover image (if you have this endpoint)
  uploadImage: async (formData) => {
    // Note: You might need to create a separate endpoint for image uploads
    // or handle it differently depending on your backend
    const response = await api.post('/blog/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
};

export default api;