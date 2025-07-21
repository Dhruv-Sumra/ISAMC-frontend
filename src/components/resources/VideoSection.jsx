import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Eye, Tag, Search, Filter, Grid, List } from 'lucide-react';
import Spinner from '../ui/Spinner';
import { useCachedApi } from '../../services/cachedApiService';

const VideoSection = () => {
  const { cachedGet } = useCachedApi();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'grid', 'list', 'embedded', or 'preview'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [showLivePreviews, setShowLivePreviews] = useState(true); // Always show live previews

  // Fetch videos
  useEffect(() => {
    fetchVideos();
  }, []);

  // Fetch videos when filters change
  useEffect(() => {
    fetchVideos();
  }, [searchQuery, currentPage]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await cachedGet('/videos', params, 15); // Cache for 15 minutes
      console.log('Fetched videos:', response.data);
      
      // Debug: Log each video's URL and extracted ID
      const videosWithDebug = response.data || [];
      videosWithDebug.forEach((video, index) => {
        console.log(`Video ${index + 1}:`, {
          title: video.title,
          youtubeUrl: video.youtubeUrl,
          extractedId: extractYouTubeId(video.youtubeUrl),
          thumbnailUrl: getPreviewUrl(video)
        });
      });
      
      setVideos(videosWithDebug);
      setHasNextPage(response.pagination?.hasNext || false);
      setHasPrevPage(response.pagination?.hasPrev || false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') {
      console.warn('Invalid YouTube URL:', url);
      return null;
    }
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]{11})/,
      /youtube\.com\/v\/([^&\n?#]{11})/,
      /youtube\.com\/watch\?.*v=([^&\n?#]{11})/,
      /youtu\.be\/([^&\n?#]{11})/,
      /youtube\.com\/embed\/([^&\n?#]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log('Extracted YouTube ID:', match[1], 'from URL:', url);
        return match[1];
      }
    }
    
    console.warn('Could not extract YouTube ID from URL:', url);
    return null;
  };

  // Returns the animated preview URL (webp) if available
  const getAnimatedPreviewUrl = (video) => {
    const videoId = extractYouTubeId(video.youtubeUrl);
    if (videoId) {
      return `https://i.ytimg.com/an_webp/${videoId}/mqdefault_6s.webp`;
    }
    return null;
  };

  // Returns the static thumbnail URL
  const getStaticThumbnailUrl = (video) => {
    const videoId = extractYouTubeId(video.youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return video.thumbnailUrl || '/default-video-thumbnail.jpg';
  };

  const getPreviewUrl = (video) => {
    const videoId = extractYouTubeId(video.youtubeUrl);
    if (videoId) {
      // Use a lower quality thumbnail for faster loading
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return video.thumbnailUrl || '/default-video-thumbnail.jpg';
  };

  const handleThumbnailError = (e, video) => {
    console.warn('Thumbnail failed to load:', e.target.src, 'for video:', video.title);
    
    const videoId = extractYouTubeId(video.youtubeUrl);
    if (videoId) {
      // Try different thumbnail qualities as fallbacks
      const fallbacks = [
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/default.jpg`
      ];
      
      const currentSrc = e.target.src;
      const currentIndex = fallbacks.findIndex(url => url === currentSrc);
      
      if (currentIndex < fallbacks.length - 1) {
        // Try next fallback
        console.log('Trying fallback thumbnail:', fallbacks[currentIndex + 1]);
        e.target.src = fallbacks[currentIndex + 1];
      } else {
        // Use default thumbnail
        console.log('Using default thumbnail for video:', video.title);
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBaIiBmaWxsPSIjOUI5QkEwIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDhCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIFZpZGVvIFByZXZpZXc8L3RleHQ+Cjwvc3ZnPgo=';
      }
    } else {
      console.log('No YouTube ID found, using default thumbnail for video:', video.title);
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBaIiBmaWxsPSIjOUI5QkEwIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDhCIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIFZpZGVvIFByZXZpZXc8L3RleHQ+Cjwvc3ZnPgo=';
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    return duration;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  if (loading && videos.length === 0) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="w-full h-auto mt-10 py-10 flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto mt-20 py-5">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          Video Resources
        </h2>
        <div className="border-2 border-blue-500 w-20 m-auto mb-4"></div>
        <p className="px-5 md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore our curated collection of educational videos on additive manufacturing, 3D printing, and related technologies.
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="px-5 md:px-10 mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'preview'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
              title="Preview Mode"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('embedded')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'embedded'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}
              title="Embedded Videos"
            >
              <Play className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Videos Grid/List */}
      <div className="px-5 md:px-10">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : videos.length === 0 ? (
          <motion.div
            className="text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No videos found. Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : viewMode === 'embedded'
                ? 'grid-cols-1 lg:grid-cols-2'
                : viewMode === 'preview'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {videos.map((video, index) => (
                <motion.div
                  key={video._id || video.id || `video-${index}-${video.title?.replace(/\s+/g, '-').toLowerCase()}`}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  } ${viewMode === 'embedded' ? '' : 'cursor-pointer'}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                  onClick={viewMode === 'embedded' ? undefined : () => handleVideoClick(video)}
                >
                  {/* Thumbnail or Embedded Video */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    {viewMode === 'embedded' ? (
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(video.youtubeUrl)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${extractYouTubeId(video.youtubeUrl)}`}
                          title={video.title}
                          className="w-full h-full rounded-t-xl"
                          frameBorder="0"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : viewMode === 'preview' ? (
                      <>
                        {extractYouTubeId(video.youtubeUrl) ? (
                          <div className="aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${extractYouTubeId(video.youtubeUrl)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${extractYouTubeId(video.youtubeUrl)}&start=600`}
                              title={video.title}
                              className="w-full h-full rounded-t-xl"
                              frameBorder="0"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <div className={`w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${
                            viewMode === 'list' ? 'h-32' : 'h-48'
                          }`}>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                              <Play className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">No Video Preview</p>
                              <p className="text-xs">Invalid YouTube URL</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Loading skeleton */}
                        {imageLoading[video._id || video.id || index] !== false && (
                          <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${
                            viewMode === 'list' ? 'h-32' : 'h-48'
                          }`}></div>
                        )}
                        <img
                          src={getPreviewUrl(video)}
                          alt={video.title}
                          className={`w-full object-cover transition-all duration-300 hover:scale-105 ${
                            viewMode === 'list' ? 'h-32' : 'h-48'
                          } ${imageLoading[video._id || video.id || index] === false ? 'opacity-100' : 'opacity-0'}`}
                          onLoad={() => setImageLoading(prev => ({ ...prev, [video._id || video.id || index]: false }))}
                          onError={(e) => handleThumbnailError(e, video)}
                        />
                        {/* Hover overlay with play button */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center group">
                          <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-90 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <Play className="w-6 h-6 text-blue-600 ml-1" />
                          </div>
                        </div>
                        {/* Video duration badge */}
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                            {formatDuration(video.duration)}
                          </div>
                        )}

                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-center' : ''}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    {viewMode !== 'embedded' && (
                      <>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {video.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                            {video.author && (
                              <span className="flex items-center gap-1">
                                <span>{video.author}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {video.viewCount || 0}
                          </div>
                        </div>

                        {/* Tags */}
                        {video.tags && Array.isArray(video.tags) && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {video.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                            {video.tags.length > 3 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{video.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}


                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {(hasNextPage || hasPrevPage) && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!hasPrevPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  Previous
                </button>
                <span className="text-gray-600 dark:text-gray-300">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!hasNextPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Modal */}
      {showModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedVideo.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="aspect-video mb-4">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(selectedVideo.youtubeUrl)}?start=600`}
                  title={selectedVideo.title}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedVideo.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags && Array.isArray(selectedVideo.tags) && selectedVideo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Published: {formatDate(selectedVideo.publishDate)}</span>
                  <span>{selectedVideo.viewCount || 0} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSection; 