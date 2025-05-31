// imageValidator.js
// Utilidad para verificar que todas las imágenes de productos sean válidas

/**
 * Valida una URL de imagen comprobando que sea accesible
 * @param {string} url - URL de la imagen a validar
 * @returns {Promise<boolean>} - Promesa que resuelve a true si la imagen es válida
 */
export const validateImageUrl = (url) => {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') {
      console.error(`[ImageValidator] 🔴 URL inválida: ${url}`);
      resolve(false);
      return;
    }
    
    // Crear una imagen temporal para probar la carga
    const img = new Image();
    
    // Establecer un timeout para evitar esperas excesivas
    const timeout = setTimeout(() => {
      console.error(`[ImageValidator] 🔴 Timeout en imagen: ${url}`);
      resolve(false);
    }, 5000);
    
    img.onload = () => {
      clearTimeout(timeout);
      console.log(`[ImageValidator] 🟢 Imagen cargada correctamente: ${url}`);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.error(`[ImageValidator] 🔴 Error al cargar la imagen: ${url}`);
      resolve(false);
    };
    
    // Iniciar la carga
    img.src = url;
  });
};

/**
 * Valida todas las imágenes de una lista de ofertas
 * @param {Array} offers - Lista de ofertas a validar
 * @returns {Promise<Object>} - Resultados de la validación
 */
export const validateProductImages = async (offers) => {
  console.log(`[ImageValidator] 🟡 Iniciando validación de ${offers.length} imágenes`);
  
  const results = {
    total: offers.length,
    success: 0,
    failed: 0,
    details: []
  };
  
  for (const offer of offers) {
    const isValid = await validateImageUrl(offer.url_imagen);
    
    results.details.push({
      id: offer.id,
      titulo: offer.titulo,
      url: offer.url_imagen,
      valid: isValid
    });
    
    if (isValid) {
      results.success++;
    } else {
      results.failed++;
    }
  }
  
  console.log('[ImageValidator] 🟢 Validación completada:', {
    total: results.total,
    válidas: results.success,
    fallidas: results.failed,
    porcentajeÉxito: `${((results.success / results.total) * 100).toFixed(2)}%`
  });
  
  return results;
};

/**
 * Exporta la lista de todas las imágenes fallidas para diagnóstico
 * @param {Array} validationResults - Resultados de la validación
 * @returns {Array} - Lista de ofertas con imágenes fallidas
 */
export const getFailedImages = (validationResults) => {
  return validationResults.details.filter(item => !item.valid);
};

// Función auxiliar para verificar las imágenes al iniciar la aplicación
// Esta función puede ser llamada desde el componente principal
export const verifyAllProductImages = async (offers) => {
  console.log('[ImageValidator] ⚙️ Iniciar verificación automática de imágenes');
  const results = await validateProductImages(offers);
  
  if (results.failed > 0) {
    console.warn(`[ImageValidator] ⚠️ Hay ${results.failed} imágenes que no se pudieron cargar`);
    console.warn('[ImageValidator] 📋 Lista de imágenes fallidas:', 
      getFailedImages(results).map(item => ({
        id: item.id,
        titulo: item.titulo,
        url: item.url
      }))
    );
    return results;
  }
  
  console.log('[ImageValidator] ✅ Todas las imágenes se cargaron correctamente');
  return results;
};
