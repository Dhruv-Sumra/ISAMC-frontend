import React, { useState } from 'react';
import Spinner from '../ui/Spinner';
import { useGallery } from '../../store/GalleryContext.jsx';

const GalleryManager = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrls, setImageUrls] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80');
  const { galleries, setGalleries } = useGallery();

  const handleAddGallery = (e) => {
    e.preventDefault();
    if (!title.trim() || !imageUrls.trim()) return;
    const urls = imageUrls.split('\n').map(url => url.trim()).filter(Boolean);
    setGalleries(prev => [...prev, { title, images: urls }]);
    setTitle('');
    setImageUrls('');
  };

  const handleDeleteGallery = (idx) => {
    setGalleries(prev => prev.filter((_, i) => i !== idx));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add Gallery Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Gallery</h2>
        <form onSubmit={handleAddGallery} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter gallery title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (one per line)</label>
            <textarea
              value={imageUrls}
              onChange={e => setImageUrls(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={5}
              placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use direct, public image URLs (ending in .jpg, .png, etc.). Images must be accessible from your browser.
            </p>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Gallery
          </button>
        </form>
      </div>

      {/* Gallery List */}
      <div className="space-y-8">
        {galleries.length === 0 ? (
          <div className="text-center text-gray-500">No galleries added yet.</div>
        ) : (
          galleries.map((gallery, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{gallery.title}</h3>
                <button
                  onClick={() => handleDeleteGallery(idx)}
                  className="text-red-500 hover:text-red-700 text-sm border border-red-200 rounded px-2 py-1 ml-2"
                >
                  Delete
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gallery.images.map((url, i) => (
                  <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={url}
                      alt={`Gallery ${gallery.title} Image ${i+1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryManager; 