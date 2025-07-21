import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw, Database, Clock, HardDrive } from 'lucide-react';
import { useCache } from '../../hooks/useCache';

const CacheManager = () => {
  const { getCacheStats, clearCache, removeCacheItem } = useCache();
  const [cacheStats, setCacheStats] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    updateCacheStats();
  }, []);

  const updateCacheStats = () => {
    const stats = getCacheStats();
    setCacheStats(stats);
  };

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      clearCache();
      updateCacheStats();
      // Show success message
      alert('Cache cleared successfully!');
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Failed to clear cache');
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveItem = (key) => {
    try {
      removeCacheItem(key);
      updateCacheStats();
      alert(`Cache item "${key}" removed successfully!`);
    } catch (error) {
      console.error('Error removing cache item:', error);
      alert('Failed to remove cache item');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const estimateCacheSize = () => {
    if (!cacheStats) return 0;
    
    let totalSize = 0;
    cacheStats.keys.forEach(key => {
      try {
        const cachedData = localStorage.getItem(`isamc_cache_${key}`);
        if (cachedData) {
          totalSize += new Blob([cachedData]).size;
        }
      } catch (error) {
        console.warn('Error calculating size for key:', key);
      }
    });
    
    return totalSize;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="w-6 h-6" />
          Cache Management
        </h2>
        <button
          onClick={updateCacheStats}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Stats
        </button>
      </div>

      {cacheStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Cache Entries</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {cacheStats.size}
            </p>
          </motion.div>

          <motion.div
            className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Estimated Size</span>
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
              {formatBytes(estimateCacheSize())}
            </p>
          </motion.div>

          <motion.div
            className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Local Storage</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {cacheStats.localStorageSize}
            </p>
          </motion.div>

          <motion.div
            className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Last Updated</span>
            </div>
            <p className="text-sm font-bold text-orange-900 dark:text-orange-100">
              {new Date().toLocaleTimeString()}
            </p>
          </motion.div>
        </div>
      )}

      {/* Cache Entries List */}
      {cacheStats && cacheStats.keys.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cached Entries
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
            {cacheStats.keys.map((key, index) => (
              <motion.div
                key={key}
                className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {key}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cached entry
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(key)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Remove this cache entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleClearCache}
          disabled={isClearing || !cacheStats?.size}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isClearing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          {isClearing ? 'Clearing...' : 'Clear All Cache'}
        </button>

        <button
          onClick={updateCacheStats}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Statistics
        </button>
      </div>

      {/* Cache Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Cache Information
        </h4>
        <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Cache entries expire after 30 minutes by default</li>
          <li>• Video data is cached for 15 minutes</li>
          <li>• Cache is stored in browser's localStorage</li>
          <li>• Clearing cache will force fresh data on next request</li>
        </ul>
      </div>
    </div>
  );
};

export default CacheManager; 