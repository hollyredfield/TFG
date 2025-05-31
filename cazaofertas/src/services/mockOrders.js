// Mock data for orders
export const mockOrders = [
  {
    id: '1',
    codigo_seguimiento: 'ORD-2025-001',
    estado: 'entregado',
    total: 299.99,
    created_at: '2025-05-01T10:00:00Z',
    updated_at: '2025-05-03T15:30:00Z',
    direccion_envio: 'Calle Principal 123, Madrid',
    metodo_pago: 'Tarjeta de crédito',
    pedidos_items: [
      {
        id: '1-1',
        productos: {
          nombre: 'iPhone 15 Pro',
          imagen_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2f1f?w=200&fit=crop'
        },
        cantidad: 1,
        precio_unitario: 299.99,
        subtotal: 299.99
      }
    ]
  },
  {
    id: '2',
    codigo_seguimiento: 'ORD-2025-002',
    estado: 'enviado',
    total: 549.98,
    created_at: '2025-05-15T14:20:00Z',
    updated_at: '2025-05-16T09:45:00Z',
    direccion_envio: 'Avenida Central 45, Barcelona',
    metodo_pago: 'PayPal',
    pedidos_items: [
      {
        id: '2-1',
        productos: {
          nombre: 'PlayStation 5',
          imagen_url: 'https://images.unsplash.com/photo-1670425776189-9c56a2c72065?w=200&fit=crop'
        },
        cantidad: 1,
        precio_unitario: 499.99,
        subtotal: 499.99
      },
      {
        id: '2-2',
        productos: {
          nombre: 'Control DualSense',
          imagen_url: 'https://images.unsplash.com/photo-1681566038517-ac6c2f67ccb1?w=200&fit=crop'
        },
        cantidad: 1,
        precio_unitario: 49.99,
        subtotal: 49.99
      }
    ]
  },
  {
    id: '3',
    codigo_seguimiento: 'ORD-2025-003',
    estado: 'procesando',
    total: 129.99,
    created_at: '2025-05-22T16:45:00Z',
    updated_at: '2025-05-22T16:45:00Z',
    direccion_envio: 'Plaza Mayor 7, Valencia',
    metodo_pago: 'Tarjeta de débito',
    pedidos_items: [
      {
        id: '3-1',
        ofertas: {
          titulo: 'AirPods Pro 2',
          imagen_url: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=200&fit=crop'
        },
        cantidad: 1,
        precio_unitario: 129.99,
        subtotal: 129.99
      }
    ]
  }
];

// Mock functions to simulate API calls
export const getOrdersByUser = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    data: mockOrders,
    success: true,
    error: null
  };
};

export const getOrderById = async (orderId, userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  const order = mockOrders.find(order => order.id === orderId);
  
  if (!order) {
    return {
      data: null,
      success: false,
      error: { message: 'Pedido no encontrado' }
    };
  }

  return {
    data: order,
    success: true,
    error: null
  };
};

export const updateOrderNotificationSettings = async (userId, orderId, enabled) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    success: true,
    error: null
  };
};
