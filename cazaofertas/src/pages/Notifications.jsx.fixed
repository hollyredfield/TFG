import React, { useState } from 'react';
import { 
  FaBell, FaCheck, FaTrash, FaExclamationCircle, FaTag, FaInfoCircle,
  FaFilter, FaTimes, FaBox, FaShoppingCart, FaTicketAlt, FaHeart,
  FaStore, FaQuestionCircle, FaRegBell, FaMobile, FaMobileAlt, FaBellSlash,
  FaToggleOn, FaToggleOff
} from 'react-icons/fa';
import { useNotifications, NOTIFICATION_TYPES } from '../context/NotificationContext';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Simplified placeholder version that works
const Notifications = () => {
  const { user } = useAuth();
  const { 
    notifications,
    isLoading: loading, 
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
  } = useNotifications();
  
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    offers: true,
    system: true,
    promotions: true
  });

  const handleTypeFilter = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handlePreferenceChange = (key) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  const savePreferences = () => {
    updatePreferences(preferences)
      .then(() => {
        toast.success('Preferencias guardadas correctamente');
        setShowPreferences(false);
      })
      .catch(() => {
        toast.error('Error al guardar preferencias');
      });
  };

  const filteredNotifications = selectedTypes.length > 0
    ? notifications.filter(n => selectedTypes.includes(n.tipo))
    : notifications;

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-center">
          <FaExclamationCircle className="text-red-500 mr-3" />
          <p className="text-red-700">Error al cargar notificaciones. Inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaBell className="mr-2 text-primary" />
          Notificaciones
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => markAllAsRead()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm flex items-center"
          >
            <FaCheck className="mr-1" /> Marcar todas como leídas
          </button>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`${isFilterOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} hover:bg-primary hover:text-white py-2 px-4 rounded-lg text-sm flex items-center`}
          >
            <FaFilter className="mr-1" /> Filtrar
          </button>
          <button 
            onClick={() => setShowPreferences(!showPreferences)}
            className={`${showPreferences ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} hover:bg-primary hover:text-white py-2 px-4 rounded-lg text-sm flex items-center`}
          >
            <FaRegBell className="mr-1" /> Preferencias
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-white shadow rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Filtrar por tipo</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(NOTIFICATION_TYPES).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeFilter(type)}
                className={`py-1.5 px-3 rounded-full text-sm flex items-center ${
                  selectedTypes.includes(type)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {type === NOTIFICATION_TYPES.OFFER && <FaTag className="mr-1" />}
                {type === NOTIFICATION_TYPES.SYSTEM && <FaInfoCircle className="mr-1" />}
                {type === NOTIFICATION_TYPES.PROMOTION && <FaTicketAlt className="mr-1" />}
                {type === NOTIFICATION_TYPES.WISHLIST && <FaHeart className="mr-1" />}
                {type === NOTIFICATION_TYPES.STORE && <FaStore className="mr-1" />}
                {type === NOTIFICATION_TYPES.ORDER && <FaBox className="mr-1" />}
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {showPreferences && (
        <div className="bg-white shadow rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Preferencias de notificaciones</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <FaRegBell className="mr-2 text-gray-600" />
                <span>Notificaciones por email</span>
              </div>
              <button onClick={() => handlePreferenceChange('email')}>
                {preferences.email ? <FaToggleOn className="text-primary text-2xl" /> : <FaToggleOff className="text-gray-400 text-2xl" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <FaMobileAlt className="mr-2 text-gray-600" />
                <span>Notificaciones push</span>
              </div>
              <button onClick={() => handlePreferenceChange('push')}>
                {preferences.push ? <FaToggleOn className="text-primary text-2xl" /> : <FaToggleOff className="text-gray-400 text-2xl" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <FaTag className="mr-2 text-gray-600" />
                <span>Notificaciones de ofertas</span>
              </div>
              <button onClick={() => handlePreferenceChange('offers')}>
                {preferences.offers ? <FaToggleOn className="text-primary text-2xl" /> : <FaToggleOff className="text-gray-400 text-2xl" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <FaInfoCircle className="mr-2 text-gray-600" />
                <span>Notificaciones del sistema</span>
              </div>
              <button onClick={() => handlePreferenceChange('system')}>
                {preferences.system ? <FaToggleOn className="text-primary text-2xl" /> : <FaToggleOff className="text-gray-400 text-2xl" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <FaTicketAlt className="mr-2 text-gray-600" />
                <span>Promociones y descuentos</span>
              </div>
              <button onClick={() => handlePreferenceChange('promotions')}>
                {preferences.promotions ? <FaToggleOn className="text-primary text-2xl" /> : <FaToggleOff className="text-gray-400 text-2xl" />}
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setShowPreferences(false)}
              className="text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg mr-2"
            >
              Cancelar
            </button>
            <button 
              onClick={savePreferences}
              className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg"
            >
              Guardar preferencias
            </button>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaBellSlash className="text-gray-400 text-5xl mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No tienes notificaciones</h3>
            <p className="text-gray-500 mt-1">Las notificaciones aparecerán aquí</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 transition-all duration-200 hover:bg-gray-50 ${
                notification.leido ? 'opacity-70' : 'opacity-100 bg-blue-50/30'
              }`}
            >
              <div className="flex">
                <div className={`mt-1 mr-4 rounded-full p-2 ${
                  notification.tipo === NOTIFICATION_TYPES.SYSTEM ? 'bg-blue-100 text-blue-600' :
                  notification.tipo === NOTIFICATION_TYPES.OFFER ? 'bg-green-100 text-green-600' :
                  notification.tipo === NOTIFICATION_TYPES.PROMOTION ? 'bg-purple-100 text-purple-600' :
                  notification.tipo === NOTIFICATION_TYPES.WISHLIST ? 'bg-red-100 text-red-600' :
                  notification.tipo === NOTIFICATION_TYPES.STORE ? 'bg-indigo-100 text-indigo-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {notification.tipo === NOTIFICATION_TYPES.SYSTEM && <FaInfoCircle className="h-5 w-5" />}
                  {notification.tipo === NOTIFICATION_TYPES.OFFER && <FaTag className="h-5 w-5" />}
                  {notification.tipo === NOTIFICATION_TYPES.PROMOTION && <FaTicketAlt className="h-5 w-5" />}
                  {notification.tipo === NOTIFICATION_TYPES.WISHLIST && <FaHeart className="h-5 w-5" />}
                  {notification.tipo === NOTIFICATION_TYPES.STORE && <FaStore className="h-5 w-5" />}
                  {notification.tipo === NOTIFICATION_TYPES.ORDER && <FaBox className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{notification.titulo}</h4>
                      <p className="text-gray-600 mt-1">{notification.mensaje}</p>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.leido && (
                        <button 
                          onClick={() => markAsRead(notification.id)} 
                          className="text-primary hover:text-primary-dark"
                          title="Marcar como leído"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)} 
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar notificación"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.fecha).toLocaleString()}
                    </span>
                    {notification.enlace && (
                      <div>
                        <Link 
                          to={notification.enlace}
                          className="text-primary hover:text-primary-dark font-medium text-sm inline-flex items-center"
                        >
                          {notification.texto_enlace || "Ver detalles"}
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
