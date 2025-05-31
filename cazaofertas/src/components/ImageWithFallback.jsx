// ImageWithFallback.jsx - COMPONENTE QUE SIEMPRE MUESTRA IMÁGENES VÁLIDAS
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getImagenBruta, generarImagenDinamica } from '../utils/imageHelpers';

/**
 * COMPONENTE MEJORADO: SIEMPRE MUESTRA UNA IMAGEN VÁLIDA
 * Utiliza URLs directas y algoritmos específicos para cada tipo de producto y tienda
 */
const ImageWithFallback = ({ 
  src, 
  alt = 'Imagen', 
  categoryId = null,
  storeName = '',
  product = null,
  className = '', 
  style = {}, 
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [finalSrc, setFinalSrc] = useState('');
  
  // MÉTODO PARA OBTENER IMAGEN GARANTIZADA
  useEffect(() => {
    // Reseteamos el estado de error al cambiar las props
    setHasError(false);
    setErrorCount(0);
    
    // Usamos getImagenBruta para conseguir la imagen final
    const imagenCalculada = hasError 
      ? (product ? generarImagenDinamica(product) : getImagenBruta(null, alt, categoryId, storeName))
      : getImagenBruta(src, alt, categoryId, storeName, product);
      
    setFinalSrc(imagenCalculada);
    console.log('📷 [ImageWithFallback] Calculando imagen:', {
      src, 
      hasError, 
      finalSrc: imagenCalculada,
      product: product ? (product.titulo || product.nombre || 'objeto complejo') : 'no hay producto', 
      categoryId, 
      storeName
    });
  }, [src, alt, categoryId, storeName, product, hasError]);
  
  const handleError = () => {
    console.warn('⚠️ [ImageWithFallback] Error cargando imagen:', finalSrc);
    
    // Control de múltiples errores - aplicar estrategias diferentes
    setErrorCount(prev => prev + 1);
    
    if (!hasError) {
      setHasError(true);
    } else if (errorCount >= 2) {
      // Si falla más de 2 veces, usar imagen generada con texto
      console.warn('⚠️ [ImageWithFallback] Múltiples errores, usando imagen de emergencia');
      // No hacemos nada más, ya que usará generarImagenDinamica en el próximo render
    }
  };

  const handleLoad = () => {
    // Imagen cargada correctamente
    if (hasError) {
      console.log('✅ [ImageWithFallback] Carga exitosa con imagen alternativa:', finalSrc);
    }
  };
  
  // Determinar la mejor altura y ancho según el tipo de imagen
  const getOptimizedStyle = () => {
    // Estilo base
    const baseStyle = {
      objectFit: 'cover',
      objectPosition: 'center',
      ...style
    };
    
    // Para imágenes de tienda, centramos mejor y ajustamos el objeto
    if (storeName && (!product || typeof product !== 'object')) {
      return {
        ...baseStyle,
        objectFit: 'contain',
        padding: '8px'
      };
    }
    
    return baseStyle;
  };

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      style={getOptimizedStyle()}
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
  categoryId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  storeName: PropTypes.string,
  product: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ImageWithFallback;
