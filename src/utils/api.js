import axios from 'axios';
import { useAuthStore } from "../store/useAuthStore";

// Use Vite env variable, fallback to localhost for dev
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const refreshResult = await useAuthStore.getState().refreshAccessToken();
        
        if (refreshResult.success) {
          // Retry the original request with the new token
          const { accessToken } = useAuthStore.getState();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          // Refresh failed, logout the user
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh failed, logout the user
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
