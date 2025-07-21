import { useState, useEffect, useCallback } from 'react';

const CACHE_PREFIX = 'isamc_cache_';
const CACHE_EXPIRY_PREFIX = 'isamc_expiry_';

export const useCache = () => {
  const [cache, setCache] = useState(new Map());

  // Initialize cache from localStorage on mount
  useEffect(() => {
    const initializeCache = () => {
      const newCache = new Map();
      
      // Load cached data from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_PREFIX)) {
          const cacheKey = key.replace(CACHE_PREFIX, '');
          const expiryKey = CACHE_EXPIRY_PREFIX + cacheKey;
          const expiry = localStorage.getItem(expiryKey);
          
          if (expiry && Date.now() < parseInt(expiry)) {
            try {
              const data = JSON.parse(localStorage.getItem(key));
              newCache.set(cacheKey, data);
            } catch (error) {
              console.warn('Failed to parse cached data for key:', cacheKey);
              localStorage.removeItem(key);
              localStorage.removeItem(expiryKey);
            }
          } else {
            // Remove expired cache
            localStorage.removeItem(key);
            localStorage.removeItem(expiryKey);
          }
        }
      }
      
      setCache(newCache);
    };

    initializeCache();
  }, []);

  // Set cache with expiry
  const setCacheItem = useCallback((key, data, expiryMinutes = 30) => {
    const cacheKey = CACHE_PREFIX + key;
    const expiryKey = CACHE_EXPIRY_PREFIX + key;
    const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(expiryKey, expiryTime.toString());
      
      setCache(prev => new Map(prev.set(key, data)));
      return true;
    } catch (error) {
      console.error('Failed to set cache item:', error);
      return false;
    }
  }, []);

  // Get cache item
  const getCacheItem = useCallback((key) => {
    return cache.get(key);
  }, [cache]);

  // Check if cache item exists and is valid
  const hasCacheItem = useCallback((key) => {
    return cache.has(key);
  }, [cache]);

  // Remove cache item
  const removeCacheItem = useCallback((key) => {
    const cacheKey = CACHE_PREFIX + key;
    const expiryKey = CACHE_EXPIRY_PREFIX + key;
    
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(expiryKey);
    
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  // Clear all cache
  const clearCache = useCallback(() => {
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(CACHE_PREFIX) || key.startsWith(CACHE_EXPIRY_PREFIX))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    setCache(new Map());
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
      localStorageSize: Object.keys(localStorage).filter(key => 
        key.startsWith(CACHE_PREFIX)
      ).length
    };
  }, [cache]);

  return {
    setCacheItem,
    getCacheItem,
    hasCacheItem,
    removeCacheItem,
    clearCache,
    getCacheStats
  };
}; 