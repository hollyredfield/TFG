import supabase from './supabase';
import { NOTIFICATION_TYPES } from '../context/NotificationContext';

// Servicio para gestionar todas las notificaciones del sistema
export const NotificationService = {
  // Crear una nueva notificación
  async createNotification({ userId, type, title, message, data = {} }) {
    try {
      // Verificamos si el usuario tiene desactivadas las notificaciones para esta categoría
      const { data: preferences } = await supabase
        .from('preferencias_notificaciones')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data.category_id && preferences?.category_preferences) {
        const categoryPrefs = preferences.category_preferences;
        if (categoryPrefs[data.category_id] === false) {
          return null; // Usuario ha desactivado notificaciones para esta categoría
        }
      }
      
      // Crear la notificación
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
      console.error('Error al crear notificación:', error);
      return null;
    }
  },
  
  // Notificaciones relacionadas con ofertas
  async notifyOfferCreated(userId, offer) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.OFFER,
      title: '¡Oferta publicada con éxito!',
      message: `Tu oferta "${offer.title}" ha sido publicada y está disponible para todos los usuarios.`,
      data: {
        offer_id: offer.id
      }
    });
  },
  
  async notifyOfferApproved(userId, offer) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.OFFER,
      title: 'Oferta aprobada',
      message: `Tu oferta "${offer.title}" ha sido revisada y aprobada.`,
      data: {
        offer_id: offer.id
      }
    });
  },
  
  async notifyOfferRejected(userId, offer, reason) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.OFFER,
      title: 'Oferta rechazada',
      message: `Tu oferta "${offer.title}" no ha sido aprobada. Motivo: ${reason || 'No cumple con nuestras políticas'}`,
      data: {
        offer_id: offer.id
      }
    });
  },
  
  async notifyPriceDropOnWishlist(userId, product, oldPrice, newPrice) {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.PRICE_DROP,
      title: '¡Bajada de precio!',
      message: `El producto "${product.title}" de tu lista de deseos ahora está un ${discount}% más barato.`,
      data: {
        product_id: product.id,
        old_price: oldPrice,
        new_price: newPrice
      }
    });
  },
  
  // Notificaciones relacionadas con pedidos y compras
  async notifyOrderCreated(userId, order) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.ORDER,
      title: 'Pedido realizado',
      message: `Tu pedido #${order.id} ha sido recibido con éxito. Total: ${order.total}€`,
      data: {
        order_id: order.id
      }
    });
  },
  
  async notifyOrderStatusUpdate(userId, order, newStatus) {
    const statusMessages = {
      'processing': 'está siendo procesado.',
      'shipped': 'ha sido enviado.',
      'delivered': 'ha sido entregado.',
      'cancelled': 'ha sido cancelado.'
    };
    
    const message = statusMessages[newStatus] 
      ? `Tu pedido #${order.id} ${statusMessages[newStatus]}`
      : `El estado de tu pedido #${order.id} ha cambiado a: ${newStatus}.`;
    
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.ORDER,
      title: 'Actualización de pedido',
      message,
      data: {
        order_id: order.id,
        status: newStatus
      }
    });
  },
  
  async notifyPaymentConfirmed(userId, order) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.PAYMENT,
      title: 'Pago confirmado',
      message: `El pago de tu pedido #${order.id} por ${order.total}€ ha sido confirmado.`,
      data: {
        order_id: order.id
      }
    });
  },
  
  async notifyPaymentFailed(userId, order, reason) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.PAYMENT,
      title: 'Problema con el pago',
      message: `Ha habido un problema con el pago de tu pedido #${order.id}. Motivo: ${reason || 'Error en el proceso de pago'}`,
      data: {
        order_id: order.id
      }
    });
  },
  
  // Notificaciones de soporte y tickets
  async notifyTicketCreated(userId, ticket) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.TICKET,
      title: 'Ticket de soporte creado',
      message: `Tu ticket de soporte #${ticket.id} "${ticket.subject}" ha sido creado.`,
      data: {
        ticket_id: ticket.id
      }
    });
  },
  
  async notifyTicketResponse(userId, ticket, fromStaff = true) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.TICKET,
      title: 'Respuesta a tu ticket',
      message: fromStaff 
        ? `Un agente de soporte ha respondido a tu ticket #${ticket.id}.`
        : `Hay una nueva respuesta en tu ticket de soporte #${ticket.id}.`,
      data: {
        ticket_id: ticket.id
      }
    });
  },
  
  async notifyTicketResolved(userId, ticket) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.TICKET,
      title: 'Ticket resuelto',
      message: `Tu ticket de soporte #${ticket.id} ha sido marcado como resuelto.`,
      data: {
        ticket_id: ticket.id
      }
    });
  },
  
  // Notificaciones de tiendas y categorías
  async notifyNewStoreOffers(userId, store, offerCount) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.STORE,
      title: `Nuevas ofertas en ${store.name}`,
      message: `Hay ${offerCount} nueva${offerCount !== 1 ? 's' : ''} oferta${offerCount !== 1 ? 's' : ''} de ${store.name} que podrían interesarte.`,
      data: {
        store_id: store.id,
        store_name: store.name
      }
    });
  },
  
  async notifyNewCategoryOffers(userId, category, offerCount) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.CATEGORY,
      title: `Nuevas ofertas en ${category.name}`,
      message: `Se han añadido ${offerCount} nueva${offerCount !== 1 ? 's' : ''} oferta${offerCount !== 1 ? 's' : ''} en la categoría ${category.name}.`,
      data: {
        category_id: category.id,
        category_slug: category.slug,
        category_name: category.name
      }
    });
  },
  
  // Notificaciones de recomendaciones
  async notifyPersonalizedRecommendation(userId, recommendation) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.RECOMMENDATION,
      title: 'Recomendación personalizada',
      message: `Basado en tus intereses: "${recommendation.title}" - ${recommendation.description}`,
      data: {
        url: recommendation.url,
        recommendation_id: recommendation.id
      }
    });
  },
  
  // Notificaciones para la lista de deseos
  async notifyWishlistUpdated(userId, productName, action) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.WISHLIST,
      title: 'Lista de deseos actualizada',
      message: `El producto "${productName}" ha sido ${action === 'add' ? 'añadido a' : 'eliminado de'} tu lista de deseos.`,
      data: {}
    });
  },
  
  // Notificación de contacto
  async notifyContactResponse(userId, contactSubject) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.CONTACT,
      title: 'Respuesta a tu consulta',
      message: `Hemos respondido a tu consulta "${contactSubject}". Revisa tu correo electrónico.`,
      data: {}
    });
  },
  
  // Notificaciones del sistema
  async notifySystemMaintenance(userId, startTime, duration) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.SYSTEM,
      title: 'Mantenimiento programado',
      message: `CazaOfertas estará en mantenimiento el ${new Date(startTime).toLocaleString()} durante aproximadamente ${duration} minutos.`,
      data: {
        maintenance_start: startTime,
        maintenance_duration: duration
      }
    });
  },
  
  async notifyAccountActivity(userId, activity, location) {
    return this.createNotification({
      userId,
      type: NOTIFICATION_TYPES.SYSTEM,
      title: 'Actividad en tu cuenta',
      message: `Se ha detectado un ${activity} desde ${location}. Si no has sido tú, por favor contacta con soporte.`,
      data: {
        activity_type: activity,
        location
      }
    });
  },
  
  // Batch notifications - enviar a múltiples usuarios (útil para notificaciones masivas)
  async sendBatchNotification(userIds, type, title, message, data = {}) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return [];
    }
    
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        type,
        title,
        message,
        data,
        read: false
      }));
      
      const { data: createdNotifications, error } = await supabase
        .from('notificaciones')
        .insert(notifications)
        .select();
      
      if (error) throw error;
      
      return createdNotifications;
    } catch (error) {
      console.error('Error al enviar notificaciones por lotes:', error);
      return [];
    }
  },
  
  // Notificaciones para tickets de soporte
  async notifySupportTicketCreated(userId, ticketId, subject, priority) {
    return this.createNotification({
      userId,
      type: 'SUPPORT_TICKET_CREATED',
      title: 'Ticket de soporte creado',
      message: `Tu ticket "${subject}" ha sido creado y será revisado en breve.`,
      data: {
        ticket_id: ticketId,
        ticket_subject: subject,
        priority: priority
      }
    });
  },
  
  async notifySupportTicketStatusChanged(userId, ticketId, subject, newStatus) {
    const statusMessages = {
      'en_proceso': 'Tu ticket de soporte está siendo revisado por nuestro equipo.',
      'esperando_respuesta': 'Hemos respondido a tu ticket de soporte y esperamos tu respuesta.',
      'resuelto': 'Tu ticket de soporte ha sido resuelto. Si persiste el problema, puedes reabrirlo.',
      'cerrado': 'Tu ticket de soporte ha sido cerrado.'
    };
    
    const message = statusMessages[newStatus] || `El estado de tu ticket "${subject}" ha cambiado a ${newStatus}.`;
    
    return this.createNotification({
      userId,
      type: 'SUPPORT_TICKET_STATUS_CHANGED',
      title: 'Actualización de estado de ticket',
      message,
      data: {
        ticket_id: ticketId,
        ticket_subject: subject,
        status: newStatus
      }
    });
  },
  
  async notifySupportTicketResponse(userId, ticketId, subject, responder) {
    return this.createNotification({
      userId,
      type: 'SUPPORT_TICKET_RESPONSE',
      title: 'Nueva respuesta en tu ticket',
      message: `${responder} ha respondido a tu ticket "${subject}".`,
      data: {
        ticket_id: ticketId,
        ticket_subject: subject
      }
    });
  },
  
  // Notificaciones para la lista de deseos
  async notifyWishlistUpdated(userId, productName, action) {
    const actionMessages = {
      'add': `${productName} se ha añadido a tu lista de deseos.`,
      'remove': `${productName} se ha eliminado de tu lista de deseos.`
    };
    
    const message = actionMessages[action] || `Tu lista de deseos ha sido actualizada con ${productName}.`;
    
    return this.createNotification({
      userId,
      type: 'WISHLIST_UPDATED',
      title: 'Lista de deseos actualizada',
      message,
      data: {
        product_name: productName,
        action
      }
    });
  },
  
  // Notificaciones para pedidos
  async notifyOrderStatusChanged(userId, orderId, orderRef, newStatus) {
    const statusMessages = {
      'pendiente': 'Tu pedido está pendiente de confirmación.',
      'procesando': 'Tu pedido está siendo procesado.',
      'enviado': 'Tu pedido ha sido enviado.',
      'entregado': 'Tu pedido ha sido entregado.',
      'cancelado': 'Tu pedido ha sido cancelado.'
    };
    
    const message = statusMessages[newStatus] || `El estado de tu pedido ${orderRef} ha cambiado a: ${newStatus}.`;
    
    return this.createNotification({
      userId,
      type: 'ORDER_STATUS_CHANGED',
      title: 'Actualización de estado de pedido',
      message,
      data: {
        order_id: orderId,
        order_ref: orderRef,
        status: newStatus
      }
    });
  },
  
  async notifyOrderShipped(userId, orderId, orderRef, trackingInfo) {
    return this.createNotification({
      userId,
      type: 'ORDER_SHIPPED',
      title: 'Pedido enviado',
      message: `Tu pedido ${orderRef} ha sido enviado y está en camino.`,
      data: {
        order_id: orderId,
        order_ref: orderRef,
        tracking_info: trackingInfo
      }
    });
  },
  
  async notifyOrderDelivered(userId, orderId, orderRef) {
    return this.createNotification({
      userId,
      type: 'ORDER_DELIVERED',
      title: 'Pedido entregado',
      message: `Tu pedido ${orderRef} ha sido entregado. ¡Esperamos que disfrutes tu compra!`,
      data: {
        order_id: orderId,
        order_ref: orderRef
      }
    });
  },
  
  async notifyRecommendedOffers(userId, offersList) {
    const offerCount = offersList.length;
    let message;
    
    if (offerCount === 1) {
      message = `Hay una nueva oferta recomendada para ti: ${offersList[0].title}`;
    } else {
      message = `Hay ${offerCount} nuevas ofertas recomendadas para ti.`;
    }
    
    return this.createNotification({
      userId,
      type: 'RECOMMENDED_OFFERS',
      title: 'Ofertas recomendadas para ti',
      message,
      data: {
        offers: offersList.map(offer => ({
          id: offer.id,
          title: offer.title,
          price: offer.price
        }))
      }
    });
  },
  
  // Notificaciones para el Foro
  async notifyThreadReply(threadOwnerId, threadId, threadTitle, replyUser) {
    return this.createNotification({
      userId: threadOwnerId,
      type: NOTIFICATION_TYPES.FORUM_THREAD_REPLY,
      title: 'Nuevo mensaje en tu tema',
      message: `${replyUser} ha respondido a tu tema "${threadTitle}".`,
      data: {
        thread_id: threadId,
        thread_title: threadTitle,
        reply_user: replyUser
      }
    });
  },
  
  async notifyThreadMention(mentionedUserId, threadId, threadTitle, mentionUser) {
    return this.createNotification({
      userId: mentionedUserId,
      type: NOTIFICATION_TYPES.FORUM_THREAD_MENTION,
      title: 'Te han mencionado en un tema',
      message: `${mentionUser} te ha mencionado en el tema "${threadTitle}".`,
      data: {
        thread_id: threadId,
        thread_title: threadTitle,
        mention_user: mentionUser
      }
    });
  },
  
  async notifyThreadLiked(threadOwnerId, threadId, threadTitle, likeUser) {
    return this.createNotification({
      userId: threadOwnerId,
      type: NOTIFICATION_TYPES.FORUM_THREAD_LIKED,
      title: 'A alguien le gustó tu tema',
      message: `A ${likeUser} le gustó tu tema "${threadTitle}".`,
      data: {
        thread_id: threadId,
        thread_title: threadTitle,
        like_user: likeUser
      }
    });
  },
  
  // Notificaciones para los Comentarios
  async notifyCommentReply(commentOwnerId, productId, productName, replyUser) {
    return this.createNotification({
      userId: commentOwnerId,
      type: NOTIFICATION_TYPES.COMMENT_REPLY,
      title: 'Respuesta a tu comentario',
      message: `${replyUser} ha respondido a tu comentario en "${productName}".`,
      data: {
        product_id: productId,
        product_name: productName,
        reply_user: replyUser
      }
    });
  },
  
  async notifyCommentMention(mentionedUserId, productId, productName, mentionUser) {
    return this.createNotification({
      userId: mentionedUserId,
      type: NOTIFICATION_TYPES.COMMENT_MENTION,
      title: 'Te han mencionado en un comentario',
      message: `${mentionUser} te ha mencionado en un comentario sobre "${productName}".`,
      data: {
        product_id: productId,
        product_name: productName,
        mention_user: mentionUser
      }
    });
  },
  
  async notifyCommentLiked(commentOwnerId, productId, productName, likeUser) {
    return this.createNotification({
      userId: commentOwnerId,
      type: NOTIFICATION_TYPES.COMMENT_LIKED,
      title: 'A alguien le gustó tu comentario',
      message: `A ${likeUser} le gustó tu comentario en "${productName}".`,
      data: {
        product_id: productId,
        product_name: productName,
        like_user: likeUser
      }
    });
  },
};

export default NotificationService;
