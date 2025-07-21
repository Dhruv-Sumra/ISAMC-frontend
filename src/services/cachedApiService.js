import api from '../utils/api';
import { useCache } from '../hooks/useCache';

export const useCachedApi = () => {
  const { setCacheItem, getCacheItem, hasCacheItem, removeCacheItem } = useCache();

  // Generate cache key based on endpoint and parameters
  const generateCacheKey = (endpoint, params = {}) => {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${endpoint}${paramString ? `?${paramString}` : ''}`;
  };

  // Cached GET request
  const cachedGet = async (endpoint, params = {}, cacheExpiry = 30) => {
    const cacheKey = generateCacheKey(endpoint, params);
    
    // Check if we have cached data
    if (hasCacheItem(cacheKey)) {
      console.log('Using cached data for:', cacheKey);
      return getCacheItem(cacheKey);
    }

    try {
      // Make API request
      const response = await api.get(endpoint, { params });
      
      // Cache the response
      setCacheItem(cacheKey, response.data, cacheExpiry);
      console.log('Cached new data for:', cacheKey);
      
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  // Cached POST request (with cache invalidation)
  const cachedPost = async (endpoint, data, invalidateCache = []) => {
    try {
      const response = await api.post(endpoint, data);
      
      // Invalidate related cache entries
      invalidateCache.forEach(cacheKey => {
        removeCacheItem(cacheKey);
        console.log('Invalidated cache for:', cacheKey);
      });
      
      return response.data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  };

  // Cached PUT request (with cache invalidation)
  const cachedPut = async (endpoint, data, invalidateCache = []) => {
    try {
      const response = await api.put(endpoint, data);
      
      // Invalidate related cache entries
      invalidateCache.forEach(cacheKey => {
        removeCacheItem(cacheKey);
        console.log('Invalidated cache for:', cacheKey);
      });
      
      return response.data;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  };

  // Cached DELETE request (with cache invalidation)
  const cachedDelete = async (endpoint, invalidateCache = []) => {
    try {
      const response = await api.delete(endpoint);
      
      // Invalidate related cache entries
      invalidateCache.forEach(cacheKey => {
        removeCacheItem(cacheKey);
        console.log('Invalidated cache for:', cacheKey);
      });
      
      return response.data;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  };

  // Preload cache for specific endpoints
  const preloadCache = async (endpoints) => {
    const promises = endpoints.map(async ({ endpoint, params, cacheExpiry }) => {
      try {
        await cachedGet(endpoint, params, cacheExpiry);
      } catch (error) {
        console.warn('Failed to preload cache for:', endpoint, error);
      }
    });
    
    await Promise.allSettled(promises);
    console.log('Cache preloading completed');
  };

  return {
    cachedGet,
    cachedPost,
    cachedPut,
    cachedDelete,
    preloadCache,
    generateCacheKey,
    removeCacheItem
  };
}; 