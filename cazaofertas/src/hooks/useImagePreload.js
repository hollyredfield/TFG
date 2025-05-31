// hooks/useImagePreload.js
// Hook personalizado para precargar imágenes

import { useState, useEffect } from 'react';
import { preloadImage, preloadImages, preloadProductImages } from '../utils/imagePreloader';
import { categoryFallbackImages } from '../utils/imageHelpers';

/**
 * Hook para precargar imágenes y obtener el estado de carga
 * @param {Array|string} sources - URLs de las imágenes a precargar o un solo URL
 * @param {Object} options - Opciones adicionales
 * @returns {Object} - Estado de carga y utilidades
 */
const useImagePreload = (sources, options = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, setLoaded] = useState([]);
  const [failed, setFailed] = useState([]);
  const [progress, setProgress] = useState(0);
  
  const { 
    onComplete, 
    onError, 
    autoLoad = true, 
    preloadFallbacks = true 
  } = options;
  
  useEffect(() => {
    // No hacer nada si no hay fuentes o autoLoad está desactivado
    if (!sources || (Array.isArray(sources) && sources.length === 0) || !autoLoad) {
      return;
    }
    
    const imagesToLoad = Array.isArray(sources) ? sources : [sources];
    let totalImages = imagesToLoad.length;
    let loadedCount = 0;
    let failedImages = [];
    
    const loadImagesWithProgress = async () => {
      setIsLoading(true);
      
      // Si preloadFallbacks está activado, también precargar imágenes de respaldo de categorías
      if (preloadFallbacks) {
        // Precargar imágenes de fallback en segundo plano (no afecta al progreso)
        preloadImages(Object.values(categoryFallbackImages));
      }
      
      for (const src of imagesToLoad) {
        try {
          const success = await preloadImage(src);
          if (success) {
            loadedCount++;
            setLoaded(prev => [...prev, src]);
          } else {
            failedImages.push(src);
            setFailed(prev => [...prev, src]);
          }
          
          // Actualizar progreso
          const currentProgress = Math.round((loadedCount / totalImages) * 100);
          setProgress(currentProgress);
          
        } catch (error) {
          console.error('[useImagePreload] Error al precargar imagen:', error);
          failedImages.push(src);
          setFailed(prev => [...prev, src]);
        }
      }
      
      setIsLoading(false);
      
      // Llamar a los callbacks
      if (onComplete) {
        onComplete({
          loaded: loadedCount,
          failed: failedImages.length,
          total: totalImages
        });
      }
      
      if (failedImages.length > 0 && onError) {
        onError(failedImages);
      }
    };
    
    loadImagesWithProgress();
    
  }, [sources, autoLoad, onComplete, onError, preloadFallbacks]);
  
  // Función para precargar imágenes manualmente
  const loadImages = async (imageSources = sources) => {
    setIsLoading(true);
    const results = await preloadImages(
      Array.isArray(imageSources) ? imageSources : [imageSources]
    );
    setIsLoading(false);
    return results;
  };
  
  // Función para precargar imágenes de productos
  const loadProductImages = async (products, limit) => {
    setIsLoading(true);
    const results = await preloadProductImages(products, limit);
    setIsLoading(false);
    return results;
  };
  
  return {
    isLoading,
    loaded,
    failed,
    progress,
    loadImages,
    loadProductImages
  };
};

export default useImagePreload;
