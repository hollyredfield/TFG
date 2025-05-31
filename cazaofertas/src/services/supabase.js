import { createClient } from '@supabase/supabase-js';

// Configurar el cliente de Supabase
const supabaseUrl = 'https://qatzosrzygyndyfkdbum.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhdHpvc3J6eWd5bmR5ZmtkYnVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDI1NjgsImV4cCI6MjA2MjYxODU2OH0.9xZ7rePOsYSVZodvjlWUwwWlu3tSxVvZ20Gi6r_T2vI';

// Crear el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exportar el cliente como default export para AuthContext.jsx
export default supabase;

// También exportamos el cliente como una exportación con nombre
export { supabase };

// Funciones de autenticación
export const signIn = async (email, password) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email, password, nombre) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre_usuario: nombre
      },
      emailRedirectTo: `${window.location.origin}/email-confirmation`
    }
  });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const resetPassword = async (email) => {
  console.log("Solicitando restablecimiento de contraseña para:", email);
  try {
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar-password`
    });
    
    console.log("Resultado de resetPassword:", result);
    return result;
  } catch (error) {
    console.error("Error en resetPassword:", error);
    throw error;
  }
};

export const updatePassword = async (newPassword) => {
  console.log("Actualizando contraseña...");
  try {
    const result = await supabase.auth.updateUser({
      password: newPassword
    });
    
    console.log("Resultado de updatePassword:", result);
    return result;
  } catch (error) {
    console.error("Error en updatePassword:", error);
    throw error;
  }
};

export const resendVerificationEmail = async (email) => {
  console.log("Llamando a resendVerificationEmail con:", email);
  try {
    const result = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/email-confirmation`
      }
    });
    
    console.log("Resultado de resendVerificationEmail:", result);
    return result;
  } catch (error) {
    console.error("Error en resendVerificationEmail:", error);
    throw error;
  }
};

export const getSession = async () => {
  return supabase.auth.getSession();
};

export const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Agregar otras funciones que puedan estar siendo utilizadas en la aplicación
export const getOffers = async () => {
  const { data, error } = await supabase
    .from('ofertas')
    .select(`
      *,
      categorias:id_categoria (*)
    `)
    .order('creado_en', { ascending: false });
  
  if (error) throw error;
  return { data, error };
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('nombre', { ascending: true });
  
  if (error) throw error;
  return { data, error };
};

export const verifyEmailToken = async (token) => {
  // Esta es una función simulada, Supabase maneja la verificación automáticamente
  // Puedes usar esta función para lógica personalizada después de la verificación
  return { success: true };
};

export const createUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('perfiles_usuario')
    .insert([
      { 
        id: userId,
        ...profileData
      }
    ]);
  
  if (error) throw error;
  return data;
};

export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notificaciones')
    .select('*')
    .eq('user_id', userId)
    .order('creado_en', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notificaciones')
    .update({ leida: true })
    .eq('id', notificationId);
  
  if (error) throw error;
  return data;
};

export const deleteAllNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notificaciones')
    .delete()
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
};

export const createOffer = async (offerData) => {
  const { data, error } = await supabase
    .from('ofertas')
    .insert([offerData]);
  
  if (error) throw error;
  return data;
};

export const uploadImage = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, file);
  
  if (error) throw error;
  return data;
};

// Funciones para el manejo de ofertas del usuario
export const getUserOffers = async (userId) => {
  const { data, error } = await supabase
    .from('ofertas')
    .select(`
      *,
      categorias(*),
      tiendas(*),
      comentarios_count:comentarios(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return { data, error };
};

export const deleteOffer = async (offerId) => {
  const { data, error } = await supabase
    .from('ofertas')
    .delete()
    .eq('id', offerId);
  
  if (error) throw error;
  return { data, error };
};

// Funciones para el manejo de ofertas guardadas
export const getSavedOffers = async (userId) => {
  const { data, error } = await supabase
    .from('ofertas_guardadas')
    .select(`
      id,
      fecha_guardado,
      ofertas (
        *,
        categorias(*),
        tiendas(*)
      )
    `)
    .eq('user_id', userId)
    .order('fecha_guardado', { ascending: false });
  
  if (error) throw error;
  return { data, error };
};

export const saveOffer = async (userId, offerId) => {
  const { data, error } = await supabase
    .from('ofertas_guardadas')
    .insert([{
      user_id: userId,
      offer_id: offerId,
      fecha_guardado: new Date().toISOString()
    }]);
  
  if (error) throw error;
  return { data, error };
};

export const removeSavedOffer = async (savedId) => {
  const { data, error } = await supabase
    .from('ofertas_guardadas')
    .delete()
    .eq('id', savedId);
  
  if (error) throw error;
  return { data, error };
};

export const isOfferSaved = async (userId, offerId) => {
  const { data, error } = await supabase
    .from('ofertas_guardadas')
    .select('id')
    .eq('user_id', userId)
    .eq('offer_id', offerId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return { isSaved: !!data, savedId: data?.id };
};

// Funciones para gestión de pedidos
export const createOrder = async (orderData) => {
  try {
    // Crear el pedido principal
    const { data: order, error } = await supabase
      .from('pedidos')
      .insert({
        user_id: orderData.userId,
        estado: 'pendiente',
        total: orderData.total,
        direccion_envio: orderData.shippingAddress,
        metodo_pago: orderData.paymentMethod,
        notas: orderData.notes || null,
        codigo_seguimiento: generateTrackingCode(),
      })
      .select()
      .single();

    if (error) throw error;

    // Insertar items del pedido
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map(item => ({
        pedido_id: order.id,
        producto_id: item.id,
        oferta_id: item.oferta_id || null,
        cantidad: item.quantity,
        precio_unitario: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('pedidos_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // Crear notificación para el usuario
    await supabase
      .from('notificaciones')
      .insert({
        user_id: orderData.userId,
        tipo: 'pedido',
        titulo: 'Pedido realizado',
        mensaje: `Tu pedido #${order.id} ha sido recibido y está siendo procesado.`,
        enlace: `/pedidos/${order.id}`,
        leido: false,
        creado_en: new Date()
      });

    return { order, success: true };
  } catch (error) {
    console.error('Error creando pedido:', error);
    return { error, success: false };
  }
};

export const getOrdersByUser = async (userId) => {
  // Datos simulados para pedidos de usuario
  console.log('Obteniendo pedidos simulados para el usuario:', userId);
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockOrders = [
      {
        id: 1001,
        user_id: userId,
        estado: 'entregado',
        codigo_seguimiento: 'TR-7834512',
        total: 129.95,
        direccion_envio: 'Calle Principal 123, Madrid',
        created_at: '2025-04-15T14:30:00',
        metodo_pago: 'Tarjeta',
        pedidos_items: [
          {
            id: 2001,
            pedido_id: 1001,
            cantidad: 1,
            precio_unitario: 99.95,
            productos: {
              id: 301,
              nombre: 'Auriculares Bluetooth Sony WH-1000XM5',
              imagen: 'https://th.bing.com/th/id/OIP.ZUmlVd7bygSzaaOmY6EZpwHaHa',
              descripcion: 'Auriculares inalámbricos con cancelación de ruido'
            }
          },
          {
            id: 2002,
            pedido_id: 1001,
            cantidad: 2,
            precio_unitario: 15.00,
            productos: {
              id: 302,
              nombre: 'Funda protectora para auriculares',
              imagen: 'https://th.bing.com/th/id/OIP.qfgXFv_TIpg9hQlbdby83gAAAA',
              descripcion: 'Funda rígida para guardar y proteger tus auriculares'
            }
          }
        ]
      },
      {
        id: 1002,
        user_id: userId,
        estado: 'enviado',
        codigo_seguimiento: 'TR-9812345',
        total: 599.99,
        direccion_envio: 'Avenida Central 45, Barcelona',
        created_at: '2025-05-10T09:15:00',
        metodo_pago: 'PayPal',
        pedidos_items: [
          {
            id: 2003,
            pedido_id: 1002,
            cantidad: 1,
            precio_unitario: 599.99,
            productos: {
              id: 303,
              nombre: 'iPhone 15 Pro 128GB',
              imagen: 'https://th.bing.com/th/id/OIP.T8ALBfzER0FiiR1XlDyoeQHaHa',
              descripcion: 'Smartphone Apple con cámara profesional'
            }
          }
        ]
      },
      {
        id: 1003,
        user_id: userId,
        estado: 'procesando',
        codigo_seguimiento: 'TR-6541237',
        total: 45.50,
        direccion_envio: 'Plaza Mayor 8, Valencia',
        created_at: '2025-05-14T16:20:00',
        metodo_pago: 'Tarjeta',
        pedidos_items: [
          {
            id: 2004,
            pedido_id: 1003,
            cantidad: 1,
            precio_unitario: 25.50,
            productos: {
              id: 304,
              nombre: 'Cargador USB-C 30W',
              imagen: 'https://th.bing.com/th/id/OIP.jNZQm8yS8HIV9VxXcDBxagHaHa',
              descripcion: 'Cargador rápido con tecnología GaN'
            }
          },
          {
            id: 2005,
            pedido_id: 1003,
            cantidad: 1,
            precio_unitario: 20.00,
            productos: {
              id: 305,
              nombre: 'Cable USB-C a Lightning 2m',
              imagen: 'https://th.bing.com/th/id/OIP.RlZlvQDl9s1GI0O9-vEn2QHaHa',
              descripcion: 'Cable de carga rápida con trenzado de nylon'
            }
          }
        ]
      },
      {
        id: 1004,
        user_id: userId,
        estado: 'pendiente',
        codigo_seguimiento: 'TR-7653421',
        total: 349.00,
        direccion_envio: 'Calle del Sol 23, Sevilla',
        created_at: '2025-05-15T10:05:00',
        metodo_pago: 'Transferencia',
        pedidos_items: [
          {
            id: 2006,
            pedido_id: 1004,
            cantidad: 1,
            precio_unitario: 349.00,
            productos: {
              id: 306,
              nombre: 'Monitor LG UltraGear 27"',
              imagen: 'https://th.bing.com/th/id/OIP.6tUFQzO3JcglH25IqkXRsAHaEK',
              descripcion: 'Monitor gaming 144Hz con tiempo de respuesta de 1ms'
            }
          }
        ]
      },
      {
        id: 1005,
        user_id: userId,
        estado: 'cancelado',
        codigo_seguimiento: 'TR-8642157',
        total: 79.99,
        direccion_envio: 'Calle Mayor 12, Zaragoza',
        created_at: '2025-05-02T14:45:00',
        metodo_pago: 'Tarjeta',
        pedidos_items: [
          {
            id: 2007,
            pedido_id: 1005,
            cantidad: 1,
            precio_unitario: 79.99,
            productos: {
              id: 307,
              nombre: 'Teclado mecánico Logitech G Pro',
              imagen: 'https://th.bing.com/th/id/OIP.lKTurkehW_MG1G14kcolSgHaFj',
              descripcion: 'Teclado gaming con switches GX Blue'
            }
          }
        ]
      }
    ];
    
    return { data: mockOrders, success: true };
  } catch (error) {
    console.error('Error simulando obtención de pedidos:', error);
    return { error, success: false };
  }
};

export const getOrderById = async (orderId, userId = null) => {
  // Datos simulados para un pedido específico
  console.log('Obteniendo detalles simulados del pedido:', orderId);
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Conjunto de pedidos simulados
    const mockOrders = {
      '1001': {
        id: 1001,
        user_id: userId,
        estado: 'entregado',
        codigo_seguimiento: 'TR-7834512',
        total: 129.95,
        direccion_envio: 'Calle Principal 123, Madrid',
        created_at: '2025-04-15T14:30:00',
        entrega_estimada: '2025-04-20',
        fecha_entrega: '2025-04-19',
        metodo_pago: 'Tarjeta',
        notas: 'Entregar en horario de mañana',
        historial: [
          { fecha: '2025-04-15T14:30:00', estado: 'pendiente', descripcion: 'Pedido realizado' },
          { fecha: '2025-04-16T09:15:00', estado: 'procesando', descripcion: 'Pedido confirmado y en preparación' },
          { fecha: '2025-04-17T11:30:00', estado: 'enviado', descripcion: 'Pedido enviado con empresa de transporte' },
          { fecha: '2025-04-19T10:20:00', estado: 'entregado', descripcion: 'Pedido entregado correctamente' }
        ],
        pedidos_items: [
          {
            id: 2001,
            pedido_id: 1001,
            cantidad: 1,
            precio_unitario: 99.95,
            productos: {
              id: 301,
              nombre: 'Auriculares Bluetooth Sony WH-1000XM5',
              imagen: 'https://th.bing.com/th/id/OIP.ZUmlVd7bygSzaaOmY6EZpwHaHa',
              descripcion: 'Auriculares inalámbricos con cancelación de ruido',
              especificaciones: {
                color: 'Negro',
                peso: '250g',
                dimensiones: '32 x 25 x 15 cm',
                conectividad: 'Bluetooth 5.2, Jack 3.5mm'
              }
            }
          },
          {
            id: 2002,
            pedido_id: 1001,
            cantidad: 2,
            precio_unitario: 15.00,
            productos: {
              id: 302,
              nombre: 'Funda protectora para auriculares',
              imagen: 'https://th.bing.com/th/id/OIP.qfgXFv_TIpg9hQlbdby83gAAAA',
              descripcion: 'Funda rígida para guardar y proteger tus auriculares',
              especificaciones: {
                color: 'Gris',
                material: 'EVA',
                dimensiones: '22 x 18 x 6 cm',
                peso: '120g'
              }
            }
          }
        ]
      },
      '1002': {
        id: 1002,
        user_id: userId,
        estado: 'enviado',
        codigo_seguimiento: 'TR-9812345',
        total: 599.99,
        direccion_envio: 'Avenida Central 45, Barcelona',
        created_at: '2025-05-10T09:15:00',
        entrega_estimada: '2025-05-15',
        metodo_pago: 'PayPal',
        notas: '',
        historial: [
          { fecha: '2025-05-10T09:15:00', estado: 'pendiente', descripcion: 'Pedido realizado' },
          { fecha: '2025-05-10T14:45:00', estado: 'procesando', descripcion: 'Pedido confirmado y en preparación' },
          { fecha: '2025-05-12T08:30:00', estado: 'enviado', descripcion: 'Pedido enviado con empresa de transporte' }
        ],
        pedidos_items: [
          {
            id: 2003,
            pedido_id: 1002,
            cantidad: 1,
            precio_unitario: 599.99,
            productos: {
              id: 303,
              nombre: 'iPhone 15 Pro 128GB',
              imagen: 'https://th.bing.com/th/id/OIP.T8ALBfzER0FiiR1XlDyoeQHaHa',
              descripcion: 'Smartphone Apple con cámara profesional',
              especificaciones: {
                color: 'Titanio Natural',
                memoria: '128GB',
                pantalla: '6.1 pulgadas Super Retina XDR',
                procesador: 'A17 Pro',
                camara: 'Triple de 48MP'
              }
            }
          }
        ]
      },
      '1003': {
        id: 1003,
        user_id: userId,
        estado: 'procesando',
        codigo_seguimiento: 'TR-6541237',
        total: 45.50,
        direccion_envio: 'Plaza Mayor 8, Valencia',
        created_at: '2025-05-14T16:20:00',
        entrega_estimada: '2025-05-18',
        metodo_pago: 'Tarjeta',
        notas: 'Dejar con el vecino si no hay nadie',
        historial: [
          { fecha: '2025-05-14T16:20:00', estado: 'pendiente', descripcion: 'Pedido realizado' },
          { fecha: '2025-05-15T10:05:00', estado: 'procesando', descripcion: 'Pedido confirmado y en preparación' }
        ],
        pedidos_items: [
          {
            id: 2004,
            pedido_id: 1003,
            cantidad: 1,
            precio_unitario: 25.50,
            productos: {
              id: 304,
              nombre: 'Cargador USB-C 30W',
              imagen: 'https://th.bing.com/th/id/OIP.jNZQm8yS8HIV9VxXcDBxagHaHa',
              descripcion: 'Cargador rápido con tecnología GaN',
              especificaciones: {
                color: 'Blanco',
                potencia: '30W',
                entradas: 'USB-C',
                tecnologia: 'GaN'
              }
            }
          },
          {
            id: 2005,
            pedido_id: 1003,
            cantidad: 1,
            precio_unitario: 20.00,
            productos: {
              id: 305,
              nombre: 'Cable USB-C a Lightning 2m',
              imagen: 'https://th.bing.com/th/id/OIP.RlZlvQDl9s1GI0O9-vEn2QHaHa',
              descripcion: 'Cable de carga rápida con trenzado de nylon',
              especificaciones: {
                color: 'Negro',
                longitud: '2m',
                conectores: 'USB-C a Lightning',
                material: 'Nylon trenzado'
              }
            }
          }
        ]
      },
      '1004': {
        id: 1004,
        user_id: userId,
        estado: 'pendiente',
        codigo_seguimiento: 'TR-7653421',
        total: 349.00,
        direccion_envio: 'Calle del Sol 23, Sevilla',
        created_at: '2025-05-15T10:05:00',
        entrega_estimada: '2025-05-20',
        metodo_pago: 'Transferencia',
        notas: '',
        historial: [
          { fecha: '2025-05-15T10:05:00', estado: 'pendiente', descripcion: 'Pedido realizado, esperando confirmación de pago' }
        ],
        pedidos_items: [
          {
            id: 2006,
            pedido_id: 1004,
            cantidad: 1,
            precio_unitario: 349.00,
            productos: {
              id: 306,
              nombre: 'Monitor LG UltraGear 27"',
              imagen: 'https://th.bing.com/th/id/OIP.6tUFQzO3JcglH25IqkXRsAHaEK',
              descripcion: 'Monitor gaming 144Hz con tiempo de respuesta de 1ms',
              especificaciones: {
                tamaño: '27 pulgadas',
                resolucion: '2560 x 1440 QHD',
                refresco: '144Hz',
                respuesta: '1ms',
                conectividad: 'HDMI 2.0, DisplayPort 1.4'
              }
            }
          }
        ]
      },
      '1005': {
        id: 1005,
        user_id: userId,
        estado: 'cancelado',
        codigo_seguimiento: 'TR-8642157',
        total: 79.99,
        direccion_envio: 'Calle Mayor 12, Zaragoza',
        created_at: '2025-05-02T14:45:00',
        entrega_estimada: '2025-05-07',
        metodo_pago: 'Tarjeta',
        notas: '',
        historial: [
          { fecha: '2025-05-02T14:45:00', estado: 'pendiente', descripcion: 'Pedido realizado' },
          { fecha: '2025-05-02T15:30:00', estado: 'procesando', descripcion: 'Pedido confirmado y en preparación' },
          { fecha: '2025-05-03T09:15:00', estado: 'cancelado', descripcion: 'Pedido cancelado a petición del cliente' }
        ],
        pedidos_items: [
          {
            id: 2007,
            pedido_id: 1005,
            cantidad: 1,
            precio_unitario: 79.99,
            productos: {
              id: 307,
              nombre: 'Teclado mecánico Logitech G Pro',
              imagen: 'https://th.bing.com/th/id/OIP.lKTurkehW_MG1G14kcolSgHaFj',
              descripcion: 'Teclado gaming con switches GX Blue',
              especificaciones: {
                tipo: 'Mecánico',
                switches: 'GX Blue',
                rgb: 'Sí',
                layout: 'Español',
                conectividad: 'USB'
              }
            }
          }
        ]
      }
    };
    
    // Buscar el pedido por ID
    if (mockOrders[orderId]) {
      // Si se proporciona userId, verificar que coincida
      if (userId && mockOrders[orderId].user_id !== userId) {
        return { error: { message: 'El pedido no pertenece a este usuario' }, success: false };
      }
      return { data: mockOrders[orderId], success: true };
    } else {
      return { error: { message: 'Pedido no encontrado' }, success: false };
    }
  } catch (error) {
    console.error('Error obteniendo detalle de pedido simulado:', error);
    return { error, success: false };
  }
};

export const updateOrderStatus = async (orderId, status, adminId = null) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .update({ 
        estado: status,
        updated_at: new Date(),
        admin_id: adminId
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Crear notificación para el usuario
    const statusMessages = {
      'procesando': 'Tu pedido está siendo procesado',
      'enviado': 'Tu pedido ha sido enviado',
      'entregado': 'Tu pedido ha sido entregado',
      'cancelado': 'Tu pedido ha sido cancelado'
    };

    if (statusMessages[status]) {
      await supabase
        .from('notificaciones')
        .insert({
          user_id: data.user_id,
          tipo: 'pedido',
          titulo: `Estado de pedido actualizado: ${status}`,
          mensaje: `${statusMessages[status]}. Pedido #${orderId}.`,
          enlace: `/pedidos/${orderId}`,
          leido: false,
          creado_en: new Date()
        });
    }

    return { data, success: true };
  } catch (error) {
    console.error('Error actualizando estado de pedido:', error);
    return { error, success: false };
  }
};

// Utilidad para generar código de seguimiento
const generateTrackingCode = () => {
  const prefix = 'CZO';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Funciones para soporte y chat

export const createSupportTicket = async (ticketData) => {
  // Simular crear un ticket de soporte
  console.log('Creando ticket de soporte simulado con datos:', ticketData);
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Creamos un ticket simulado con los datos proporcionados
    const mockTicket = {
      id: Math.floor(Math.random() * 1000) + 10,
      user_id: ticketData.userId,
      asunto: ticketData.subject || ticketData.asunto,
      descripcion: ticketData.message || ticketData.mensaje,
      estado: 'abierto',
      prioridad: ticketData.priority || ticketData.prioridad || 'normal',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      categoria: ticketData.department || ticketData.departamento || 'general',
      respuestas: [
        {
          id: Math.floor(Math.random() * 1000) + 200,
          ticket_id: Math.floor(Math.random() * 1000) + 10,
          user_id: ticketData.userId,
          es_admin: false,
          mensaje: ticketData.message || ticketData.mensaje,
          created_at: new Date().toISOString()
        }
      ]
    };
    
    console.log('Ticket simulado creado:', mockTicket);
    
    return { data: mockTicket, success: true };
  } catch (error) {
    console.error('Error creando ticket de soporte simulado:', error);
    return { error, success: false };
  }
};

export const getSupportTicketsByUser = async (userId) => {
  // Datos simulados para tickets de soporte del usuario
  console.log('Obteniendo tickets de soporte simulados para el usuario:', userId);
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockTickets = [
      {
        id: 1,
        user_id: userId,
        asunto: 'Problema con mi pedido #1002',
        descripcion: 'Mi pedido lleva varios días en estado "enviado" pero no he recibido ninguna actualización.',
        estado: 'abierto',
        prioridad: 'media',
        created_at: '2025-05-11T10:30:00',
        updated_at: '2025-05-11T15:45:00',
        categoria: 'pedidos',
        respuestas: [
          {
            id: 101,
            ticket_id: 1,
            user_id: userId,
            es_admin: false,
            mensaje: 'Mi pedido lleva varios días en estado "enviado" pero no he recibido ninguna actualización.',
            created_at: '2025-05-11T10:30:00'
          },
          {
            id: 102,
            ticket_id: 1,
            es_admin: true,
            mensaje: 'Buenos días. Hemos consultado el estado de su envío y nos informan que hubo un retraso en el centro logístico. El paquete saldrá mañana para entrega. Disculpe las molestias.',
            created_at: '2025-05-11T15:45:00'
          }
        ]
      },
      {
        id: 2,
        user_id: userId,
        asunto: 'Consulta sobre compatibilidad de productos',
        descripcion: '¿El cargador USB-C que compré es compatible con mi iPhone 15 Pro?',
        estado: 'cerrado',
        prioridad: 'baja',
        created_at: '2025-04-28T09:15:00',
        updated_at: '2025-04-28T11:20:00',
        categoria: 'productos',
        respuestas: [
          {
            id: 103,
            ticket_id: 2,
            user_id: userId,
            es_admin: false,
            mensaje: '¿El cargador USB-C que compré es compatible con mi iPhone 15 Pro?',
            created_at: '2025-04-28T09:15:00'
          },
          {
            id: 104,
            ticket_id: 2,
            es_admin: true,
            mensaje: 'Sí, el cargador USB-C de 30W es totalmente compatible con el iPhone 15 Pro y aprovecha la carga rápida. Necesitará un cable USB-C a Lightning que también vendemos en nuestra tienda.',
            created_at: '2025-04-28T10:30:00'
          },
          {
            id: 105,
            ticket_id: 2,
            user_id: userId,
            es_admin: false,
            mensaje: '¡Gracias por la información! Ya he comprado el cable también.',
            created_at: '2025-04-28T11:00:00'
          },
          {
            id: 106,
            ticket_id: 2,
            es_admin: true,
            mensaje: 'Perfecto, estamos a su disposición para cualquier otra consulta. ¡Que disfrute de sus productos!',
            created_at: '2025-04-28T11:20:00'
          }
        ]
      },
      {
        id: 3,
        user_id: userId,
        asunto: 'Solicitud de devolución',
        descripcion: 'Quisiera devolver el teclado mecánico que compré porque las teclas hacen demasiado ruido.',
        estado: 'en proceso',
        prioridad: 'alta',
        created_at: '2025-05-05T14:20:00',
        updated_at: '2025-05-06T09:10:00',
        categoria: 'devoluciones',
        respuestas: [
          {
            id: 107,
            ticket_id: 3,
            user_id: userId,
            es_admin: false,
            mensaje: 'Quisiera devolver el teclado mecánico que compré porque las teclas hacen demasiado ruido.',
            created_at: '2025-05-05T14:20:00'
          },
          {
            id: 108,
            ticket_id: 3,
            es_admin: true,
            mensaje: 'Hemos recibido su solicitud de devolución. Para proceder, necesitamos que nos envíe una foto del producto y su factura de compra a este ticket.',
            created_at: '2025-05-05T16:45:00'
          },
          {
            id: 109,
            ticket_id: 3,
            user_id: userId,
            es_admin: false,
            mensaje: 'Acabo de enviar las fotos y la factura por correo electrónico.',
            created_at: '2025-05-06T09:10:00'
          }
        ]
      }
    ];
    
    return { data: mockTickets, success: true };
  } catch (error) {
    console.error('Error obteniendo tickets de soporte simulados:', error);
    return { error, success: false };
  }
};

export const addTicketResponse = async (ticketId, response, isAdmin = false) => {
  // Simular añadir una respuesta a un ticket
  console.log('Añadiendo respuesta simulada al ticket:', ticketId);
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulamos una respuesta exitosa
    const mockResponse = {
      id: Math.floor(Math.random() * 1000) + 200,
      ticket_id: ticketId,
      mensaje: response.message,
      es_admin: isAdmin,
      user_id: response.userId,
      created_at: new Date().toISOString()
    };

    // Actualizar el estado del ticket si es necesario
    if (isAdmin && response.updateStatus) {
      console.log(`Actualizando estado del ticket ${ticketId} a: ${response.updateStatus}`);
      // En un caso real, aquí actualizaríamos el estado en la base de datos
    }    // Notificar al usuario si la respuesta es de un admin
    if (isAdmin) {
      console.log(`Simulando notificación para el usuario por respuesta de soporte en ticket ${ticketId}`);
      // En un caso real, aquí enviaríamos una notificación al usuario
    }

    return { data: mockResponse, success: true };
  } catch (error) {
    console.error('Error agregando respuesta a ticket:', error);
    return { error, success: false };
  }
};

export const getFaqs = async (category = null) => {
  // Datos simulados para FAQs
  console.log('Obteniendo FAQs simuladas, categoría:', category || 'todas');
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const mockFaqs = [
      {
        id: 1,
        categoria: 'general',
        pregunta: '¿Cómo funciona CazaOfertas?',
        respuesta: 'CazaOfertas es una plataforma comunitaria donde los usuarios pueden compartir, descubrir y votar ofertas. Cualquier usuario registrado puede publicar ofertas que encuentre en tiendas online o físicas, y otros usuarios pueden valorarlas y comentarlas.',
        orden: 1,
        util_si: 128,
        util_no: 12
      },
      {
        id: 2,
        categoria: 'general',
        pregunta: '¿Es gratis usar CazaOfertas?',
        respuesta: 'Sí, CazaOfertas es completamente gratuito para todos los usuarios. No hay costos ocultos ni suscripciones premium.',
        orden: 2,
        util_si: 97,
        util_no: 3
      },
      {
        id: 3,
        categoria: 'cuenta',
        pregunta: '¿Cómo puedo cambiar mi contraseña?',
        respuesta: 'Para cambiar tu contraseña, inicia sesión en tu cuenta, ve a tu perfil haciendo clic en tu avatar en la esquina superior derecha, selecciona "Configuración de cuenta" y luego "Cambiar contraseña". Sigue las instrucciones para establecer tu nueva contraseña.',
        orden: 1,
        util_si: 65,
        util_no: 8
      },
      {
        id: 4,
        categoria: 'cuenta',
        pregunta: '¿Cómo puedo eliminar mi cuenta?',
        respuesta: 'Para eliminar tu cuenta, ve a la configuración de tu perfil y selecciona "Eliminar cuenta" en la sección "Peligro". Ten en cuenta que esta acción es irreversible y perderás todas tus ofertas, comentarios y actividad en la plataforma.',
        orden: 2,
        util_si: 34,
        util_no: 7
      },
      {
        id: 5,
        categoria: 'pedidos',
        pregunta: '¿Cómo puedo hacer seguimiento de mi pedido?',
        respuesta: 'Para hacer seguimiento de tu pedido, inicia sesión y ve a "Mis Pedidos" en el menú lateral. Allí encontrarás una lista de todos tus pedidos con su estado actual. Al hacer clic en un pedido específico, verás los detalles y podrás seguir su trayecto con el código de seguimiento proporcionado.',
        orden: 1,
        util_si: 89,
        util_no: 4
      },
      {
        id: 6,
        categoria: 'pedidos',
        pregunta: '¿Qué hago si mi pedido está retrasado?',
        respuesta: 'Si tu pedido está retrasado, primero verifica su estado en la sección "Mis Pedidos". Si ha pasado la fecha estimada de entrega, puedes contactar con nuestro servicio de atención al cliente desde la sección "Soporte" creando un nuevo ticket con los detalles de tu pedido.',
        orden: 2,
        util_si: 76,
        util_no: 5
      },
      {
        id: 7,
        categoria: 'devoluciones',
        pregunta: '¿Cuál es la política de devoluciones?',
        respuesta: 'Nuestra política de devoluciones permite devolver cualquier producto en un plazo de 14 días desde su recepción, siempre que esté en su estado original y con todos sus accesorios y embalaje. Para iniciar una devolución, ve a "Mis Pedidos", selecciona el pedido y haz clic en "Solicitar devolución".',
        orden: 1,
        util_si: 103,
        util_no: 11
      },
      {
        id: 8,
        categoria: 'productos',
        pregunta: '¿Los productos tienen garantía?',
        respuesta: 'Todos nuestros productos vienen con la garantía oficial del fabricante. La duración de la garantía depende de cada producto y marca, y se especifica en la página de detalles del producto.',
        orden: 1,
        util_si: 67,
        util_no: 2
      },
      {
        id: 9,
        categoria: 'productos',
        pregunta: '¿Cómo puedo saber si un producto es compatible con mis dispositivos?',
        respuesta: 'En la página de detalles de cada producto encontrarás las especificaciones técnicas y requisitos de compatibilidad. Si tienes dudas específicas, puedes usar el chat de producto para preguntar o crear un ticket de soporte con tu consulta.',
        orden: 2,
        util_si: 58,
        util_no: 6
      },
      {
        id: 10,
        categoria: 'productos',
        pregunta: '¿Puedo cancelar un pedido después de realizarlo?',
        respuesta: 'Puedes cancelar un pedido siempre que su estado sea "pendiente" o "procesando". Para hacerlo, ve a la sección "Mis Pedidos", selecciona el pedido que deseas cancelar y haz clic en el botón "Cancelar pedido". Una vez que el pedido cambia a estado "enviado", ya no es posible cancelarlo directamente.',
        orden: 3,
        util_si: 92,
        util_no: 7
      }
    ];
    
    // Filtramos por categoría si se especifica
    const filteredFaqs = category 
      ? mockFaqs.filter(faq => faq.categoria === category)
      : mockFaqs;
    
    // Ordenamos por el campo "orden"
    filteredFaqs.sort((a, b) => a.orden - b.orden);
    
    return { data: filteredFaqs, success: true };
  } catch (error) {
    console.error('Error obteniendo FAQs simuladas:', error);
    return { error, success: false };
  }
};

// Funciones para productos (expandiendo funcionalidades existentes)
export const getProductById = async (productId) => {
  // Datos simulados para productos específicos
  console.log('Obteniendo producto simulado con ID:', productId);
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockProducts = {
      '101': {
        id: 101,
        nombre: 'iPhone 15 Pro 256GB Titanio Natural',
        descripcion: 'El iPhone 15 Pro es el smartphone más avanzado de Apple hasta la fecha. Con chip A17 Pro, sistema de cámaras profesional con nuevo Ultra Wide, y diseño en titanio de grado aeroespacial que lo hace más ligero y resistente.',
        precio: 1199.99,
        stock: 15,
        categoria_id: 1,
        tienda_id: 1,
        imagen: 'https://th.bing.com/th/id/OIP.T8ALBfzER0FiiR1XlDyoeQHaHa',
        imagenes: [
          'https://th.bing.com/th/id/OIP.T8ALBfzER0FiiR1XlDyoeQHaHa',
          'https://th.bing.com/th/id/OIP.AerTas1fYJ4weo3Wm0S_oQHaHa',
          'https://th.bing.com/th/id/OIP.-JDeaiVHKOq5nZ_5umKrWAHaHa'
        ],
        created_at: '2025-01-15T10:00:00',
        destacado: true,
        puntuacion: 4.8,
        especificaciones: {
          procesador: 'A17 Pro',
          ram: '8GB',
          almacenamiento: '256GB',
          pantalla: '6.1 pulgadas Super Retina XDR',
          resolucion: '2556 x 1179 píxeles',
          camara: 'Sistema Pro de cámaras de 48 MP (principal), 12 MP (ultra gran angular), 12 MP (teleobjetivo)',
          bateria: 'Hasta 23 horas de reproducción de vídeo',
          sistema: 'iOS 17',
          dimensiones: '146,6 mm x 71,6 mm x 8,25 mm',
          peso: '187 g'
        },
        categorias: {
          id: 1,
          nombre: 'Smartphones',
          slug: 'smartphones'
        },
        tiendas: {
          id: 1,
          nombre: 'Apple Store',
          logo: 'https://th.bing.com/th/id/OIP.JtmXSh_uyqIQE3XTmfEnBAHaGV'
        },
        ofertas: [
          {
            id: 201,
            producto_id: 101,
            descuento: 100,
            precio_oferta: 1099.99,
            fecha_inicio: '2025-05-01T00:00:00',
            fecha_fin: '2025-05-20T23:59:59',
            activa: true
          }
        ]
      },
      '102': {
        id: 102,
        nombre: 'Monitor Samsung Odyssey G7 32" QLED Curvo 240Hz',
        descripcion: 'El monitor gaming definitivo con una curvatura 1000R que se adapta a la visión natural del ojo humano. Con tecnología QLED para colores vibrantes, resolución QHD y una increíble tasa de refresco de 240Hz.',
        precio: 799.99,
        stock: 8,
        categoria_id: 2,
        tienda_id: 2,
        imagen: 'https://th.bing.com/th/id/OIP.6tUFQzO3JcglH25IqkXRsAHaEK',
        imagenes: [
          'https://th.bing.com/th/id/OIP.6tUFQzO3JcglH25IqkXRsAHaEK',
          'https://th.bing.com/th/id/OIP.n-QjSj8KlCbCChm3UDx4XwHaEJ',
          'https://th.bing.com/th/id/OIP.X0yIfXGjUgtMjwwcMBTjOgHaE8'
        ],
        created_at: '2025-02-10T14:30:00',
        destacado: true,
        puntuacion: 4.7,
        especificaciones: {
          tamaño: '32 pulgadas',
          tipo_panel: 'QLED',
          resolucion: 'QHD 2560 x 1440',
          tasa_refresco: '240Hz',
          tiempo_respuesta: '1ms',
          curvatura: '1000R',
          hdr: 'HDR600',
          puertos: '1 x DisplayPort 1.4, 2 x HDMI 2.0, 2 x USB 3.0',
          dimensiones: '711.7 x 631.9 x 306.9 mm',
          peso: '7.8 kg'
        },
        categorias: {
          id: 2,
          nombre: 'Monitores',
          slug: 'monitores'
        },
        tiendas: {
          id: 2,
          nombre: 'Samsung',
          logo: 'https://th.bing.com/th/id/OIP.vP_xTw993xA1wppzBGf17QHaEK'
        },
        ofertas: []
      },
      '103': {
        id: 103,
        nombre: 'Sony WH-1000XM5 - Auriculares Inalámbricos',
        descripcion: 'Los auriculares Sony WH-1000XM5 ofrecen la mejor cancelación de ruido de su clase con ocho micrófonos y dos procesadores. Disfruta de un sonido de alta calidad con un nuevo controlador y compatibilidad con LDAC.',
        precio: 399.99,
        stock: 20,
        categoria_id: 3,
        tienda_id: 3,
        imagen: 'https://th.bing.com/th/id/OIP.ZUmlVd7bygSzaaOmY6EZpwHaHa',
        imagenes: [
          'https://th.bing.com/th/id/OIP.ZUmlVd7bygSzaaOmY6EZpwHaHa',
          'https://th.bing.com/th/id/OIP.EaFZ1fcyD-M8DKMFQcBxVgHaHa',
          'https://th.bing.com/th/id/OIP.d1-t-D0PheQfhzWKCQJX2AHaHa'
        ],
        created_at: '2025-03-05T09:45:00',
        destacado: false,
        puntuacion: 4.9,
        especificaciones: {
          tipo: 'Over-ear, cerrado',
          driver: '30mm, tipo cúpula (bobina de voz CCAW)',
          cancelacion_ruido: 'Procesador de ruido HD QN1, Procesador V1',
          bluetooth: '5.2 con LDAC, AAC, SBC',
          bateria: 'Hasta 30 horas con NC',
          carga: 'USB-C, carga rápida (3 min = 3 horas)',
          peso: '250g',
          colores: 'Negro, Plata'
        },
        categorias: {
          id: 3,
          nombre: 'Audio',
          slug: 'audio'
        },
        tiendas: {
          id: 3,
          nombre: 'Sony',
          logo: 'https://th.bing.com/th/id/OIP.33fcOT_bIy9w0IIlMCQ4pgHaEK'
        },
        ofertas: [
          {
            id: 202,
            producto_id: 103,
            descuento: 50,
            precio_oferta: 349.99,
            fecha_inicio: '2025-05-10T00:00:00',
            fecha_fin: '2025-05-25T23:59:59',
            activa: true
          }
        ]
      },
      '104': {
        id: 104,
        nombre: 'Logitech MX Master 3S - Ratón inalámbrico',
        descripcion: 'El Logitech MX Master 3S es un ratón ergonómico avanzado con un 90% menos de ruido en los clics, seguimiento en cualquier superficie con 8K DPI y desplazamiento electromagnético ultrarrápido MagSpeed.',
        precio: 119.99,
        stock: 35,
        categoria_id: 4,
        tienda_id: 4,
        imagen: 'https://th.bing.com/th/id/OIP.hwpEGV4eXlUD30XwJ0oX7QHaHa',
        imagenes: [
          'https://th.bing.com/th/id/OIP.hwpEGV4eXlUD30XwJ0oX7QHaHa',
          'https://th.bing.com/th/id/OIP.PIpT9c6CytYB8KdLsfe5hwHaHa',
          'https://th.bing.com/th/id/OIP.4OJc-eb41T47cTo61_-CnQHaHa'
        ],
        created_at: '2025-04-01T11:20:00',
        destacado: false,
        puntuacion: 4.7,
        especificaciones: {
          tipo: 'Inalámbrico',
          sensor: 'Darkfield de alta precisión, 8000 DPI',
          botones: '7 botones programables',
          conexiones: 'Bluetooth, USB Receptor Logi Bolt',
          bateria: 'Hasta 70 días con carga completa',
          carga: 'USB-C, carga rápida (1 min = 3 horas)',
          peso: '141g',
          colores: 'Gris grafito, Gris claro'
        },
        categorias: {
          id: 4,
          nombre: 'Periféricos',
          slug: 'perifericos'
        },
        tiendas: {
          id: 4,
          nombre: 'Logitech',
          logo: 'https://th.bing.com/th/id/OIP._wmILg-NteMDQ3Dfmr9r9QAAAA'
        },
        ofertas: []
      }
    };
    
    if (mockProducts[productId]) {
      return { data: mockProducts[productId], success: true };
    } else {
      return { error: { message: 'Producto no encontrado' }, success: false };
    }
  } catch (error) {
    console.error('Error obteniendo producto simulado:', error);
    return { error, success: false };
  }
};

export const getProductReviews = async (productId) => {
  // Datos simulados para reseñas de productos
  console.log('Obteniendo reseñas simuladas para el producto:', productId);
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Conjunto de reseñas simuladas para diferentes productos
    const mockReviews = {
      '101': [
        {
          id: 1,
          producto_id: 101,
          user_id: 'user-1',
          puntuacion: 5,
          titulo: 'El mejor iPhone hasta la fecha',
          comentario: 'Me encanta todo de este teléfono. La cámara es increíble, la batería dura todo el día y el nuevo diseño en titanio se siente muy premium. Vale cada céntimo.',
          created_at: '2025-05-02T09:30:00',
          perfiles_usuario: {
            nombre_usuario: 'Carlos Martínez',
            avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg'
          }
        },
        {
          id: 2,
          producto_id: 101,
          user_id: 'user-2',
          puntuacion: 4,
          titulo: 'Casi perfecto',
          comentario: 'Excelente teléfono en todos los aspectos. Le quito una estrella solo porque el precio es muy alto, pero en términos de rendimiento y calidad no tiene rival.',
          created_at: '2025-04-28T14:20:00',
          perfiles_usuario: {
            nombre_usuario: 'Ana García',
            avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg'
          }
        },
        {
          id: 3,
          producto_id: 101,
          user_id: 'user-3',
          puntuacion: 5,
          titulo: 'Cámara impresionante',
          comentario: 'Soy fotógrafo aficionado y la calidad de las fotos que se pueden hacer con este teléfono es comparable a algunas cámaras DSLR. El modo nocturno es espectacular.',
          created_at: '2025-04-20T18:45:00',
          perfiles_usuario: {
            nombre_usuario: 'Miguel Ángel',
            avatar_url: 'https://randomuser.me/api/portraits/men/67.jpg'
          }
        }
      ],
      '102': [
        {
          id: 4,
          producto_id: 102,
          user_id: 'user-4',
          puntuacion: 5,
          titulo: 'Monitor gaming definitivo',
          comentario: 'La tasa de refresco de 240Hz hace toda la diferencia en juegos competitivos. Colores vivos, negros profundos y la curvatura es perfecta. Muy satisfecho con esta compra.',
          created_at: '2025-05-08T11:15:00',
          perfiles_usuario: {
            nombre_usuario: 'Lucas Rodríguez',
            avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg'
          }
        },
        {
          id: 5,
          producto_id: 102,
          user_id: 'user-5',
          puntuacion: 4,
          titulo: 'Excelente pero caro',
          comentario: 'Es un monitor fantástico con características premium, pero el precio es bastante elevado. Si puedes permitírtelo, no te arrepentirás. La calidad de imagen es sobresaliente.',
          created_at: '2025-05-01T09:40:00',
          perfiles_usuario: {
            nombre_usuario: 'Elena Sánchez',
            avatar_url: 'https://randomuser.me/api/portraits/women/56.jpg'
          }
        }
      ],
      '103': [
        {
          id: 6,
          producto_id: 103,
          user_id: 'user-6',
          puntuacion: 5,
          titulo: 'La mejor cancelación de ruido',
          comentario: 'Uso estos auriculares todos los días en el transporte público y en la oficina. La cancelación de ruido es increíble, bloquea prácticamente todo el ruido externo. El sonido es nítido y detallado.',
          created_at: '2025-05-12T16:25:00',
          perfiles_usuario: {
            nombre_usuario: 'Laura Torres',
            avatar_url: 'https://randomuser.me/api/portraits/women/29.jpg'
          }
        },
        {
          id: 7,
          producto_id: 103,
          user_id: 'user-7',
          puntuacion: 5,
          titulo: 'Cómodos incluso para largas sesiones',
          comentario: 'Los uso durante horas para trabajar y son muy cómodos. La batería dura para varios días de uso y la calidad de las llamadas es excelente.',
          created_at: '2025-05-10T08:50:00',
          perfiles_usuario: {
            nombre_usuario: 'Javier Díaz',
            avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg'
          }
        },
        {
          id: 8,
          producto_id: 103,
          user_id: 'user-8',
          puntuacion: 4,
          titulo: 'Casi perfectos',
          comentario: 'Sonido increíble y gran cancelación de ruido. El único inconveniente es que son un poco voluminosos para llevar en la mochila. Por lo demás, excelentes.',
          created_at: '2025-04-25T13:10:00',
          perfiles_usuario: {
            nombre_usuario: 'Sofía López',
            avatar_url: 'https://randomuser.me/api/portraits/women/33.jpg'
          }
        }
      ],
      '104': [
        {
          id: 9,
          producto_id: 104,
          user_id: 'user-9',
          puntuacion: 5,
          titulo: 'El mejor ratón que he tenido',
          comentario: 'Perfecto para productividad. Los botones programables me ahorran mucho tiempo y la rueda de desplazamiento electromagnético es adictiva. Vale cada euro.',
          created_at: '2025-05-14T10:05:00',
          perfiles_usuario: {
            nombre_usuario: 'Daniel Fernández',
            avatar_url: 'https://randomuser.me/api/portraits/men/11.jpg'
          }
        },
        {
          id: 10,
          producto_id: 104,
          user_id: 'user-10',
          puntuacion: 4,
          titulo: 'Excelente ergonomía',
          comentario: 'Muy cómodo para jornadas largas de trabajo. El software Logi Options+ permite personalizarlo al máximo. Solo le falta ser un poco más ligero para ser perfecto.',
          created_at: '2025-05-06T17:30:00',
          perfiles_usuario: {
            nombre_usuario: 'Marta Gómez',
            avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg'
          }
        }
      ]
    };
    
    // Devolvemos las reseñas del producto solicitado o un array vacío si no hay
    return { 
      data: mockReviews[productId] || [], 
      success: true 
    };
  } catch (error) {
    console.error('Error obteniendo reviews simuladas:', error);
    return { error, success: false };
  }
};

export const addProductReview = async (reviewData) => {
  // Simular agregar una reseña a un producto
  console.log('Añadiendo reseña simulada al producto:', reviewData.productId);
  
  try {
    // Simulamos una pequeña demora para que parezca una llamada real
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Creamos una reseña simulada con los datos proporcionados
    const mockReview = {
      id: Math.floor(Math.random() * 1000) + 100,
      producto_id: reviewData.productId,
      user_id: reviewData.userId,
      puntuacion: reviewData.rating,
      comentario: reviewData.comment,
      titulo: reviewData.title || 'Mi opinión sobre este producto',
      created_at: new Date().toISOString(),
      perfiles_usuario: {
        nombre_usuario: 'Usuario actual', // En un caso real, obtendríamos el nombre del usuario actual
        avatar_url: 'https://randomuser.me/api/portraits/lego/1.jpg' // Avatar por defecto
      }
    };
    
    console.log('Reseña simulada creada:', mockReview);
    
    return { data: mockReview, success: true };
  } catch (error) {
    console.error('Error agregando reseña simulada:', error);
    return { error, success: false };
  }
};
