// Simple UUID generator function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Utility functions
const generateId = () => generateUUID();
const simulateDelay = async (min = 300, max = 800) => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
};

// Basic data sets
const users = [
  { id: 'user1', username: 'Alice', email: 'alice@example.com', profilePicture: 'https://via.placeholder.com/150/FFC0CB/000000?Text=A', role: 'user', createdAt: new Date().toISOString() },
  { id: 'user2', username: 'Bob', email: 'bob@example.com', profilePicture: 'https://via.placeholder.com/150/ADD8E6/000000?Text=B', role: 'user', createdAt: new Date().toISOString() },
  { id: 'adminUser', username: 'AdminBoss', email: 'admin@example.com', profilePicture: 'https://via.placeholder.com/150/D3D3D3/000000?Text=Adm', role: 'admin', createdAt: new Date().toISOString() }
];

const categorias = [
  { id: 'electronica', nombre: 'Electrónica', icono: 'FaLaptop', slug: 'electronica', description: 'Ofertas en productos electrónicos.' },
  { id: 'moda', nombre: 'Moda', icono: 'FaTshirt', slug: 'moda', description: 'Las últimas tendencias en moda.' },
  { id: 'hogar', nombre: 'Hogar', icono: 'FaHome', slug: 'hogar', description: 'Todo para tu hogar.' },
  { id: 'videojuegos', nombre: 'Videojuegos', icono: 'FaGamepad', slug: 'videojuegos', description: 'Ofertas en juegos y consolas.' },
  { id: 'deportes', nombre: 'Deportes', icono: 'FaFutbol', slug: 'deportes', description: 'Equipamiento y ropa deportiva.' },
  { id: 'libros', nombre: 'Libros', icono: 'FaBook', slug: 'libros', description: 'Best sellers y novedades literarias.' },
  { id: 'juguetes', nombre: 'Juguetes', icono: 'FaChild', slug: 'juguetes', description: 'Juguetes para todas las edades.' },
  { id: 'alimentacion', nombre: 'Alimentación', icono: 'FaAppleAlt', slug: 'alimentacion', description: 'Ofertas en supermercado y productos gourmet.' },
  { id: 'viajes', nombre: 'Viajes', icono: 'FaPlane', slug: 'viajes', description: 'Descuentos en vuelos, hoteles y paquetes vacacionales.' },
  { id: 'salud_belleza', nombre: 'Salud y Belleza', icono: 'FaHeartbeat', slug: 'salud-belleza', description: 'Productos de cosmética, cuidado personal y salud.' },
  { id: 'bricolaje', nombre: 'Bricolaje', icono: 'FaTools', slug: 'bricolaje', description: 'Herramientas y materiales para tus proyectos.' },
  { id: 'mascotas', nombre: 'Mascotas', icono: 'FaPaw', slug: 'mascotas', description: 'Todo para tus compañeros animales.' },
  { id: 'cursos_formacion', nombre: 'Cursos y Formación', icono: 'FaGraduationCap', slug: 'cursos-formacion', description: 'Descuentos en cursos online y presenciales.' },
  { id: 'automocion', nombre: 'Automoción', icono: 'FaCar', slug: 'automocion', description: 'Accesorios y productos para tu vehículo.' }
];

const tiendas = [
  { id: 'amazon', nombre: 'Amazon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', website: 'https://www.amazon.es', rating: 4.5, totalOfertas: 120 },
  { id: 'elcorteingles', nombre: 'El Corte Inglés', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/El_Corte_Ingl%C3%A9s_Logo.svg/1200px-El_Corte_Ingl%C3%A9s_Logo.svg.png', website: 'https://www.elcorteingles.es', rating: 4.2, totalOfertas: 85 },
  { id: 'pccomponentes', nombre: 'PcComponentes', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/PcComponentes_logo.svg/1200px-PcComponentes_logo.svg.png', website: 'https://www.pccomponentes.com', rating: 4.7, totalOfertas: 200 },
  { id: 'decathlon', nombre: 'Decathlon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Decathlon_logo.svg/1200px-Decathlon_logo.svg.png', website: 'https://www.decathlon.es', rating: 4.6, totalOfertas: 150 },
  { id: 'casadellibro', nombre: 'Casa del Libro', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Casa_del_Libro_logo.svg/1200px-Casa_del_Libro_logo.svg.png', website: 'https://www.casadellibro.com', rating: 4.3, totalOfertas: 90 },
  { id: 'toysrus', nombre: 'Toys "R" Us', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Toys_%22R%22_Us_logo.svg/1200px-Toys_%22R%22_Us_logo.svg.png', website: 'https://www.toysrus.es', rating: 4.1, totalOfertas: 70 },
  { id: 'carrefour', nombre: 'Carrefour', logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Logo_Carrefour.svg/1200px-Logo_Carrefour.svg.png', website: 'https://www.carrefour.es', rating: 4.0, totalOfertas: 250 },
  { id: 'booking', nombre: 'Booking.com', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/1200px-Booking.com_logo.svg.png', website: 'https://www.booking.com', rating: 4.8, totalOfertas: 500 },
  { id: 'sephora', nombre: 'Sephora', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Sephora_logo.svg/1200px-Sephora_logo.svg.png', website: 'https://www.sephora.es', rating: 4.4, totalOfertas: 110 },
  { id: 'leroymerlin', nombre: 'Leroy Merlin', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Leroy_Merlin.svg/1200px-Leroy_Merlin.svg.png', website: 'https://www.leroymerlin.es', rating: 4.3, totalOfertas: 130 },
  { id: 'zooplus', nombre: 'Zooplus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Zooplus_logo.svg/1200px-Zooplus_logo.svg.png', website: 'https://www.zooplus.es', rating: 4.6, totalOfertas: 95 },
  { id: 'udemy', nombre: 'Udemy', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/1200px-Udemy_logo.svg.png', website: 'https://www.udemy.com', rating: 4.5, totalOfertas: 1000 },
  { id: 'norauto', nombre: 'Norauto', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Norauto_logo.svg/1200px-Norauto_logo.svg.png', website: 'https://www.norauto.es', rating: 4.2, totalOfertas: 60 }
];

const ofertas = [
  {
    id: 'oferta-iphone-15-pro-max-titanio',
    titulo: 'Oferta Especial: iPhone 15 Pro Max 256GB Titanio',
    slug: 'oferta-iphone-15-pro-max-titanio',
    productoId: 'iphone-15-pro-max-titanio',
    tiendaId: 'amazon',
    precio_original: 1499,
    precio_oferta: 1399,
    fecha_inicio: new Date('2024-05-15T00:00:00Z').toISOString(),
    fecha_fin: new Date('2024-06-15T23:59:59Z').toISOString(),
    descripcion: 'Descuento exclusivo en el nuevo iPhone 15 Pro Max. El smartphone más potente de Apple con diseño en titanio y chip A17 Pro.',
    descripcion_larga: `El iPhone 15 Pro Max representa la cima de la innovación de Apple, ofreciendo una experiencia premium sin igual:

• Pantalla Super Retina XDR OLED de 6.7" con ProMotion y Always-On
• Diseño en titanio de grado aeroespacial, más ligero y resistente
• Chip A17 Pro con GPU de 6 núcleos para un rendimiento extraordinario
• Sistema de cámara pro de 48MP + 12MP + 12MP con zoom óptico 5x
• Grabación en formato ProRes y modo Acción
• Face ID de última generación
• Conectividad USB-C con velocidades Thunderbolt
• iOS 17 con nuevas funciones de personalización
• Batería de larga duración con carga rápida y MagSafe

Incluye:
- iPhone 15 Pro Max
- Cable USB-C
- Documentación
- Herramienta de expulsión de SIM

¡Aprovecha esta oferta exclusiva por tiempo limitado!`,
    link_oferta: 'https://www.amazon.es/dp/example_iphone15',
    categoriaId: 'electronica',
    tags: ['smartphone', 'apple', 'tecnologia', 'iphone15', 'titanio', 'camara-48mp', 'usb-c'],
    imageUrl: 'https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_inline.jpg.large.jpg',
    likes: 250,
    dislikes: 10,
    commentsCount: 45,
    isHot: true,
    postedBy: 'user1',
    createdAt: new Date('2024-05-15T08:00:00Z').toISOString(),
    updatedAt: new Date('2024-05-20T10:00:00Z').toISOString(),
    clicks: 1250,
    discountPercentage: Math.round(((1499 - 1399) / 1499) * 100),
    rating: 4.8,
    stock: 50,
    shippingInfo: 'Envío gratis en 24/48h',
    couponCode: 'IPHONE100OFF',
    userVotes: { 'user1': 1, 'user2': 1 },
    approved: true,
    communityScore: 240,
    dealType: 'Descuento Directo',
    availability: 'Disponible',
    region: 'ES',
    source: 'Web Oficial Amazon'
  },
  {
    id: 'oferta-macbook-air-m3',
    titulo: 'MacBook Air M3 13.6" 8GB RAM 256GB SSD - Ahorra 150€',
    slug: 'oferta-macbook-air-m3',
    productoId: 'macbook-air-m3',
    tiendaId: 'pccomponentes',
    precio_original: 1299,
    precio_oferta: 1149,
    fecha_inicio: new Date('2024-05-10T00:00:00Z').toISOString(),
    fecha_fin: new Date('2024-06-10T23:59:59Z').toISOString(),
    descripcion: 'El nuevo MacBook Air con chip M3 y una espectacular pantalla Liquid Retina. Perfecto para productividad y creatividad.',
    descripcion_larga: `El nuevo MacBook Air M3 revoluciona lo que puedes esperar de un portátil ultraligero:

• Pantalla Liquid Retina de 13.6" con 500 nits de brillo
• Chip M3 con CPU de 8 núcleos y GPU de 8 núcleos
• 8GB de memoria unificada
• SSD de 256GB de alta velocidad
• Magic Keyboard retroiluminado con Touch ID
• Sistema de sonido de cuatro altavoces con audio espacial
• Dos puertos Thunderbolt/USB 4
• Hasta 18 horas de autonomía
• Cámara FaceTime HD 1080p
• Tres micrófonos en array de calidad profesional
• WiFi 6E y Bluetooth 5.3

Disponible en:
- Medianoche
- Plata
- Gris espacial
- Luz estelar

Incluye:
- MacBook Air M3
- Adaptador de corriente USB-C de 35W
- Cable de carga USB-C

¡El portátil perfecto para estudiantes y profesionales!`,
    link_oferta: 'https://www.pccomponentes.com/apple-macbook-air-m3-13-6-8gb-256gb-ssd-gris-espacial',
    categoriaId: 'electronica',
    tags: ['portatil', 'apple', 'macbook', 'm3', 'oferta', 'ssd', 'ligero'],
    imageUrl: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1707414202086',
    likes: 180,
    dislikes: 5,
    commentsCount: 30,
    isHot: true,
    postedBy: 'user2',
    createdAt: new Date('2024-05-10T09:30:00Z').toISOString(),
    updatedAt: new Date('2024-05-18T11:00:00Z').toISOString(),
    clicks: 980,
    discountPercentage: Math.round(((1299 - 1149) / 1299) * 100),
    rating: 4.9,
    stock: 30,
    shippingInfo: 'Envío rápido',
    couponCode: null,
    userVotes: { 'user1': 1 },
    approved: true,
    communityScore: 175,
    dealType: 'Descuento Directo',
    availability: 'Disponible',
    region: 'ES',
    source: 'PcComponentes'
  },
  // Nuevas ofertas
  {
    id: 'oferta-samsung-galaxy-s24',
    titulo: 'Samsung Galaxy S24 Ultra 512GB - Descuento Lanzamiento',
    slug: 'oferta-samsung-galaxy-s24-ultra',
    productoId: 'samsung-galaxy-s24-ultra',
    tiendaId: 'elcorteingles',
    precio_original: 1589,
    precio_oferta: 1459,
    fecha_inicio: new Date('2025-05-01T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-06-01T23:59:59Z').toISOString(),
    descripcion: 'El nuevo buque insignia de Samsung con IA integrada, cámara revolucionaria de 200MP y S Pen incluido.',
    descripcion_larga: `El Samsung Galaxy S24 Ultra redefine los límites de la innovación móvil:

• Pantalla Dynamic AMOLED 2X de 6.8" QHD+ 
  - 120Hz adaptativo
  - 2600 nits de brillo máximo
  - Gorilla Glass Armor

• Sistema de cámaras profesional:
  - Principal: 200MP con tecnología Adaptive Pixel
  - Ultra gran angular: 12MP
  - Teleobjetivo 1: 10MP (zoom óptico 3x)
  - Teleobjetivo 2: 50MP (zoom óptico 5x)
  - Frontal: 12MP con enfoque automático

• Rendimiento extraordinario:
  - Snapdragon 8 Gen 3 for Galaxy
  - 12GB RAM LPDDR5X
  - 512GB almacenamiento UFS 4.0
  - Batería 5000mAh con carga rápida 45W

• Galaxy AI integrada:
  - Traducción en vivo de llamadas y mensajes
  - Circle to Search con Google
  - Edición generativa de fotos
  - Asistente de notas con IA

• Características premium:
  - Marco de titanio resistente
  - S Pen integrado con latencia ultrabaja
  - Certificación IP68 agua/polvo
  - Samsung DeX

Colores disponibles:
- Titanium Black
- Titanium Gray
- Titanium Violet
- Titanium Yellow

Incluye:
- Galaxy S24 Ultra
- S Pen
- Cable USB-C
- Herramienta de expulsión
- Guía de inicio rápido

¡Reserva ahora y llévate unos Galaxy Buds2 Pro de regalo!`,
    link_oferta: 'https://www.elcorteingles.es/electronica/A12345678-samsung-galaxy-s24-ultra-512gb/',
    categoriaId: 'electronica',
    tags: ['smartphone', 'samsung', 'galaxy s24', 'android', 'tecnologia', 'ia', 'camara-200mp', 's-pen'],
    imageUrl: 'https://images.samsung.com/es/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-kv.jpg',
    likes: 320,
    dislikes: 8,
    commentsCount: 60,
    isHot: true,
    postedBy: 'adminUser',
    createdAt: new Date('2025-05-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-15T12:00:00Z').toISOString(),
    clicks: 1800,
    discountPercentage: Math.round(((1589 - 1459) / 1589) * 100),
    rating: 4.9,
    stock: 25,
    shippingInfo: 'Envío gratuito y rápido',
    couponCode: 'S24ULTRA',
    userVotes: { 'user1': 1, 'user2': 1, 'adminUser': 1 },
    approved: true,
    communityScore: 312, // likes - dislikes
    dealType: 'Descuento Directo',
    availability: 'Disponible',
    region: 'ES',
    source: 'El Corte Inglés Web'
  },
  {
    id: 'oferta-zapatillas-running-nike',
    titulo: 'Zapatillas Nike Revolution 7 - 30% Descuento',
    slug: 'oferta-zapatillas-nike-revolution-7',
    productoId: 'nike-revolution-7',
    tiendaId: 'decathlon',
    precio_original: 64.99,
    precio_oferta: 45.49,
    fecha_inicio: new Date('2025-05-10T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-05-25T23:59:59Z').toISOString(),
    descripcion: 'Comodidad y amortiguación para tus carreras diarias. Perfectas para corredores neutros.',
    descripcion_larga: `Las zapatillas Nike Revolution 7 están diseñadas para ofrecerte el máximo confort y soporte en cada paso:

• Amortiguación suave y reactiva para una pisada cómoda
• Parte superior de malla transpirable que se adapta a tu pie
• Suela de goma duradera con patrón de tracción optimizado
• Drop de 10mm que favorece una transición natural del pie
• Peso ligero para una sensación ágil y rápida

Ideal para:
- Corredores neutros que buscan comodidad
- Entrenamiento diario y carreras de media distancia
- Uso en asfalto y pista

Incluye:
- Zapatillas Nike Revolution 7

¡No te pierdas esta oferta exclusiva y mejora tu rendimiento corriendo!`,
    link_oferta: 'https://www.decathlon.es/es/p/zapatillas-running-hombre-nike-revolution-7/_/R-p-MP123XCV',
    categoriaId: 'deportes',
    tags: ['running', 'zapatillas', 'nike', 'deporte', 'calzado'],
    imageUrl: 'https://contents.mediadecathlon.com/p2495906/k$1c1b2a7d7e8f9g0h1i2j3k4l5m6n7o8/sq/zapatillas-running-hombre-nike-revolution-7.jpg',
    likes: 150,
    dislikes: 3,
    commentsCount: 25,
    isHot: false,
    postedBy: 'user1',
    createdAt: new Date('2025-05-10T11:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-12T15:00:00Z').toISOString(),
    clicks: 750,
    discountPercentage: Math.round(((64.99 - 45.49) / 64.99) * 100),
    rating: 4.5,
    stock: 100,
    shippingInfo: 'Recogida en tienda gratis / Envío a domicilio',
    couponCode: null,
    userVotes: { 'user2': 1 },
    approved: true,
    communityScore: 147,
    dealType: 'Porcentaje Descuento',
    availability: 'Disponible',
    region: 'ES',
    source: 'Decathlon Online'
  },
  {
    id: 'oferta-el-problema-de-los-tres-cuerpos',
    titulo: 'Libro: El Problema de los Tres Cuerpos (Trilogía) - Tapa Dura',
    slug: 'oferta-libro-problema-tres-cuerpos',
    productoId: 'libro-problema-tres-cuerpos',
    tiendaId: 'casadellibro',
    precio_original: 22.90,
    precio_oferta: 19.95,
    fecha_inicio: new Date('2025-04-20T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-05-30T23:59:59Z').toISOString(),
    descripcion: 'La aclamada novela de ciencia ficción de Cixin Liu. Sumérgete en un universo épico.',
    descripcion_larga: `El Problema de los Tres Cuerpos es una obra maestra de la ciencia ficción contemporánea, escrita por el autor chino Cixin Liu. Este libro, el primero de la trilogía, ha sido aclamado por su profunda exploración de conceptos científicos y filosóficos complejos.

Características:
- Autor: Cixin Liu, ganador del Premio Hugo
- Editorial: Nova (Ediciones B)
- Formato: Tapa dura con sobrecubierta
- Páginas: 416
- ISBN: 978-8417347329
- Idioma: Español (traducción)

Sinopsis:
Durante la Revolución Cultural China, un grupo de intelectuales es perseguido por el régimen. Uno de ellos, Ye Wenjie, es testigo de la brutalidad del sistema y decide actuar. Años después, se establece contacto con una civilización extraterrestre en peligro, los Trisolarans, que viven en un sistema estelar inestable. La respuesta de la humanidad a este contacto determinará el futuro de la Tierra.

Incluye:
- El Problema de los Tres Cuerpos (Trilogía) - Tapa Dura

¡No te pierdas la oportunidad de leer este bestseller y entender por qué ha fascinado a millones!`,
    link_oferta: 'https://www.casadellibro.com/libro-el-problema-de-los-tres-cuerpos/9788417347329/1234567',
    categoriaId: 'libros',
    tags: ['ciencia ficcion', 'libro', 'cixin liu', 'literatura', 'best seller'],
    imageUrl: 'https://imagessl0.casadellibro.com/a/l/t0/20/9788417347320.jpg',
    likes: 280,
    dislikes: 2,
    commentsCount: 55,
    isHot: true,
    postedBy: 'user2',
    createdAt: new Date('2025-04-20T14:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-05T10:00:00Z').toISOString(),
    clicks: 1100,
    discountPercentage: Math.round(((22.90 - 19.95) / 22.90) * 100),
    rating: 4.9,
    stock: 75,
    shippingInfo: 'Envío gratis para socios',
    couponCode: 'LIBRO10',
    userVotes: { 'user1': 1, 'adminUser': 1 },
    approved: true,
    communityScore: 278,
    dealType: 'Descuento Directo',
    availability: 'Disponible',
    region: 'ES',
    source: 'Casa del Libro Web'
  },
  {
    id: 'oferta-lego-star-wars-halcon-milenario',
    titulo: 'LEGO Star Wars Halcón Milenario (75257) - 20% Dto.',
    slug: 'oferta-lego-star-wars-halcon-milenario-75257',
    productoId: 'lego-halcon-milenario-75257',
    tiendaId: 'toysrus',
    precio_original: 159.99,
    precio_oferta: 127.99,
    fecha_inicio: new Date('2025-05-15T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-06-05T23:59:59Z').toISOString(),
    descripcion: 'Construye y exhibe el icónico Halcón Milenario de Star Wars. Incluye 7 minifiguras.',
    descripcion_larga: `¡Inspira a jóvenes y adultos con este modelo LEGO Star Wars Halcón Milenario (75257)! Esta versión de ladrillo del emblemático carguero corelliano cuenta con numerosos detalles, como torretas defensivas superior e inferior giratorias, 2 cañones automáticos, una rampa descendente y una cabina abatible con espacio para 2 minifiguras. Los paneles superiores también se abren para revelar un detallado interior.

Características del set:
- Marca: LEGO
- Línea: Star Wars
- Número de set: 75257
- Piezas: 1353
- Minifiguras incluidas: 7 (Finn, Chewbacca, Lando Calrissian, Boolio, C-3PO, R2-D2, D-O)
- Edad recomendada: 9+ años
- Dimensiones montado: Aprox. 14cm alto, 44cm largo, 32cm ancho

Incluye:
- LEGO Star Wars Halcón Milenario (75257)
- 7 minifiguras
- Accesorios y armas para las minifiguras
- Instrucciones de montaje

¡No te pierdas esta oportunidad de tener en tus manos una de las naves más icónicas de la historia del cine!`,
    link_oferta: 'https://www.toysrus.es/LEGO-Star-Wars-Halcon-Milenario-75257/p/K1234567',
    categoriaId: 'juguetes',
    tags: ['lego', 'star wars', 'juguete', 'construccion', 'halcon milenario'],
    imageUrl: 'https://www.lego.com/cdn/cs/set/assets/blt25c1a97987679115/75257.png',
    likes: 190,
    dislikes: 7,
    commentsCount: 33,
    isHot: true,
    postedBy: 'user1',
    createdAt: new Date('2025-05-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-18T13:00:00Z').toISOString(),
    clicks: 850,
    discountPercentage: Math.round(((159.99 - 127.99) / 159.99) * 100),
    rating: 4.8,
    stock: 40,
    shippingInfo: 'Envío estándar 3-5 días',
    couponCode: null,
    userVotes: { 'user2': 1 },
    approved: true,
    communityScore: 183,
    dealType: 'Porcentaje Descuento',
    availability: 'Disponible',
    region: 'ES',
    source: 'ToysRUs Online'
  },
  {
    id: 'oferta-aceite-oliva-virgen-extra',
    titulo: 'Aceite de Oliva Virgen Extra 5L - Segunda Unidad 70%',
    slug: 'oferta-aceite-oliva-virgen-extra-5l',
    productoId: 'aove-picual-5l',
    tiendaId: 'carrefour',
    precio_original: 45.00, // Precio por unidad
    precio_oferta: 38.25, // Precio efectivo por unidad si compras 2 (45 + 45*0.3)/2
    fecha_inicio: new Date('2025-05-20T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-06-20T23:59:59Z').toISOString(),
    descripcion: 'Llévate dos garrafas de Aceite de Oliva Virgen Extra de calidad superior y ahorra en la segunda unidad.',
    descripcion_larga: `Aceite de Oliva Virgen Extra de categoría superior obtenido directamente de aceitunas y solo mediante procedimientos mecánicos. Perfecto para una dieta mediterránea saludable, aportando sabor y aroma a todos tus platos. La variedad Picual es conocida por su estabilidad y matices sensoriales.

Características:
- Tipo de aceite: Aceite de Oliva Virgen Extra
- Variedad de aceituna: Picual (o mezcla según marca)
- Origen: España (Andalucía, Jaén, etc. - variable)
- Acidez máxima: < 0.4º (variable, buscar calidad)
- Presentación: Garrafa PET 5 Litros
- Método de extracción: Primera presión en frío (idealmente)

Incluye:
- Aceite de Oliva Virgen Extra 5L

¡Aprovecha esta oferta y disfruta de un producto de calidad superior en tu mesa!`,
    link_oferta: 'https://www.carrefour.es/supermercado/aceite-de-oliva-virgen-extra-picual-5-l/R-prod12345/p',
    categoriaId: 'alimentacion',
    tags: ['aceite de oliva', 'aove', 'alimentacion', 'supermercado', 'oferta 2x1'],
    imageUrl: 'https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202309/27/00118401001648____3__640x640.jpg', // Placeholder image
    likes: 220,
    dislikes: 4,
    commentsCount: 40,
    isHot: true,
    postedBy: 'adminUser',
    createdAt: new Date('2025-05-20T08:30:00Z').toISOString(),
    updatedAt: new Date('2025-05-21T09:00:00Z').toISOString(),
    clicks: 990,
    // Para ofertas tipo "2da unidad al X%", el discountPercentage es más complejo de calcular de forma genérica.
    // Se podría calcular sobre el total de la compra de 2 unidades.
    // (Precio 2 unidades sin oferta - Precio 2 unidades con oferta) / Precio 2 unidades sin oferta
    // (90 - (45 + 45*0.3)) / 90 = (90 - 58.5) / 90 = 31.5 / 90 = 0.35 => 35%
    // O el precio_oferta ya es el precio unitario efectivo.
    discountPercentage: Math.round(((45.00 - 38.25) / 45.00) * 100), // Asumiendo precio_oferta es el efectivo por unidad
    rating: 4.7,
    stock: 200,
    shippingInfo: 'Disponible en tienda y online',
    couponCode: null,
    userVotes: { 'user1': 1, 'user2': 1 },
    approved: true,
    communityScore: 216,
    dealType: 'Segunda Unidad Descuento',
    availability: 'Disponible',
    region: 'ES',
    source: 'Carrefour Folleto'
  },
  {
    id: 'oferta-vuelo-paris-finde',
    titulo: 'Vuelo Ida y Vuelta a París - Fin de Semana desde 79€',
    slug: 'oferta-vuelo-paris-fin-de-semana',
    productoId: 'vuelo-mad-par', // Podría ser un ID genérico para la ruta
    tiendaId: 'booking', // O una aerolínea específica si se prefiere
    precio_original: 120, // Precio medio habitual
    precio_oferta: 79,
    fecha_inicio: new Date('2025-05-18T00:00:00Z').toISOString(), // Fecha de publicación de la oferta
    fecha_fin: new Date('2025-05-28T23:59:59Z').toISOString(), // Hasta cuándo se puede reservar
    descripcion: 'Escápate a París este fin de semana. Plazas limitadas. Salidas desde Madrid/Barcelona.',
    descripcion_larga: `Descubre la magia de París con esta oferta de vuelo de ida y vuelta. Disfruta de un fin de semana inolvidable en la ciudad de la luz, paseando por sus encantadoras calles, visitando sus museos de fama mundial y degustando su exquisita gastronomía. Oferta sujeta a disponibilidad y condiciones de la aerolínea.

Detalles de la oferta:
- Ruta: Madrid (MAD) - París (CDG/ORY) o Barcelona (BCN) - París (CDG/ORY)
- Tipo de viaje: Ida y Vuelta
- Duración del vuelo directo: Aprox. 2 horas
- Equipaje incluido: Generalmente equipaje de mano (consultar condiciones de la aerolínea)
- Aerolíneas comunes: Iberia, Air France, Vueling, Ryanair, EasyJet (varía según oferta)
- Temporada de la oferta: Variable (fines de semana, temporada baja)

Incluye:
- Billete de avión ida y vuelta
- Tasas de aeropuerto
- Seguro de viaje básico

¡No esperes más y reserva tu escapada a París por un precio increíble!`,
    link_oferta: 'https://www.booking.com/flights/city/par.es.html?aid=12345',
    categoriaId: 'viajes',
    tags: ['vuelos', 'paris', 'viajes', 'europa', 'escapada'],
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80',
    likes: 450,
    dislikes: 15,
    commentsCount: 80,
    isHot: true,
    postedBy: 'user2',
    createdAt: new Date('2025-05-18T16:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-20T17:00:00Z').toISOString(),
    clicks: 2500,
    discountPercentage: Math.round(((120 - 79) / 120) * 100),
    rating: 4.6,
    stock: 0, // Para viajes, el stock es más bien "plazas disponibles"
    shippingInfo: 'Billete electrónico',
    couponCode: 'PARISLOVE',
    userVotes: { 'user1': 1, 'adminUser': 1 },
    approved: true,
    communityScore: 435,
    dealType: 'Precio Fijo',
    availability: 'Plazas Limitadas',
    region: 'ES',
    source: 'Booking.com Promociones'
  },
  {
    id: 'oferta-crema-facial-antiarrugas',
    titulo: 'Crema Facial Antiarrugas Revitalift Laser L\'Oréal - 50% Dto',
    slug: 'oferta-crema-revitalift-loreal',
    productoId: 'crema-revitalift-laser',
    tiendaId: 'sephora',
    precio_original: 29.99,
    precio_oferta: 14.99,
    fecha_inicio: new Date('2025-05-12T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-05-26T23:59:59Z').toISOString(),
    descripcion: 'Reduce arrugas y reafirma la piel con la crema Revitalift Laser de L\'Oréal Paris.',
    descripcion_larga: `La crema de día Revitalift Laser X3 de L\'Oréal Paris es un tratamiento anti-edad intensivo que ayuda a corregir las arrugas, redensificar la piel y remodelar los contornos del rostro. Su fórmula enriquecida con Pro-Xylane y Ácido Hialurónico proporciona una triple acción para una piel visiblemente más joven y firme.

Características:
- Marca: L\'Oréal Paris
- Línea: Revitalift Laser
- Tipo de producto: Crema de día anti-edad
- Contenido: 50 ml
- Ingredientes clave: Pro-Xylane (3%), Ácido Hialurónico fragmentado, LHA
- Tipo de piel: Todo tipo de piel, especialmente madura

Beneficios:
- Corrige arrugas
- Redensifica la piel
- Unifica el tono

Incluye:
- Crema Facial Antiarrugas Revitalift Laser L'Oréal

¡Aprovecha esta oferta y rejuvenece tu piel con Revitalift Laser!`,
    link_oferta: 'https://www.sephora.es/p/revitalift-laser-crema-de-dia-anti-edad-P123456.html',
    categoriaId: 'salud_belleza',
    tags: ['crema facial', 'antiarrugas', 'loreal', 'belleza', 'cuidado personal'],
    imageUrl: 'https://media.static-allbeauty.com/image/product/1/1600/1197021-l_oreal_paris_revitalift_laser_renew_advanced_anti_ageing_day_cream_50ml.jpg',
    likes: 120,
    dislikes: 2,
    commentsCount: 18,
    isHot: false,
    postedBy: 'user1',
    createdAt: new Date('2025-05-12T10:30:00Z').toISOString(),
    updatedAt: new Date('2025-05-14T11:00:00Z').toISOString(),
    clicks: 600,
    discountPercentage: Math.round(((29.99 - 14.99) / 29.99) * 100),
    rating: 4.4,
    stock: 80,
    shippingInfo: 'Envío gratis a partir de 30€',
    couponCode: null,
    userVotes: { 'user2': 1 },
    approved: true,
    communityScore: 118,
    dealType: 'Porcentaje Descuento',
    availability: 'Disponible',
    region: 'ES',
    source: 'Sephora Newsletter'
  },
  {
    id: 'oferta-taladro-percutor-bosch',
    titulo: 'Taladro Percutor Bosch EasyImpact 18V + 2 Baterías',
    slug: 'oferta-taladro-bosch-easyimpact-18v',
    productoId: 'taladro-bosch-easyimpact-18v',
    tiendaId: 'leroymerlin',
    precio_original: 149.00,
    precio_oferta: 119.00,
    fecha_inicio: new Date('2025-05-05T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-05-25T23:59:59Z').toISOString(),
    descripcion: 'Potente taladro percutor inalámbrico Bosch con dos baterías y maletín. Ideal para cualquier tarea de bricolaje.',
    descripcion_larga: `El taladro percutor inalámbrico Bosch EasyImpact 18V es una herramienta versátil y potente para una amplia gama de tareas de atornillado y taladrado en madera, metal y mampostería. Gracias a sus dos baterías incluidas, podrás trabajar sin interrupciones. Su diseño ergonómico y ligero asegura un manejo cómodo.

Características:
- Marca: Bosch
- Modelo: EasyImpact 18V (o similar según oferta específica)
- Tipo: Taladro percutor inalámbrico
- Voltaje batería: 18V
- Capacidad batería: Variable (ej. 1.5Ah, 2.0Ah, 2.5Ah) - la oferta incluye 2
- Par máximo: Variable (ej. 30-40 Nm)
- Velocidad en vacío: Variable (ej. 0-400 / 0-1350 rpm)
- Impactos por minuto: Variable (ej. 0-20000 ipm)
- Portabrocas: Portabrocas de sujeción rápida 10mm o 13mm
- Accesorios incluidos: 2 baterías, cargador, maletín de transporte

Incluye:
- Taladro Percutor Bosch EasyImpact 18V
- 2 Baterías
- Cargador
- Maletín de transporte

¡Aprovecha esta oferta y equipa tu caja de herramientas con Bosch!`,
    link_oferta: 'https://www.leroymerlin.es/productos/herramientas/herramientas-electricas-y-accesorios/taladros/taladro-sin-cable-bosch-easyimpact-18v-12345678.html',
    categoriaId: 'bricolaje',
    tags: ['taladro', 'bosch', 'herramientas', 'bricolaje', 'inalambrico'],
    imageUrl: 'https://media.adeo.com/marketplace/LMES/82630705/20210123094900519.jpeg?width=650&height=650&format=jpg&quality=80&fit=bounds',
    likes: 175,
    dislikes: 6,
    commentsCount: 28,
    isHot: true,
    postedBy: 'adminUser',
    createdAt: new Date('2025-05-05T13:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-10T14:00:00Z').toISOString(),
    clicks: 920,
    discountPercentage: Math.round(((149.00 - 119.00) / 149.00) * 100),
    rating: 4.7,
    stock: 35,
    shippingInfo: 'Click and Collect disponible',
    couponCode: 'BRICO10LM',
    userVotes: { 'user1': 1 },
    approved: true,
    communityScore: 169,
    dealType: 'Descuento Directo',
    availability: 'Disponible',
    region: 'ES',
    source: 'Leroy Merlin Catálogo'
  },
  {
    id: 'oferta-pienso-perro-royal-canin',
    titulo: 'Pienso Royal Canin Maxi Adult 15kg - Ahorra 10€',
    slug: 'oferta-pienso-royal-canin-maxi-adult',
    productoId: 'pienso-royal-canin-maxi-adult-15kg',
    tiendaId: 'zooplus',
    precio_original: 59.99,
    precio_oferta: 49.99,
    fecha_inicio: new Date('2025-05-19T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-06-02T23:59:59Z').toISOString(),
    descripcion: 'Alimento completo para perros adultos de razas grandes. Nutrición de alta calidad para tu mascota.',
    descripcion_larga: `Royal Canin Maxi Adult es un alimento completo y equilibrado especialmente formulado para perros adultos de razas grandes. Su fórmula exclusiva ayuda a mantener la salud digestiva, proteger las articulaciones y asegurar una condición corporal óptima, proporcionando toda la energía que necesitan para su día a día.

Características:
- Marca: Royal Canin
- Gama: Size Health Nutrition (SHN)
- Producto específico: Maxi Adult
- Peso perro recomendado: 26-44 kg (razas grandes)
- Edad perro recomendado: >15 meses a 5 años
- Presentación: Saco 15 kg

Ingredientes principales:
Proteínas de ave deshidratadas, maíz, harina de maíz, grasas animales, trigo, etc. (consultar composición exacta)

Beneficios clave:
- Alta digestibilidad
- Salud osteoarticular
- Mantenimiento del peso ideal
- Palatabilidad reforzada

Incluye:
- Pienso Royal Canin Maxi Adult 15kg

¡Aprovecha esta oferta y dale a tu perro la nutrición que merece!`,
    link_oferta: 'https://www.zooplus.es/shop/tienda_perros/pienso_perros/royal_canin_size/adult_26kg/12345',
    categoriaId: 'mascotas',
    tags: ['pienso', 'perro', 'royal canin', 'mascotas', 'alimentacion canina'],
    imageUrl: 'https://shop-cdn-fr.maxi-zoo.fr/media/catalog/product/r/o/royal_canin_maxi_adult_dry_dog_food_15kg_1_.jpg',
    likes: 95,
    dislikes: 1,
    commentsCount: 15,
    isHot: false,
    postedBy: 'user2',
    createdAt: new Date('2025-05-19T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-20T11:00:00Z').toISOString(),
    clicks: 450,
    discountPercentage: Math.round(((59.99 - 49.99) / 59.99) * 100),
    rating: 4.8,
    stock: 60,
    shippingInfo: 'Envío gratis a partir de 49€',
    couponCode: null,
    userVotes: { 'user1': 1 },
    approved: true,
    communityScore: 94,
    dealType: 'Descuento Directo',
    availability: 'Disponible',
    region: 'ES',
    source: 'Zooplus Promociones'
  },
  {
    id: 'oferta-curso-python-udemy',
    titulo: 'Curso Completo de Python: De Cero a Experto - 90% Dto.',
    slug: 'oferta-curso-python-completo-udemy',
    productoId: 'curso-python-udemy-jose-portilla',
    tiendaId: 'udemy',
    precio_original: 199.99,
    precio_oferta: 19.99,
    fecha_inicio: new Date('2025-05-01T00:00:00Z').toISOString(), // Ofertas suelen ser recurrentes
    fecha_fin: new Date('2025-05-28T23:59:59Z').toISOString(),
    descripcion: 'Aprende Python desde lo más básico hasta temas avanzados como desarrollo web, machine learning y más.',
    descripcion_larga: `Conviértete en un programador Python profesional con este curso completo. Aprenderás desde los conceptos más básicos hasta aplicaciones avanzadas en diversos campos. Ideal para quienes buscan iniciar una carrera en tecnología, mejorar sus habilidades o automatizar tareas.

Contenido principal:
- Fundamentos de Python
- Estructuras de Datos
- Programación Orientada a Objetos (OOP)
- Módulos y Paquetes
- Web Scraping
- APIs
- Desarrollo Web con Django y Flask
- Data Science y Machine Learning
- Automatización de tareas

Recursos adicionales:
- Artículos y recursos descargables
- Ejercicios de codificación
- Acceso en móvil y TV
- Certificado de finalización

Incluye:
- Curso Completo de Python: De Cero a Experto

¡Aprovecha esta oferta y da el primer paso hacia tu futuro en programación!`,
    link_oferta: 'https://www.udemy.com/course/python-total/',
    categoriaId: 'cursos_formacion',
    tags: ['curso online', 'python', 'programacion', 'udemy', 'formacion'],
    imageUrl: 'https://img-c.udemycdn.com/course/750x422/567828_67d0_8.jpg', // Imagen genérica de curso de Python
    likes: 350,
    dislikes: 5,
    commentsCount: 70,
    isHot: true,
    postedBy: 'adminUser',
    createdAt: new Date('2025-05-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-15T00:00:00Z').toISOString(),
    clicks: 2200,
    discountPercentage: Math.round(((199.99 - 19.99) / 199.99) * 100),
    rating: 4.7,
    stock: Infinity, // Cursos online suelen tener stock ilimitado
    shippingInfo: 'Acceso de por vida',
    couponCode: 'PYTHONMAY',
    userVotes: { 'user1': 1, 'user2': 1 },
    approved: true,
    communityScore: 345,
    dealType: 'Precio Promocional',
    availability: 'Disponible Siempre',
    region: 'Global',
    source: 'Udemy Promoción Flash'
  },
  {
    id: 'oferta-neumaticos-michelin',
    titulo: 'Neumáticos Michelin Primacy 4+ (205/55R16) - Montaje Incluido',
    slug: 'oferta-neumaticos-michelin-primacy4plus-norauto',
    productoId: 'neumatico-michelin-primacy4plus-2055516',
    tiendaId: 'norauto',
    precio_original: 95.00, // Precio por neumático sin montaje
    precio_oferta: 85.00, // Precio por neumático con montaje en oferta
    fecha_inicio: new Date('2025-05-10T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-06-10T23:59:59Z').toISOString(),
    descripcion: 'Cambia tus neumáticos por unos Michelin Primacy 4+ y llévate el montaje gratis. Seguridad y durabilidad.',
    descripcion_larga: `El neumático Michelin Primacy 4+ ofrece una combinación óptima de seguridad y longevidad. Gracias a sus innovadoras tecnologías, mantiene un excelente rendimiento en frenada sobre mojado a lo largo de toda su vida útil. Una elección ideal para conductores que buscan tranquilidad y durabilidad.

Características:
- Marca: Michelin
- Modelo: Primacy 4+
- Medidas: 205/55 R16
- Índice de carga: 91 (615 kg por neumático)
- Código de velocidad: V (hasta 240 km/h)
- Tipo de vehículo: Turismo
- Temporada: Verano

Etiqueta europea (ejemplo):
- Agarre en mojado: A
- Eficiencia combustible: B
- Ruido exterior: 69dB

Incluye:
- 2 Neumáticos Michelin Primacy 4+ (205/55R16)
- Montaje en taller Norauto

¡Aprovecha esta oferta y viaja seguro con Michelin!`,
    link_oferta: 'https://www.norauto.es/p/neumatico-michelin-primacy-4-205-55-r16-91-v-123456.html',
    categoriaId: 'automocion',
    tags: ['neumaticos', 'michelin', 'coche', 'automocion', 'seguridad vial'],
    imageUrl: 'https://cdn.norauto.es/images/live/product_page_large/750x750/000/000/123/000000123456_ES_01.jpg', // Placeholder
    likes: 110,
    dislikes: 3,
    commentsCount: 22,
    isHot: false,
    postedBy: 'user1',
    createdAt: new Date('2025-05-10T15:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-12T16:00:00Z').toISOString(),
    clicks: 550,
    discountPercentage: Math.round(((95.00 - 85.00) / 95.00) * 100), // Simplificado, el montaje gratis es el valor añadido
    rating: 4.6,
    stock: 100, // Stock de neumáticos en promoción
    shippingInfo: 'Montaje en taller Norauto',
    couponCode: null,
    userVotes: { 'user2': 1 },
    approved: true,
    communityScore: 107,
    dealType: 'Servicio Incluido',
    availability: 'Sujeto a disponibilidad en taller',
    region: 'ES',
    source: 'Norauto Ofertas Taller'
  },
  {
    id: 'oferta-lg-oled65c3',
    titulo: 'LG OLED65C3 Smart TV 65" - Precio Mínimo Histórico',
    slug: 'lg-oled65c3-smart-tv-65',
    productoId: 'lg-oled65c3',
    tiendaId: 'elcorteingles',
    precio_original: 2499,
    precio_oferta: 2099,
    fecha_inicio: new Date('2025-05-15T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-06-15T23:59:59Z').toISOString(),
    descripcion: 'Smart TV LG OLED 4K 65" con tecnología OLED evo, procesador α9 Gen6 AI y el mejor panel para gaming.',
    descripcion_larga: `El LG OLED C3 representa la excelencia en calidad de imagen:

• Panel OLED evo de última generación con pixel auto-iluminados
• Procesador α9 Gen 6 AI con Deep Learning
• 4K Cinema HDR con Dolby Vision IQ y HDR10 Pro
• Dolby Atmos y sonido envolvente virtual 7.1.2
• Perfect for Gaming: 4 HDMI 2.1, 120Hz, VRR, G-SYNC, FreeSync
• webOS 23 con ThinQ AI y asistentes de voz integrados
• Diseño minimalista con peana ajustable

Incluye:
- Smart TV LG OLED65C3
- Control remoto
- Manual de usuario

¡Disfruta de una experiencia visual inigualable con LG OLED!`,
    link_oferta: 'https://www.elcorteingles.es/electronica/televisores/lg-oled65c3',
    categoriaId: 'electronica',
    tags: ['tv', 'oled', 'lg', '4k', 'smart tv', 'hdmi 2.1', 'gaming'],
    imageUrl: 'https://www.lg.com/es/images/televisores/md07554403/gallery/medium01.jpg',
    likes: 280,
    dislikes: 5,
    commentsCount: 42,
    isHot: true,
    postedBy: 'adminUser',
    createdAt: new Date('2025-05-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-16T10:00:00Z').toISOString(),
    clicks: 1500,
    discountPercentage: Math.round(((2499 - 2099) / 2499) * 100),
    rating: 4.9,
    stock: 15,
    shippingInfo: 'Envío e instalación gratis',
    couponCode: 'OLED400',
    userVotes: { 'user1': 1, 'user2': 1 },
    approved: true,
    communityScore: 275,
    dealType: 'Descuento Directo',
    availability: 'Disponible',
    region: 'ES',
    source: 'El Corte Inglés Web'
  },
  {
    id: 'oferta-dyson-v15-detect',
    titulo: 'Dyson V15 Detect Absolute - Black Friday en Mayo',
    slug: 'dyson-v15-detect-absolute',
    productoId: 'dyson-v15-detect',
    tiendaId: 'amazon',
    precio_original: 799,
    precio_oferta: 599,
    fecha_inicio: new Date('2025-05-15T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-06-15T23:59:59Z').toISOString(),
    descripcion: 'Aspiradora sin cable Dyson V15 Detect con tecnología láser y sensor de partículas.',
    descripcion_larga: `La aspiradora más avanzada de Dyson con tecnología revolucionaria:

• Tecnología láser Dust Detection para visualizar el polvo invisible
• Sensor piezo que cuenta y mide las partículas de polvo
• Motor Dyson Hyperdymium que gira hasta 125.000 rpm
• Hasta 60 minutos de autonomía sin pérdida de succión
• Filtración HEPA que captura 99,99% de partículas
• Incluye 6 accesorios especializados
• Pantalla LCD con información en tiempo real
• Sistema de vaciado higiénico Point & Shoot

Características adicionales:
- Potencia de succión: 240AW
- Modos de potencia: Eco, Auto/Med, Boost
- Capacidad del depósito: 0.76L
- Nivel de ruido: 81dB(A)
- Batería: Ion-Litio 25.2V, tiempo de carga 4.5 horas

Incluye:
- Aspiradora Dyson V15 Detect
- Base de carga para pared
- Cepillo Laser Slim Fluffy
- Cepillo Digital Motorbar XL
- Mini cepillo motorizado
- Accesorio 2 en 1
- Accesorio para rincones
- Adaptador para zonas altas
- Cargador
- Manual de instrucciones

¡Aprovecha esta oferta y transforma la limpieza de tu hogar!`,
    link_oferta: 'https://www.amazon.es/dyson-v15-detect',
    categoriaId: 'hogar',
    tags: ['aspiradora', 'dyson', 'sin cables', 'smart', 'hogar'],
    imageUrl: 'https://www.dyson.es/medialibrary/images/dyson-v15-detect-absolute/Dyson_V15_Detect_Absolute_Hero.jpg',
    likes: 180,
    dislikes: 3,
    commentsCount: 25,
    isHot: true,
    postedBy: 'adminUser',
    createdAt: new Date('2025-05-16T10:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-17T11:00:00Z').toISOString(),
    clicks: 890,
    discountPercentage: Math.round(((799 - 599) / 799) * 100),
    rating: 4.8,
    stock: 25,
    shippingInfo: 'Envío Prime en 1 día',
    couponCode: 'DYSON200',
    userVotes: { 'user1': 1 },
    approved: true,
    communityScore: 177,
    dealType: 'Descuento Directo',
    availability: 'Disponible',
    region: 'ES',
    source: 'Amazon España'
  },
  {
    id: 'oferta-nintendo-switch-oled-mariokart',
    titulo: 'Nintendo Switch OLED + Mario Kart 8 Deluxe + 3 Meses NSO',
    slug: 'nintendo-switch-oled-mario-kart-bundle',
    productoId: 'nintendo-switch-oled-bundle',
    tiendaId: 'pccomponentes',
    precio_original: 399,
    precio_oferta: 349,
    fecha_inicio: new Date('2025-05-17T00:00:00Z').toISOString(),
    fecha_fin: new Date('2025-06-17T23:59:59Z').toISOString(),
    descripcion: 'Pack Nintendo Switch OLED con Mario Kart 8 Deluxe y 3 meses de Nintendo Switch Online.',
    descripcion_larga: `El mejor pack de Nintendo Switch OLED incluye:

• Consola Nintendo Switch OLED (Blanca)
  - Pantalla OLED de 7 pulgadas
  - 64GB de almacenamiento
  - Soporte ajustable mejorado
  - Base con puerto LAN

• Mario Kart 8 Deluxe (juego completo)
  - 48 circuitos con el Pase de Pistas Extra
  - Multijugador local y online
  - Compatible con volante Joy-Con

• 3 meses de Nintendo Switch Online
  - Juego online
  - Juegos clásicos NES y SNES
  - Guardado en la nube
  - Ofertas exclusivas`,
    link_oferta: 'https://www.pccomponentes.com/nintendo-switch-oled-mario-kart-bundle',
    categoriaId: 'videojuegos',
    tags: ['nintendo', 'switch', 'consola', 'mario kart', 'bundle'],
    imageUrl: 'https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_lpad/b_white/f_auto/q_auto/dpr_auto/c_scale,w_700/v1/ncom/en_US/switch/site-design-update/oled-model-promo',
    likes: 210,
    dislikes: 2,
    commentsCount: 35,
    isHot: true,
    postedBy: 'adminUser',
    createdAt: new Date('2025-05-17T11:00:00Z').toISOString(),
    updatedAt: new Date('2025-05-18T12:00:00Z').toISOString(),
    clicks: 750,
    discountPercentage: Math.round(((399 - 349) / 399) * 100),
    rating: 4.9,
    stock: 50,
    shippingInfo: 'Envío en 24h',
    couponCode: null,
    userVotes: { 'user2': 1 },
    approved: true,
    communityScore: 208,
    dealType: 'Pack Especial',
    availability: 'Disponible',
    region: 'ES',
    source: 'PcComponentes Web'
  }
];

// Product specifications data
const especificacionesProductos = {
  'lg-oled65c3': {
    especificaciones: {
      pantalla: '65" OLED evo con Brightness Booster',
      resolucion: '4K UHD (3840 x 2160)',
      procesador: 'α9 Gen6 AI con Deep Learning',
      tasa_refresco: '120Hz',
      hdr: 'Dolby Vision IQ, HDR10 Pro, HLG',
      sonido: 'Dolby Atmos 2.2ch 40W',
      sistema_operativo: 'webOS 23',
      conectividad: 'WiFi 6, Bluetooth 5.0, HDMI 2.1 x4',
      gaming: 'NVIDIA G-SYNC, AMD FreeSync Premium, VRR',
      dimensiones: '1441 x 879 x 41.1 mm (sin peana)',
      peso: '23.3 kg'
    },
    caracteristicas_destacadas: [
      'Panel OLED evo de última generación',
      'Procesador α9 Gen6 AI para upscaling y optimización',
      'Perfect for Gaming con 4 puertos HDMI 2.1',
      'Dolby Vision IQ y Dolby Atmos',
      'Tecnología Motion Pro para deportes',
      'Brightness Booster para mayor brillo'
    ],
    contenido_caja: [
      'TV LG OLED65C3',
      'Magic Remote 2023',
      'Base de sobremesa',
      'Cable de alimentación',
      'Manual de usuario',
      'Guía rápida de instalación'
    ],
    descripcion_detallada: 'El LG OLED C3 2023 representa la excelencia en calidad de imagen con su panel OLED evo de nueva generación. El procesador α9 Gen6 AI utiliza deep learning para optimizar imagen y sonido en tiempo real. Ideal para gaming con sus 4 puertos HDMI 2.1, G-Sync, FreeSync y VRR.'
  },
  'dyson-v15-detect': {
    especificaciones: {
      potencia_succion: '240AW',
      autonomia: 'Hasta 60 minutos',
      tecnologia_laser: 'Dyson Slim Fluffy con luz verde',
      sensor_particulas: 'Piezo sensor con pantalla LCD',
      modos_potencia: 'Eco, Auto/Med, Boost',
      capacidad_deposito: '0.76L',
      filtrado: 'Sistema de filtración HEPA avanzado',
      motor: 'Dyson Hyperdymium hasta 125.000 rpm',
      peso: '3.08 kg',
      nivel_ruido: '81dB(A)',
      bateria: 'Ion-Litio 25.2V',
      tiempo_carga: '4.5 horas'
    },
    caracteristicas_destacadas: [
      'Tecnología láser Green Dust Detection',
      'Sensor piezo con conteo de partículas',
      'Motor Dyson Hyperdymium mejorado',
      'Filtración HEPA avanzada',
      'LCD con información en tiempo real'
    ],
    contenido_caja: [
      'Aspiradora Dyson V15 Detect',
      'Base de carga para pared',
      'Cepillo Laser Slim Fluffy',
      'Cepillo Digital Motorbar XL',
      'Mini cepillo motorizado',
      'Accesorio 2 en 1',
      'Accesorio para rincones',
      'Adaptador para zonas altas'
    ],
    descripcion_detallada: 'El Dyson V15 Detect revoluciona la limpieza con tecnología láser que revela el polvo invisible y sensor piezo que cuenta partículas en tiempo real. Motor Hyperdymium de 125.000 rpm y filtración HEPA avanzada.'
  }
};

// Forum data
const forumCategories = [
  {
    id: generateUUID(),
    name: 'Discusión General',
    description: 'Un lugar para hablar de todo lo relacionado con ofertas y compras.',
    icon: 'FaComments',
    threadCount: 2,
    postCount: 3,
    createdAt: new Date('2024-04-01T10:00:00Z'),
    updatedAt: new Date('2024-05-20T12:00:00Z')
  },
  {
    id: generateUUID(),
    name: 'Electrónica',
    description: 'Debates sobre las últimas ofertas en gadgets, móviles, ordenadores, etc.',
    icon: 'FaLaptop',
    threadCount: 1,
    postCount: 2,
    createdAt: new Date('2024-04-05T14:30:00Z'),
    updatedAt: new Date('2024-05-15T16:45:00Z')
  }
];

// Forum simulation data - Realistic threads and discussions
const forumThreads = [
  {
    id: generateUUID(),
    titulo: '¡Bienvenidos al nuevo foro de CazaOfertas!',
    contenido: `<p>¡Hola a toda la comunidad de CazaOfertas!</p>
<p>Estamos emocionados de lanzar nuestro nuevo foro donde podréis:</p>
<ul>
<li>Compartir vuestras mejores ofertas</li>
<li>Hacer preguntas sobre productos</li>
<li>Ayudar a otros cazadores de ofertas</li>
<li>Discutir sobre las últimas tendencias en compras</li>
</ul>
<p>¡Esperamos que disfrutéis de este nuevo espacio y que sea de gran ayuda para todos!</p>
<p><strong>¡Felices cazas de ofertas! 🎯</strong></p>`,
    categoria_id: forumCategories[0].id, // Discusión General
    user_id: 'adminUser',
    created_at: new Date('2024-05-01T10:00:00Z'),
    updated_at: new Date('2024-05-20T14:30:00Z'),
    vistas: 247,
    fijado: true,
    cerrado: false
  },
  {
    id: generateUUID(),
    titulo: '🔥 Mejores ofertas de la semana - ¡Compartid las vuestras!',
    contenido: `<p>¡Hola cazaofertas!</p>
<p>He encontrado unas ofertas increíbles esta semana y quería compartirlas con vosotros:</p>
<h3>🎧 Audio</h3>
<ul>
<li><strong>AirPods Pro 2</strong> - 199€ (antes 279€) en Amazon</li>
<li><strong>Sony WH-1000XM5</strong> - 249€ (antes 399€) en MediaMarkt</li>
</ul>
<h3>📱 Móviles</h3>
<ul>
<li><strong>iPhone 15</strong> - 759€ (antes 909€) en PcComponentes</li>
<li><strong>Samsung Galaxy S24</strong> - 699€ (antes 859€) en El Corte Inglés</li>
</ul>
<p>¿Qué ofertas habéis encontrado vosotros? ¡Compartidlas aquí! 💸</p>`,
    categoria_id: forumCategories[0].id, // Discusión General
    user_id: 'user2',
    created_at: new Date('2024-05-15T08:30:00Z'),
    updated_at: new Date('2024-05-21T16:45:00Z'),
    vistas: 189,
    fijado: false,
    cerrado: false
  },
  {
    id: generateUUID(),
    titulo: 'iPhone 15 Pro vs Samsung Galaxy S24 Ultra - ¿Cuál elegir?',
    contenido: `<p>Estoy entre estos dos móviles y no me decido. He visto ofertas buenas para ambos:</p>
<p><strong>iPhone 15 Pro (128GB)</strong></p>
<ul>
<li>✅ Mejor rendimiento en gaming</li>
<li>✅ Cámaras excelentes</li>
<li>❌ Menos RAM</li>
<li>❌ Sin USB-C hasta ahora</li>
</ul>
<p><strong>Samsung Galaxy S24 Ultra (256GB)</strong></p>
<ul>
<li>✅ S Pen incluido</li>
<li>✅ Más RAM y almacenamiento</li>
<li>✅ Pantalla más grande</li>
<li>❌ OneUI a veces se ralentiza</li>
</ul>
<p>¿Qué opináis? ¿Alguno tiene experiencia con estos modelos?</p>`,
    categoria_id: forumCategories[1].id, // Electrónica
    user_id: 'user1',
    created_at: new Date('2024-05-18T14:20:00Z'),
    updated_at: new Date('2024-05-21T11:15:00Z'),
    vistas: 156,
    fijado: false,
    cerrado: false
  },
  {
    id: generateUUID(),
    titulo: 'Experiencia con Xiaomi 14 Ultra - Review después de 2 meses',
    contenido: `<p>Hola a todos,</p>
<p>Hace 2 meses compré el Xiaomi 14 Ultra aprovechando una oferta que vi aquí en el foro (¡gracias a quien la compartió!). Quería compartir mi experiencia:</p>
<h3>📷 Cámaras (10/10)</h3>
<p>Las cámaras son espectaculares. Los retratos con el teleperiscopio son de nivel profesional.</p>
<h3>🔋 Batería (8/10)</h3>
<p>Dura todo el día con uso intenso. La carga rápida de 90W es increíble.</p>
<h3>📱 Software (7/10)</h3>
<p>MIUI 15 ha mejorado mucho, pero aún hay algunas cosillas raras con las notificaciones.</p>
<h3>🎮 Gaming (9/10)</h3>
<p>Snapdragon 8 Gen 3 va como la seda. Cero lag en Genshin Impact a máximos.</p>
<p><strong>Veredicto:</strong> Lo recomiendo totalmente si encontráis una buena oferta. Pagué 899€ y creo que vale cada euro.</p>
<p>¿Alguien más lo tiene? ¿Qué tal vuestra experiencia?</p>`,
    categoria_id: forumCategories[1].id, // Electrónica
    user_id: 'user3',
    created_at: new Date('2024-05-20T09:45:00Z'),
    updated_at: new Date('2024-05-21T13:20:00Z'),
    vistas: 134,
    fijado: false,
    cerrado: false
  },
  {
    id: generateUUID(),
    titulo: '¿Merece la pena el Prime Day de Amazon este año?',
    contenido: `<p>El Prime Day está a la vuelta de la esquina y me pregunto si realmente merece la pena...</p>
<p><strong>Los años anteriores:</strong></p>
<ul>
<li>2023: Encontré un MacBook Air M2 con 200€ de descuento</li>
<li>2022: Nada interesante, todo inflado antes</li>
<li>2021: Algunas ofertas decentes en gadgets</li>
</ul>
<p><strong>Este año espero:</strong></p>
<ul>
<li>Ofertas en iPhone 15 (ya está bajando de precio)</li>
<li>Descuentos en productos de Amazon (Echo, Kindle, etc.)</li>
<li>Alguna sorpresa en gaming</li>
</ul>
<p>¿Qué opináis? ¿Tenéis algo en vuestra lista de deseos esperando al Prime Day?</p>
<p><em>PD: Recordad usar herramientas como CamelCamelCamel para ver el historial de precios.</em></p>`,
    categoria_id: forumCategories[0].id, // Discusión General
    user_id: 'user1',
    created_at: new Date('2024-05-19T16:30:00Z'),
    updated_at: new Date('2024-05-21T10:45:00Z'),
    vistas: 98,
    fijado: false,
    cerrado: false
  },
  {
    id: generateUUID(),
    titulo: 'Ayuda: ¿Qué aspiradora comprar con presupuesto de 300€?',
    contenido: `<p>Necesito vuestra ayuda para elegir aspiradora. Mi presupuesto es de máximo 300€.</p>
<p><strong>Requisitos:</strong></p>
<ul>
<li>Para piso de 90m² (parquet + alfombras)</li>
<li>Tengo un gato (pelo de mascota)</li>
<li>Prefiero sin cable si es posible</li>
<li>Que no pese mucho</li>
</ul>
<p><strong>Opciones que estoy considerando:</strong></p>
<ol>
<li><strong>Dyson V8 Absolute</strong> (280€ en oferta)</li>
<li><strong>Tineco Pure One S12</strong> (199€)</li>
<li><strong>Shark Anti Hair Wrap</strong> (250€)</li>
</ol>
<p>¿Alguno tiene experiencia con estas marcas? ¿Hay algo mejor en este rango de precio?</p>
<p>¡Gracias de antemano! 🙏</p>`,
    categoria_id: forumCategories[0].id, // Discusión General
    user_id: 'user2',
    created_at: new Date('2024-05-17T12:15:00Z'),
    updated_at: new Date('2024-05-20T18:30:00Z'),
    vistas: 87,
    fijado: false,
    cerrado: false
  }
];

const forumPosts = [
  // Respuestas al hilo de bienvenida
  {
    id: generateUUID(),
    tema_id: forumThreads[0].id,
    user_id: 'user1',
    contenido: '¡Genial! Ya era hora de tener un foro propio. ¡Gracias por crear este espacio! 🎉',
    created_at: new Date('2024-05-01T11:30:00Z'),
    updated_at: new Date('2024-05-01T11:30:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[0].id,
    user_id: 'user2',
    contenido: 'Súper emocionado por poder compartir ofertas aquí. ¡Vamos a llenar esto de ofertas increíbles! 💸',
    created_at: new Date('2024-05-01T14:20:00Z'),
    updated_at: new Date('2024-05-01T14:20:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[0].id,
    user_id: 'user3',
    contenido: 'Me encanta la idea. ¿Podríamos tener también una sección de alertas automáticas?',
    created_at: new Date('2024-05-02T09:15:00Z'),
    updated_at: new Date('2024-05-02T09:15:00Z')
  },

  // Respuestas al hilo de mejores ofertas
  {
    id: generateUUID(),
    tema_id: forumThreads[1].id,
    user_id: 'user1',
    contenido: '¡Increíbles ofertas! Los AirPods Pro 2 a 199€ están geniales. ¿Siguen disponibles?',
    created_at: new Date('2024-05-15T10:45:00Z'),
    updated_at: new Date('2024-05-15T10:45:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[1].id,
    user_id: 'user3',
    contenido: 'Añado mi aportación: Logitech MX Master 3S a 79€ en Amazon (antes 109€). ¡Ratón increíble para productividad!',
    created_at: new Date('2024-05-15T12:30:00Z'),
    updated_at: new Date('2024-05-15T12:30:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[1].id,
    user_id: 'adminUser',
    contenido: 'Geniales aportaciones todos. He creado una sección destacada en la web con estas ofertas 👍',
    created_at: new Date('2024-05-16T08:15:00Z'),
    updated_at: new Date('2024-05-16T08:15:00Z')
  },

  // Respuestas al iPhone vs Samsung
  {
    id: generateUUID(),
    tema_id: forumThreads[2].id,
    user_id: 'user2',
    contenido: 'Tengo el iPhone 15 Pro desde septiembre. La batería es espectacular y iOS 17 va muy fluido. Para gaming es una bestia.',
    created_at: new Date('2024-05-18T16:45:00Z'),
    updated_at: new Date('2024-05-18T16:45:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[2].id,
    user_id: 'user3',
    contenido: 'Samsung S24 Ultra usuario aquí. El S Pen es adictivo para tomar notas. Pero si vienes de iPhone, el cambio puede ser brusco.',
    created_at: new Date('2024-05-18T18:20:00Z'),
    updated_at: new Date('2024-05-18T18:20:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[2].id,
    user_id: 'adminUser',
    contenido: 'Ambos son excelentes. Depende de tu ecosistema actual. ¿Tienes Mac, iPad, etc? -> iPhone. ¿Prefieres personalización? -> Samsung.',
    created_at: new Date('2024-05-19T09:30:00Z'),
    updated_at: new Date('2024-05-19T09:30:00Z')
  },

  // Respuestas al Xiaomi 14 Ultra
  {
    id: generateUUID(),
    tema_id: forumThreads[3].id,
    user_id: 'user1',
    contenido: 'Gracias por la review! Estaba dudando entre este y el iPhone 15 Pro. ¿Qué tal las fotos nocturnas?',
    created_at: new Date('2024-05-20T11:15:00Z'),
    updated_at: new Date('2024-05-20T11:15:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[3].id,
    user_id: 'user2',
    contenido: 'Lo tengo desde hace 1 mes. Confirmo todo lo que dices. Las fotos nocturnas son impresionantes, casi no necesitas flash.',
    created_at: new Date('2024-05-20T13:45:00Z'),
    updated_at: new Date('2024-05-20T13:45:00Z')
  },

  // Respuestas al Prime Day
  {
    id: generateUUID(),
    tema_id: forumThreads[4].id,
    user_id: 'user2',
    contenido: 'El año pasado pillé unos Echo Buds por 39€. Están atentos a los productos de Amazon que suelen tener mejores descuentos.',
    created_at: new Date('2024-05-19T18:15:00Z'),
    updated_at: new Date('2024-05-19T18:15:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[4].id,
    user_id: 'user3',
    contenido: 'Consejo: empezad a añadir productos a la lista de deseos YA. Amazon envía notificaciones si bajan de precio durante el Prime Day.',
    created_at: new Date('2024-05-20T08:30:00Z'),
    updated_at: new Date('2024-05-20T08:30:00Z')
  },

  // Respuestas a la ayuda con aspiradora
  {
    id: generateUUID(),
    tema_id: forumThreads[5].id,
    user_id: 'user1',
    contenido: 'Tengo la Dyson V8 y va genial con pelos de gato. La batería dura unos 25-30 min en modo normal, suficiente para 90m².',
    created_at: new Date('2024-05-17T14:30:00Z'),
    updated_at: new Date('2024-05-17T14:30:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[5].id,
    user_id: 'user3',
    contenido: 'Mira también la Dreame V12. La tengo y por 180€ es increíble. Potencia similar a Dyson pero más barata.',
    created_at: new Date('2024-05-17T16:45:00Z'),
    updated_at: new Date('2024-05-17T16:45:00Z')
  },
  {
    id: generateUUID(),
    tema_id: forumThreads[5].id,
    user_id: 'adminUser',
    contenido: 'He añadido una comparativa de aspiradoras sin cable en la web. Checked it out en la sección de guías de compra 👍',
    created_at: new Date('2024-05-18T10:20:00Z'),
    updated_at: new Date('2024-05-18T10:20:00Z')
  }
];

const forumVotes = [
  // Votos en hilos
  { id: generateUUID(), item_id: forumThreads[0].id, item_type: 'thread', user_id: 'user1', vote_type: 'up', created_at: new Date('2024-05-01T12:00:00Z') },
  { id: generateUUID(), item_id: forumThreads[0].id, item_type: 'thread', user_id: 'user2', vote_type: 'up', created_at: new Date('2024-05-01T15:00:00Z') },
  { id: generateUUID(), item_id: forumThreads[0].id, item_type: 'thread', user_id: 'user3', vote_type: 'up', created_at: new Date('2024-05-02T10:00:00Z') },
  
  { id: generateUUID(), item_id: forumThreads[1].id, item_type: 'thread', user_id: 'user1', vote_type: 'up', created_at: new Date('2024-05-15T11:00:00Z') },
  { id: generateUUID(), item_id: forumThreads[1].id, item_type: 'thread', user_id: 'user3', vote_type: 'up', created_at: new Date('2024-05-15T13:00:00Z') },
  { id: generateUUID(), item_id: forumThreads[1].id, item_type: 'thread', user_id: 'adminUser', vote_type: 'up', created_at: new Date('2024-05-16T09:00:00Z') },
  
  { id: generateUUID(), item_id: forumThreads[2].id, item_type: 'thread', user_id: 'user2', vote_type: 'up', created_at: new Date('2024-05-18T17:00:00Z') },
  { id: generateUUID(), item_id: forumThreads[2].id, item_type: 'thread', user_id: 'user3', vote_type: 'up', created_at: new Date('2024-05-18T19:00:00Z') },
  
  { id: generateUUID(), item_id: forumThreads[3].id, item_type: 'thread', user_id: 'user1', vote_type: 'up', created_at: new Date('2024-05-20T12:00:00Z') },
  { id: generateUUID(), item_id: forumThreads[3].id, item_type: 'thread', user_id: 'user2', vote_type: 'up', created_at: new Date('2024-05-20T14:00:00Z') },
  
  // Votos en mensajes
  { id: generateUUID(), item_id: forumPosts[0].id, item_type: 'message', user_id: 'user2', vote_type: 'up', created_at: new Date('2024-05-01T12:30:00Z') },
  { id: generateUUID(), item_id: forumPosts[1].id, item_type: 'message', user_id: 'user1', vote_type: 'up', created_at: new Date('2024-05-01T15:30:00Z') },
  { id: generateUUID(), item_id: forumPosts[3].id, item_type: 'message', user_id: 'user2', vote_type: 'up', created_at: new Date('2024-05-15T11:30:00Z') },
  { id: generateUUID(), item_id: forumPosts[4].id, item_type: 'message', user_id: 'user1', vote_type: 'up', created_at: new Date('2024-05-15T13:30:00Z') },
  { id: generateUUID(), item_id: forumPosts[6].id, item_type: 'message', user_id: 'user1', vote_type: 'up', created_at: new Date('2024-05-18T17:30:00Z') },
  { id: generateUUID(), item_id: forumPosts[8].id, item_type: 'message', user_id: 'user2', vote_type: 'up', created_at: new Date('2024-05-19T10:30:00Z') }
];

// Offer comments
const comentariosOfertas = [
  {
    id: generateId(),
    ofertaId: 'oferta-iphone-15-pro-max-titanio',
    userId: 'user2',
    texto: 'Muy buena oferta, ¡gracias por compartir!',
    fecha: new Date('2024-05-16T10:00:00Z').toISOString(),
    rating: 5,
    respuestas: []
  },
  {
    id: generateId(),
    ofertaId: 'oferta-iphone-15-pro-max-titanio',
    userId: 'user1',
    texto: '¿Alguien sabe si el stock es limitado?',
    fecha: new Date('2024-05-17T11:30:00Z').toISOString(),
    rating: null,
    respuestas: [
      {
        id: generateId(),
        userId: 'adminUser',
        texto: 'Sí, las unidades son limitadas para esta promoción.',
        fecha: new Date('2024-05-17T12:00:00Z').toISOString(),
      }
    ]
  },
  {
    id: generateId(),
    ofertaId: 'oferta-macbook-air-m3',
    userId: 'user1',
    texto: 'Excelente precio para el M3, ¡comprado!',
    fecha: new Date('2024-05-11T09:00:00Z').toISOString(),
    rating: 5,
    respuestas: []
  }
];

// Create the mockData object with all components
const mockData = {
  users,
  categorias,
  tiendas,
  ofertas,
  especificacionesProductos,
  forumCategories,
  forumThreads,
  forumPosts,
  forumVotes,
  comentariosOfertas // Added comentariosOfertas to the mockData object
};

// Export the mockData object as default
export default mockData;

// Export individual utilities for direct access
export { generateUUID, generateId, simulateDelay, especificacionesProductos, ofertas, categorias, tiendas, users, forumCategories, forumThreads, forumPosts, forumVotes, comentariosOfertas }; // Added comentariosOfertas to named exports
Object.assign(especificacionesProductos, {
  'cecotec-mambo-12090': {
    especificaciones: {
      potencia: '1700W',
      capacidad: '3.3L',
      velocidades: '0-10 + Turbo',
      temperatura: '37-120°C',
      tiempo_max: '12 horas',
      funciones: '36 funciones',
      conectividad: 'WiFi + App MamboElite',
      pantalla: 'LCD táctil a color',
      peso: '7.4 kg',
      dimensiones: '33.5 x 23.7 x 34.7 cm',
      material_jarra: 'Acero inoxidable AISI 304',
      potencia_calentamiento: '1000W'
    },
    caracteristicas_destacadas: [
      'Control por app smartphone',
      '36 funciones de cocina',
      'Báscula integrada',
      'Jarra SlowMambo para risottos',
      'Temperatura y velocidad precisas'
    ],
    contenido_caja: [
      'Robot de cocina Mambo 12090',
      'Jarra de acero inoxidable',
      'Vaporera de 2 niveles',
      'Espátula MamboMix',
      'Mariposa',
      'Cuchillas',
      'Cubilete dosificador'
    ],
    descripcion_detallada: 'El Cecotec Mambo 12090 es el robot de cocina más avanzado con 36 funciones y conectividad WiFi. Perfecto para todo tipo de recetas, desde los platos más básicos hasta elaboraciones profesionales.'
  },
  'logitech-mx-mechanical-mini': {
    especificaciones: {
      tipo: 'Teclado mecánico 75%',
      switches: 'Táctiles silenciosos',
      layout: 'Español',
      conectividad: 'Bluetooth + USB Logi Bolt',
      dispositivos: 'Multi-dispositivo (hasta 3)',
      retroiluminacion: 'LED blanco adaptativo',
      autonomia: 'Hasta 15 días (con luz)',
      tiempo_carga: '4 horas',
      dimensiones: '312.6 x 131.55 x 26.1 mm',
      peso: '612g',
      material: 'Aluminio y plástico premium'
    },
    caracteristicas_destacadas: [
      'Switches mecánicos táctiles silenciosos',
      'Retroiluminación inteligente',
      'Conectividad dual Bluetooth/USB',
      'Multi-dispositivo Flow',
      'Diseño compacto 75%'
    ],
    contenido_caja: [
      'Teclado MX Mechanical Mini',
      'Receptor USB Logi Bolt',
      'Cable USB-C a USB-A',
      'Documentación del usuario'
    ],
    descripcion_detallada: 'El Logitech MX Mechanical Mini es un teclado mecánico premium para máxima productividad. Sus switches táctiles silenciosos y retroiluminación inteligente lo hacen perfecto para entornos profesionales.'
  }
});
