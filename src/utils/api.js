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
    
    // Don't attempt refresh for certain endpoints
    const noRefreshEndpoints = ['/auth/refresh', '/auth/server-time', '/auth/register', '/auth/login'];
    const isNoRefreshEndpoint = noRefreshEndpoints.some(endpoint => 
      originalRequest.url?.includes(endpoint)
    );
    
    // If error is 401 and we haven't already tried to refresh and it's not a no-refresh endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isNoRefreshEndpoint) {
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
