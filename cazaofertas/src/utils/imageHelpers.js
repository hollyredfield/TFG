// SISTEMA DE IMÁGENES CON URLS REALES Y DIRECTAS
// Este archivo utiliza URLs de imágenes reales organizadas por categoría y tienda

// IMÁGENES DE CATEGORÍAS (URLS DIRECTAS A IMÁGENES REALES)
const IMAGEN_GENERICA = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=300&h=200&auto=format&fit=crop'; // Imagen genérica de oferta

// Electrónica - imágenes reales por subcategoría
const IMAGEN_ELECTRONICA = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=300&h=200&auto=format&fit=crop'; // Electrónica general
const IMAGEN_MOVIL = 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=300&h=200&auto=format&fit=crop'; // Móviles
const IMAGEN_PORTATIL = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300&h=200&auto=format&fit=crop'; // Portátiles
const IMAGEN_TABLET = 'https://images.unsplash.com/photo-1544244015-6318b14f7d1b?q=80&w=300&h=200&auto=format&fit=crop'; // Tablets
const IMAGEN_AURICULARES = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=200&auto=format&fit=crop'; // Auriculares
const IMAGEN_CAMARA = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&h=200&auto=format&fit=crop'; // Cámaras
const IMAGEN_SMART_TV = 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=300&h=200&auto=format&fit=crop'; // Smart TVs
const IMAGEN_ALTAVOCES = 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=300&h=200&auto=format&fit=crop'; // Altavoces
const IMAGEN_MONITOR = 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&h=200&auto=format&fit=crop'; // Monitores
const IMAGEN_WEARABLE = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=300&h=200&auto=format&fit=crop'; // Smartwatch, pulseras inteligentes

// Moda - imágenes reales por subcategoría
const IMAGEN_MODA = 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=300&h=200&auto=format&fit=crop'; // Moda general
const IMAGEN_ROPA = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=300&h=200&auto=format&fit=crop'; // Ropa
const IMAGEN_ZAPATILLAS = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&h=200&auto=format&fit=crop'; // Zapatillas
const IMAGEN_ACCESORIOS = 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=300&h=200&auto=format&fit=crop'; // Accesorios
const IMAGEN_RELOJ = 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=300&h=200&auto=format&fit=crop'; // Relojes
const IMAGEN_BOLSO = 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=300&h=200&auto=format&fit=crop'; // Bolsos
const IMAGEN_GAFAS = 'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=300&h=200&auto=format&fit=crop'; // Gafas
const IMAGEN_JOYERIA = 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=300&h=200&auto=format&fit=crop'; // Joyería

// Hogar - imágenes reales por subcategoría
const IMAGEN_HOGAR = 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=300&h=200&auto=format&fit=crop'; // Hogar general
const IMAGEN_MUEBLES = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=300&h=200&auto=format&fit=crop'; // Muebles
const IMAGEN_COCINA = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=300&h=200&auto=format&fit=crop'; // Cocina
const IMAGEN_DECORACION = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=300&h=200&auto=format&fit=crop'; // Decoración
const IMAGEN_JARDIN = 'https://images.unsplash.com/photo-1598902108854-10e335adac99?q=80&w=300&h=200&auto=format&fit=crop'; // Jardín
const IMAGEN_ELECTRODOMESTICOS = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=300&h=200&auto=format&fit=crop'; // Electrodomésticos
const IMAGEN_ILUMINACION = 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=300&h=200&auto=format&fit=crop'; // Iluminación

// Videojuegos - imágenes reales por subcategoría
const IMAGEN_VIDEOJUEGOS = 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=300&h=200&auto=format&fit=crop'; // Videojuegos general
const IMAGEN_CONSOLAS = 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=300&h=200&auto=format&fit=crop'; // Consolas
const IMAGEN_JUEGOS = 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?q=80&w=300&h=200&auto=format&fit=crop'; // Juegos
const IMAGEN_ACCESORIOS_GAMING = 'https://images.unsplash.com/photo-1607016284318-d1384f74454c?q=80&w=300&h=200&auto=format&fit=crop'; // Accesorios
const IMAGEN_PS5 = 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=300&h=200&auto=format&fit=crop'; // PS5
const IMAGEN_XBOX = 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=300&h=200&auto=format&fit=crop'; // Xbox
const IMAGEN_NINTENDO = 'https://images.unsplash.com/photo-1615680022647-99c397c9a641?q=80&w=300&h=200&auto=format&fit=crop'; // Nintendo
const IMAGEN_PC_GAMING = 'https://images.unsplash.com/photo-1603481546384-91d876919e69?q=80&w=300&h=200&auto=format&fit=crop'; // PC Gaming

// Deportes - imágenes reales por subcategoría
const IMAGEN_DEPORTES = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=300&h=200&auto=format&fit=crop'; // Deportes general
const IMAGEN_FITNESS = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=300&h=200&auto=format&fit=crop'; // Fitness
const IMAGEN_FUTBOL = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=300&h=200&auto=format&fit=crop'; // Fútbol
const IMAGEN_BICICLETAS = 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=300&h=200&auto=format&fit=crop'; // Bicicletas
const IMAGEN_RUNNING = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=300&h=200&auto=format&fit=crop'; // Running
const IMAGEN_BALONCESTO = 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&h=200&auto=format&fit=crop'; // Baloncesto
const IMAGEN_TENNIS = 'https://images.unsplash.com/photo-1622279457486-28f24525420d?q=80&w=300&h=200&auto=format&fit=crop'; // Tennis
const IMAGEN_NATACION = 'https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?q=80&w=300&h=200&auto=format&fit=crop'; // Natación

// Viajes - imágenes reales por subcategoría
const IMAGEN_VIAJES = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=300&h=200&auto=format&fit=crop'; // Viajes general
const IMAGEN_HOTELES = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&h=200&auto=format&fit=crop'; // Hoteles
const IMAGEN_VUELOS = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=300&h=200&auto=format&fit=crop'; // Vuelos
const IMAGEN_MALETAS = 'https://images.unsplash.com/photo-1581553680321-4aba6b12e596?q=80&w=300&h=200&auto=format&fit=crop'; // Maletas
const IMAGEN_PLAYA = 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=300&h=200&auto=format&fit=crop'; // Playa
const IMAGEN_MONTANA = 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=300&h=200&auto=format&fit=crop'; // Montaña
const IMAGEN_CIUDADES = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=300&h=200&auto=format&fit=crop'; // Ciudades

// LOGOS DE TIENDAS REALES
const AVATAR_AMAZON = 'https://logo.clearbit.com/amazon.com'; // Amazon
const AVATAR_ECI = 'https://logo.clearbit.com/elcorteingles.es'; // El Corte Inglés
const AVATAR_PCCOMPONENTES = 'https://logo.clearbit.com/pccomponentes.com'; // PcComponentes
const AVATAR_DECATHLON = 'https://logo.clearbit.com/decathlon.es'; // Decathlon
const AVATAR_MEDIAMARKT = 'https://logo.clearbit.com/mediamarkt.es'; // MediaMarkt
const AVATAR_ALIEXPRESS = 'https://logo.clearbit.com/aliexpress.com'; // AliExpress
const AVATAR_BOOKING = 'https://logo.clearbit.com/booking.com'; // Booking
const AVATAR_NIKE = 'https://logo.clearbit.com/nike.com'; // Nike
const AVATAR_APPLE = 'https://logo.clearbit.com/apple.com'; // Apple
const AVATAR_SAMSUNG = 'https://logo.clearbit.com/samsung.com'; // Samsung
const AVATAR_ZARA = 'https://logo.clearbit.com/zara.com'; // Zara
const AVATAR_ADIDAS = 'https://logo.clearbit.com/adidas.com'; // Adidas
const AVATAR_IKEA = 'https://logo.clearbit.com/ikea.com'; // Ikea
const AVATAR_LEROY = 'https://logo.clearbit.com/leroymerlin.es'; // Leroy Merlin
const AVATAR_PLAYSTATION = 'https://logo.clearbit.com/playstation.com'; // PlayStation
const AVATAR_XBOX = 'https://logo.clearbit.com/xbox.com'; // Xbox
const AVATAR_NINTENDO = 'https://logo.clearbit.com/nintendo.com'; // Nintendo
const AVATAR_ZALANDO = 'https://logo.clearbit.com/zalando.es'; // Zalando
const AVATAR_WORTEN = 'https://logo.clearbit.com/worten.es'; // Worten
const AVATAR_FNAC = 'https://logo.clearbit.com/fnac.es'; // Fnac
const AVATAR_CARREFOUR = 'https://logo.clearbit.com/carrefour.es'; // Carrefour
const AVATAR_LIDL = 'https://logo.clearbit.com/lidl.es'; // Lidl
const AVATAR_CASADELLIBRO = 'https://logo.clearbit.com/casadellibro.com'; // Casa del Libro
const AVATAR_GAME = 'https://logo.clearbit.com/game.es'; // GAME
const AVATAR_ELTENEDOR = 'https://logo.clearbit.com/eltenedor.es'; // El Tenedor
const AVATAR_MANGO = 'https://logo.clearbit.com/mango.com'; // Mango
const AVATAR_PRIMARK = 'https://logo.clearbit.com/primark.com'; // Primark
const AVATAR_DEFAULT = 'https://via.placeholder.com/200x200/6f7381/ffffff?text=TIENDA'; // Logo genérico tienda

// MAPA DE IMÁGENES POR CATEGORÍA
export const categoryFallbackImages = {
  1: IMAGEN_ELECTRONICA,
  2: IMAGEN_MODA,
  3: IMAGEN_HOGAR,
  4: IMAGEN_VIDEOJUEGOS,
  5: IMAGEN_DEPORTES,
  6: IMAGEN_VIAJES,
  default: IMAGEN_GENERICA
};

// COLORES DE CATEGORÍAS
export const categoryColors = {
  1: '#3983f6', // Electrónica
  2: '#ec4899', // Moda
  3: '#10b981', // Hogar
  4: '#8b5cf6', // Videojuegos
  5: '#f59e0b', // Deportes
  6: '#06b6d4'  // Viajes
};

// MAPAS AVANZADOS DE IDENTIFICACIÓN POR CARACTERÍSTICAS
const electronicsKeywords = {
  mobile: ['móvil', 'smartphone', 'iphone', 'samsung galaxy', 'xiaomi', 'teléfono', 'huawei', 'phone'],
  laptop: ['portátil', 'laptop', 'macbook', 'notebook', 'ordenador portátil', 'ultrabook'],
  tablet: ['tablet', 'ipad', 'galaxy tab', 'huawei matepad'],
  headphones: ['auricular', 'headphone', 'earphone', 'airpod', 'earbud', 'cascos', 'headset'],
  camera: ['cámara', 'camera', 'gopro', 'nikon', 'canon', 'sony alpha', 'reflex', 'fujifilm'],
  tv: ['televisor', 'tv', 'smart tv', 'television', 'oled', 'qled', 'led tv', 'samsung tv', 'lg tv'],
  speaker: ['altavoz', 'speaker', 'sonos', 'bose', 'audio', 'home cinema', 'barra de sonido', 'soundbar'],
  monitor: ['monitor', 'pantalla', 'display', 'ultrawide', 'gaming monitor'],
  wearable: ['smartwatch', 'reloj inteligente', 'fitbit', 'garmin', 'apple watch', 'amazfit', 'pulsera inteligente']
};

const fashionKeywords = {
  shoes: ['zapatilla', 'zapato', 'calzado', 'sneaker', 'nike', 'adidas', 'tenis', 'botas', 'deportivas'],
  clothes: ['ropa', 'camiseta', 'pantalón', 'vestido', 'camisa', 'chaqueta', 'abrigo', 'jersey', 'sudadera'],
  accessories: ['accesorio', 'complemento', 'gorra', 'calcetines', 'bufanda', 'guantes'],
  watches: ['reloj', 'watch', 'smartwatch', 'casio', 'seiko', 'swatch'],
  bags: ['bolso', 'mochila', 'maleta', 'cartera', 'bag', 'backpack'],
  glasses: ['gafas', 'sunglasses', 'gafas de sol', 'lentes', 'ray-ban', 'oakley'],
  jewelry: ['joya', 'joyeria', 'collar', 'anillo', 'pulsera', 'pendientes', 'plata', 'oro']
};

const homeKeywords = {
  furniture: ['mueble', 'sofá', 'sofa', 'mesa', 'silla', 'armario', 'cama', 'estantería', 'escritorio'],
  kitchen: ['cocina', 'cafetera', 'microondas', 'batidora', 'freidora', 'robot de cocina', 'sartén', 'olla'],
  decoration: ['decoración', 'cuadro', 'lámpara', 'espejo', 'alfombra', 'jarrón', 'cojín', 'cortina'],
  garden: ['jardín', 'terraza', 'exterior', 'barbacoa', 'planta', 'maceta', 'cortacésped', 'mueble exterior'],
  appliances: ['electrodoméstico', 'lavadora', 'nevera', 'frigorífico', 'lavavajillas', 'aspiradora', 'horno'],
  lighting: ['iluminación', 'lámpara', 'bombilla', 'led', 'aplique', 'flexo', 'tira led']
};

const gamingKeywords = {
  console: ['consola', 'playstation', 'ps5', 'ps4', 'xbox', 'nintendo', 'switch'],
  games: ['juego', 'game', 'videojuego', 'fifa', 'call of duty', 'fortnite', 'gta', 'zelda', 'mario'],
  accessories: ['mando', 'controller', 'auriculares gaming', 'headset', 'teclado', 'ratón', 'mouse', 'silla gaming'],
  pcgaming: ['pc gaming', 'ordenador gaming', 'gaming pc', 'tarjeta gráfica', 'nvidia', 'amd', 'rtx', 'gpu']
};

const sportsKeywords = {
  fitness: ['fitness', 'gym', 'gimnasio', 'pesa', 'mancuerna', 'entrenamiento', 'crossfit', 'yoga', 'pilates'],
  football: ['fútbol', 'futbol', 'balón', 'pelota', 'soccer', 'bota de fútbol', 'equipación'],
  bike: ['bicicleta', 'bike', 'ciclismo', 'mtb', 'bici', 'mountain bike', 'peloton'],
  running: ['running', 'correr', 'runner', 'maratón', 'zapatillas running'],
  basketball: ['baloncesto', 'basketball', 'nba', 'canasta', 'jordan'],
  tennis: ['tenis', 'tennis', 'raqueta', 'pádel', 'padel', 'wilson', 'babolat'],
  swimming: ['natación', 'piscina', 'bañador', 'gafas de nadar', 'swimming']
};

const travelKeywords = {
  hotels: ['hotel', 'alojamiento', 'booking', 'habitación', 'hostel', 'apartamento', 'airbnb'],
  flights: ['vuelo', 'flight', 'avión', 'billetes', 'ryanair', 'iberia', 'viaje avión'],
  luggage: ['maleta', 'equipaje', 'mochila', 'trolley', 'samsonite'],
  beach: ['playa', 'beach', 'vacaciones playa', 'costa', 'mar', 'caribe', 'resort'],
  mountain: ['montaña', 'senderismo', 'hiking', 'trekking', 'camping', 'naturaleza'],
  city: ['ciudad', 'city break', 'escapada', 'turismo', 'tour']
};

// MAPA DE TIENDAS
const storeMap = {
  amazon: ['amazon', 'amazon.com', 'amazon.es', 'amazon prime'],
  elcorteingles: ['corte inglés', 'corteingles', 'el corte ingles', 'eci'],
  pccomponentes: ['pc componentes', 'pccomponentes', 'pc-componentes'],
  decathlon: ['decathlon', 'decatlon'],
  mediamarkt: ['media markt', 'mediamarkt', 'media mark'],
  aliexpress: ['aliexpress', 'ali express', 'ali-express'],
  booking: ['booking', 'booking.com'],
  nike: ['nike', 'nike.com'],
  apple: ['apple', 'apple store', 'iphone', 'mac', 'ipad'],
  samsung: ['samsung', 'samsung store', 'galaxy'],
  zara: ['zara', 'zara.com', 'inditex'],
  adidas: ['adidas', 'adidas.com'],
  ikea: ['ikea'],
  leroymerlin: ['leroy merlin', 'leroy', 'leroymerlin'],
  playstation: ['playstation', 'playstation store', 'ps store'],
  xbox: ['xbox', 'microsoft store'],
  nintendo: ['nintendo', 'nintendo store', 'switch'],
  zalando: ['zalando'],
  worten: ['worten'],
  fnac: ['fnac'],
  carrefour: ['carrefour'],
  lidl: ['lidl'],
  casadellibro: ['casa del libro', 'casadellibro', 'casa libro'],
  game: ['game', 'game.es'],
  eltenedor: ['el tenedor', 'eltenedor', 'tenedor'],
  mango: ['mango'],
  primark: ['primark']
};

/**
 * FUNCIÓN PRINCIPAL: OBTENER IMAGEN CON GARANTÍA ABSOLUTA
 * Esta función SIEMPRE devuelve una imagen válida para cualquier producto
 */
export const getImagenBruta = (src, alt = '', categoryId = null, storeName = '', product = null) => {
  // CASO ESPECIAL: Si es claramente una tienda (tiene storeName pero no product),
  // entonces priorizar imágenes de tiendas
  if (storeName && !product) {
    // Buscar logo de tienda específico
    const storeNameLower = storeName.toLowerCase();
    
    for (const [store, variants] of Object.entries(storeMap)) {
      if (variants.some(variant => storeNameLower.includes(variant))) {
        switch(store) {
          case 'amazon': return AVATAR_AMAZON;
          case 'elcorteingles': return AVATAR_ECI;
          case 'pccomponentes': return AVATAR_PCCOMPONENTES;
          case 'decathlon': return AVATAR_DECATHLON;
          case 'mediamarkt': return AVATAR_MEDIAMARKT;
          case 'aliexpress': return AVATAR_ALIEXPRESS;
          case 'booking': return AVATAR_BOOKING;
          case 'nike': return AVATAR_NIKE;
          case 'apple': return AVATAR_APPLE;
          case 'samsung': return AVATAR_SAMSUNG;
          case 'zara': return AVATAR_ZARA;
          case 'adidas': return AVATAR_ADIDAS;
          case 'ikea': return AVATAR_IKEA;
          case 'leroymerlin': return AVATAR_LEROY;
          case 'playstation': return AVATAR_PLAYSTATION;
          case 'xbox': return AVATAR_XBOX;
          case 'nintendo': return AVATAR_NINTENDO;
          case 'zalando': return AVATAR_ZALANDO;
          case 'worten': return AVATAR_WORTEN;
          case 'fnac': return AVATAR_FNAC;
          case 'carrefour': return AVATAR_CARREFOUR;
          case 'lidl': return AVATAR_LIDL;
          case 'casadellibro': return AVATAR_CASADELLIBRO;
          case 'game': return AVATAR_GAME;
          case 'eltenedor': return AVATAR_ELTENEDOR;
          case 'mango': return AVATAR_MANGO;
          case 'primark': return AVATAR_PRIMARK;
        }
      }
    }
    
    // Generar un avatar con las iniciales de la tienda
    const storeInitials = storeName.replace(/[^A-Za-z0-9\s]/g, '')
                                 .split(' ')
                                 .filter(word => word.length > 0)
                                 .map(word => word[0].toUpperCase())
                                 .join('')
                                 .substring(0, 2);
    
    if (storeInitials) {
      return `https://via.placeholder.com/200x200/6f7381/ffffff?text=${encodeURIComponent(storeInitials)}`;
    }
    
    return AVATAR_DEFAULT;
  }

  // 1. Si hay una URL válida y parece ser una imagen real, usarla
  if (src && typeof src === 'string' && src.trim() && 
      !src.includes('undefined') && !src.includes('null') && src !== 'undefined' &&
      (src.startsWith('http') || src.startsWith('https') || src.startsWith('data:'))) {
    
    // Si la URL es de un CDN confiable o formato de imagen conocido
    if (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || 
        src.includes('.webp') || src.includes('.svg') || 
        src.includes('cloudfront.net') || src.includes('cdn') || 
        src.includes('images.unsplash.com') || 
        src.includes('images-amazon') || src.includes('media-amazon')) {
      return src;
    }
  }
  
  // 2. Si es un producto con nombre, intentar identificar qué tipo de producto es de forma avanzada
  if (product || alt) {
    const productName = (product && (product.titulo || product.nombre || product.title || product.name)) || alt;
    if (productName && typeof productName === 'string') {
      const nameLower = productName.toLowerCase();
      
      // Electrónica - búsqueda avanzada por palabras clave
      for (const [type, keywords] of Object.entries(electronicsKeywords)) {
        if (keywords.some(keyword => nameLower.includes(keyword))) {
          switch(type) {
            case 'mobile': return IMAGEN_MOVIL;
            case 'laptop': return IMAGEN_PORTATIL;
            case 'tablet': return IMAGEN_TABLET;
            case 'headphones': return IMAGEN_AURICULARES;
            case 'camera': return IMAGEN_CAMARA;
            case 'tv': return IMAGEN_SMART_TV;
            case 'speaker': return IMAGEN_ALTAVOCES;
            case 'monitor': return IMAGEN_MONITOR;
            case 'wearable': return IMAGEN_WEARABLE;
          }
        }
      }
      
      // Moda - búsqueda avanzada por palabras clave
      for (const [type, keywords] of Object.entries(fashionKeywords)) {
        if (keywords.some(keyword => nameLower.includes(keyword))) {
          switch(type) {
            case 'shoes': return IMAGEN_ZAPATILLAS;
            case 'clothes': return IMAGEN_ROPA;
            case 'accessories': return IMAGEN_ACCESORIOS;
            case 'watches': return IMAGEN_RELOJ;
            case 'bags': return IMAGEN_BOLSO;
            case 'glasses': return IMAGEN_GAFAS;
            case 'jewelry': return IMAGEN_JOYERIA;
          }
        }
      }
      
      // Hogar - búsqueda avanzada por palabras clave
      for (const [type, keywords] of Object.entries(homeKeywords)) {
        if (keywords.some(keyword => nameLower.includes(keyword))) {
          switch(type) {
            case 'furniture': return IMAGEN_MUEBLES;
            case 'kitchen': return IMAGEN_COCINA;
            case 'decoration': return IMAGEN_DECORACION;
            case 'garden': return IMAGEN_JARDIN;
            case 'appliances': return IMAGEN_ELECTRODOMESTICOS;
            case 'lighting': return IMAGEN_ILUMINACION;
          }
        }
      }
      
      // Videojuegos - búsqueda avanzada por palabras clave
      for (const [type, keywords] of Object.entries(gamingKeywords)) {
        if (keywords.some(keyword => nameLower.includes(keyword))) {
          switch(type) {
            case 'console': 
              if (nameLower.includes('ps5') || nameLower.includes('playstation 5')) return IMAGEN_PS5;
              if (nameLower.includes('xbox')) return IMAGEN_XBOX;
              if (nameLower.includes('nintendo') || nameLower.includes('switch')) return IMAGEN_NINTENDO;
              return IMAGEN_CONSOLAS;
            case 'games': return IMAGEN_JUEGOS;
            case 'accessories': return IMAGEN_ACCESORIOS_GAMING;
            case 'pcgaming': return IMAGEN_PC_GAMING;
          }
        }
      }
      
      // Deportes - búsqueda avanzada por palabras clave
      for (const [type, keywords] of Object.entries(sportsKeywords)) {
        if (keywords.some(keyword => nameLower.includes(keyword))) {
          switch(type) {
            case 'fitness': return IMAGEN_FITNESS;
            case 'football': return IMAGEN_FUTBOL;
            case 'bike': return IMAGEN_BICICLETAS;
            case 'running': return IMAGEN_RUNNING;
            case 'basketball': return IMAGEN_BALONCESTO;
            case 'tennis': return IMAGEN_TENNIS;
            case 'swimming': return IMAGEN_NATACION;
          }
        }
      }
      
      // Viajes - búsqueda avanzada por palabras clave
      for (const [type, keywords] of Object.entries(travelKeywords)) {
        if (keywords.some(keyword => nameLower.includes(keyword))) {
          switch(type) {
            case 'hotels': return IMAGEN_HOTELES;
            case 'flights': return IMAGEN_VUELOS;
            case 'luggage': return IMAGEN_MALETAS;
            case 'beach': return IMAGEN_PLAYA;
            case 'mountain': return IMAGEN_MONTANA;
            case 'city': return IMAGEN_CIUDADES;
          }
        }
      }
    }
  }
  
  // 3. Si es una tienda específica, usar avatar de tienda (búsqueda avanzada)
  if (storeName && typeof storeName === 'string') {
    const storeNameLower = storeName.toLowerCase();
    
    for (const [store, variants] of Object.entries(storeMap)) {
      if (variants.some(variant => storeNameLower.includes(variant))) {
        switch(store) {
          case 'amazon': return AVATAR_AMAZON;
          case 'elcorteingles': return AVATAR_ECI;
          case 'pccomponentes': return AVATAR_PCCOMPONENTES;
          case 'decathlon': return AVATAR_DECATHLON;
          case 'mediamarkt': return AVATAR_MEDIAMARKT;
          case 'aliexpress': return AVATAR_ALIEXPRESS;
          case 'booking': return AVATAR_BOOKING;
          case 'nike': return AVATAR_NIKE;
          case 'apple': return AVATAR_APPLE;
          case 'samsung': return AVATAR_SAMSUNG;
          case 'zara': return AVATAR_ZARA;
          case 'adidas': return AVATAR_ADIDAS;
          case 'ikea': return AVATAR_IKEA;
          case 'leroymerlin': return AVATAR_LEROY;
          case 'playstation': return AVATAR_PLAYSTATION;
          case 'xbox': return AVATAR_XBOX;
          case 'nintendo': return AVATAR_NINTENDO;
          case 'zalando': return AVATAR_ZALANDO;
          case 'worten': return AVATAR_WORTEN;
          case 'fnac': return AVATAR_FNAC;
          case 'carrefour': return AVATAR_CARREFOUR;
          case 'lidl': return AVATAR_LIDL;
          case 'casadellibro': return AVATAR_CASADELLIBRO;
          case 'game': return AVATAR_GAME;
          case 'eltenedor': return AVATAR_ELTENEDOR;
          case 'mango': return AVATAR_MANGO;
          case 'primark': return AVATAR_PRIMARK;
        }
      }
    }
    
    // Generar un avatar con las iniciales de la tienda si no está en la lista
    if (storeNameLower) {
      const storeInitials = storeName.replace(/[^A-Za-z0-9\s]/g, '')
                                   .split(' ')
                                   .filter(word => word.length > 0)
                                   .map(word => word[0].toUpperCase())
                                   .join('')
                                   .substring(0, 2);
      
      if (storeInitials) {
        return `https://via.placeholder.com/200x200/6f7381/ffffff?text=${encodeURIComponent(storeInitials)}`;
      }
    }
    
    return AVATAR_DEFAULT;
  }
    
  // 3. Si hay categoría específica, usar imagen de categoría
  if (categoryId) {
    const catId = typeof categoryId === 'number' ? categoryId : 
                 typeof categoryId === 'string' ? parseInt(categoryId, 10) : null;
    
    if (catId && catId >= 1 && catId <= 6) {
      // Para cada categoría específica, intentamos ser más precisos
      if (catId === 1) { // Electrónica
        if (alt) {
          const altLower = alt.toLowerCase();
          if (altLower.includes('móvil') || altLower.includes('phone') || altLower.includes('smartphone')) 
            return IMAGEN_MOVIL;
          if (altLower.includes('portátil') || altLower.includes('laptop') || altLower.includes('notebook')) 
            return IMAGEN_PORTATIL;
          if (altLower.includes('tablet') || altLower.includes('ipad')) 
            return IMAGEN_TABLET;
          if (altLower.includes('auricular') || altLower.includes('headphone'))
            return IMAGEN_AURICULARES;
          if (altLower.includes('tv') || altLower.includes('televisor'))
            return IMAGEN_SMART_TV;
        }
      }
      else if (catId === 2) { // Moda
        if (alt) {
          const altLower = alt.toLowerCase();
          if (altLower.includes('zapatilla') || altLower.includes('calzado'))
            return IMAGEN_ZAPATILLAS;
          if (altLower.includes('camiseta') || altLower.includes('pantalón') || altLower.includes('ropa'))
            return IMAGEN_ROPA;
          if (altLower.includes('bolso') || altLower.includes('mochila'))
            return IMAGEN_BOLSO;
        }
      }
      else if (catId === 4) { // Videojuegos
        if (alt) {
          const altLower = alt.toLowerCase();
          if (altLower.includes('ps5') || altLower.includes('playstation'))
            return IMAGEN_PS5;
          if (altLower.includes('xbox'))
            return IMAGEN_XBOX;
          if (altLower.includes('nintendo') || altLower.includes('switch'))
            return IMAGEN_NINTENDO;
          if (altLower.includes('juego') || altLower.includes('game'))
            return IMAGEN_JUEGOS;
        }
      }

      // Si no pudimos ser más específicos, al menos usamos la categoría correcta
      return categoryFallbackImages[catId];
    }
    
    // Si la categoría está como texto en lugar de ID
    if (typeof categoryId === 'string') {
      const catLower = categoryId.toLowerCase();
      if (catLower.includes('electro') || catLower.includes('tecnolog')) 
        return IMAGEN_ELECTRONICA;
      if (catLower.includes('moda') || catLower.includes('ropa')) 
        return IMAGEN_MODA;
      if (catLower.includes('hogar') || catLower.includes('casa') || catLower.includes('mueble')) 
        return IMAGEN_HOGAR;
      if (catLower.includes('juego') || catLower.includes('game') || catLower.includes('consola')) 
        return IMAGEN_VIDEOJUEGOS;
      if (catLower.includes('deport') || catLower.includes('sport') || catLower.includes('fitnes')) 
        return IMAGEN_DEPORTES;
      if (catLower.includes('viaje') || catLower.includes('travel') || catLower.includes('vacation')) 
        return IMAGEN_VIAJES;
    }
  }
  
  // 5. Usar el título/alt para determinar una categoría
  if (alt && typeof alt === 'string') {
    const altLower = alt.toLowerCase();
    if (altLower.includes('electro') || altLower.includes('phone') || altLower.includes('móvil') || 
        altLower.includes('laptop') || altLower.includes('tablet')) 
      return IMAGEN_ELECTRONICA;
      
    if (altLower.includes('ropa') || altLower.includes('zapato') || altLower.includes('moda') || 
        altLower.includes('vestido') || altLower.includes('camisa'))
      return IMAGEN_MODA;
      
    if (altLower.includes('mueble') || altLower.includes('sofa') || altLower.includes('mesa') || 
        altLower.includes('silla') || altLower.includes('hogar'))
      return IMAGEN_HOGAR;
      
    if (altLower.includes('juego') || altLower.includes('game') || altLower.includes('ps5') || 
        altLower.includes('xbox') || altLower.includes('nintendo'))
      return IMAGEN_VIDEOJUEGOS;
      
    if (altLower.includes('deport') || altLower.includes('balón') || altLower.includes('zapatillas') || 
        altLower.includes('bicicleta') || altLower.includes('fitnes'))
      return IMAGEN_DEPORTES;
      
    if (altLower.includes('viaje') || altLower.includes('vuelo') || altLower.includes('hotel') || 
        altLower.includes('vacacion'))
      return IMAGEN_VIAJES;
  }
  
  // 6. Por defecto, imagen genérica
  return IMAGEN_GENERICA;
};

/**
 * Obtener imagen de fallback por categoría (requerido por otros componentes)
 */
export const getFallbackImageByCategory = (categoryId) => {
  if (!categoryId) {
    return categoryFallbackImages.default;
  }
  
  // Soportar tanto números como strings
  const catId = typeof categoryId === 'number' ? categoryId : 
               typeof categoryId === 'string' ? parseInt(categoryId, 10) : null;
  
  if (catId && catId >= 1 && catId <= 6) {
    return categoryFallbackImages[catId];
  }
  
  // Intentar interpretar el texto de la categoría
  if (typeof categoryId === 'string') {
    const catLower = categoryId.toLowerCase();
    if (catLower.includes('electro')) return IMAGEN_ELECTRONICA;
    if (catLower.includes('moda')) return IMAGEN_MODA;
    if (catLower.includes('hogar')) return IMAGEN_HOGAR;
    if (catLower.includes('juego')) return IMAGEN_VIDEOJUEGOS;
    if (catLower.includes('deport')) return IMAGEN_DEPORTES;
    if (catLower.includes('viaje')) return IMAGEN_VIAJES;
  }  
  
  return categoryFallbackImages.default;
};

/**
 * Obtener imagen de producto con fallback automático basado en información del producto
 */
export const getProductFallbackImage = (product) => {
  if (!product) return categoryFallbackImages.default;
  
  // Si es un ID numérico de categoría
  if (typeof product === 'number') {
    return getFallbackImageByCategory(product);
  }
  
  // Si es un objeto producto completo
  if (typeof product === 'object') {
    // Buscar ID de categoría en diferentes formatos posibles
    const categoryId = product.categoria_id || product.categoryId || 
                       (product.categoria && product.categoria.id) ||
                       product.category_id;
    
    if (categoryId) {
      return getFallbackImageByCategory(categoryId);
    }
    
    // Intentar usar el nombre o título para determinar la categoría
    const productName = product.nombre || product.name || product.titulo || product.title || '';
    if (productName) {
      // Búsqueda avanzada por palabras clave reutilizando la lógica de getImagenBruta
      return getImagenBruta(null, productName, null, null, product);
    }
  }
  
  return categoryFallbackImages.default;
};

/**
 * Limpiar y validar URL de imagen
 */
export const sanitizeImageUrl = (url, fallback = '', categoryId = null, productName = '') => {
  // Si no hay URL o es inválida, usar fallback
  if (!url || url === 'undefined' || url === 'null' || typeof url !== 'string') {
    if (categoryId) {
      return getFallbackImageByCategory(categoryId);
    }
    return fallback || categoryFallbackImages.default;
  }
  
  // Limpiar la URL
  const cleanUrl = url.trim();
  if (!cleanUrl || cleanUrl.includes('undefined') || cleanUrl.includes('null')) {
    if (categoryId) {
      return getFallbackImageByCategory(categoryId);
    }
    return fallback || categoryFallbackImages.default;
  }
  
  // Comprobar si la URL es de imgur y es válida
  if (cleanUrl.includes('imgur.com')) {
    // Si la URL de imgur no apunta directamente a una imagen, intentar arreglarla
    if (!cleanUrl.endsWith('.jpg') && !cleanUrl.endsWith('.png') && !cleanUrl.endsWith('.gif')) {
      // Extraer el ID de la imagen de imgur
      const match = cleanUrl.match(/imgur\.com\/([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        return `https://i.imgur.com/${match[1]}.jpg`;
      }
    }
  }
  
  // Arreglar URLs de Amazon y otras tiendas
  if (cleanUrl.includes('amazon') && cleanUrl.includes('images')) {
    // Asegurarnos de que la URL incluye https
    if (!cleanUrl.startsWith('https://')) {
      return `https://${cleanUrl.replace('http://', '')}`;
    }
  }
  
  // Arreglar URLs que no empiezan con http
  if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('data:') && !cleanUrl.startsWith('/')) {
    return `https://${cleanUrl}`;
  }
  
  // Asegurarse que las URLs relativas apuntan a algo conocido
  if (cleanUrl.startsWith('/')) {
    // Para imágenes locales en public
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    return `${baseUrl}${cleanUrl}`;
  }
  
  return cleanUrl;
};

/**
 * Generar imagen placeholder local
 */
export const generatePlaceholderImage = (text = 'IMAGEN', color = '#e5e7eb') => {
  const safeText = text.replace(/[<>&"']/g, '');
  const svg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">${safeText}</text>
  </svg>`;
  
  try {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  } catch (e) {
    console.warn('[generatePlaceholderImage] Error:', e);
    return IMAGEN_GENERICA;
  }
};

/**
 * Obtener información de categoría
 */
export const getCategoryInfo = (categoryId) => {
  const categoryInfo = {
    1: { name: 'Electrónica', color: categoryColors[1], icon: '💻' },
    2: { name: 'Moda', color: categoryColors[2], icon: '👕' },
    3: { name: 'Hogar', color: categoryColors[3], icon: '🏠' },
    4: { name: 'Videojuegos', color: categoryColors[4], icon: '🎮' },
    5: { name: 'Deportes', color: categoryColors[5], icon: '⚽' },
    6: { name: 'Viajes', color: categoryColors[6], icon: '✈️' }
  };
  
  return categoryInfo[categoryId] || {
    name: 'General',
    color: '#6b7280',
    icon: '🏷️'
  };
};

/**
 * FUNCIÓN DE EMERGENCIA: Genera imagen por palabras clave del producto
 */
export const generarImagenDinamica = (producto) => {
  if (!producto) return IMAGEN_GENERICA;
  
  // Extraer datos del producto
  let nombre = '';
  let categoria = '';
  let precio = '';
  let tienda = '';
  
  if (typeof producto === 'string') {
    nombre = producto;
  } else if (typeof producto === 'object') {
    nombre = producto.titulo || producto.nombre || producto.title || producto.name || '';
    categoria = producto.categoria_id || producto.categoryId || 
                (producto.categoria && (producto.categoria.id || producto.categoria.nombre)) || '';
    precio = producto.precio || producto.precio_oferta || producto.price || 
             producto.precio_actual || producto.precio_original || '';
    tienda = producto.tienda || producto.store_name || '';
  }
  
  // Primero intentar encontrar una imagen específica basada en el nombre del producto
  if (nombre) {
    const nameLower = nombre.toLowerCase();
    
    // Electrónica
    for (const [type, keywords] of Object.entries(electronicsKeywords)) {
      if (keywords.some(keyword => nameLower.includes(keyword))) {
        switch(type) {
          case 'mobile': return IMAGEN_MOVIL;
          case 'laptop': return IMAGEN_PORTATIL;
          case 'tablet': return IMAGEN_TABLET;
          case 'headphones': return IMAGEN_AURICULARES;
          case 'camera': return IMAGEN_CAMARA;
          case 'tv': return IMAGEN_SMART_TV;
          case 'speaker': return IMAGEN_ALTAVOCES;
          case 'monitor': return IMAGEN_MONITOR;
          case 'wearable': return IMAGEN_WEARABLE;
        }
      }
    }
    
    // Moda
    for (const [type, keywords] of Object.entries(fashionKeywords)) {
      if (keywords.some(keyword => nameLower.includes(keyword))) {
        switch(type) {
          case 'shoes': return IMAGEN_ZAPATILLAS;
          case 'clothes': return IMAGEN_ROPA;
          case 'accessories': return IMAGEN_ACCESORIOS;
          case 'watches': return IMAGEN_RELOJ;
          case 'bags': return IMAGEN_BOLSO;
          case 'glasses': return IMAGEN_GAFAS;
          case 'jewelry': return IMAGEN_JOYERIA;
        }
      }
    }
    
    // Videojuegos
    for (const [type, keywords] of Object.entries(gamingKeywords)) {
      if (keywords.some(keyword => nameLower.includes(keyword))) {
        switch(type) {
          case 'console': 
            if (nameLower.includes('ps5') || nameLower.includes('playstation 5')) return IMAGEN_PS5;
            if (nameLower.includes('xbox')) return IMAGEN_XBOX;
            if (nameLower.includes('nintendo') || nameLower.includes('switch')) return IMAGEN_NINTENDO;
            return IMAGEN_CONSOLAS;
          case 'games': return IMAGEN_JUEGOS;
          case 'accessories': return IMAGEN_ACCESORIOS_GAMING;
          case 'pcgaming': return IMAGEN_PC_GAMING;
        }
      }
    }
  }

  // Determinar color basado en categoría
  let colorFondo = '4f4f4f'; // Gris por defecto
  
  if (categoria) {
    if (typeof categoria === 'number' || !isNaN(parseInt(categoria))) {
      const catId = parseInt(categoria);
      switch(catId) {
        case 1: colorFondo = '3983f6'; break; // Electrónica
        case 2: colorFondo = 'ec4899'; break; // Moda
        case 3: colorFondo = '10b981'; break; // Hogar
        case 4: colorFondo = '8b5cf6'; break; // Videojuegos
        case 5: colorFondo = 'f59e0b'; break; // Deportes
        case 6: colorFondo = '06b6d4'; break; // Viajes
      }
    }
  }
  
  // Determinar si tenemos suficiente información para la imagen
  if (!nombre && !categoria && !tienda) {
    return IMAGEN_GENERICA; // Si no hay información, usar imagen genérica
  }
  
  // Preparar texto para la imagen
  let textoImagen = '';
  
  // Usar tienda si existe
  if (tienda) textoImagen += tienda + ' - ';
  
  // Añadir título acortado
  if (nombre) {
    textoImagen += nombre.length > 20 ? nombre.substring(0, 20) + '...' : nombre;
  } else {
    textoImagen += 'OFERTA';
  }
  
  // Añadir precio si existe
  if (precio) {
    const precioFormateado = typeof precio === 'number' ? 
      precio.toFixed(2) + '€' : typeof precio === 'string' ? 
      (precio.includes('€') ? precio : precio + '€') : '';
      
    if (precioFormateado) textoImagen += ` | ${precioFormateado}`;
  }
  
  // Generar URL de placeholder.com con texto del producto
  return `https://via.placeholder.com/300x200/${colorFondo}/ffffff?text=${encodeURIComponent(textoImagen)}`;
};

/**
 * FUNCIÓN FINAL DE EMERGENCIA: SI TODO FALLA, USAR ESTA
 */
export const imagenDeEmergencia = (producto) => {
  if (producto) {
    return generarImagenDinamica(producto);
  }
  return IMAGEN_GENERICA;
};

// Exportar todo por si acaso
export default {
  getImagenBruta,
  getFallbackImageByCategory,
  getProductFallbackImage,
  sanitizeImageUrl,
  generatePlaceholderImage,
  getCategoryInfo,
  categoryFallbackImages,
  categoryColors,
  imagenDeEmergencia
};
