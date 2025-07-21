import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const GalleryContext = createContext();

export const useGallery = () => useContext(GalleryContext);

export const GalleryProvider = ({ children }) => {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await api.get('/gallery');
        if (response.data.success) {
          setGalleries(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch galleries:', error);
      }
    };
    fetchGalleries();
  }, []);

  return (
    <GalleryContext.Provider value={{ galleries, setGalleries }}>
      {children}
    </GalleryContext.Provider>
  );
}; 