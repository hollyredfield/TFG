// ImageWithFallback.jsx - COMPONENTE BRUTAL QUE SIEMPRE MUESTRA IMÁGENES
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getImagenBruta } from '../utils/imageHelpers';

/**
 * COMPONENTE BRUTAL: SIEMPRE MUESTRA UNA IMAGEN
 * No hay excusas, no hay errores, siempre hay imagen
 */
const ImageWithFallback = ({ 
  src, 
  alt = 'Imagen', 
  categoryId = null,
  storeName = '',
  className = '', 
  style = {}, 
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  
  // MÉTODO BRUTAL: OBTENER IMAGEN SÍ O SÍ
  const imagenFinal = hasError 
    ? getImagenBruta(null, alt, categoryId, storeName)  // Forzar fallback
    : getImagenBruta(src, alt, categoryId, storeName);   // Intentar original o fallback
  
  console.log('🖼️ [ImageWithFallback] Imagen final:', { src, imagenFinal, categoryId, storeName });

  const handleError = () => {
    console.warn('⚠️ [ImageWithFallback] Error cargando imagen:', src);
    setHasError(true);
  };

  const handleLoad = () => {
    console.log('✅ [ImageWithFallback] Imagen cargada correctamente:', imagenFinal);
  };

  return (
    <img
      src={imagenFinal}
      alt={alt}
      className={className}
      style={{
        objectFit: 'cover',
        objectPosition: 'center',
        ...style
      }}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      {...props}
    />
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  categoryId: PropTypes.number,
  storeName: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ImageWithFallback;
