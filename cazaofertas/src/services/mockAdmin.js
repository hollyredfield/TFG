// Mock data for admin panel
export const mockUsers = [
  { id: 1, name: 'Ana García', email: 'ana@example.com', role: 'user', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Carlos López', email: 'carlos@example.com', role: 'admin', status: 'active', createdAt: '2024-01-10' },
  { id: 3, name: 'María Sánchez', email: 'maria@example.com', role: 'user', status: 'inactive', createdAt: '2024-02-20' },
];

export const mockOffers = [
  { 
    id: 1, 
    title: 'iPhone 15 Pro Max', 
    price: 999.99, 
    store: 'Apple Store',
    status: 'active',
    createdAt: '2024-05-10',
    user: 'Ana García'
  },
  { 
    id: 2, 
    title: 'Samsung Galaxy S24', 
    price: 899.99, 
    store: 'Samsung Store',
    status: 'active',
    createdAt: '2024-05-15',
    user: 'Carlos López'
  },
];

export const mockComments = [
  {
    id: 1,
    text: '¡Excelente oferta!',
    user: 'Ana García',
    offer: 'iPhone 15 Pro Max',
    createdAt: '2024-05-20',
    status: 'active'
  },
  {
    id: 2,
    text: 'El precio está muy bien',
    user: 'María Sánchez',
    offer: 'Samsung Galaxy S24',
    createdAt: '2024-05-21',
    status: 'active'
  },
];

export const mockReports = [
  {
    id: 1,
    type: 'offer',
    reason: 'Precio incorrecto',
    reportedItem: 'iPhone 15 Pro Max',
    reportedBy: 'María Sánchez',
    status: 'pending',
    createdAt: '2024-05-22'
  },
  {
    id: 2,
    type: 'comment',
    reason: 'Spam',
    reportedItem: 'Comentario en Samsung Galaxy S24',
    reportedBy: 'Carlos López',
    status: 'resolved',
    createdAt: '2024-05-23'
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: 'new_offer',
    message: 'Nueva oferta añadida: iPhone 15 Pro Max',
    createdAt: '2024-05-24',
    status: 'unread'
  },
  {
    id: 2,
    type: 'new_report',
    message: 'Nuevo reporte: Precio incorrecto en iPhone 15 Pro Max',
    createdAt: '2024-05-25',
    status: 'read'
  },
];

// Admin service functions
export const adminService = {
  // Users
  getUsers: () => Promise.resolve(mockUsers),
  updateUser: (id, data) => {
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      return Promise.resolve(mockUsers[userIndex]);
    }
    return Promise.reject(new Error('Usuario no encontrado'));
  },

  // Offers
  getOffers: () => Promise.resolve(mockOffers),
  updateOffer: (id, data) => {
    const offerIndex = mockOffers.findIndex(offer => offer.id === id);
    if (offerIndex !== -1) {
      mockOffers[offerIndex] = { ...mockOffers[offerIndex], ...data };
      return Promise.resolve(mockOffers[offerIndex]);
    }
    return Promise.reject(new Error('Oferta no encontrada'));
  },

  // Comments
  getComments: () => Promise.resolve(mockComments),
  updateComment: (id, data) => {
    const commentIndex = mockComments.findIndex(comment => comment.id === id);
    if (commentIndex !== -1) {
      mockComments[commentIndex] = { ...mockComments[commentIndex], ...data };
      return Promise.resolve(mockComments[commentIndex]);
    }
    return Promise.reject(new Error('Comentario no encontrado'));
  },

  // Reports
  getReports: () => Promise.resolve(mockReports),
  updateReport: (id, data) => {
    const reportIndex = mockReports.findIndex(report => report.id === id);
    if (reportIndex !== -1) {
      mockReports[reportIndex] = { ...mockReports[reportIndex], ...data };
      return Promise.resolve(mockReports[reportIndex]);
    }
    return Promise.reject(new Error('Reporte no encontrado'));
  },

  // Notifications
  getNotifications: () => Promise.resolve(mockNotifications),
  updateNotification: (id, data) => {
    const notifIndex = mockNotifications.findIndex(notif => notif.id === id);
    if (notifIndex !== -1) {
      mockNotifications[notifIndex] = { ...mockNotifications[notifIndex], ...data };
      return Promise.resolve(mockNotifications[notifIndex]);
    }
    return Promise.reject(new Error('Notificación no encontrada'));
  },
};
