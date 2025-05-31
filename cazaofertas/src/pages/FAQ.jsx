import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChevronDown, FaChevronUp, FaQuestionCircle, FaArrowRight, FaTicketAlt, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { getFaqs } from '../services/supabase';
import toast from 'react-hot-toast';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpfulFeedback, setHelpfulFeedback] = useState({});

  const categories = [
    { id: 'all', name: 'Todas las preguntas' },
    { id: 'pedidos', name: 'Pedidos y envíos' },
    { id: 'pagos', name: 'Pagos y facturación' },
    { id: 'productos', name: 'Productos y ofertas' },
    { id: 'cuenta', name: 'Mi cuenta' },
    { id: 'devoluciones', name: 'Devoluciones' }
  ];

  // Datos para mostrar mientras se implementa la base de datos
  const demoFaqs = [
    {
      id: 1,
      pregunta: '¿Cómo puedo realizar un seguimiento de mi pedido?',
      respuesta: 'Puedes realizar un seguimiento de tu pedido accediendo a la sección "Mis Pedidos" en tu cuenta. Allí encontrarás todos tus pedidos y podrás hacer clic en cualquiera de ellos para ver su estado actual, detalles de envío y seguimiento. También recibirás notificaciones por correo electrónico cuando el estado de tu pedido cambie.',
      categoria: 'pedidos',
      orden: 1
    },
    {
      id: 2,
      pregunta: '¿Cuáles son los métodos de pago aceptados?',
      respuesta: 'Aceptamos diversas formas de pago para tu comodidad:\n\n- Tarjetas de crédito/débito (Visa, Mastercard, American Express)\n- PayPal\n- Transferencia bancaria\n- Pago contra reembolso (con cargo adicional)\n\nTodos los pagos se procesan de forma segura mediante conexiones encriptadas.',
      categoria: 'pagos',
      orden: 1
    },
    {
      id: 3,
      pregunta: '¿Cómo puedo cambiar mi contraseña o datos personales?',
      respuesta: 'Para cambiar tu contraseña o actualizar tus datos personales:\n\n1. Inicia sesión en tu cuenta\n2. Ve a la sección "Mi Perfil"\n3. Para cambiar la contraseña, haz clic en "Cambiar contraseña"\n4. Para actualizar datos personales, modifica los campos correspondientes y haz clic en "Guardar cambios"\n\nTus datos siempre se mantienen seguros y cifrados en nuestra base de datos.',
      categoria: 'cuenta',
      orden: 1
    },
    {
      id: 4,
      pregunta: '¿Cuál es la política de devoluciones?',
      respuesta: 'Nuestra política de devoluciones contempla un plazo de 14 días naturales desde la recepción del producto para solicitar la devolución. El producto debe estar en perfectas condiciones, con el embalaje original y todos los accesorios. Para iniciar una devolución, accede a la sección "Mis Pedidos", selecciona el pedido correspondiente y haz clic en "Solicitar devolución". Una vez aprobada la devolución, te enviaremos instrucciones sobre cómo proceder con el envío.',
      categoria: 'devoluciones',
      orden: 1
    },
    {
      id: 5,
      pregunta: '¿Cómo puedo guardar una oferta para más tarde?',
      respuesta: 'Para guardar una oferta que te interese y verla más tarde:\n\n1. Haz clic en el icono de "guardar" (símbolo de marcador) que aparece en cada oferta\n2. La oferta se añadirá automáticamente a tu sección "Ofertas guardadas"\n3. Puedes acceder a tus ofertas guardadas desde el menú de usuario\n\nAdemás, puedes activar notificaciones para recibir alertas cuando las ofertas guardadas estén a punto de expirar.',
      categoria: 'productos',
      orden: 1
    },
    {
      id: 6,
      pregunta: '¿Los precios incluyen IVA?',
      respuesta: 'Sí, todos los precios mostrados en nuestra plataforma incluyen IVA. El desglose del IVA aparecerá en tu factura, que podrás descargar desde la sección "Mis Pedidos".',
      categoria: 'pagos',
      orden: 2
    },
    {
      id: 7,
      pregunta: '¿Cuánto tiempo tarda en llegar un pedido?',
      respuesta: 'El tiempo de entrega varía según el tipo de envío seleccionado:\n\n- Envío estándar: 3-5 días laborables\n- Envío exprés: 1-2 días laborables\n- Envío internacional: 7-14 días laborables\n\nEstos plazos son estimados y pueden variar según la ubicación geográfica y la disponibilidad del producto. Puedes consultar el tiempo estimado de entrega durante el proceso de compra.',
      categoria: 'pedidos',
      orden: 2
    },
    {
      id: 8,
      pregunta: '¿Cómo puedo cancelar un pedido?',
      respuesta: 'Para cancelar un pedido:\n\n1. Accede a "Mis Pedidos" en tu cuenta\n2. Selecciona el pedido que deseas cancelar\n3. Haz clic en "Cancelar pedido"\n\nSolo es posible cancelar pedidos que aún no hayan sido enviados. Si el pedido ya ha sido procesado para envío, tendrás que esperar a recibirlo y luego solicitar una devolución. Para cualquier duda, puedes contactar con nuestro servicio de soporte.',
      categoria: 'pedidos',
      orden: 3
    },
    {
      id: 9,
      pregunta: '¿Cómo puedo contactar con el servicio de atención al cliente?',
      respuesta: 'Puedes contactar con nuestro servicio de atención al cliente de varias formas:\n\n- Chat en línea: disponible en horario laboral en nuestra web\n- Email: soporte@cazaofertas.com\n- Teléfono: +34 911 23 45 67 (L-V 9:00-18:00)\n- Formulario de contacto en la sección "Soporte"\n\nNuestro tiempo de respuesta habitual es de 24-48 horas en días laborables.',
      categoria: 'cuenta',
      orden: 2
    },
    {
      id: 10,
      pregunta: '¿Cómo puedo publicar una oferta?',
      respuesta: 'Para publicar una oferta en nuestra plataforma:\n\n1. Inicia sesión en tu cuenta\n2. Haz clic en "Publicar oferta" en el menú principal\n3. Rellena el formulario con los detalles de la oferta (título, descripción, precio, enlace, etc.)\n4. Añade una imagen si es posible\n5. Selecciona la categoría adecuada\n6. Haz clic en "Publicar"\n\nTu oferta será revisada por nuestro equipo antes de ser publicada para garantizar su calidad y veracidad.',
      categoria: 'productos',
      orden: 2
    },
    {
      id: 11,
      pregunta: '¿Qué hago si recibo un producto defectuoso?',
      respuesta: 'Si recibes un producto defectuoso:\n\n1. Toma fotografías que muestren claramente el defecto\n2. Accede a "Mis Pedidos" y selecciona el pedido correspondiente\n3. Haz clic en "Reportar problema" e indica que has recibido un producto defectuoso\n4. Adjunta las fotografías como evidencia\n5. Nuestro equipo revisará tu caso y te contactará con instrucciones sobre cómo proceder\n\nGeneralmente ofrecemos reembolso completo o reemplazo del producto en estos casos.',
      categoria: 'devoluciones',
      orden: 2
    },
    {
      id: 12,
      pregunta: '¿Cómo funcionan las notificaciones de ofertas?',
      respuesta: 'Las notificaciones de ofertas te permiten estar al día de las mejores promociones según tus preferencias. Puedes configurarlas así:\n\n1. Ve a "Mi Perfil" > "Preferencias de notificaciones"\n2. Selecciona las categorías que te interesan\n3. Elige la frecuencia de notificaciones (diaria, semanal, inmediata)\n4. Activa notificaciones push, email o ambas\n\nTambién puedes recibir alertas de precio para productos específicos que estés siguiendo cuando alcancen el precio deseado.',
      categoria: 'productos',
      orden: 3
    }
  ];

  useEffect(() => {
    async function loadFaqs() {
      setLoading(true);
      try {
        // Intentar cargar desde la API
        const { data, success, error } = await getFaqs();
        
        if (success && data && data.length > 0) {
          setFaqs(data);
          setFilteredFaqs(data);
        } else {
          // Si no hay datos o hay un error, usar los datos demo
          console.log('Usando datos demo para FAQs');
          setFaqs(demoFaqs);
          setFilteredFaqs(demoFaqs);
        }
      } catch (err) {
        console.error('Error cargando FAQs:', err);
        setError('No se pudieron cargar las preguntas frecuentes');
        // Usar datos demo en caso de error
        setFaqs(demoFaqs);
        setFilteredFaqs(demoFaqs);
        toast.error('Error al cargar preguntas frecuentes');
      } finally {
        setLoading(false);
      }
    }

    loadFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [searchTerm, activeCategory, faqs]);

  const filterFaqs = () => {
    let filtered = faqs;
    
    // Filtrar por categoría
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.categoria === activeCategory);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.pregunta.toLowerCase().includes(searchLower) || 
        faq.respuesta.toLowerCase().includes(searchLower)
      );
    }
    
    // Ordenar por el campo 'orden' si existe
    filtered = [...filtered].sort((a, b) => (a.orden || 0) - (b.orden || 0));
    
    setFilteredFaqs(filtered);
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleFeedback = (id, isHelpful) => {
    setHelpfulFeedback(prev => ({
      ...prev,
      [id]: isHelpful
    }));
    
    toast.success(isHelpful 
      ? '¡Gracias por tu feedback positivo!' 
      : 'Agradecemos tu feedback. Trabajaremos para mejorar esta respuesta.'
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Preguntas Frecuentes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Encuentra respuestas rápidas a las preguntas más comunes
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/soporte" className="button-modern button-primary inline-flex items-center">
            <FaTicketAlt className="mr-2" />
            Contactar soporte
          </Link>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Busca tu pregunta aquí..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-3 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-10 text-center">
          <FaQuestionCircle className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            No encontramos preguntas que coincidan con tu búsqueda. Intenta con otros términos o contacta con nuestro soporte.
          </p>
          <Link to="/soporte" className="button-modern button-primary">
            Contactar con soporte
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden transition-all ${
                expandedItems[faq.id] ? 'ring-2 ring-primary/30' : ''
              }`}
            >
              <button
                onClick={() => toggleExpand(faq.id)}
                className="flex justify-between items-center w-full p-5 text-left"
              >
                <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                  {faq.pregunta}
                </h3>
                {expandedItems[faq.id] ? (
                  <FaChevronUp className="flex-shrink-0 text-primary" />
                ) : (
                  <FaChevronDown className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
                )}
              </button>

              {expandedItems[faq.id] && (
                <div className="p-5 pt-0 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {faq.respuesta}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                          ¿Te ha resultado útil esta respuesta?
                        </p>
                      </div>
                      
                      {helpfulFeedback[faq.id] !== undefined ? (
                        <span className={`text-sm ${
                          helpfulFeedback[faq.id] 
                            ? 'text-green-500 dark:text-green-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          Gracias por tu feedback
                        </span>
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeedback(faq.id, true);
                            }}
                            className="flex items-center space-x-1 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <FaThumbsUp className="text-gray-500 dark:text-gray-400" />
                            <span>Sí</span>
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFeedback(faq.id, false);
                            }}
                            className="flex items-center space-x-1 text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <FaThumbsDown className="text-gray-500 dark:text-gray-400" />
                            <span>No</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sección de ayuda */}
      <div className="mt-12 bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-xl p-8 relative overflow-hidden">
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ¿No encuentras la respuesta que buscas?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Nuestro equipo de soporte está listo para ayudarte con cualquier duda o problema que tengas.
          </p>
          <Link to="/soporte" className="button-modern button-primary inline-flex items-center">
            Contactar con soporte
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-10">
          <FaQuestionCircle className="text-9xl text-primary" />
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
