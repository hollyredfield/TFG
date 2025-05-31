import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import supabase from '../services/supabase';
import { SmartLogger } from '../utils/smartLogger';
import PushNotificationService from '../services/pushNotificationService';

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  OFFER: 'offer',
  ORDER: 'order',
  PAYMENT: 'payment',
  SUPPORT: 'support',
  SYSTEM: 'system',
  WISHLIST: 'wishlist',
  PRICE_DROP: 'price_drop',
  STORE: 'store',
  CATEGORY: 'category',
  RECOMMENDATION: 'recommendation',
  TICKET: 'ticket',
  CONTACT: 'contact',
  // Tipos relacionados con soporte técnico
  SUPPORT_TICKET_CREATED: 'support_ticket_created',
  SUPPORT_TICKET_UPDATED: 'support_ticket_updated',
  SUPPORT_TICKET_RESPONSE: 'support_ticket_response',
  SUPPORT_TICKET_STATUS_CHANGED: 'support_ticket_status_changed',
  // Tipos relacionados con lista de deseos
  WISHLIST_UPDATED: 'wishlist_updated',
  // Tipos relacionados con alertas de producto
  STOCK_ALERT: 'stock_alert',
  // Tipos relacionados con pedidos
  ORDER_STATUS_CHANGED: 'order_status_changed',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  // Tipos relacionados con recomendaciones
  RECOMMENDED_OFFERS: 'recommended_offers',
  // Tipos relacionados con foro
  FORUM_THREAD_REPLY: 'forum_thread_reply',
  FORUM_THREAD_MENTION: 'forum_thread_mention',
  FORUM_THREAD_LIKED: 'forum_thread_liked',
  // Tipos relacionados con comentarios
  COMMENT_REPLY: 'comment_reply',
  COMMENT_MENTION: 'comment_mention',
  COMMENT_LIKED: 'comment_liked',
  // Preferencias de notificación
  NOTIFICATION_PREFERENCE_CHANGED: 'notification_preference_changed'
};

// Estado inicial
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  categories: {},
  preferences: {
    email: true,
    push: true,
    browser: true,
    categories: {},
  }
};

// Reducer para gestionar el estado
function notificationReducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, isLoading: true };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        isLoading: false, 
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
        error: null 
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications];
      return { 
        ...state, 
        notifications: newNotifications,
        unreadCount: state.unreadCount + (action.payload.read ? 0 : 1) 
      };
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({ ...notification, read: true })),
        unreadCount: 0
      };
    case 'DELETE_NOTIFICATION':
      const wasUnread = state.notifications.find(n => n.id === action.payload)?.read === false;
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    case 'LOAD_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    default:
      return state;
  }
}

// Contexto
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

  // Cargar notificaciones iniciales
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'FETCH_SUCCESS', payload: [] });
      return;
    }

    const fetchNotifications = async () => {
      if (!user) return;
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        // Corregido: user_id -> id_usuario
        const { data, error } = await supabase
          .from('notificaciones')
          .select('*')
          .eq('id_usuario', user.id) // Changed user_id to id_usuario
          .order('creado_en', { ascending: false });

        if (error) throw error;
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        logger.error('Error fetching notifications:', error);
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    };

    fetchNotifications();
    
    // Suscribirse a notificaciones en tiempo real
    setupRealtimeSubscription();
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user]);

  // Configurar suscripción en tiempo real para notificaciones
  const setupRealtimeSubscription = () => {
    if (!user) return;
    
    try {
      const newSubscription = supabase
        .channel('notifications-channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notificaciones',
          filter: `user_id=eq.${user.id}`
        }, payload => {
          if (payload.new) {
            handleNewNotification(payload.new);
          }
        })
        .subscribe();
      
      setSubscription(newSubscription);
    } catch (error) {
      SmartLogger.logError('notification-subscription-error', error, { 
        userId: user?.id 
      });
    }
  };

  // Manejar nuevas notificaciones
  const handleNewNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Mostrar notificación del navegador si está habilitado
    if (state.preferences.browser && 
        Notification.permission === 'granted' && 
        document.visibilityState !== 'visible') {
      try {
        new Notification('CazaOfertas', {
          body: notification.message,
          icon: '/logo.png'
        });
      } catch (error) {
        console.error('Error al mostrar notificación del navegador:', error);
      }
    }
  };

  // Solicitar permiso para notificaciones del navegador
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return false;
    }
    
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return true;
  };

  // Marcar notificación como leída
  const markAsRead = async (notificationId) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notificaciones')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error) {
      SmartLogger.logError('notification-mark-read-error', error, { 
        notificationId,
        userId: user?.id 
      });
    }
  };

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notificaciones')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      dispatch({ type: 'MARK_ALL_AS_READ' });
    } catch (error) {
      SmartLogger.logError('notification-mark-all-read-error', error, { 
        userId: user?.id 
      });
    }
  };

  // Eliminar notificación
  const deleteNotification = async (notificationId) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notificaciones')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
    } catch (error) {
      SmartLogger.logError('notification-delete-error', error, { 
        notificationId,
        userId: user?.id 
      });
    }
  };

  // Actualizar preferencias de notificación
  const updatePreferences = async (preferences) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('preferencias_notificaciones')
        .upsert({
          user_id: user.id,
          email_enabled: preferences.email,
          push_enabled: preferences.push,
          browser_enabled: preferences.browser,
          category_preferences: preferences.categories
        });
      
      if (error) throw error;
      
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      
      // Si se activan las notificaciones del navegador, solicitar permiso
      if (preferences.browser) {
        await requestNotificationPermission();
      }
    } catch (error) {
      SmartLogger.logError('notification-preferences-error', error, { 
        userId: user?.id 
      });
    }
  };

  // Crear una nueva notificación (función para uso interno principalmente)
  const createNotification = async ({ userId, type, title, message, data = {} }) => {
    try {
      // Primero comprobamos las preferencias del usuario para este tipo
      const { data: preferences } = await supabase
        .from('preferencias_notificaciones')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      // Si hay una categoría específica, verificamos si está habilitada
      if (data.category_id && preferences?.category_preferences) {
        const categoryPrefs = preferences.category_preferences;
        if (categoryPrefs[data.category_id] === false) {
          return null; // El usuario ha desactivado notificaciones para esta categoría
        }
      }
      
      // Creamos la notificación
      const { data: notification, error } = await supabase
        .from('notificaciones')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data,
          read: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return notification;
    } catch (error) {
      SmartLogger.logError('create-notification-error', error, {
        userId,
        type,
        title
      });
      return null;
    }
  };

  // Filtrar notificaciones por tipo
  const getFilteredNotifications = (types) => {
    if (!types || types.length === 0) {
      return state.notifications;
    }
    return state.notifications.filter(n => types.includes(n.type));
  };

  // Check if push notifications are supported
  useEffect(() => {
    const checkPushSupport = async () => {
      const isSupported = PushNotificationService.isSupported();
      setPushSupported(isSupported);
      
      if (isSupported) {
        // Check current permission status
        const hasPermission = PushNotificationService.hasPermission();
        setPushEnabled(hasPermission);
      }
    };
    
    checkPushSupport();
  }, []);
  
  // Function to request push notification permission and subscribe
  const enablePushNotifications = async () => {
    if (!user) {
      dispatch({
        type: 'SHOW_ERROR',
        payload: 'Debes iniciar sesión para activar notificaciones push'
      });
      return;
    }
    
    try {
      dispatch({ type: 'NOTIFICATION_PROCESSING', payload: true });
      
      // Request permission
      const permission = await PushNotificationService.requestPermission();
      
      if (permission === 'granted') {
        // Subscribe to push notifications
        await PushNotificationService.subscribeToPush(user.id);
        
        // Update preference in database
        const { error } = await supabase
          .from('notificaciones_preferencias')
          .upsert({
            user_id: user.id,
            push_enabled: true,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        setPushEnabled(true);
        dispatch({
          type: 'SHOW_SUCCESS',
          payload: 'Notificaciones push activadas correctamente'
        });
      } else {
        dispatch({
          type: 'SHOW_ERROR',
          payload: 'Permiso denegado para notificaciones push'
        });
      }
    } catch (error) {
      console.error('Error activando notificaciones push:', error);
      dispatch({
        type: 'SHOW_ERROR',
        payload: 'No se pudieron activar las notificaciones push'
      });
    } finally {
      dispatch({ type: 'NOTIFICATION_PROCESSING', payload: false });
    }
  };
  
  // Function to unsubscribe from push notifications
  const disablePushNotifications = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: 'NOTIFICATION_PROCESSING', payload: true });
      
      // Unsubscribe
      await PushNotificationService.unsubscribe();
      
      // Update preference in database
      const { error } = await supabase
        .from('notificaciones_preferencias')
        .upsert({
          user_id: user.id,
          push_enabled: false,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setPushEnabled(false);
      dispatch({
        type: 'SHOW_SUCCESS',
        payload: 'Notificaciones push desactivadas'
      });
    } catch (error) {
      console.error('Error desactivando notificaciones push:', error);
      dispatch({
        type: 'SHOW_ERROR',
        payload: 'No se pudieron desactivar las notificaciones push'
      });
    } finally {
      dispatch({ type: 'NOTIFICATION_PROCESSING', payload: false });
    }
  };
  
  // Function to show a local notification (useful for testing)
  const showLocalNotification = async (title, options) => {
    try {
      await PushNotificationService.showLocalNotification(title, options);
      return true;
    } catch (error) {
      console.error('Error mostrando notificación local:', error);
      return false;
    }
  };

  const value = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    createNotification,
    requestNotificationPermission,
    getFilteredNotifications,
    enablePushNotifications,
    disablePushNotifications,
    showLocalNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook para usar el contexto
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
  }
  return context;
};
