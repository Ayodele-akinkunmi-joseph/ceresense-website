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

// Helper function to handle form data
const createFormData = (data, file, fileFieldName = 'image') => {
  const formData = new FormData();
  
  // Add all text fields
  Object.keys(data).forEach(key => {
    if (key !== fileFieldName && data[key] !== undefined && data[key] !== null) {
      if (key === 'tags' && Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  // Add file if exists
  if (file) {
    formData.append(fileFieldName, file);
  }
  
  return formData;
};

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
  // Get all gallery items
  getAll: async (params = {}) => {
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
        indexes: null
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
  
  // Create blog post with image
  create: async (data, imageFile = null) => {
    if (imageFile) {
      // If there's an image, use FormData
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === 'tags' && Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      // Add image file
      formData.append('coverImage', imageFile);
      
      const response = await api.post('/blog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      // No image, send as JSON
      const cleanData = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : 
              (typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      };
      
      const response = await api.post('/blog', cleanData);
      return response.data;
    }
  },
  
  // Update blog post with optional new image
  update: async (id, data, imageFile = null) => {
    if (imageFile) {
      // If there's a new image, use FormData
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === 'tags' && Array.isArray(data[key])) {
            formData.append(key, JSON.stringify(data[key]));
          } else {
            formData.append(key, data[key]);
          }
        }
      });
      
      // Add image file
      formData.append('coverImage', imageFile);
      
      const response = await api.put(`/blog/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } else {
      // No new image, send as JSON
      const cleanData = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : 
              (typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []),
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      };
      
      const response = await api.put(`/blog/${id}`, cleanData);
      return response.data;
    }
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
  
  // Get comments for post (if you still need them)
  getComments: async (postId) => {
    const response = await api.get(`/blog/${postId}/comments`);
    return response.data;
  },
  
  // Create comment (if you still need them)
  createComment: async (postId, data) => {
    const response = await api.post(`/blog/${postId}/comments`, data);
    return response.data;
  },
  
  // Like comment (if you still need them)
  likeComment: async (commentId) => {
    const response = await api.post(`/blog/comments/${commentId}/like`);
    return response.data;
  },
  
  // Delete comment (if you still need them)
  deleteComment: async (commentId) => {
    const response = await api.delete(`/blog/comments/${commentId}`);
    return response.data;
  },
};

export default api;