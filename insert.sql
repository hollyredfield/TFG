-- =============================================
-- DATOS DE EJEMPLO PARA CAZAOFERTAS
-- Productos, Servicios y Datos de Usuario
-- =============================================

-- Insertar perfiles de usuario de ejemplo
INSERT INTO perfiles_usuario (id, nombre_usuario, url_avatar, biografia, puntuacion_reputacion, esta_verificado) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'tecno_hunter', 'https://i.pravatar.cc/150?img=1', 'Experto en tecnología y gadgets. 5 años cazando ofertas tech.', 1250, true),
('550e8400-e29b-41d4-a716-446655440002', 'moda_deals', 'https://i.pravatar.cc/150?img=2', 'Fashion lover 👗 Siempre al día con las últimas tendencias y descuentos', 890, true),
('550e8400-e29b-41d4-a716-446655440003', 'gamer_pro', 'https://i.pravatar.cc/150?img=3', '🎮 Gaming es vida. Especialista en ofertas de videojuegos y hardware', 1100, true),
('550e8400-e29b-41d4-a716-446655440004', 'hogar_smart', 'https://i.pravatar.cc/150?img=4', '🏠 Smart home enthusiast. Casa inteligente con presupuesto inteligente', 670, false),
('550e8400-e29b-41d4-a716-446655440005', 'viajero_ahorro', 'https://i.pravatar.cc/150?img=5', '✈️ Viajando por el mundo sin arruinarse. Tips de viaje low-cost', 520, false),
('550e8400-e29b-41d4-a716-446655440006', 'fit_deals', 'https://i.pravatar.cc/150?img=6', '💪 Fitness y deporte. Encuentra las mejores ofertas para estar en forma', 430, false),
('550e8400-e29b-41d4-a716-446655440007', 'foodie_saver', 'https://i.pravatar.cc/150?img=7', '🍕 Gourmet con presupuesto. Las mejores ofertas gastronómicas', 380, false),
('550e8400-e29b-41d4-a716-446655440008', 'beauty_guru', 'https://i.pravatar.cc/150?img=8', '💄 Beauty & skincare addict. Belleza accesible para todos', 560, false)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- PRODUCTOS TECNOLÓGICOS
-- =============================================

INSERT INTO ofertas (titulo, descripcion, precio_actual, precio_original, url, url_imagen, tienda, id_usuario, id_categoria, expira_en) VALUES
-- Smartphones
('iPhone 15 Pro Max 256GB', 'El iPhone más avanzado con titanio, cámara de 48MP con zoom 5x y chip A17 Pro. Pantalla Super Retina XDR de 6.7". Incluye cable USB-C y garantía de 2 años.', 1199.99, 1399.99, 'https://store.apple.com/iphone-15-pro', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-blue-titanium-select.png', 'Apple Store', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'tecnologia'), NOW() + INTERVAL '5 days'),

('Samsung Galaxy S24 Ultra 512GB', 'Smartphone premium con S Pen integrado, cámara de 200MP, zoom 100x y pantalla Dynamic AMOLED 2X de 6.8". Resistente al agua IP68.', 1049.99, 1299.99, 'https://samsung.com/galaxy-s24-ultra', 'https://images.samsung.com/is/image/samsung/p6pim/es/2401/gallery/es-galaxy-s24-ultra-s928-sm-s928bztqeub-thumb-539573045', 'Samsung', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'electronica'), NOW() + INTERVAL '7 days'),

('Google Pixel 8 Pro 128GB', 'Smartphone con IA avanzada, cámara computational photography y Magic Eraser. 7 años de actualizaciones garantizadas.', 699.99, 899.99, 'https://store.google.com/pixel-8-pro', 'https://lh3.googleusercontent.com/pixel8pro.png', 'Google Store', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'tecnologia'), NOW() + INTERVAL '10 days'),

-- Portátiles
('MacBook Air M3 13" 16GB RAM', 'Portátil ultraligero con chip M3, 16GB de memoria unificada y SSD de 512GB. Pantalla Liquid Retina de 13.6" y hasta 18 horas de batería.', 1399.99, 1699.99, 'https://apple.com/macbook-air-m3', 'https://store.storeimages.cdn-apple.com/macbook-air-m3.png', 'Apple Store', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'informatica'), NOW() + INTERVAL '12 days'),

('Dell XPS 13 Plus i7', 'Ultrabook premium con Intel Core i7-13700H, 32GB RAM, SSD 1TB y pantalla OLED 4K táctil. Ideal para profesionales creativos.', 1299.99, 1799.99, 'https://dell.com/xps-13-plus', 'https://i.dell.com/is/image/DellContent/xps-13-plus.png', 'Dell', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'informatica'), NOW() + INTERVAL '8 days'),

('ASUS ROG Strix G15 RTX 4070', 'Portátil gaming con AMD Ryzen 7, RTX 4070, 16GB DDR5 y pantalla 165Hz. Refrigeración ROG Intelligent Cooling para máximo rendimiento.', 1199.99, 1599.99, 'https://asus.com/rog-strix-g15', 'https://dlcdnwebimgs.asus.com/rog-strix-g15.png', 'ASUS', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM categorias WHERE slug = 'informatica'), NOW() + INTERVAL '6 days'),

-- Tablets y Accesorios
('iPad Pro 12.9" M2 WiFi 256GB', 'Tablet profesional con chip M2, pantalla Liquid Retina XDR y soporte para Apple Pencil 2. Perfecto para diseño y productividad.', 999.99, 1199.99, 'https://apple.com/ipad-pro', 'https://store.storeimages.cdn-apple.com/ipad-pro-12.png', 'Apple Store', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'tecnologia'), NOW() + INTERVAL '14 days'),

('Apple Watch Series 9 GPS 45mm', 'Smartwatch con chip S9, pantalla Always-On Retina más brillante y nuevas funciones de salud. Resistente al agua hasta 50 metros.', 399.99, 479.99, 'https://apple.com/watch-series-9', 'https://store.storeimages.cdn-apple.com/watch-series-9.png', 'Apple Store', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'tecnologia'), NOW() + INTERVAL '9 days'),

-- =============================================
-- VIDEOJUEGOS Y CONSOLAS
-- =============================================

('PlayStation 5 Slim + Spider-Man 2', 'Consola PS5 modelo Slim con 1TB de almacenamiento + Marvel Spider-Man 2 Digital Deluxe Edition. Stock limitado disponible.', 549.99, 649.99, 'https://playstation.com/ps5-slim-bundle', 'https://gmedia.playstation.com/ps5-slim-spiderman.png', 'PlayStation Direct', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM categorias WHERE slug = 'videojuegos'), NOW() + INTERVAL '3 days'),

('Xbox Series X + Game Pass 3 meses', 'Consola Xbox Series X con 1TB SSD + 3 meses de Xbox Game Pass Ultimate incluidos. Juega a más de 100 juegos desde el día uno.', 449.99, 549.99, 'https://xbox.com/series-x-bundle', 'https://assets.xboxservices.com/xbox-series-x.png', 'Microsoft Store', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM categorias WHERE slug = 'videojuegos'), NOW() + INTERVAL '5 days'),

('Nintendo Switch OLED Zelda Edition', 'Consola híbrida con pantalla OLED de 7" + The Legend of Zelda: Tears of the Kingdom. Edición especial con diseños únicos del juego.', 399.99, 459.99, 'https://nintendo.com/switch-oled-zelda', 'https://assets.nintendo.com/switch-oled-zelda.png', 'Nintendo Store', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM categorias WHERE slug = 'videojuegos'), NOW() + INTERVAL '11 days'),

('Baldur\'s Gate 3 Deluxe Edition PC', 'RPG del año con más de 100 horas de contenido. Incluye soundtrack digital, artbook y contenido exclusivo. Compatible con Steam Deck.', 59.99, 79.99, 'https://store.steampowered.com/baldurs-gate-3', 'https://cdn.akamai.steamstatic.com/baldurs-gate-3.jpg', 'Steam', '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM categorias WHERE slug = 'videojuegos'), NOW() + INTERVAL '20 days'),

-- =============================================
-- MODA Y ACCESORIOS
-- =============================================

('Zapatillas Nike Air Jordan 1 Retro', 'Icónicas zapatillas en colorway Chicago Bulls. Piel premium y suela de goma para máximo confort. Edición limitada disponible en todas las tallas.', 129.99, 179.99, 'https://nike.com/air-jordan-1-retro', 'https://static.nike.com/air-jordan-1-chicago.png', 'Nike', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM categorias WHERE slug = 'moda'), NOW() + INTERVAL '7 days'),

('Chaqueta Adidas Originals Trefoil', 'Chaqueta vintage con logo Trefoil bordado. Fabricada en algodón orgánico. Disponible en negro, blanco y azul marino. Tallas S-XXL.', 69.99, 99.99, 'https://adidas.com/trefoil-jacket', 'https://assets.adidas.com/trefoil-jacket.png', 'Adidas', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM categorias WHERE slug = 'moda'), NOW() + INTERVAL '12 days'),

('Reloj Casio G-Shock GA-2100', 'Reloj resistente a golpes con diseño octagonal inspirado en el DW-5000C original. Resistente al agua hasta 200m. Batería de 3 años.', 89.99, 119.99, 'https://casio.com/g-shock-ga2100', 'https://gshock.casio.com/ga-2100.png', 'Casio', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM categorias WHERE slug = 'moda'), NOW() + INTERVAL '15 days'),

-- =============================================
-- HOGAR Y DECORACIÓN
-- =============================================

('Robot Aspirador Roomba j7+ Combo', 'Robot 2 en 1 que aspira y friega. Reconocimiento de objetos con IA, base de autovaciado y mapeado inteligente. Compatible con Alexa y Google.', 699.99, 999.99, 'https://irobot.com/roomba-j7-combo', 'https://www.irobot.com/roomba-j7-combo.png', 'iRobot', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM categorias WHERE slug = 'hogar'), NOW() + INTERVAL '8 days'),

('Philips Hue Kit Iniciación Color', 'Kit de 3 bombillas LED inteligentes + Bridge. 16 millones de colores, control por app y compatible con Alexa, Google y Siri.', 149.99, 199.99, 'https://philips.com/hue-starter-kit', 'https://www.philips.com/hue-color-kit.png', 'Philips', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM categorias WHERE slug = 'hogar'), NOW() + INTERVAL '10 days'),

('Cafetera Nespresso Vertuo Next', 'Cafetera de cápsulas con tecnología Centrifusion. Prepara café y espresso con crema natural. Incluye 12 cápsulas de degustación.', 119.99, 169.99, 'https://nespresso.com/vertuo-next', 'https://www.nespresso.com/vertuo-next.png', 'Nespresso', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM categorias WHERE slug = 'hogar'), NOW() + INTERVAL '13 days'),

-- =============================================
-- DEPORTES Y FITNESS
-- =============================================

('Bicicleta Eléctrica Xiaomi Mi Smart', 'E-bike plegable con motor de 250W, batería de 45km autonomía y frenos de disco. App Mi Home para estadísticas y control remoto.', 499.99, 699.99, 'https://xiaomi.com/mi-electric-scooter', 'https://cdn.mi.com/mi-ebike.png', 'Xiaomi', '550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM categorias WHERE slug = 'deportes'), NOW() + INTERVAL '6 days'),

('Pulsera Fitness Garmin Vivosmart 5', 'Monitor de actividad con GPS, pulsómetro 24/7 y hasta 7 días de batería. Seguimiento del sueño y notificaciones smart.', 129.99, 179.99, 'https://garmin.com/vivosmart-5', 'https://static.garmin.com/vivosmart-5.png', 'Garmin', '550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM categorias WHERE slug = 'deportes'), NOW() + INTERVAL '14 days'),

-- =============================================
-- SERVICIOS DIGITALES
-- =============================================

('Suscripción Adobe Creative Cloud', 'Acceso completo a todas las aplicaciones de Adobe: Photoshop, Illustrator, Premiere Pro, After Effects y más. Incluye 100GB de almacenamiento.', 39.99, 59.99, 'https://adobe.com/creative-cloud', 'https://www.adobe.com/cc-all-apps.png', 'Adobe', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'tecnologia'), NOW() + INTERVAL '30 days'),

('Curso Udemy Desarrollo Web Completo', 'Aprende HTML, CSS, JavaScript, React, Node.js y MongoDB. 40+ horas de contenido con certificado de finalización. Acceso de por vida.', 19.99, 89.99, 'https://udemy.com/web-development-bootcamp', 'https://img-c.udemycdn.com/course/web-dev.jpg', 'Udemy', '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categorias WHERE slug = 'libros'), NOW() + INTERVAL '25 days'),

('Netflix Premium 4K - 6 meses', 'Suscripción premium con acceso a contenido en 4K Ultra HD en hasta 4 dispositivos simultáneamente. Sin publicidad y descarga offline.', 89.99, 119.94, 'https://netflix.com/premium-plan', 'https://assets.nflxext.com/netflix-premium.png', 'Netflix', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM categorias WHERE slug = 'viajes'), NOW() + INTERVAL '18 days'),

-- =============================================
-- VIAJES Y EXPERIENCIAS
-- =============================================

('Vuelo Madrid-Londres ida y vuelta', 'Vuelos directos con British Airways. Incluye equipaje de mano y selección de asiento. Fechas flexibles disponibles para marzo-mayo 2024.', 89.99, 159.99, 'https://britishairways.com/madrid-london', 'https://www.britishairways.com/flights-madrid-london.jpg', 'British Airways', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM categorias WHERE slug = 'viajes'), NOW() + INTERVAL '4 days'),

('Hotel 5* Roma Centro - 3 noches', 'Hotel boutique en el corazón de Roma, cerca del Coliseo. Desayuno buffet incluido, WiFi gratis y gimnasio. Cancelación gratuita hasta 24h antes.', 199.99, 299.99, 'https://booking.com/hotel-roma-centro', 'https://cf.bstatic.com/hotel-roma.jpg', 'Booking.com', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM categorias WHERE slug = 'viajes'), NOW() + INTERVAL '12 days'),

-- =============================================
-- ALIMENTACIÓN GOURMET
-- =============================================

('Jamón Ibérico 100% Bellota 5J', 'Jamón ibérico de bellota con 36 meses de curación. Cortado a cuchillo por maestros jamoneros. Incluye soporte y cuchillo jamonero.', 179.99, 249.99, 'https://jamonescincojotas.com/jamon-bellota', 'https://www.5j.es/jamon-bellota-5j.jpg', 'Cinco Jotas', '550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM categorias WHERE slug = 'alimentacion'), NOW() + INTERVAL '9 days'),

('Kit de Cata de Vinos Ribera del Duero', 'Selección de 6 vinos premium de diferentes bodegas con maridaje recomendado. Incluye guía de cata y notas del sommelier.', 89.99, 129.99, 'https://vinoteca.com/kit-cata-ribera', 'https://static.vinoteca.com/kit-cata-ribera.jpg', 'Vinoteca', '550e8400-e29b-41d4-a716-446655440007', (SELECT id FROM categorias WHERE slug = 'alimentacion'), NOW() + INTERVAL '16 days'),

-- =============================================
-- BELLEZA Y CUIDADO PERSONAL
-- =============================================

('Set Skincare The Ordinary Completo', 'Rutina completa de 7 productos: limpiador, tónicos, serums con ácido hialurónico, niacinamida, retinol y moisturizer. Guía de uso incluida.', 49.99, 79.99, 'https://theordinary.com/skincare-set', 'https://theordinary.deciem.com/skincare-set.jpg', 'The Ordinary', '550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM categorias WHERE slug = 'belleza'), NOW() + INTERVAL '11 days'),

('Perfume Chanel Bleu de Chanel EDT', 'Eau de Toilette para hombre de 100ml. Fragancia woody aromatic con notas de limón, menta y madera de cedro. Incluye muestra gratuita.', 89.99, 119.99, 'https://chanel.com/bleu-de-chanel', 'https://www.chanel.com/bleu-chanel-edt.jpg', 'Chanel', '550e8400-e29b-41d4-a716-446655440008', (SELECT id FROM categorias WHERE slug = 'belleza'), NOW() + INTERVAL '8 days'),

-- =============================================
-- MASCOTAS
-- =============================================

('Comedero Automático SureFlap', 'Comedero inteligente con reconocimiento de microchip. Mantiene la comida fresca y evita que otras mascotas roben la comida. App incluida.', 149.99, 199.99, 'https://surepetcare.com/comedero-automatico', 'https://www.surepetcare.com/comedero-auto.jpg', 'SureFlap', '550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM categorias WHERE slug = 'mascotas'), NOW() + INTERVAL '17 days'),

-- =============================================
-- LIBROS Y EDUCACIÓN
-- =============================================

('Colección Harry Potter Ilustrada', 'Los 7 libros de Harry Potter con ilustraciones de Jim Kay. Edición especial en tapa dura con estuche coleccionista. Texto en español.', 149.99, 199.99, 'https://casadellibro.com/harry-potter-ilustrado', 'https://imagessl.casadellibro.com/hp-ilustrado.jpg', 'Casa del Libro', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM categorias WHERE slug = 'libros'), NOW() + INTERVAL '22 days'),

-- =============================================
-- JUGUETES Y ENTRETENIMIENTO
-- =============================================

('LEGO Creator Expert Big Ben', 'Set de construcción LEGO de 4163 piezas del icónico Big Ben de Londres. Incluye detalles arquitectónicos precisos y base para exposición.', 199.99, 249.99, 'https://lego.com/creator-expert-big-ben', 'https://www.lego.com/bigben-creator.jpg', 'LEGO', '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM categorias WHERE slug = 'juguetes'), NOW() + INTERVAL '19 days');

-- =============================================
-- INSERTAR VOTOS REALISTAS
-- =============================================

INSERT INTO votos (id_oferta, id_usuario, tipo_voto) VALUES
-- iPhone 15 Pro Max (muy popular)
((SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%'), '550e8400-e29b-41d4-a716-446655440002', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%'), '550e8400-e29b-41d4-a716-446655440003', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%'), '550e8400-e29b-41d4-a716-446655440004', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%'), '550e8400-e29b-41d4-a716-446655440005', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%'), '550e8400-e29b-41d4-a716-446655440006', 'up'),

-- PlayStation 5 (popular entre gamers)
((SELECT id FROM ofertas WHERE titulo LIKE 'PlayStation 5%'), '550e8400-e29b-41d4-a716-446655440001', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'PlayStation 5%'), '550e8400-e29b-41d4-a716-446655440002', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'PlayStation 5%'), '550e8400-e29b-41d4-a716-446655440004', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'PlayStation 5%'), '550e8400-e29b-41d4-a716-446655440007', 'up'),

-- Roomba (útil para el hogar)
((SELECT id FROM ofertas WHERE titulo LIKE 'Robot Aspirador%'), '550e8400-e29b-41d4-a716-446655440001', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Robot Aspirador%'), '550e8400-e29b-41d4-a716-446655440005', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Robot Aspirador%'), '550e8400-e29b-41d4-a716-446655440008', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Robot Aspirador%'), '550e8400-e29b-41d4-a716-446655440007', 'down'),

-- MacBook Air (popular entre profesionales)
((SELECT id FROM ofertas WHERE titulo LIKE 'MacBook Air%'), '550e8400-e29b-41d4-a716-446655440002', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'MacBook Air%'), '550e8400-e29b-41d4-a716-446655440003', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'MacBook Air%'), '550e8400-e29b-41d4-a716-446655440006', 'up'),

-- Zapatillas Nike (moda)
((SELECT id FROM ofertas WHERE titulo LIKE 'Zapatillas Nike%'), '550e8400-e29b-41d4-a716-446655440003', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Zapatillas Nike%'), '550e8400-e29b-41d4-a716-446655440006', 'up'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Zapatillas Nike%'), '550e8400-e29b-41d4-a716-446655440008', 'up');

-- =============================================
-- INSERTAR COMENTARIOS REALISTAS
-- =============================================

INSERT INTO comentarios (id_oferta, id_usuario, contenido) VALUES
-- iPhone 15 Pro Max
((SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%'), '550e8400-e29b-41d4-a716-446655440002', '¡Increíble oferta! Lo acabo de comprar y la entrega fue súper rápida. La cámara es una bestialidad 📸'),
((SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%'), '550e8400-e29b-41d4-a716-446655440003', 'Ojo que en Amazon está 50€ más caro ahora mismo. Esta es la mejor oferta que he visto'),
((SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%'), '550e8400-e29b-41d4-a716-446655440004', 'Vengo del iPhone 12 Pro y la diferencia es abismal. El titanio se siente premium 💯'),

-- PlayStation 5
((SELECT id FROM ofertas WHERE titulo LIKE 'PlayStation 5%'), '550e8400-e29b-41d4-a716-446655440001', 'Por fin conseguí una PS5 a precio decente! Spider-Man 2 es espectacular 🕷️'),
((SELECT id FROM ofertas WHERE titulo LIKE 'PlayStation 5%'), '550e8400-e29b-41d4-a716-446655440002', 'Compré una hace 2 semanas y llegó perfecta. El juego viene sellado y funcionando'),
((SELECT id FROM ofertas WHERE titulo LIKE 'PlayStation 5%'), '550e8400-e29b-41d4-a716-446655440004', 'Stock agotado ya? Era demasiado buena para durar mucho 😅'),

-- Roomba
((SELECT id FROM ofertas WHERE titulo LIKE 'Robot Aspirador%'), '550e8400-e29b-41d4-a716-446655440005', 'Tengo el modelo anterior y me cambió la vida. Este j7+ es aún mejor, reconoce todo'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Robot Aspirador%'), '550e8400-e29b-41d4-a716-446655440008', 'Lo uso desde hace 6 meses. La función de fregado es top pero hay que cambiar la mopa seguido'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Robot Aspirador%'), '550e8400-e29b-41d4-a716-446655440007', 'Para el precio creo que el Xiaomi Robot Vacuum es mejor opción. Este es sobrevalorado'),

-- MacBook Air M3
((SELECT id FROM ofertas WHERE titulo LIKE 'MacBook Air%'), '550e8400-e29b-41d4-a716-446655440002', 'Perfecto para desarrollo web. Con 16GB de RAM va súper fluido con Docker y VS Code'),
((SELECT id FROM ofertas WHERE titulo LIKE 'MacBook Air%'), '550e8400-e29b-41d4-a716-446655440003', 'La batería dura TODO el día. Trabajo 8-10 horas sin necesidad de cargador'),

-- Zapatillas Nike
((SELECT id FROM ofertas WHERE titulo LIKE 'Zapatillas Nike%'), '550e8400-e29b-41d4-a716-446655440006', 'Las uso para correr y están perfectas. El colorway Chicago es icónico 🔥'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Zapatillas Nike%'), '550e8400-e29b-41d4-a716-446655440008', 'Calidad precio está bien pero prefiero las Adidas para uso diario'),

-- Samsung Galaxy S24 Ultra
((SELECT id FROM ofertas WHERE titulo LIKE 'Samsung Galaxy S24%'), '550e8400-e29b-41d4-a716-446655440003', 'El S Pen es genial para tomar notas. La cámara con zoom 100x es una locura'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Samsung Galaxy S24%'), '550e8400-e29b-41d4-a716-446655440001', 'Android 14 con One UI 6 va súper fluido. 7 años de actualizaciones es un plus'),

-- Jamón Ibérico
((SELECT id FROM ofertas WHERE titulo LIKE 'Jamón Ibérico%'), '550e8400-e29b-41d4-a716-446655440008', 'Lo pedí para Navidad y la calidad es excepcional. El cortado a cuchillo marca la diferencia'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Jamón Ibérico%'), '550e8400-e29b-41d4-a716-446655440004', 'Caro pero merece la pena para ocasiones especiales. El soporte jamonero está genial'),

-- Bicicleta eléctrica
((SELECT id FROM ofertas WHERE titulo LIKE 'Bicicleta Eléctrica%'), '550e8400-e29b-41d4-a716-446655440006', 'La uso para ir al trabajo todos los días. 45km de autonomía son más que suficientes'),
((SELECT id FROM ofertas WHERE titulo LIKE 'Bicicleta Eléctrica%'), '550e8400-e29b-41d4-a716-446655440005', 'Se pliega super fácil y cabe en el maletero. Perfecta para combinar con transporte público');

-- =============================================
-- INSERTAR NOTIFICACIONES DE EJEMPLO
-- =============================================

INSERT INTO notificaciones (id_usuario, tipo, mensaje, datos) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'nuevo_comentario', 'Alguien comentó en tu oferta "iPhone 15 Pro Max 256GB"', '{"oferta_id": "' || (SELECT id FROM ofertas WHERE titulo LIKE 'iPhone 15 Pro Max%') || '", "comentario_usuario": "moda_deals"}'),
('550e8400-e29b-41d4-a716-446655440003', 'nuevo_voto', 'Tu oferta "PlayStation 5 Slim + Spider-Man 2" recibió 4 votos positivos', '{"oferta_id": "' || (SELECT id FROM ofertas WHERE titulo LIKE 'PlayStation 5%') || '", "votos": 4}'),
('550e8400-e29b-41d4-a716-446655440002', 'oferta_popular', 'Tu oferta "Zapatillas Nike Air Jordan 1 Retro" está siendo muy popular', '{"oferta_id": "' || (SELECT id FROM ofertas WHERE titulo LIKE 'Zapatillas Nike%') || '", "vistas": 150}'),
('550e8400-e29b-41d4-a716-446655440004', 'precio_bajada', 'El precio del "Robot Aspirador Roomba j7+" ha bajado aún más', '{"oferta_id": "' || (SELECT id FROM ofertas WHERE titulo LIKE 'Robot Aspirador%') || '", "precio_anterior": 749.99, "precio_actual": 699.99}'),
('550e8400-e29b-41d4-a716-446655440005', 'oferta_expira', 'Tu oferta "Vuelo Madrid-Londres" expira en 24 horas', '{"oferta_id": "' || (SELECT id FROM ofertas WHERE titulo LIKE 'Vuelo Madrid-Londres%') || '", "expira_en": "24 horas"}');

-- =============================================
-- ACTUALIZAR CONTADORES
-- =============================================

-- Actualizar contadores de votos y comentarios en todas las ofertas
UPDATE ofertas SET 
    votos_positivos = (SELECT COUNT(*) FROM votos WHERE votos.id_oferta = ofertas.id AND tipo_voto = 'up'),
    votos_negativos = (SELECT COUNT(*) FROM votos WHERE votos.id_oferta = ofertas.id AND tipo_voto = 'down'),
    contador_comentarios = (SELECT COUNT(*) FROM comentarios WHERE comentarios.id_oferta = ofertas.id),
    contador_vistas = FLOOR(RANDOM() * 500) + 50; -- Vistas aleatorias entre 50-550

-- Actualizar puntuación de reputación basada en la actividad
UPDATE perfiles_usuario SET 
    puntuacion_reputacion = puntuacion_reputacion + (
        SELECT COALESCE(SUM(o.votos_positivos * 10 - o.votos_negativos * 5), 0)
        FROM ofertas o 
        WHERE o.id_usuario = perfiles_usuario.id
    );
