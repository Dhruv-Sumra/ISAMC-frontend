import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

const YouTubePlayer = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const id = extractYouTubeId(videoUrl);
    if (id) {
      setVideoId(id);
      setIsPlaying(true);
    } else {
      alert('Please enter a valid YouTube URL');
    }
  };

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value);
    // Auto-extract ID if it's a valid YouTube URL
    const id = extractYouTubeId(e.target.value);
    if (id) {
      setVideoId(id);
    }
  };

  const getEmbedUrl = (id) => {
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  };

  const getThumbnailUrl = (id) => {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          YouTube Video Player
        </h2>
        <div className="border-2 border-blue-500 w-20 m-auto mb-4"></div>
        <p className="px-5 md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Paste any YouTube URL to watch videos directly on this page.
        </p>
      </motion.div>

      {/* URL Input */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <form onSubmit={handleUrlSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="url"
              value={videoUrl}
              onChange={handleUrlChange}
              placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Watch Video
          </button>
        </form>
        
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>Supported formats:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
            <li>https://youtu.be/VIDEO_ID</li>
            <li>https://www.youtube.com/embed/VIDEO_ID</li>
          </ul>
        </div>
      </motion.div>

      {/* Video Player */}
      {videoId && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(videoId)}
                title="YouTube Video Player"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  YouTube Video
                </h3>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open on YouTube
                </a>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  Video ID: {videoId}
                </span>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                  Direct Play
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Examples */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Quick Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Sample Video 1",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              description: "Test video for demonstration"
            },
            {
              title: "Sample Video 2", 
              url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
              description: "Another test video"
            },
            {
              title: "Sample Video 3",
              url: "https://www.youtube.com/watch?v=9bZkp7q19f0", 
              description: "Third test video"
            }
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setVideoUrl(example.url);
                setVideoId(extractYouTubeId(example.url));
                setIsPlaying(true);
              }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-left border border-gray-200 dark:border-gray-600"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {example.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {example.description}
              </p>
              <span className="text-xs text-blue-500">Click to load</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default YouTubePlayer; 