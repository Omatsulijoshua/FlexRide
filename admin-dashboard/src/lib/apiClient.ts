import axios from 'axios';

// API Gateway Port for the backend
const BASE_URL = 'https://flexride-api.onrender.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to auto-inject the JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Only attempt to access localStorage if we are in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., clear token and redirect to login)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_jwt_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
