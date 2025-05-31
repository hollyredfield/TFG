// components/ImagePreloader.jsx
// Componente para precargar imágenes de forma automática

import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import mockData from '../data/mockData';
import useImagePreload from '../hooks/useImagePreload';
import { categoryFallbackImages } from '../utils/imageHelpers';
import { preloadProductImages, preloadCategoryImages } from '../utils/imagePreloader';

/**
 * Componente que precarga imágenes para mejorar la experiencia del usuario
 * Este componente no renderiza nada visible en la UI
 */
const ImagePreloader = ({ priorityProducts = [], limit = 10 }) => {
  // Precargar imágenes de fallback automáticamente al montar el componente
  useEffect(() => {
    const preloadImportantImages = async () => {
      console.log('[ImagePreloader] Iniciando precarga de imágenes importantes...');
      
      // 1. Precargar imágenes de categorías (son pocas y muy importantes)
      await preloadCategoryImages(categoryFallbackImages);
      
      // 2. Precargar productos prioritarios si se especifican
      if (priorityProducts.length > 0) {
        await preloadProductImages(priorityProducts);
      } else {
        // 3. O precargar las primeras N ofertas
        const featuredOffers = mockData.ofertas
          .sort((a, b) => b.likes - a.likes)
          .slice(0, limit);
          
        await preloadProductImages(featuredOffers, limit);
      }
      
      console.log('[ImagePreloader] Precarga inicial completada');
    };
    
    preloadImportantImages();
  }, [priorityProducts, limit]);

  // Este componente no renderiza nada visible
  return null;
};

/**
 * Componente con UI para precargar imágenes con control de progreso
 */
export const VisibleImagePreloader = ({ sources, onComplete }) => {
  const { isLoading, progress, loaded, failed } = useImagePreload(sources, { 
    onComplete, 
    autoLoad: true
  });

  if (!isLoading && progress === 100) {
    return null;
  }

  return (
    <div className="image-preloader">
      <div className="preloader-bar">
        <div 
          className="preloader-progress" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="preloader-stats">
        Cargando imágenes: {progress}% ({loaded.length}/{sources.length})
      </div>
    </div>
  );
};

ImagePreloader.propTypes = {
  priorityProducts: PropTypes.array,
  limit: PropTypes.number,
};

export default ImagePreloader;
