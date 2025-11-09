import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
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

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getMe: () => api.get('/auth/me'),
};

// Posts API
export const postsAPI = {
  getPosts: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/posts', { params }),
  
  getPost: (id: string) => api.get(`/posts/${id}`),
  
  getMyPosts: () => api.get('/posts/my-posts'),
  createPost: (data: {
    title: string;
    content: string;
    summary?: string;
    tags?: string;
    published?: boolean;
  }) => api.post('/posts', data),
  
  updatePost: (id: string, data: {
    title?: string;
    content?: string;
    summary?: string;
    tags?: string;
    published?: boolean;
  }) => api.put(`/posts/${id}`, data),
  
  deletePost: (id: string) => api.delete(`/posts/${id}`),
};

export default api;