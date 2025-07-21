import React, { createContext, useContext, useState, useEffect } from 'react';

const GalleryContext = createContext();

export const useGallery = () => useContext(GalleryContext);

export const GalleryProvider = ({ children }) => {
  const [galleries, setGalleries] = useState(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem('galleries');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('galleries', JSON.stringify(galleries));
  }, [galleries]);

  return (
    <GalleryContext.Provider value={{ galleries, setGalleries }}>
      {children}
    </GalleryContext.Provider>
  );
}; 