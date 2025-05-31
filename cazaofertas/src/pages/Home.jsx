import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { 
  FaFire, FaStar, FaClock, FaTag, FaArrowRight, FaStoreAlt, 
  FaMobileAlt, FaUsers, FaPercent, FaShoppingCart, FaHandshake,
  FaChevronLeft, FaChevronRight, FaBell, FaTrophy, FaShieldAlt
} from 'react-icons/fa';
import { motion, useAnimation, useInView } from 'framer-motion';
import OfferCard from '../components/OfferCard';
import RecommendedOffers from '../components/RecommendedOffers';
import { initializeAllAnimations } from '../utils/animationHelpers';
import ImagePreloader from '../components/ImagePreloader';
import useImagePreload from '../hooks/useImagePreload';

console.log('Home.jsx: Iniciando renderizado del componente Home');

const Home = () => {
  console.log('Home.jsx: Ejecutando función de componente Home');
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activePhoneSection, setActivePhoneSection] = useState(0); // For phone presentation
  const [featuresVisible, setFeaturesVisible] = useState(false); // Estado para visibilidad de características

  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const communityRef = useRef(null);

  // Animation controls
  const controls = useAnimation();
  const isHeroInView = useInView(heroRef, { once: false });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px 0px" });
  const isStatsInView = useInView(statsRef, { once: true });
  const isCommunityInView = useInView(communityRef, { once: true });
  // Cargar datos al montar el componente
  useEffect(() => {
    console.log('Home.jsx: useEffect para cargar ofertas');
    const loadOffers = async () => {
      try {
        // Seleccionar ofertas destacadas aleatoriamente
        const randomOffers = [...mockData.ofertas].sort(() => 0.5 - Math.random()).slice(0, 8);
          // Asegúrate de que todas las ofertas tienen una URL de imagen válida
        setFeaturedOffers(randomOffers);
        
        // Simular una carga
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading offers:', error);
        setIsLoading(false);
      }
    };
    
    loadOffers();
    // Inicializar animaciones
    initializeAllAnimations();
  }, []);
  
  // Handle animation control when sections come into view
  useEffect(() => {
    if (isFeaturesInView) {
      controls.start('visible');
      setFeaturesVisible(true); // Marcar como visible
    }
  }, [controls, isFeaturesInView]);

  // Asegurarse de que las secciones críticas se muestren incluso si la animación falla
  useEffect(() => {
    // Forzar visibilidad de secciones críticas después de un tiempo
    const timer = setTimeout(() => {
      controls.start('visible');
      setFeaturesVisible(true); // Forzar visibilidad después de un tiempo
      console.log('Forzando visibilidad de secciones críticas');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [controls]);
  
  // Carousel functions
  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev >= Math.ceil(featuredOffers.length / 4) - 1 ? 0 : prev + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev <= 0 ? Math.ceil(featuredOffers.length / 4) - 1 : prev - 1
    );
  };
  // Obtener las últimas ofertas y ofertas populares
  const latestOffers = [...mockData.ofertas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const popularOffers = [...mockData.ofertas].sort((a, b) => b.likes - a.likes).slice(0, 4);
  
  // Obtener las tiendas más activas
  const topStores = mockData.tiendas
    .slice(0, 3)
    .sort((a, b) => b.likes - a.likes)
    .map((product, index) => ({
      ...product,
      activeOffers: mockData.ofertas.filter(o => o.tiendaId === product.id).length
    }));

  // Si está cargando, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Sample categories data with icons
  const categories = [
    {
      id: 1,
      title: 'Electrónica',
      description: 'Ofertas en smartphones, portátiles, tablets y todo tipo de gadgets',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80',
      slug: 'electronica',
      icon: <FaMobileAlt />
    },
    {
      id: 2,
      title: 'Moda',
      description: 'Las últimas tendencias en ropa, calzado y accesorios con los mejores descuentos',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80',
      slug: 'moda',
      icon: <FaTag />
    },
    {
      id: 3,
      title: 'Hogar',
      description: 'Todo para tu casa: muebles, decoración, electrodomésticos y más',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80',
      slug: 'hogar',
      icon: <FaStoreAlt />
    },
    {
      id: 4,
      title: 'Videojuegos',
      description: 'Encuentra las mejores ofertas en juegos, consolas y accesorios gaming',
      image: 'https://images.unsplash.com/photo-1580327332925-a10e6cb11baa?auto=format&fit=crop&q=80',
      slug: 'videojuegos',
      icon: <FaFire />
    },
  ];
  
  // Platform features with detailed descriptions
  const features = [
    {
      icon: <FaUsers />,
      title: "Comunidad Activa",
      description: "Únete a más de 2 millones de usuarios comprometidos que comparten, validan y comentan las ofertas en tiempo real. Las mejores ofertas son votadas por la comunidad y suben automáticamente a posiciones destacadas.",
      color: "text-purple-500"
    },
    {
      icon: <FaBell />,
      title: "Alertas Personalizadas",
      description: "Configura alertas para recibir notificaciones instantáneas cuando aparezcan ofertas que coincidan con tus intereses. Define tus propios filtros por categoría, descuento mínimo, tienda o palabras clave.",
      color: "text-blue-500"
    },
    {
      icon: <FaPercent />,
      title: "Descuentos Exclusivos",
      description: "Accede a ofertas y códigos promocionales exclusivos negociados directamente con las tiendas para nuestra comunidad. Nuestros usuarios reportan un ahorro medio de 300€ mensuales gracias a estas ofertas.",
      color: "text-green-500"
    },
    {
      icon: <FaShieldAlt />,
      title: "Verificación de Calidad",
      description: "Todas las ofertas pasan por un sistema de validación comunitaria que garantiza su autenticidad. Los usuarios pueden reportar ofertas caducadas o con información incorrecta para mantener la plataforma actualizada.",
      color: "text-red-500"
    }
  ];
  
  // Platform statistics with impressive numbers
  const stats = [
    { value: "2M+", label: "Usuarios activos" },
    { value: "150K+", label: "Ofertas publicadas" },
    { value: "€52M", label: "Ahorro total" },
    { value: "4.9", label: "Valoración media" }
  ];
  
  // Testimonials from platform users
  const testimonials = [
    {
      name: "Carlos Martínez",
      role: "Usuario Premium",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Gracias a CazaOfertas he ahorrado más de 500€ en mi último portátil. La comunidad es increíblemente activa y las alertas personalizadas funcionan a la perfección."
    },
    {
      name: "Laura Torres",
      role: "Cazadora Experta",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Uso la app todos los días para encontrar chollos. He conseguido descuentos increíbles en productos que realmente necesitaba. La interfaz es intuitiva y muy fácil de usar."
    },
    {
      name: "Miguel Ángel",
      role: "Nuevo Usuario",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      text: "Me sorprendió lo rápido que encontré ofertas relevantes. El sistema de notificaciones es genial y no te bombardea con información irrelevante. ¡Totalmente recomendado!"
    }
  ];
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  // Precargar las imágenes de las ofertas destacadas para mejorar la experiencia de usuario
  /*
  useEffect(() => {
    const topOffers = [...ofertas]
      .sort((a, b) => b.votos_positivos - a.votos_positivos)
      .slice(0, 12);
  }, []);
  */

  // Phone presentation data
  const phoneFeatures = [
    {
      title: "Descubre Ofertas al Instante",
      description: "Navega por miles de ofertas actualizadas en tiempo real. Nuestra interfaz intuitiva te permite encontrar exactamente lo que buscas, desde tecnología de última generación hasta moda y viajes.",
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1000&auto=format&fit=crop", // Placeholder image
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      title: "Comunidad Activa y Colaborativa",
      description: "Únete a una comunidad de millones de cazadores de ofertas. Comparte tus hallazgos, vota por las mejores ofertas y ayuda a otros a ahorrar. ¡Juntos somos más fuertes!",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c7da?q=80&w=1000&auto=format&fit=crop", // Placeholder image
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
    {
      title: "Alertas Personalizadas Inteligentes",
      description: "No te pierdas ni una ganga. Configura alertas personalizadas para tus productos y categorías favoritas. Te notificaremos al instante cuando aparezca una oferta que te interese.",
      image: "https://images.unsplash.com/photo-1505238680356-667803448bb6?q=80&w=1000&auto=format&fit=crop", // Placeholder image
      bgColor: "bg-gradient-to-br from-green-500 to-teal-600",
    },
    {
      title: "Guarda y Organiza tus Favoritos",
      description: "Crea tu lista de deseos y guarda las ofertas que más te gusten. Organiza tus futuras compras y accede a ellas fácilmente desde cualquier dispositivo. Planificar tus compras nunca fue tan sencillo.",
      image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=1000&auto=format&fit=crop", // Placeholder image
      bgColor: "bg-gradient-to-br from-yellow-500 to-orange-600",
    }
  ];
  
  return (
    <div className="space-y-16">
      {/* Componente para precargar imágenes en segundo plano */}
      <ImagePreloader limit={15} />
      
      {/* Hero presentation section with Apple/Samsung style */}
      <section ref={heroRef} className="hero-presentation -mt-8 -mx-4 lg:-mx-8 px-4 py-12 md:py-24 relative overflow-hidden">
        <div className="decoration-circle w-96 h-96 -left-20 -top-20"></div>
        <div className="decoration-circle w-80 h-80 right-10 top-40"></div>
        <div className="decoration-circle w-72 h-72 left-20 bottom-20"></div>
        
        <motion.div 
          className="container mx-auto max-w-5xl text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-4 md:mb-6">
            <motion.div 
              className="text-reveal mb-1 md:mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-white/80 text-sm md:text-lg font-medium tracking-wider">DESCUBRE</span>
            </motion.div>
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-7xl font-bold mb-4 md:mb-6 text-white tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Caza las mejores <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
                ofertas en tiempo real
              </span>
            </motion.h1>
          </div>
          
          <motion.p 
            className="text-base sm:text-lg md:text-2xl mb-6 md:mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Miles de chollos actualizados al instante por nuestra comunidad de expertos en ahorro
          </motion.p>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link 
              to="/ofertas"
              className="w-64 md:w-auto bg-white hover:bg-opacity-90 text-primary font-semibold px-6 md:px-10 py-3 md:py-4 text-base md:text-lg rounded-full flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              Explorar ahora <FaArrowRight />
            </Link>
            <div className="text-white text-sm md:text-lg flex items-center gap-2">
              <FaUsers className="text-yellow-300" /> <span>+2 millones de usuarios</span>
            </div>
          </motion.div>
        </motion.div>{/* Floating device mockup */}
        <motion.div 
          className="floating-element absolute -bottom-16 md:bottom-0 right-0 md:right-8 w-full md:w-1/3 max-w-md z-0 opacity-90"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1000" 
            alt="CazaOfertas App" 
            className="w-full h-auto transform -rotate-6"
          />
        </motion.div>
      </section>

      {/* Premium category presentation section */}
      <section className="px-4 py-10 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Descubre ofertas en todas las categorías
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Encuentra descuentos en tus productos favoritos organizados por categorías y filtrados por la comunidad
            </motion.p>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.div 
                key={category.id}
                variants={itemVariants}
                className="category-card-premium"
                style={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="category-card-premium-content">
                  <div className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{category.title}</h3>
                  <p className="text-white/80 text-sm">{category.description}</p>                  <Link to={`/categoria/${category.slug}`} className="mt-4 inline-flex items-center text-white">
                    Ver ofertas <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Phone-like scroll presentation */}
      <section className="phone-presentation-container sticky-container py-16 bg-gray-900 text-white overflow-hidden">
        <div className="container mx-auto max-w-5xl relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start"> {/* Changed to items-start for better sticky behavior */}
            {/* Text content on the left, sticky */}
            <div className="md:sticky top-24 h-auto md:h-[calc(100vh-12rem)] py-8 md:py-0 relative"> {/* Added relative and adjusted height */}
              {phoneFeatures.map((feature, index) => (
                <PhoneFeatureText 
                  key={`phone-text-${index}`}
                  index={index}
                  title={feature.title}
                  description={feature.description}
                  isActive={activePhoneSection === index}
                />
              ))}
            </div>

            {/* Phone mockup on the right */}
            <div className="relative h-[600px] md:h-[700px] flex items-center justify-center">
              <div className="w-full max-w-sm mx-auto md:sticky top-24"> {/* Made phone mockup sticky within its column */}
                <div className="relative aspect-[9/19.5] bg-black rounded-[40px] shadow-2xl border-8 border-gray-800 overflow-hidden">
                  {/* Screen content that changes */}
                  {phoneFeatures.map((feature, index) => (
                    <motion.div
                      key={`phone-screen-${index}`}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${feature.bgColor}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activePhoneSection === index ? 1 : 0 }}
                      style={{
                        backgroundImage: `url(${feature.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/30"></div>
                       <div className="absolute bottom-8 left-4 right-4 text-center p-4 bg-black/50 rounded-lg backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                   {/* Notch/Dynamic Island */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Invisible divs to trigger scroll changes. These will be below the grid content, providing scroll length. */}
          <div className="w-full mt-8"> {/* Container for scroll triggers */}
            {phoneFeatures.map((feature, index) => (
              <ScrollTriggerDiv
                key={`trigger-${index}`}
                onInViewCallback={() => {
                  // console.log(`ScrollTrigger for feature ${index} (${feature.title}) in view. Setting active section.`);
                  setActivePhoneSection(index);
                }}
                sectionHeight="75vh" // Each trigger creates a scroll "page"
              />
            ))}
          </div>
        </div>
        <div className="text-center mt-16 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Una Experiencia Móvil Inigualable
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Lleva CazaOfertas contigo a donde vayas. Nuestra aplicación móvil te ofrece todas las funcionalidades de la web en un formato optimizado para tu dispositivo. Descárgala ahora y empieza a ahorrar.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="#" className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-colors">
              Descargar para iOS
            </a>
            <a href="#" className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-colors">
              Descargar para Android
            </a>
          </div>
        </div>
      </section>

      {/* Feature highlights section - Apple style */}
      <section ref={featuresRef} className="px-4 py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto max-w-7xl">
          <div className={`text-center mb-16 ${featuresVisible ? 'opacity-100' : 'opacity-90'} transition-opacity duration-500`}>
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
            >
              Ventajas de <span className="text-primary">CazaOfertas</span>
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } }
              }}
            >
              Una plataforma diseñada para ayudarte a encontrar los mejores descuentos
            </motion.p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${featuresVisible ? 'opacity-100' : 'opacity-90'} transition-opacity duration-500`}>
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="feature-card p-8 bg-white dark:bg-gray-700/40 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                variants={{
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 0.6, delay: 0.2 * index, ease: "easeOut" } 
                  }
                }}
              >
                <div className={`${feature.color} text-3xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* Stats counter section */}
      <section ref={statsRef} className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 stats-counter"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="counter-item text-center py-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div 
                  className="counter-value text-4xl md:text-5xl font-bold mb-2" 
                  data-target={stat.value.replace(/\D/g, '')}
                >
                  {stat.value}
                </div>
                <div className="counter-label uppercase tracking-wider text-sm md:text-base opacity-80">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium carousel section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ofertas destacadas
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Las ofertas más populares seleccionadas por nuestra comunidad
            </motion.p>
          </div>
          
          <div className="premium-carousel">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-3">
                <button 
                  onClick={prevSlide} 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaChevronRight />
                </button>
              </div>
              <Link 
                to="/ofertas" 
                className="text-primary hover:text-primary-dark flex items-center gap-1 font-medium"
              >
                Ver todas las ofertas
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`
              }}
            >
              {featuredOffers.map((offer, index) => (
                <div
                  key={offer.id}
                  className={`carousel-item ${index === currentSlide ? 'active' : ''}`} // Ensure this class provides appropriate width for carousel items
                >
                  {/* Replace custom card with OfferCard component */}
                  <OfferCard offer={offer} viewMode="grid" />
                </div>
              ))}
            </div>

            <div className="carousel-nav mt-8">
              {[...Array(Math.ceil(featuredOffers.length / 4))].map((_, index) => (
                <div 
                  key={index}
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Offers - Personalized section */}
      <RecommendedOffers />

      {/* Testimonials section */}
      <section ref={communityRef} className="py-16 px-4 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Miles de personas confían en CazaOfertas para encontrar los mejores descuentos
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full mr-4 border-2 border-white/30"
                  />
                  <div>
                    <h4 className="text-white font-bold">{testimonial.name}</h4>
                    <p className="text-white/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white/90">"{testimonial.text}"</p>
                <div className="mt-4 text-amber-300 flex">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/registro" 
              className="btn-premium px-10 py-4 text-lg inline-flex items-center gap-2"
            >
              Únete ahora <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="px-4 py-20 text-center">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Comienza a ahorrar hoy mismo
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Únete a la mayor comunidad de ahorro en España y empieza a descubrir 
              ofertas increíbles todos los días.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/registro" 
                className="button-modern button-primary"
              >
                Regístrate gratis
              </Link>
              <Link 
                to="/como-funciona" 
                className="button-modern button-secondary"
              >
                Cómo funciona
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Component for individual feature text in the phone presentation
const PhoneFeatureText = ({ title, description, isActive, index }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isActive) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } });
    } else {
      controls.start({ opacity: 0, y: 20, transition: { duration: 0.3 } });
    }
  }, [isActive, controls, index]);

  return (
    <motion.div
      className={`absolute top-0 left-0 w-full`}
      animate={controls}
      initial={{ opacity: 0, y: 20 }}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{title}</h3>
      <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">{description}</p>
    </motion.div>
  );
};

// Component to trigger active section change on scroll for phone presentation
const ScrollTriggerDiv = ({ onInViewCallback, sectionHeight = '50vh' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.5, once: false });

    useEffect(() => {
      if (isInView) {
        onInViewCallback();
      }
    }, [isInView, onInViewCallback]);

    return <div ref={ref} style={{ height: sectionHeight }} />;
  };

export default Home;