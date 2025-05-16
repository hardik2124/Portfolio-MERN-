import axios from 'axios';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.render.com/deploy/srv-d0jglkumcj7s738088ug?key=3fYmRx2lNTw',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    // Try multiple sources for the token with better error handling
    let token;
    try {
      // First try localStorage
      token = localStorage.getItem('token');
      
      // If that fails, try environment variable
      if (!token) {
        token = import.meta.env.VITE_AUTH_TOKEN;
      }
      
      // Debug token access
      console.log(`🔍 Token source check - localStorage: ${!!localStorage.getItem('token')}, ENV: ${!!import.meta.env.VITE_AUTH_TOKEN}`);
    } catch (e) {
      console.error('Error accessing token sources:', e);
      token = null;
    }
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(`🔑 Adding auth token to request: ${config.url} (Token: ${token.substring(0, 10)}...)`);
    } else {
      console.log(`⚠️ No auth token found for request: ${config.url}`);
      
      // Check if this is a protected route that requires authentication
      const protectedRoutes = ['/auth/me', '/auth/updateprofile', '/auth/avatar', '/auth/change-password'];
      const adminRoutes = ['/projects', '/skills', '/contact'].filter(route => 
        // These are admin routes only if they're not GET requests
        !(config.method === 'get' && config.url.includes(route))
      );
      
      const isProtectedRoute = [
        ...protectedRoutes, 
        ...adminRoutes
      ].some(route => config.url.includes(route));
      
      if (isProtectedRoute && !config.url.includes('/auth/login') && !config.url.includes('/auth/register') && !config.url.includes('/auth/profile/public')) {
        console.warn(`⛔ Attempting to access protected route without authentication token: ${config.url}`);
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to normalize data from server
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from: ${response.config.url}`, response.data);
    
    // Special handling for login endpoint to preserve token
    if (response.config.url.includes('/auth/login')) {
      return response;
    }
    
    // If the response has data property and success flag
    if (response.data && response.data.success !== undefined) {
      // These are the common property names where data might be stored
      const dataProperties = ['projects', 'skills', 'project', 'skill', 'contacts', 'contact', 'data', 'user'];
      
      // Try to find the data in one of these properties
      for (const prop of dataProperties) {
        if (response.data[prop] !== undefined) {
          console.log(`🔄 Found data in response.data.${prop}`);
          return { ...response, data: response.data[prop] };
        }
      }
      
      // If we have a token, make sure to preserve it
      if (response.data.token) {
        console.log('🔑 Token found in response');
        return response;
      }
    }
    
    // For all other cases, just return the original response
    return response;
  },
  (error) => {
    console.error('❌ API Response error:', error);
    
    // Create a standardized error object
    const errorResponse = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      originalError: error
    };
    
    // Add specific error messages for common error cases
    if (error.code === 'ECONNABORTED') {
      errorResponse.message = 'Request timed out. Please check your internet connection and try again.';
    } else if (!error.response) {
      errorResponse.message = 'Network error. Please check your internet connection and ensure the server is running.';
    }
    
    console.error('❌ Normalized error:', errorResponse);
    return Promise.reject(errorResponse);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.patch('/auth/updateprofile', profileData),
  uploadAvatar: (formData) => {
    return api.post('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  getPublicProfile: () => api.get('/auth/profile/public'),
};

// Project services
export const projectService = {
  getAllProjects: (params) => api.get('/projects', { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.patch(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  uploadProjectImage: (formData) => {
    return api.post('/projects/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Skill services
export const skillService = {
  getAllSkills: async (params) => {
    try {
      const response = await api.get('/skills', { params });
      return response;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },
  getSkillsByCategory: (category) => api.get(`/skills/category/${category}`),
  getSkill: (id) => api.get(`/skills/${id}`),
  createSkill: async (skillData) => {
    try {
      // Validate required fields
      if (!skillData.name || !skillData.category) {
        throw new Error('Skill name and category are required');
      }
      
      // Ensure level is a number between 10-100
      const level = parseInt(skillData.level, 10);
      if (isNaN(level) || level < 10 || level > 100) {
        skillData.level = 80; // Default to 80% if invalid
      }
      
      const response = await api.post('/skills', skillData);
      return response;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },
  updateSkill: async (id, skillData) => {
    try {
      if (!id) {
        throw new Error('Skill ID is required for updates');
      }
      
      // Validate required fields
      if (!skillData.name || !skillData.category) {
        throw new Error('Skill name and category are required');
      }
      
      const response = await api.patch(`/skills/${id}`, skillData);
      return response;
    } catch (error) {
      console.error(`Error updating skill ${id}:`, error);
      throw error;
    }
  },
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

// Contact services
export const contactService = {
  submitContact: (contactData) => api.post('/contact', contactData),
  getAllContacts: () => api.get('/contact'),
  getContact: (id) => api.get(`/contact/${id}`),
  updateContactStatus: (id, statusData) => api.patch(`/contact/${id}`, statusData),
  deleteContact: (id) => api.delete(`/contact/${id}`),
};

export default api; 