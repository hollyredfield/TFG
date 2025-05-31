// Versión simulada sin dependencias externas
// Todo el scraping se reemplaza por datos pre-cargados

// Cache para almacenar resultados pre-cargados
const cache = {
  images: {
    // Datos pre-cargados para evitar peticiones reales
    'iphone 15': 'https://images.unsplash.com/photo-1697559629937-8afed676f52c?q=80&w=2070',
    'samsung tv': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2057',
    'nintendo switch': 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?q=80&w=2070',
    'playstation 5': 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2264',
    'laptop': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020',
    'zapatillas': 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=2187',
    'roomba': 'https://images.unsplash.com/photo-1679679195912-28a666c501ce?q=80&w=2070',
    'bicicleta': 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2070',
    'freidora aire': 'https://images.unsplash.com/photo-1626074961596-cab914d9392e?q=80&w=1964',
    'chaqueta': 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?q=80&w=1974'
  },
  descriptions: {
    'iphone 15': 'El último iPhone 15 con chip A17 Pro, cámara de 48MP mejorada, y diseño en titanio. Incluye Dynamic Island y pantalla Super Retina XDR.',
    'samsung tv': 'Smart TV Samsung QLED 4K con procesador Neural AI, HDR10+, y sistema de sonido Object Tracking Sound.',
    'nintendo switch': 'Consola Nintendo Switch con pantalla OLED de 7", 64GB de almacenamiento y dock con puerto LAN.',
    'playstation 5': 'Consola PlayStation 5 con SSD ultrarrápido, ray tracing, resolución 4K y control DualSense con retroalimentación háptica.',
    'laptop': 'Portátil con procesador de última generación, pantalla de alta resolución y diseño ultraligero.',
    'zapatillas': 'Zapatillas deportivas con tecnología de amortiguación avanzada y diseño ergonómico.',
    'roomba': 'Robot aspirador con mapeo inteligente, navegación con cámaras y sistema de autovaciado.',
    'bicicleta': 'Bicicleta de montaña con cuadro de aluminio, suspensión delantera y cambios Shimano.',
    'freidora aire': 'Freidora de aire con panel digital, múltiples programas de cocción y tecnología de circulación de aire 360°.',
    'chaqueta': 'Chaqueta con diseño moderno, materiales de alta calidad y excelente acabado.'
  },
  specs: {
    'iphone 15': {
      pantalla: '6.1" Super Retina XDR OLED',
      procesador: 'A17 Pro',
      almacenamiento: '128GB/256GB/512GB/1TB',
      camara: '48MP principal + 12MP ultra gran angular',
      bateria: 'Hasta 26 horas de reproducción de video'
    },
    'samsung tv': {
      pantalla: '65" QLED 4K',
      refresco: '120Hz',
      hdr: 'HDR10+',
      sonido: '40W con Dolby Atmos',
      conectividad: 'HDMI 2.1, WiFi 6, Bluetooth'
    }
  },
  // Caducidad del cache simulado: 24 horas
  expiry: 24 * 60 * 60 * 1000
};

// Lista de logos predefinidos para tiendas populares
const storeLogos = {
  'Amazon': 'https://logo.clearbit.com/amazon.com',
  'El Corte Inglés': 'https://logo.clearbit.com/elcorteingles.es',
  'MediaMarkt': 'https://logo.clearbit.com/mediamarkt.es',
  'PC Componentes': 'https://logo.clearbit.com/pccomponentes.com',
  'PcComponentes': 'https://logo.clearbit.com/pccomponentes.com',
  'Zara': 'https://logo.clearbit.com/zara.com',
  'Carrefour': 'https://logo.clearbit.com/carrefour.es',
  'Decathlon': 'https://logo.clearbit.com/decathlon.es',
  'Alcampo': 'https://logo.clearbit.com/alcampo.es',
  'Leroy Merlin': 'https://logo.clearbit.com/leroymerlin.es',
  'IKEA': 'https://logo.clearbit.com/ikea.com',
  'Fnac': 'https://logo.clearbit.com/fnac.es',
  'FNAC': 'https://logo.clearbit.com/fnac.es'
};

/**
 * Formatea el término de búsqueda
 */
const formatSearchTerm = (productName, category = '') => {
  let searchTerm = productName
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (category && !searchTerm.includes(category.toLowerCase())) {
    searchTerm = `${searchTerm} ${category.toLowerCase()}`;
  }
  
  return searchTerm;
};

/**
 * Obtiene imágenes de productos (simulado)
 */
export const getProductImages = async (productName, category = '', count = 4) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de red
    const searchTerm = formatSearchTerm(productName, category);
    
    // Buscar en cache o generar imágenes aleatorias
    const images = cache.images[searchTerm] ? 
      Array(count).fill(cache.images[searchTerm]) :
      Array(count).fill(`https://source.unsplash.com/800x600/?${encodeURIComponent(searchTerm)}`);
    
    return { images, error: null };
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    return { 
      images: [`https://source.unsplash.com/800x600/?${encodeURIComponent(productName)}`], 
      error 
    };
  }
};

/**
 * Obtiene la descripción de un producto (simulado)
 */
export const getProductDescription = async (productName, category = '') => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay de red
    const searchTerm = formatSearchTerm(productName, category);
    
    // Buscar en cache o generar descripción genérica
    const description = cache.descriptions[searchTerm] || 
      `${productName} - Producto de alta calidad con excelentes características y prestaciones.`;
    
    return { description, error: null };
  } catch (error) {
    console.error('Error al obtener descripción:', error);
    return { description: '', error };
  }
};

/**
 * Obtiene especificaciones técnicas (simulado)
 */
export const getProductSpecs = async (productName, category = '') => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simular delay de red
    const searchTerm = formatSearchTerm(productName, category);
    
    // Buscar en cache o generar specs genéricas
    const specs = cache.specs[searchTerm] || {
      dimensiones: 'Dimensiones estándar',
      peso: 'Peso aproximado',
      material: 'Materiales de calidad',
      garantia: '2 años de garantía'
    };
    
    return { specs, error: null };
  } catch (error) {
    console.error('Error al obtener especificaciones:', error);
    return { specs: {}, error };
  }
};

/**
 * Obtiene el logo de una tienda
 */
export const getStoreLogo = (storeName) => {
  const normalizedName = storeName.trim();
  return storeLogos[normalizedName] || 'https://via.placeholder.com/150x150.png?text=Logo';
};
