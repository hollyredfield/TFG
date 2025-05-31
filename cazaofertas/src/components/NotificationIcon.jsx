import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash, FaShoppingCart, FaTags, FaStore, 
         FaTicketAlt, FaQuestionCircle, FaHeart, FaBox } from 'react-icons/fa';
import { useNotifications, NOTIFICATION_TYPES } from '../context/NotificationContext';

const NotificationIcon = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  // Cerrar el menú de notificaciones cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    markAllAsRead();
  };  // Obtener el ícono adecuado según el tipo de notificación
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.OFFER:
      case NOTIFICATION_TYPES.PRICE_DROP:
      case NOTIFICATION_TYPES.RECOMMENDED_OFFERS:
        return <FaTags className="text-green-500" />;
      
      case NOTIFICATION_TYPES.ORDER:
      case NOTIFICATION_TYPES.ORDER_STATUS_CHANGED:
      case NOTIFICATION_TYPES.ORDER_SHIPPED:
      case NOTIFICATION_TYPES.ORDER_DELIVERED:
        return <FaBox className="text-blue-500" />;
      
      case NOTIFICATION_TYPES.PAYMENT:
        return <FaShoppingCart className="text-purple-500" />;
      
      case NOTIFICATION_TYPES.SUPPORT:
      case NOTIFICATION_TYPES.TICKET:
      case NOTIFICATION_TYPES.SUPPORT_TICKET_CREATED:
      case NOTIFICATION_TYPES.SUPPORT_TICKET_UPDATED:
      case NOTIFICATION_TYPES.SUPPORT_TICKET_RESPONSE:
      case NOTIFICATION_TYPES.SUPPORT_TICKET_STATUS_CHANGED:
        return <FaTicketAlt className="text-orange-500" />;
      
      case NOTIFICATION_TYPES.WISHLIST:
      case NOTIFICATION_TYPES.WISHLIST_UPDATED:
        return <FaHeart className="text-red-500" />;
      
      case NOTIFICATION_TYPES.STORE:
        return <FaStore className="text-indigo-500" />;
      
      case NOTIFICATION_TYPES.STOCK_ALERT:
        return <FaBox className="text-yellow-500" />;
        
      case NOTIFICATION_TYPES.CONTACT:
        return <FaQuestionCircle className="text-yellow-500" />;
        
      case NOTIFICATION_TYPES.SYSTEM:
      case NOTIFICATION_TYPES.NOTIFICATION_PREFERENCE_CHANGED:
        return <FaBell className="text-gray-500" />;
        
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  // Función para obtener la URL de destino basada en el tipo y datos de notificación
  const getNotificationUrl = (notification) => {
    const { type, data } = notification;
    
    switch (type) {
      case NOTIFICATION_TYPES.OFFER:
        return `/oferta/${data?.offer_id || ''}`;
      
      case NOTIFICATION_TYPES.ORDER:
      case NOTIFICATION_TYPES.ORDER_STATUS_CHANGED:
      case NOTIFICATION_TYPES.ORDER_SHIPPED:
      case NOTIFICATION_TYPES.ORDER_DELIVERED:
        return `/pedido/${data?.order_id || ''}`;
      
      case NOTIFICATION_TYPES.PAYMENT:
        return `/mis-pedidos`;
      
      case NOTIFICATION_TYPES.SUPPORT:
      case NOTIFICATION_TYPES.TICKET:
      case NOTIFICATION_TYPES.SUPPORT_TICKET_CREATED:
      case NOTIFICATION_TYPES.SUPPORT_TICKET_UPDATED:
      case NOTIFICATION_TYPES.SUPPORT_TICKET_RESPONSE:
      case NOTIFICATION_TYPES.SUPPORT_TICKET_STATUS_CHANGED:
        return `/soporte?ticket=${data?.ticket_id || ''}`;
      
      case NOTIFICATION_TYPES.WISHLIST:
      case NOTIFICATION_TYPES.WISHLIST_UPDATED:
        return `/guardadas`;
      
      case NOTIFICATION_TYPES.STORE:
        return `/tienda/${data?.store_id || ''}`;
      
      case NOTIFICATION_TYPES.CATEGORY:
        return `/categoria/${data?.category_slug || ''}`;
      
      case NOTIFICATION_TYPES.RECOMMENDATION:
      case NOTIFICATION_TYPES.RECOMMENDED_OFFERS:
        return data?.url || '/recomendaciones';
      
      case NOTIFICATION_TYPES.PRICE_DROP:
        return `/oferta/${data?.offer_id || ''}`;
      
      case NOTIFICATION_TYPES.STOCK_ALERT:
        return `/oferta/${data?.offer_id || ''}`;
      
      case NOTIFICATION_TYPES.CONTACT:
        return '/contacto';
      
      default:
        return '/notificaciones';
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={toggleMenu}
        className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white relative"
        aria-label="Notificaciones"
      >
        <FaBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center"
              >
                <FaCheck className="mr-1" /> Marcar todas como leídas
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No tienes notificaciones
              </div>
            ) : (
              <div>
                {notifications.slice(0, 5).map((notification) => (
                  <Link
                    key={notification.id}
                    to={getNotificationUrl(notification)}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                    className={`block p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            {new Date(notification.created_at).toLocaleString()}
                          </span>
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(e, notification.id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(e, notification.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {notifications.length > 5 && (
                  <div className="p-2 text-center">
                    <Link
                      to="/notificaciones"
                      onClick={() => setIsOpen(false)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800"
                    >
                      Ver todas las notificaciones ({notifications.length})
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
