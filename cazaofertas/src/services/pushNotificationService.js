// Servicio para gestionar las notificaciones push en el navegador
const PushNotificationService = {
  // Verificar si el navegador soporta notificaciones push
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  },
  
  // Solicitar permiso para notificaciones push
  async requestPermission() {
    if (!this.isSupported()) {
      throw new Error('Las notificaciones push no son soportadas en este navegador');
    }
    
    const permission = await Notification.requestPermission();
    return permission;
  },
  
  // Verificar si el usuario ha concedido permiso para notificaciones
  hasPermission() {
    return Notification.permission === 'granted';
  },
  
  // Registrar el service worker para notificaciones push
  async registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (error) {
      throw new Error('No se pudo registrar el service worker: ' + error);
    }
  },
  
  // Suscribirse a notificaciones push
  async subscribeToPush(userId) {
    try {
      // Registrar service worker si no está registrado
      const registration = await this.registerServiceWorker();
      
      // Obtenemos las claves públicas del servidor
      // En una implementación real, estas claves vendrían de tu backend
      const publicKey = 'BHmBB4CemJAA-QQM70ZABwJL1qC3cHmcjIQ6OCa3bUgPBO1HikdEH8AQQRghJgPuHbYQo1rExb3_nfccDsY60Bw';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicKey)
      });
      
      // Enviar la suscripción al servidor para asociarla con el usuario
      await this.sendSubscriptionToServer(subscription, userId);
      
      return subscription;
    } catch (error) {
      console.error('Error al suscribirse a notificaciones push:', error);
      throw error;
    }
  },
  
  // Enviar la suscripción al servidor
  async sendSubscriptionToServer(subscription, userId) {
    try {
      const response = await fetch('/api/push-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscription
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar la suscripción en el servidor');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al enviar suscripción al servidor:', error);
      throw error;
    }
  },
  
  // Cancelar suscripción a notificaciones push
  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        // También informar al servidor
        await fetch('/api/push-subscriptions', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscription }),
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      throw error;
    }
  },
  
  // Mostrar una notificación local (no push)
  async showLocalNotification(title, options = {}) {
    if (!this.hasPermission()) {
      throw new Error('No hay permiso para mostrar notificaciones');
    }
    
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      badge: '/path/to/badge.png',
      icon: '/path/to/icon.png',
      ...options,
    });
  },
  
  // Convertir clave pública a formato adecuado para la API
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
};

export default PushNotificationService;
