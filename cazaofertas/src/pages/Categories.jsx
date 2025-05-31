import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import supabase from '../services/supabase';
import { 
  FaBoxOpen, FaChartLine, FaFire, FaClock,
  FaPercent, FaShoppingBag, FaRegLightbulb,
  FaSearch, FaFilter, FaTags, FaStar, 
  FaArrowRight, FaLightbulb, FaBolt,
  FaChevronLeft, FaChevronRight, FaInfoCircle,
  FaQuestionCircle, FaShoppingCart, FaUsers,
  FaHeart, FaTrophy, FaBullhorn, FaGift, FaBell,
  FaBellSlash
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [activeFilter, setActiveFilter] = useState('all');
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [categoryNotifPreferences, setCategoryNotifPreferences] = useState({});
  
  // Auth and notifications hooks
  const { user } = useAuth();
  const { updatePreferences, preferences, showLocalNotification } = useNotifications();

  // Swiper refs
  const swiperRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    // Initialize category notification preferences from global preferences
    if (user && preferences?.categories) {
      setCategoryNotifPreferences(preferences.categories);
    }
  }, [user, preferences]);

  const fetchCategories = async () => {
    try {
      console.log('[Categories] 🟡 Iniciando fetch de categorías');
      
      const { data, error } = await supabase
        .from('vista_estadisticas_categorias')
        .select('*');
      
      if (error) throw error;
      
      const sortedData = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      
      // Separar categorías destacadas y tendencias
      setFeaturedCategories(sortedData.filter(cat => cat.destacada));
      setTrendingCategories(sortedData.filter(cat => cat.ofertas_activas > 10).slice(0, 5));
      setCategories(sortedData);
      setLoading(false);
    } catch (error) {
      console.error('[Categories] 🔴 Error:', error);
      setError(error);
      setLoading(false);
    }
  };

  // Toggle notification preference for a specific category
  const toggleCategoryNotification = async (categoryId, enabled) => {
    if (!user) {
      toast.error('Debes iniciar sesión para gestionar notificaciones');
      return;
    }

    try {
      // Update local state first for responsive UI
      const updatedPrefs = { 
        ...categoryNotifPreferences, 
        [categoryId]: enabled 
      };
      setCategoryNotifPreferences(updatedPrefs);

      // Update global preferences
      const updatedGlobalPrefs = {
        ...preferences,
        categories: updatedPrefs
      };
      
      // Save to database via context
      await updatePreferences(updatedGlobalPrefs);
      
      // Show confirmation
      toast.success(`Notificaciones ${enabled ? 'activadas' : 'desactivadas'} para esta categoría`);
      
      // Demo notification if enabled
      if (enabled) {
        await showLocalNotification(
          'CazaOfertas - Notificaciones de Categoría', 
          {
            body: `Recibirás notificaciones de nuevas ofertas en esta categoría`,
            icon: '/path/to/category-icon.png'
          }
        );
      }
    } catch (error) {
      console.error('Error al actualizar preferencia de notificación:', error);
      toast.error('No se pudo actualizar la preferencia');
      // Revert local state on error
      setCategoryNotifPreferences({ ...categoryNotifPreferences });
    }
  };

  const getGradient = (color) => {
    const baseColor = color || '#6366f1';
    return `linear-gradient(135deg, 
      ${baseColor}22 0%, 
      ${baseColor}44 50%,
      ${baseColor}66 100%)`;
  };

  const categoryGuides = {
    shopping: [
      { title: "Comparar Precios", desc: "Revisa siempre múltiples tiendas para encontrar el mejor precio." },
      { title: "Historial de Precios", desc: "Consulta el historial para saber si es el mejor momento para comprar." },
      { title: "Opiniones Verificadas", desc: "Lee las experiencias de otros usuarios antes de decidir." },
      { title: "Alertas de Precio", desc: "Configura alertas para recibir notificaciones de bajadas de precio." }
    ],
    savings: [
      { title: "Cupones Exclusivos", desc: "Encuentra códigos de descuento especiales en cada categoría." },
      { title: "Ofertas Relámpago", desc: "Aprovecha las ofertas por tiempo limitado." },
      { title: "Programas de Fidelidad", desc: "Acumula puntos y obtén beneficios adicionales." },
      { title: "Temporadas de Ofertas", desc: "Conoce las mejores épocas para comprar cada producto." }
    ]
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <FaBoxOpen size={64} className="text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-white">No hay categorías disponibles</h3>
      <p className="mt-2 text-sm text-gray-400">
        No se encontraron categorías. Inténtalo de nuevo más tarde.
      </p>
    </div>
  );

  const renderLoading = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-3 text-gray-400">Cargando categorías...</p>
    </div>
  );

  const renderError = () => (
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 my-6">
      <div className="flex items-center">
        <FaInfoCircle className="text-red-400 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-red-200">No pudimos cargar las categorías</h3>
          <div className="mt-2 text-sm text-red-300">{error?.message || 'Ocurrió un error inesperado'}</div>
        </div>
      </div>
    </div>
  );

  const handleNotificationToggle = async (categoryId) => {
    try {
      const newPreferences = { ...categoryNotifPreferences };
      newPreferences[categoryId] = !newPreferences[categoryId];
      
      setCategoryNotifPreferences(newPreferences);
      
      // Update user preferences in the backend
      if (user) {
        await updatePreferences({ categories: newPreferences });
        toast.success('Preferencias de notificación actualizadas');
      }
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Error al actualizar preferencias');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        {/* Hero Section with Dynamic Background */}
        <div className="relative text-center mb-16 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 mix-blend-overlay"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 py-16 px-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Explora por Categorías
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Descubre un mundo de ofertas organizadas por categorías. Encuentra exactamente lo que buscas y ahorra en tus compras favoritas.
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center">
                <FaSearch className="mr-2" />
                Buscar Ofertas
              </button>
              <button 
                onClick={() => setShowGuide(true)}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center"
              >
                <FaQuestionCircle className="mr-2" />
                Guía de Compra
              </button>
            </div>
          </motion.div>
        </div>

        {/* Live Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <FaShoppingCart className="w-8 h-8 text-primary mb-4 mx-auto" />
            <h3 className="text-3xl font-bold text-white mb-2">1,234</h3>
            <p className="text-gray-400">Ofertas Activas</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <FaUsers className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
            <h3 className="text-3xl font-bold text-white mb-2">15K+</h3>
            <p className="text-gray-400">Cazadores de Ofertas</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <FaPercent className="w-8 h-8 text-green-500 mb-4 mx-auto" />
            <h3 className="text-3xl font-bold text-white mb-2">45%</h3>
            <p className="text-gray-400">Ahorro Medio</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
          >
            <FaHeart className="w-8 h-8 text-red-500 mb-4 mx-auto" />
            <h3 className="text-3xl font-bold text-white mb-2">98%</h3>
            <p className="text-gray-400">Satisfacción</p>
          </motion.div>
        </div>

        {/* Featured Categories Carousel */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <FaTrophy className="mr-3 text-yellow-500" />
                Categorías Destacadas
              </h2>
              <p className="text-gray-400">Las categorías más populares con los mejores descuentos</p>
            </div>
          </div>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="categories-swiper"
          >
            {featuredCategories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link 
                  to={`/categoria/${category.slug}`}
                  className="block bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div 
                    className="h-48 p-6 relative"
                    style={{ background: getGradient(category.color) }}
                  >
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                        DESTACADA
                      </span>
                    </div>
                    <div className="flex flex-col h-full justify-between">
                      <div className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl">
                        {category.icono || '🔍'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{category.nombre}</h3>
                        <p className="text-white/80">{category.ofertas_activas} ofertas activas</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-12 bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
              <FaSearch className="mr-2" />
              Encuentra tu Categoría Ideal
            </h3>
            <p className="text-gray-400">Utiliza los filtros para encontrar exactamente lo que buscas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-2">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de categoría..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select 
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Más populares</option>
                <option value="recent">Más recientes</option>
                <option value="discount">Mayor descuento</option>
                <option value="name">Alfabéticamente</option>
              </select>
            </div>
            <div>
              <button className="w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center justify-center transition-colors">
                <FaFilter className="mr-2" />
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Category Guides Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Guías de Compra por Categoría</h2>
            <p className="text-gray-400">Aprende a sacar el máximo provecho de cada categoría</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <FaShoppingCart className="text-primary text-2xl mr-4" />
                <h3 className="text-xl font-semibold text-white">Consejos de Compra</h3>
              </div>
              <div className="space-y-4">
                {categoryGuides.shopping.map((guide, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-4 mt-1">
                      <span className="text-primary font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{guide.title}</h4>
                      <p className="text-gray-400 text-sm">{guide.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center mb-6">
                <FaGift className="text-green-500 text-2xl mr-4" />
                <h3 className="text-xl font-semibold text-white">Maximiza tu Ahorro</h3>
              </div>
              <div className="space-y-4">
                {categoryGuides.savings.map((guide, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 mt-1">
                      <span className="text-green-500 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{guide.title}</h4>
                      <p className="text-gray-400 text-sm">{guide.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <FaFire className="mr-3 text-orange-500" />
                Categorías en Tendencia
              </h2>
              <p className="text-gray-400">Las categorías más activas en este momento</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {trendingCategories.map((category, index) => (
              <Link 
                key={category.id}
                to={`/categoria/${category.slug}`}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:bg-gray-700/50 transition-colors group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center text-2xl mr-4">
                    {category.icono || '🔍'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold group-hover:text-primary-light transition-colors">
                      {category.nombre}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {category.ofertas_activas} ofertas activas
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <FaChartLine className="mr-2 text-green-500" />
                  <span>{Math.round(category.descuento_promedio)}% desc. medio</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Categories Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Todas las Categorías</h2>
            <p className="text-gray-400">Explora nuestro catálogo completo de categorías</p>
          </div>
          
          {loading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : categories.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link 
                    to={`/categoria/${category.slug}`} 
                    className="block bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-700/50"
                  >
                    <div 
                      className="h-48 p-6 relative overflow-hidden"
                      style={{ background: getGradient(category.color) }}
                    >
                      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <div className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl">
                            {category.icono || '🔍'}
                          </div>
                          <div className="flex items-center gap-2">
                            {user && (
                              <button 
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent navigation
                                  toggleCategoryNotification(
                                    category.id, 
                                    !categoryNotifPreferences[category.id]
                                  );
                                }}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 text-white hover:bg-white/20 transition-colors"
                                aria-label={`${categoryNotifPreferences[category.id] ? 'Desactivar' : 'Activar'} notificaciones para ${category.nombre}`}
                                title={`${categoryNotifPreferences[category.id] ? 'Desactivar' : 'Activar'} notificaciones`}
                              >
                                {categoryNotifPreferences[category.id] ? <FaBell /> : <FaBellSlash />}
                              </button>
                            )}
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1 text-sm text-white font-medium">
                              {category.ofertas_activas || 0} ofertas activas
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-8">
                          <h2 className="text-2xl font-bold text-white group-hover:text-primary-light transition-colors">
                            {category.nombre}
                          </h2>
                          <p className="text-gray-300 mt-2 line-clamp-2">
                            Encuentra las mejores ofertas en {category.nombre.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 backdrop-blur-sm p-4 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 rounded-lg bg-gray-700/30">
                          <span className="block text-green-400 text-lg font-bold">
                            {Math.round(category.descuento_promedio || 0)}%
                          </span>
                          <span className="text-sm text-gray-400">Desc. medio</span>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-gray-700/30">
                          <span className="block text-primary-light text-lg font-bold">
                            {category.total_ofertas || 0}
                          </span>
                          <span className="text-sm text-gray-400">Total ofertas</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <span className="inline-flex items-center text-primary hover:text-primary-light font-medium transition-colors">
                          Ver todas las ofertas
                          <FaArrowRight className="ml-2" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-8 border border-gray-700/50">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block p-3 bg-primary/20 rounded-full mb-6">
                <FaBullhorn className="text-3xl text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                ¿Quieres recibir las mejores ofertas?
              </h2>
              <p className="text-gray-300 mb-8">
                Suscríbete a nuestro newsletter y recibe alertas personalizadas de las categorías que más te interesan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="px-6 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors whitespace-nowrap">
                  Suscribirme
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Help Section */}
        <div className="text-center">
          <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">¿Necesitas ayuda?</h2>
            <p className="text-gray-400 mb-6">
              ¿No encuentras lo que buscas o tienes dudas sobre alguna categoría? Nuestro equipo está aquí para ayudarte.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contacto" 
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                Contactar Soporte
              </Link>
              <Link 
                to="/preguntas-frecuentes"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Ver FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;