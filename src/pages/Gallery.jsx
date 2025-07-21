import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Spinner from '../components/ui/Spinner';
import { useGallery } from '../store/GalleryContext.jsx';

const Gallery = () => {
  const { galleries } = useGallery();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Flatten all images from all galleries
  const images = galleries.flatMap(gallery =>
    gallery.images.map(url => ({
      url,
      filename: gallery.title,
      galleryTitle: gallery.title
    }))
  );

  if (galleries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No galleries found</h2>
          <p className="mt-2 text-gray-600">Add some galleries in the admin panel to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 mt-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-lg">
              Gallery
            </h1>
            <div className="mx-auto w-24 h-1 bg-white/60 dark:bg-white/30 rounded-full mb-2"></div>
            <p className="text-lg text-white/80 dark:text-white/60 font-medium mb-2">A collection of memories and moments</p>
          </motion.div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 space-y-12">
        {galleries.map((gallery, gIdx) => (
          <div key={gIdx}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-left pl-2">{gallery.title}</h2>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 pb-8">
              {gallery.images.map((url, index) => (
                <motion.div
                  key={url + index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className="mb-4 break-inside-avoid group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-200"
                  onClick={() => { setSelectedImage({ url }); setShowModal(true); }}
                >
                  <img
                    src={url}
                    alt={gallery.title}
                    className="w-full block h-auto object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    style={{ maxHeight: `${200 + (index % 3) * 80}px` }}
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        {galleries.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 max-w-md mx-auto">
              <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No images found</h3>
            </div>
          </div>
        )}
      </div>
      {showModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-transparent rounded-lg max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-40 rounded-full p-2 hover:bg-opacity-70 z-10"
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src={selectedImage.url}
              alt="Full"
              className="max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl border-4 border-white dark:border-gray-700"
              loading="lazy"
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 