// utils/imagePreloader.js
// Utilidad para precargar imágenes y mejorar la experiencia del usuario
// ADAPTADO AL SISTEMA BRUTAL DE IMÁGENES

import { getImagenBruta } from './imageHelpers';

/**
 * Lista de imágenes precargadas para cache
 */
const preloadedImages = new Set();

/**
 * PRECARGA BRUTAL: Garantiza que siempre haya imagen
 * @param {string} src - URL de la imagen a precargar
 * @param {string} alt - Texto alternativo
 * @param {number} categoryId - ID de categoría
 * @param {string} storeName - Nombre de la tienda
 * @returns {Promise<string>} - Promise que resuelve a la URL final (siempre válida)
 */
export const preloadImage = (src, alt = '', categoryId = null, storeName = '') => {
  // Con el sistema brutal, siempre obtenemos una imagen válida
  const imagenFinal = getImagenBruta(src, alt, categoryId, storeName);
  
  if (preloadedImages.has(imagenFinal)) {
    return Promise.resolve(imagenFinal);
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      preloadedImages.add(imagenFinal);
      console.log(`[ImagePreloader] ✅ Imagen precargada: ${imagenFinal.substring(0, 50)}...`);
      resolve(imagenFinal);
    };
    
    img.onerror = () => {
      console.warn(`[ImagePreloader] ⚠️ Error con imagen, pero tenemos fallback: ${imagenFinal.substring(0, 50)}...`);
      // Incluso si hay error, devolvemos la imagen porque es base64 y siempre funciona
      resolve(imagenFinal);
    };
    
    img.src = imagenFinal;
  });
};

/**
 * Precarga múltiples imágenes en paralelo con el sistema brutal
 * @param {Array<Object>} imageData - Lista de objetos con {src, alt, categoryId, storeName}
 * @returns {Promise<Array>} - Promise que resuelve a un array de URLs finales
 */
export const preloadImages = async (imageData) => {
  if (!Array.isArray(imageData) || imageData.length === 0) {
    return [];
  }
  
  console.log(`[ImagePreloader] 🔄 Precargando ${imageData.length} imágenes brutales...`);
  const results = await Promise.all(
    imageData.map(data => preloadImage(data.src, data.alt, data.categoryId, data.storeName))
  );
  
  console.log(`[ImagePreloader] ✅ ${results.length} imágenes brutales precargadas exitosamente`);
  return results;
};

/**
 * Precarga las imágenes de un conjunto de productos con sistema brutal
 * @param {Array<Object>} products - Lista de productos
 * @param {number} limit - Límite de imágenes a precargar (opcional)
 */
export const preloadProductImages = async (products, limit = 10) => {
  if (!products || !Array.isArray(products)) {
    return;
  }
  
  const limitedProducts = products.slice(0, limit);
  const imageData = limitedProducts.map(product => ({
    src: product.url_imagen || product.imagen_url,
    alt: product.titulo || product.nombre,
    categoryId: product.categoria_id || (product.categoria && product.categoria.id),
    storeName: product.tienda || product.store_name || ''
  }));
  
  return preloadImages(imageData);
};

/**
 * Precarga las imágenes de las categorías principales
 * @param {Object} categoryImageMap - Objeto con mapeo de categoría->imagen
 */
export const preloadCategoryImages = async (categoryImageMap) => {
  if (!categoryImageMap || typeof categoryImageMap !== 'object') {
    return;
  }
  
  const imageSources = Object.values(categoryImageMap).filter(Boolean);
  return preloadImages(imageSources);
};

/**
 * Comprueba el estado de una imagen previamente cargada
 * @param {string} src - URL de la imagen a comprobar
 * @returns {boolean} - true si la imagen está precargada
 */
export const isImagePreloaded = (src) => {
  return preloadedImages.has(src);
};

/**
 * Obtiene estadísticas de las imágenes precargadas
 * @returns {Object} - Estadísticas de precarga
 */
export const getPreloadStats = () => {
  return {
    total: preloadedImages.size,
    urls: Array.from(preloadedImages)
  };
};
