import axios from 'axios';

const BASE_URL = 'http://localhost:3001';
const SUBJECT_URL = `${BASE_URL}/subjects`;
const AUTH_URL = `${BASE_URL}/auth`;

// Create an Axios instance for subjects API
const api = axios.create({
  baseURL: SUBJECT_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create an Axios instance for auth API
const authApi = axios.create({
  baseURL: AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add JWT token to request headers if available
 * This interceptor automatically includes the token in all API requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add the same interceptor to authApi for authenticated auth endpoints
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDataForCards = async ( params = {}) => {
  try {
    const response = await api.get('/getDataForCards', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error.response?.data || error.message;
  }
};

export const getSubjectById = async (id, fields = []) => {
  try {
    const params = fields.length > 0 ? { fields: fields.join(',') } : {};
    const response = await api.get(`/${id}`, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching subject with id ${id}:`, error);
    throw error.response?.data || error.message;
  }
};

export const addSubject = async (data) => {
  try {
    const response = await api.post('/', data);
    return response.data;
  } catch (error) {
    console.error('Error adding subject:', error);
    throw error.response?.data || error.message;
  }
};

export const updateSubject = async (id, data) => {
  try {
    const response = await api.put(`/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating subject with id ${id}:`, error);
    throw error.response?.data || error.message;
  }
};






// ==================== Authentication API ====================

/**
 * Register a new user
 * @param {string} name - Username
 * @param {string} password - User password
 * @param {string} role - User role (optional, default: "student")
 * @returns {Promise<Object>} - Response with token and user data
 */
export const register = async (name, password, role = 'student') => {
  try {
    const response = await authApi.post('/register', { name, password, role });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Login user
 * @param {string} name - Username
 * @param {string} password - User password
 * @returns {Promise<Object>} - Response with token and user data
 */
export const login = async (name, password) => {
  try {
    const response = await authApi.post('/login', { name, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get current authenticated user information
 * Requires valid JWT token
 * @returns {Promise<Object>} - Response with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await authApi.get('/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Mark a subject as done by adding it to user's learnedSubjects array
 * Requires valid JWT token
 * @param {string} subjectId - Subject ID to mark as done
 * @returns {Promise<Object>} - Response with updated user data
 */
export const markSubjectDone = async (subjectId) => {
  try {
    const response = await authApi.post('/mark-subject-done', { subjectId });
    return response.data;
  } catch (error) {
    console.error('Mark subject done error:', error);
    throw error.response?.data || error.message;
  }
};

/**
 * Unmark a subject as done by removing it from user's learnedSubjects array
 * Requires valid JWT token
 * @param {string} subjectId - Subject ID to unmark as done
 * @returns {Promise<Object>} - Response with updated user data
 */
export const unmarkSubjectDone = async (subjectId) => {
  try {
    const response = await authApi.post('/unmark-subject-done', { subjectId });
    return response.data;
  } catch (error) {
    console.error('Unmark subject done error:', error);
    throw error.response?.data || error.message;
  }
};

export default api;
