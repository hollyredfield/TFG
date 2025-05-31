import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBox, FaShippingFast, FaCheck, FaInfoCircle, FaTimes, FaExclamationCircle, FaTruck, FaBoxOpen, FaClipboardCheck, FaReceipt, FaBell } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getOrderById, updateOrderNotificationSettings } from '../services/mockOrders.js';
import { NotificationService } from '../services/notificationService';
import supabase from '../services/supabase';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for notification preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error, success } = await getOrderById(orderId, user.id);

        if (!success || error) {
          throw new Error(error?.message || 'No se pudo cargar la información del pedido');
        }

        setOrder(data);
      } catch (err) {
        console.error('Error cargando detalle de pedido:', err);
        setError('No se pudo cargar la información del pedido. Por favor, inténtalo de nuevo.');
        toast.error('Error al cargar el pedido');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, user]);

  // Load notification preferences when component mounts
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      if (!user || !order) return;
      
      try {
        const { data, error } = await supabase
          .from('notificaciones_preferencias')
          .select('order_notifications')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error loading notification preferences:', error);
          return;
        }
        
        if (data && data.order_notifications) {
          // Check if this specific order has notifications enabled
          setNotificationsEnabled(
            data.order_notifications[orderId] !== false // true by default
          );
        }
      } catch (err) {
        console.error('Error loading notification preferences:', err);
      }
    };
    
    loadNotificationPreferences();
  }, [user, order, orderId]);

  // Toggle order notifications
  const toggleOrderNotifications = async () => {
    if (!user || !order) return;
    
    try {
      // Update local state
      const newValue = !notificationsEnabled;
      setNotificationsEnabled(newValue);
      
      // Update in database
      const { data: existingPrefs } = await supabase
        .from('notificaciones_preferencias')
        .select('order_notifications')
        .eq('user_id', user.id)
        .single();
      
      const orderNotifications = existingPrefs?.order_notifications || {};
      orderNotifications[orderId] = newValue;
      
      const { error } = await supabase
        .from('notificaciones_preferencias')
        .upsert({
          user_id: user.id,
          order_notifications: orderNotifications,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Send notification about preference change
      if (newValue) {
        await NotificationService.createNotification({
          userId: user.id,
          type: 'NOTIFICATION_PREFERENCE_CHANGED',
          title: 'Notificaciones de pedido activadas',
          message: `Recibirás actualizaciones sobre el estado de tu pedido ${order.codigo_seguimiento || orderId}.`,
          data: {
            order_id: orderId,
            preference_type: 'order_notifications',
            enabled: true
          }
        });
        toast.success('Notificaciones de pedido activadas');
      } else {
        toast.success('Notificaciones de pedido desactivadas');
      }
    } catch (err) {
      console.error('Error toggling order notifications:', err);
      toast.error('No se pudo actualizar las preferencias de notificaciones');
      // Revert local state on error
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-start">
          <FaExclamationCircle className="mt-1 mr-2 flex-shrink-0" />
          <p>{error || 'No se encontró el pedido solicitado'}</p>
        </div>
        <Link to="/mis-pedidos" className="button-modern button-secondary">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  // Helper para obtener el icono y color según el estado
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pendiente':
        return { icon: <FaReceipt />, color: 'text-blue-500' };
      case 'procesando':
        return { icon: <FaBox />, color: 'text-yellow-500' };
      case 'enviado':
        return { icon: <FaTruck />, color: 'text-purple-500' };
      case 'entregado':
        return { icon: <FaCheck />, color: 'text-green-500' };
      case 'cancelado':
        return { icon: <FaTimes />, color: 'text-red-500' };
      default:
        return { icon: <FaInfoCircle />, color: 'text-gray-500' };
    }
  };

  const { icon, color } = getStatusInfo(order.estado);

  // Determinar el progreso actual del pedido
  const getStepProgress = () => {
    const steps = ['pendiente', 'procesando', 'enviado', 'entregado'];
    if (order.estado === 'cancelado') return -1;
    return steps.indexOf(order.estado);
  };

  const currentStep = getStepProgress();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seguimiento de Pedido</h1>
            <span className={`text-2xl ${color}`}>{icon}</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Código de pedido: <span className="font-medium">{order.codigo_seguimiento}</span>
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link to="/mis-pedidos" className="button-modern button-secondary">
            Volver a mis pedidos
          </Link>
        </div>
      </div>      {/* Progreso del pedido */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Estado del pedido</h2>
          
          <button
            onClick={toggleOrderNotifications}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
              notificationsEnabled 
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
            }`}
            title={notificationsEnabled ? "Desactivar notificaciones" : "Activar notificaciones"}
          >
            <FaBell className={notificationsEnabled ? "text-primary" : "text-gray-400"} />
            <span>{notificationsEnabled ? 'Notificaciones activadas' : 'Notificaciones desactivadas'}</span>
          </button>
        </div>
        
        <div className="relative">
          {/* Línea de progreso */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-0"></div>
          <div 
            className={`absolute top-5 left-0 h-1 bg-primary z-10 transition-all duration-500 ${
              currentStep === -1 ? 'w-0' : currentStep === 0 ? 'w-[12.5%]' : 
              currentStep === 1 ? 'w-[37.5%]' : currentStep === 2 ? 'w-[62.5%]' : 'w-full'
            }`}
          ></div>
          
          {/* Íconos de estados */}
          <div className="grid grid-cols-4 relative z-20">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 0 ? 'bg-primary text-white' : 
                currentStep === -1 ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <FaReceipt className="text-lg" />
              </div>
              <p className="mt-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300">Recibido</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                {order.created_at && new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary text-white' : 
                currentStep === -1 ? 'bg-red-500 text-white opacity-30' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <FaBoxOpen className="text-lg" />
              </div>
              <p className="mt-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300">Procesando</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                {order.estado === 'procesando' && order.updated_at ? new Date(order.updated_at).toLocaleDateString() : ''}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary text-white' : 
                currentStep === -1 ? 'bg-red-500 text-white opacity-30' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <FaTruck className="text-lg" />
              </div>
              <p className="mt-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300">Enviado</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                {order.estado === 'enviado' && order.updated_at ? new Date(order.updated_at).toLocaleDateString() : ''}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-primary text-white' : 
                currentStep === -1 ? 'bg-red-500 text-white opacity-30' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                <FaClipboardCheck className="text-lg" />
              </div>
              <p className="mt-2 text-sm font-medium text-center text-gray-700 dark:text-gray-300">Entregado</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                {order.estado === 'entregado' && order.updated_at ? new Date(order.updated_at).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Estado actual */}
        <div className={`mt-8 p-4 rounded-lg border ${
          order.estado === 'cancelado' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
          order.estado === 'entregado' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
          'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        }`}>
          <div className="flex items-center">
            <div className={`mr-4 text-xl ${
              order.estado === 'cancelado' ? 'text-red-500 dark:text-red-400' : 
              order.estado === 'entregado' ? 'text-green-500 dark:text-green-400' :
              'text-blue-500 dark:text-blue-400'
            }`}>
              {icon}
            </div>
            <div>
              <h3 className={`font-medium ${
                order.estado === 'cancelado' ? 'text-red-700 dark:text-red-300' :
                order.estado === 'entregado' ? 'text-green-700 dark:text-green-300' :
                'text-blue-700 dark:text-blue-300'
              }`}>
                Estado actual: {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {order.estado === 'pendiente' && 'Tu pedido ha sido recibido y está pendiente de procesamiento.'}
                {order.estado === 'procesando' && 'Tu pedido está siendo preparado para envío.'}
                {order.estado === 'enviado' && 'Tu pedido está en camino a la dirección de entrega.'}
                {order.estado === 'entregado' && '¡Tu pedido ha sido entregado con éxito!'}
                {order.estado === 'cancelado' && 'Este pedido ha sido cancelado.'}
              </p>
            </div>
          </div>
        </div>

        {/* Detalles de envío */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Detalles de envío</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Dirección de entrega</p>
              <p className="text-gray-700 dark:text-gray-300">{order.direccion_envio}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Método de pago</p>
              <p className="text-gray-700 dark:text-gray-300">{order.metodo_pago}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos del pedido */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden mb-8">
        <h2 className="p-6 border-b border-gray-200 dark:border-gray-700 text-xl font-semibold text-gray-900 dark:text-white">
          Productos del pedido
        </h2>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {order.pedidos_items?.map((item) => (
            <div key={item.id} className="p-6 flex items-center">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                {(item.productos?.imagen_url || item.ofertas?.imagen_url) ? (
                  <img
                    src={item.productos?.imagen_url || item.ofertas?.imagen_url}
                    alt={item.productos?.nombre || item.ofertas?.titulo}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-700">
                    <FaBox className="text-gray-400 text-xl" />
                  </div>
                )}
              </div>

              <div className="ml-6 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {item.productos?.nombre || item.ofertas?.titulo}
                  </h3>
                  <p className="ml-4 text-base font-medium text-gray-900 dark:text-white">
                    {item.subtotal.toFixed(2)}€
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Cantidad: {item.cantidad} × {item.precio_unitario.toFixed(2)}€
                </p>
                {item.ofertas && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                      Oferta aplicada
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
            <p>Total</p>
            <p>{order.total.toFixed(2)}€</p>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Impuestos incluidos
          </p>
        </div>
      </div>

      {/* Soporte */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">¿Necesitas ayuda?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Si tienes alguna pregunta sobre tu pedido o necesitas ayuda, no dudes en contactar con nuestro equipo de soporte.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to={`/soporte?ref=order&id=${order.id}`} className="button-modern button-primary">
            Contactar con soporte
          </Link>
          <Link to="/preguntas-frecuentes" className="button-modern button-secondary">
            Preguntas frecuentes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
