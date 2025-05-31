// Versión simulada sin dependencias externas
// Todo el scraping se reemplaza por datos pre-cargados

import { tiendas, ofertas } from '../data/mockData';

// Cache para almacenar resultados pre-cargados
const cache = {
  images: {
    // Datos pre-cargados para evitar peticiones reales
    'iphone 15': 'https://images.unsplash.com/photo-1697559629937-8afed676f52c?q=80&w=2070',
    'iphone 14': 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?q=80&w=2069',
    'iphone 13': 'https://images.unsplash.com/photo-1632661674596-618e45f8d8be?q=80&w=1000',
    'samsung s24': 'https://images.unsplash.com/photo-1707476770642-3d1d772f5669?q=80&w=2437',
    'samsung s23': 'https://images.unsplash.com/photo-1676380372026-9440a8535283?q=80&w=2070',
    'pixel 8': 'https://images.unsplash.com/photo-1697552879386-f3ba57fcde46?q=80&w=2071',
    'samsung tv': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2057',
    'lg oled': 'https://images.unsplash.com/photo-1558888401-3cc1de77652d?q=80&w=2070',
    'monitor gaming': 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=2064',
    'nintendo switch': 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?q=80&w=2070',
    'nintendo switch oled': 'https://images.unsplash.com/photo-1635028538561-27e4c4cd5a93?q=80&w=1000',
    'playstation 5': 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2264',
    'xbox series x': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1932',
    'steam deck': 'https://images.unsplash.com/photo-1670425514645-76246e5ab1bc?q=80&w=1000',
    'laptop': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020',
    'macbook pro': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2626',
    'macbook air': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070',
    'asus rog': 'https://images.unsplash.com/photo-1593642632505-1f965e8426e9?q=80&w=1000',
    'lenovo thinkpad': 'https://images.unsplash.com/photo-1648428041876-bff8d151e949?q=80&w=2080',
    'zapatillas': 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=2187',
    'nike air': 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070',
    'adidas': 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=2071',
    'roomba': 'https://images.unsplash.com/photo-1679679195912-28a666c501ce?q=80&w=2070',
    'bicicleta': 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2070',
    'bicicleta electrica': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2070',
    'freidora aire': 'https://images.unsplash.com/photo-1626074961596-cab914d9392e?q=80&w=1964',
    'robot cocina': 'https://images.unsplash.com/photo-1622419091207-7c616f6d224c?q=80&w=1000',
    'tablet': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=2874',
    'ipad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2079',
    'chaqueta': 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?q=80&w=1974',
    'camara': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1938',
    'sony alpha': 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=2070',
    'canon': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1920',
    'airpods': 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=1963',
    'smartwatch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072',
    'apple watch': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1928',
    'altavoz bluetooth': 'https://images.unsplash.com/photo-1589003077984-894e133dabab?q=80&w=1964',
    'impresora': 'https://images.unsplash.com/photo-1612815292890-fd25aea952d6?q=80&w=2070',
    'mueble': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070',
    'sofa': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=2070',
    'silla gaming': 'https://images.unsplash.com/photo-1598550477585-037afa7a2964?q=80&w=2070',
    'secador pelo': 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?q=80&w=1964',
    'cafetera': 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=2070',
    'lavadora': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1974',
    'nevera': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=1974',
    'microondas': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=1931',
    'aspiradora': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=2070',
    'lavavajillas': 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?q=80&w=1931'
  },  descriptions: {
    'iphone 15': 'El último iPhone 15 con chip A17 Pro, cámara de 48MP mejorada, y diseño en titanio. Incluye Dynamic Island y pantalla Super Retina XDR.',
    'iphone 14': 'iPhone 14 con chip A16 Bionic, sistema avanzado de doble cámara y modo Acción para videos más estables. Resistente al agua y con conectividad 5G ultrarrápida.',
    'iphone 13': 'iPhone 13 con potente chip A15 Bionic, impresionante sistema de doble cámara con modo Noche y grabación en Dolby Vision HDR, pantalla Super Retina XDR.',
    'samsung s24': 'Samsung Galaxy S24 Ultra con procesador Exynos 2400, cámara principal de 200MP con zoom óptico 10x, S Pen integrado y batería de alta capacidad.',
    'samsung s23': 'Samsung Galaxy S23 Ultra con procesador Snapdragon 8 Gen 2, sistema de cámara profesional de 108MP con zoom espacial y pantalla Dynamic AMOLED 2X.',
    'pixel 8': 'Google Pixel 8 Pro con Tensor G3, cámara avanzada de 50MP con procesamiento computacional, Magic Editor y pantalla Smooth Display de 120Hz.',
    'samsung tv': 'Smart TV Samsung Neo QLED 4K con procesador Neural AI, Mini LED, HDR10+, y sistema de sonido Object Tracking Sound.',
    'lg oled': 'LG OLED evo con procesador α9 Gen6, Dolby Vision IQ, Dolby Atmos, y tecnología OLED auto-iluminante para negros perfectos y colores infinitos.',
    'monitor gaming': 'Monitor gaming ultrawide curvo con 240Hz de refresco, 1ms de respuesta, tecnología G-Sync y resolución WQHD para una experiencia inmersiva.',
    'nintendo switch': 'Consola Nintendo Switch con pantalla táctil de 6.2", 32GB de almacenamiento, Joy-Con desmontables y modo portátil, TV y sobremesa.',
    'nintendo switch oled': 'Nintendo Switch modelo OLED con pantalla de 7", 64GB de almacenamiento, base con puerto LAN y audio mejorado.',
    'playstation 5': 'PS5 con SSD ultrarrápido, ray tracing, resolución 4K, 120FPS y control DualSense con retroalimentación háptica y gatillos adaptativos.',
    'xbox series x': 'Xbox Series X con 12 teraflops de potencia, SSD personalizado, Quick Resume, 4K a 60FPS con capacidad de hasta 120FPS.',
    'steam deck': 'Steam Deck con AMD APU personalizado, 16GB de RAM LPDDR5, pantalla táctil LCD de 7" y acceso a miles de juegos de Steam.',
    'laptop': 'Portátil ultraligero con procesador de última generación, pantalla de alta resolución, SSD rápido y autonomía de todo el día.',
    'macbook pro': 'MacBook Pro con chip M2 Pro/Max, pantalla Liquid Retina XDR, hasta 96GB de RAM unificada y autonomía de hasta 22 horas.',
    'macbook air': 'MacBook Air con chip M2, diseño ultradelgado de 1,24 cm, 18 horas de autonomía y pantalla Liquid Retina de 13,6".',
    'asus rog': 'ASUS ROG Strix con procesador AMD Ryzen 9, GPU NVIDIA RTX serie 40, refrigeración avanzada y pantalla IPS de 240Hz.',
    'lenovo thinkpad': 'Lenovo ThinkPad con procesador Intel Core, seguridad avanzada, conectividad completa y resistencia probada con certificación militar.',
    'zapatillas': 'Zapatillas deportivas con tecnología de amortiguación reactiva, parte superior transpirable y suela con gran agarre en diferentes superficies.',
    'nike air': 'Nike Air Max con unidad Air visible para máxima amortiguación, parte superior de materiales premium y diseño emblemático.',
    'adidas': 'Zapatillas adidas con tecnología Boost para retorno de energía, Primeknit transpirable y refuerzos estratégicos para mayor estabilidad.',
    'roomba': 'Robot aspirador iRobot Roomba con tecnología de mapeo PrecisionVision, detección de objetos, sistema de autovaciado y limpieza en tres fases.',
    'bicicleta': 'Bicicleta MTB con cuadro de aluminio hidroformado, suspensión delantera con bloqueo, cambios Shimano de 24 velocidades y frenos de disco hidráulicos.',
    'bicicleta electrica': 'Bicicleta eléctrica urbana con motor de 250W, batería de gran capacidad, autonomía de 80km, cambios Shimano y asistencia inteligente al pedaleo.',
    'freidora aire': 'Freidora de aire con panel digital táctil, 8 programas preestablecidos, tecnología de circulación de aire 360° y capacidad de 5,5L.',
    'robot cocina': 'Robot de cocina multifunción con 30 funciones, pantalla táctil, báscula integrada, temperatura hasta 120°C y motor de 1500W.',
    'tablet': 'Tablet con pantalla 2K de 10,9", procesador octa-core, 128GB ampliables, batería de larga duración y conectividad 5G opcional.',
    'ipad': 'iPad con chip Apple M1, pantalla Liquid Retina, compatibilidad con Apple Pencil y Magic Keyboard, y sistema iPadOS optimizado para productividad.',
    'chaqueta': 'Chaqueta impermeable y transpirable con membrana Gore-Tex, costuras termoselladas, capucha ajustable y múltiples bolsillos con cremalleras impermeables.',
    'camara': 'Cámara digital mirrorless con sensor full-frame de 45MP, grabación 8K, estabilización de 8 pasos y enfoque automático con seguimiento avanzado.',
    'sony alpha': 'Sony Alpha con sensor de imagen CMOS Exmor R de fotograma completo, procesador BIONZ XR y sistema AF de seguimiento en tiempo real.',
    'canon': 'Canon EOS con sensor CMOS de alta resolución, procesador DIGIC X, sistema Dual Pixel CMOS AF II y capacidad de grabación 4K a 120p.',
    'airpods': 'Apple AirPods Pro con cancelación activa de ruido, modo Transparencia, audio espacial con seguimiento dinámico de la cabeza y resistencia al agua y sudor.',
    'smartwatch': 'Smartwatch con pantalla AMOLED HD, monitorización avanzada de salud, GPS integrado, autonomía de 14 días y más de 150 modos deportivos.',
    'apple watch': 'Apple Watch con pantalla Retina siempre activa, sensores avanzados de salud, resistencia al agua, GPS + Cellular y ecosistema de apps.',
    'altavoz bluetooth': 'Altavoz Bluetooth portátil con sonido 360°, resistencia al agua IP67, autonomía de 24 horas, graves profundos y función de powerbank.',
    'impresora': 'Impresora multifunción con impresión a doble cara automática, conectividad WiFi, pantalla táctil y sistema de tinta recargable de alta capacidad.',
    'mueble': 'Mueble de diseño escandinavo fabricado con madera sostenible, acabados premium y herrajes de alta calidad para mayor durabilidad.',
    'sofa': 'Sofá modular 3 plazas con chaise longue, tapizado en tela antimanchas, asientos viscoelásticos y respaldos reclinables con sistema eléctrico.',
    'silla gaming': 'Silla gaming ergonómica con respaldo reclinable hasta 155°, reposabrazos 4D, base de aluminio, acolchado premium y soporte lumbar ajustable.',
    'secador pelo': 'Secador de pelo profesional con motor digital, tecnología iónica, 5 modos de temperatura/velocidad y difusor para definición de rizos.',
    'cafetera': 'Cafetera espresso automática con molinillo cerámico integrado, panel táctil intuitivo, espumador de leche profesional y sistema de autolimpieza.',
    'lavadora': 'Lavadora de carga frontal A+++ con 10kg de capacidad, 1400 rpm, motor inverter, programas específicos para todo tipo de tejidos y tecnología de vapor.',
    'nevera': 'Frigorífico combi No Frost con dispensador de agua, compartimento 0°C para alimentos frescos, tecnología de conservación avanzada y clasificación energética A+++.',
    'microondas': 'Microondas con grill y convección, 900W de potencia, 28L de capacidad, programas automáticos y descongelación por peso.',
    'aspiradora': 'Aspiradora sin cable con tecnología ciclónica, batería de 60 min de autonomía, cepillo motorizado con iluminación LED y accesorios multiuso.',
    'lavavajillas': 'Lavavajillas integrable A+++ con 14 servicios, 8 programas, función secado extra, tercera bandeja para cubiertos y motor inverter silencioso.'
  },  specs: {
    'iphone 15': {
      pantalla: '6.1" Super Retina XDR OLED',
      procesador: 'A17 Pro',
      almacenamiento: '128GB/256GB/512GB/1TB',
      camara: '48MP principal + 12MP ultra gran angular',
      bateria: 'Hasta 26 horas de reproducción de video'
    },
    'iphone 14': {
      pantalla: '6.1" Super Retina XDR OLED',
      procesador: 'A16 Bionic',
      almacenamiento: '128GB/256GB/512GB',
      camara: '12MP principal + 12MP ultra gran angular',
      bateria: 'Hasta 20 horas de reproducción de video'
    },
    'samsung s24': {
      pantalla: '6.8" Dynamic AMOLED 2X',
      procesador: 'Snapdragon 8 Gen 3',
      almacenamiento: '256GB/512GB/1TB',
      camara: '200MP principal + 12MP ultra gran angular + 50MP teleobjetivo',
      bateria: '5000mAh con carga rápida de 45W'
    },
    'macbook pro': {
      pantalla: '14.2" o 16.2" Liquid Retina XDR',
      procesador: 'Apple M2 Pro o M2 Max',
      almacenamiento: '512GB/1TB/2TB/4TB/8TB SSD',
      memoria: 'Hasta 96GB de memoria unificada',
      gpu: 'GPU integrada de hasta 38 núcleos'
    },
    'macbook air': {
      pantalla: '13.6" Liquid Retina',
      procesador: 'Apple M2',
      almacenamiento: '256GB/512GB/1TB/2TB SSD',
      memoria: 'Hasta 24GB de memoria unificada',
      bateria: 'Hasta 18 horas de autonomía'
    },
    'samsung tv': {
      pantalla: '65" Neo QLED 4K',
      refresco: '120Hz',
      hdr: 'HDR10+',
      sonido: '60W con Dolby Atmos',
      conectividad: 'HDMI 2.1, WiFi 6E, Bluetooth 5.2'
    },
    'lg oled': {
      pantalla: '65" OLED evo 4K',
      procesador: 'α9 Gen6 AI',
      hdr: 'Dolby Vision, HDR10, HLG',
      sonido: '40W con AI Sound Pro',
      sistema: 'webOS 23 con IA ThinQ'
    },
    'playstation 5': {
      cpu: 'AMD Zen 2 8 núcleos a 3.5GHz',
      gpu: 'AMD RDNA 2 10.28 TFLOPs',
      almacenamiento: 'SSD personalizado de 825GB',
      ram: '16GB GDDR6',
      resolucion: '4K a 120fps, compatible 8K'
    },
    'nintendo switch oled': {
      pantalla: '7" OLED',
      procesador: 'NVIDIA Custom Tegra',
      almacenamiento: '64GB ampliable',
      bateria: 'Entre 4.5 y 9 horas',
      conectividad: 'WiFi, Bluetooth, USB-C, Dock con LAN'
    },
    'ipad': {
      pantalla: '10.9" Liquid Retina',
      procesador: 'Apple M1',
      almacenamiento: '64GB/256GB',
      conectividad: 'WiFi 6, opcional 5G',
      accesorios: 'Compatible con Apple Pencil y Magic Keyboard'
    },
    'sony alpha': {
      sensor: 'CMOS Exmor R full-frame de 33MP',
      procesador: 'BIONZ XR',
      iso: '100-51200 (expandible hasta 102400)',
      estabilizacion: 'Estabilizador de imagen en 5 ejes',
      video: '4K 60p 10-bit 4:2:2'
    },
    'nevera': {
      capacidad: '400L (280L frigorífico + 120L congelador)',
      clase_energetica: 'A+++',
      ruido: '35dB',
      medidas: '200x60x65 cm (altoxanchoxfondo)',
      tecnologia: 'No Frost con control independiente'
    },
    'lavadora': {
      capacidad: '10kg',
      centrifugado: '1400 rpm',
      clase_energetica: 'A+++',
      programas: '15 programas + app smart control',
      funciones: 'Vapor, carga variable, inicio diferido'
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
  'FNAC': 'https://logo.clearbit.com/fnac.es',
  'Apple': 'https://logo.clearbit.com/apple.com',
  'Microsoft': 'https://logo.clearbit.com/microsoft.com',
  'Samsung': 'https://logo.clearbit.com/samsung.com',
  'Sony': 'https://logo.clearbit.com/sony.com',
  'LG': 'https://logo.clearbit.com/lg.com',
  'Xiaomi': 'https://logo.clearbit.com/mi.com',
  'Huawei': 'https://logo.clearbit.com/huawei.com',
  'Asus': 'https://logo.clearbit.com/asus.com',
  'Acer': 'https://logo.clearbit.com/acer.com',
  'Dell': 'https://logo.clearbit.com/dell.com',
  'HP': 'https://logo.clearbit.com/hp.com',
  'Lenovo': 'https://logo.clearbit.com/lenovo.com',
  'Nintendo': 'https://logo.clearbit.com/nintendo.com',
  'PlayStation': 'https://logo.clearbit.com/playstation.com',
  'Xbox': 'https://logo.clearbit.com/xbox.com',
  'Nike': 'https://logo.clearbit.com/nike.com',
  'Adidas': 'https://logo.clearbit.com/adidas.com',
  'Puma': 'https://logo.clearbit.com/puma.com',
  'Mango': 'https://logo.clearbit.com/mango.com',
  'H&M': 'https://logo.clearbit.com/hm.com',
  'Pull&Bear': 'https://logo.clearbit.com/pullandbear.com',
  'Bershka': 'https://logo.clearbit.com/bershka.com',
  'Stradivarius': 'https://logo.clearbit.com/stradivarius.com',
  'Lidl': 'https://logo.clearbit.com/lidl.es',
  'Aldi': 'https://logo.clearbit.com/aldi.es',
  'Dia': 'https://logo.clearbit.com/dia.es',
  'Mercadona': 'https://logo.clearbit.com/mercadona.es',
  'Worten': 'https://logo.clearbit.com/worten.es',
  'Game': 'https://logo.clearbit.com/game.es',
  'Cash Converters': 'https://logo.clearbit.com/cashconverters.es',
  'Decimas': 'https://logo.clearbit.com/decimas.es',
  'Sprinter': 'https://logo.clearbit.com/sprinter.es',
  'Forum Sport': 'https://logo.clearbit.com/forumsport.com',
  'El Ganso': 'https://logo.clearbit.com/elganso.com',
  'Springfield': 'https://logo.clearbit.com/myspringfield.com',
  'Cortefiel': 'https://logo.clearbit.com/cortefiel.com',
  'Women\'secret': 'https://logo.clearbit.com/womensecret.com',
  'Primark': 'https://logo.clearbit.com/primark.com'
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
export const fetchProductImages = async (productName, category = '', count = 4) => {
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
export const fetchProductDescription = async (productName, category = '') => {
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
export const fetchProductSpecs = async (productName, category = '') => {
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

// VERSIÓN SIMULADA DEL SCRAPER

// Simular delay de red
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));

// Función para simular el scraping de datos de una tienda
export const fetchStoreData = async (storeName) => {
  await simulateDelay();
  const store = tiendas.find(s => s.slug === storeName.toLowerCase());
  
  if (!store) {
    throw new Error('Tienda no encontrada');
  }

  // Obtener ofertas de la tienda
  const storeofertas = ofertas.filter(o => o.store_id === store.id);

  return {
    ...store,
    lastUpdate: new Date().toISOString(),
    stats: {
      offerCount: storeofertas.length,
      totalSaved: storeofertas.reduce((acc, offer) => 
        acc + (offer.original_price - offer.current_price), 0),
      averageDiscount: Math.round(
        storeofertas.reduce((acc, offer) => 
          acc + ((offer.original_price - offer.current_price) / offer.original_price * 100), 0) 
        / (storeofertas.length || 1)
      )
    }
  };
};

// Función para simular la extracción de datos de un producto
export const extractProductInfo = async (url) => {
  await simulateDelay();

  // Determinar la tienda basada en la URL
  const store = tiendas.find(s => url.includes(s.slug));
  if (!store) {
    return { error: 'URL no soportada' };
  }

  // Generar datos de producto simulados pero realistas
  const randomPrice = Math.floor(Math.random() * 900) + 100;
  const randomDiscount = Math.floor(Math.random() * 40) + 10;
  const originalPrice = Math.floor(randomPrice * (100 / (100 - randomDiscount)));

  return {
    title: `Producto de ${store.name}`,
    description: `Este es un producto de ejemplo de ${store.name}`,
    current_price: randomPrice,
    original_price: originalPrice,
    image_url: 'https://via.placeholder.com/300',
    store: store.name,
    store_id: store.id,
    error: null
  };
};

export const getProductInfo = async (url) => {
  try {
    // Validar que la URL pertenece a una tienda soportada
    const store = tiendas.find(s => url.includes(s.url.replace('https://', '')));
    if (!store) {
      throw new Error('Tienda no soportada');
    }

    // Simular extracción de datos del producto
    const randomPrice = Math.floor(Math.random() * 1000) + 100;
    const discountPercent = Math.floor(Math.random() * 30) + 10;
    const originalPrice = Math.floor(randomPrice * (100 / (100 - discountPercent)));

    return {
      title: `Producto de ${store.name}`,
      current_price: randomPrice,
      original_price: originalPrice,
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      store: store.name,
      store_id: store.id,
      url: url,
      error: null
    };
  } catch (error) {
    return {
      error: error.message || 'Error al obtener información del producto'
    };
  }
};

// Validar URLs de tiendas soportadas
export const validateUrl = (url) => {
  return tiendas.some(store => 
    url.toLowerCase().includes(store.slug.toLowerCase())
  );
};
