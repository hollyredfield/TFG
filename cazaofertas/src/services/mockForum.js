// Mock data for forum
export const mockThreads = [
  {
    id: '1',
    titulo: '¿Cuál es la mejor oferta de TV que habéis visto?',
    contenido: `Estoy buscando una smart TV de 55" o más y me gustaría saber qué ofertas habéis encontrado últimamente.

He visto algunas en MediaMarkt pero no estoy seguro si esperar a mejores descuentos.`,
    user_id: 'user1',
    user: {
      nombre_usuario: 'TechHunter',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop'
    },
    categoria: 'Electrónica',
    tags: ['TV', 'Smart TV', 'Ofertas'],
    created_at: '2025-05-20T14:30:00Z',
    comentarios_count: 15,
    votos_count: 45,
    vistas_count: 230
  },
  {
    id: '2',
    titulo: 'Recopilación de ofertas para el Prime Day 2025',
    contenido: `¡Se acerca el Prime Day! Vamos a ir recopilando las mejores ofertas que encontremos.

Yo ya tengo mi lista de deseos preparada, principalmente con productos de tecnología y hogar.`,
    user_id: 'user2',
    user: {
      nombre_usuario: 'PrimeExpert',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop'
    },
    categoria: 'Eventos',
    tags: ['Prime Day', 'Amazon', 'Recopilación'],
    created_at: '2025-05-21T09:15:00Z',
    comentarios_count: 32,
    votos_count: 87,
    vistas_count: 543,
    is_pinned: true
  },
  {
    id: '3',
    titulo: 'Ofertón: MacBook Air M3 por 999€ [AGOTADO]',
    contenido: `¡Chollazo en MediaMarkt! MacBook Air M3 por 999€.

Especificaciones:
- Chip M3
- 8GB RAM
- 256GB SSD
- Color Medianoche

Link: [agotado]`,
    user_id: 'user3',
    user: {
      nombre_usuario: 'AppleFan',
      avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop'
    },
    categoria: 'Portátiles',
    tags: ['Apple', 'MacBook', 'Chollo'],
    created_at: '2025-05-22T16:45:00Z',
    comentarios_count: 24,
    votos_count: 156,
    vistas_count: 892,
    is_expired: true
  }
];

export const mockComments = [
  {
    id: '1-1',
    thread_id: '1',
    user_id: 'user2',
    user: {
      nombre_usuario: 'PrimeExpert',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop'
    },
    contenido: 'En MediaMarkt suelen hacer buenos descuentos para el Black Friday, yo esperaría.',
    created_at: '2025-05-20T14:45:00Z',
    votos_count: 12
  },
  {
    id: '1-2',
    thread_id: '1',
    user_id: 'user3',
    user: {
      nombre_usuario: 'AppleFan',
      avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop'
    },
    contenido: 'Yo compré una LG OLED hace poco en Amazon por 899€, una pasada de precio.',
    created_at: '2025-05-20T15:00:00Z',
    votos_count: 8,
    respuesta_a: '1-1'
  }
];

export const mockCategories = [
  { id: 'electronica', nombre: 'Electrónica', icon: 'FaLaptop' },
  { id: 'eventos', nombre: 'Eventos', icon: 'FaCalendar' },
  { id: 'portatiles', nombre: 'Portátiles', icon: 'FaLaptop' },
  { id: 'moviles', nombre: 'Móviles', icon: 'FaMobile' },
  { id: 'hogar', nombre: 'Hogar', icon: 'FaHome' },
  { id: 'gaming', nombre: 'Gaming', icon: 'FaGamepad' }
];

// Mock functions to simulate API calls
export const getThreads = async (filters = {}) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  let threads = [...mockThreads];
  
  if (filters.categoria) {
    threads = threads.filter(thread => thread.categoria.toLowerCase() === filters.categoria.toLowerCase());
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    threads = threads.filter(thread => 
      thread.titulo.toLowerCase().includes(search) ||
      thread.contenido.toLowerCase().includes(search)
    );
  }

  return {
    data: threads,
    success: true,
    error: null
  };
};

export const getThreadById = async (threadId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const thread = mockThreads.find(t => t.id === threadId);
  
  if (!thread) {
    return {
      data: null,
      success: false,
      error: { message: 'Tema no encontrado' }
    };
  }

  return {
    data: thread,
    success: true,
    error: null
  };
};

export const getThreadComments = async (threadId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const comments = mockComments.filter(c => c.thread_id === threadId);
  
  return {
    data: comments,
    success: true,
    error: null
  };
};

export const createThread = async (threadData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newThread = {
    id: Date.now().toString(),
    ...threadData,
    created_at: new Date().toISOString(),
    comentarios_count: 0,
    votos_count: 0,
    vistas_count: 0
  };
  
  mockThreads.unshift(newThread);
  
  return {
    data: newThread,
    success: true,
    error: null
  };
};

export const createComment = async (commentData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const newComment = {
    id: Date.now().toString(),
    ...commentData,
    created_at: new Date().toISOString(),
    votos_count: 0
  };
  
  mockComments.push(newComment);
  
  // Update thread comment count
  const thread = mockThreads.find(t => t.id === commentData.thread_id);
  if (thread) {
    thread.comentarios_count++;
  }
  
  return {
    data: newComment,
    success: true,
    error: null
  };
};

export const voteThread = async (threadId, voteType) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const thread = mockThreads.find(t => t.id === threadId);
  
  if (thread) {
    if (voteType === 'up') {
      thread.votos_count++;
    } else if (voteType === 'down') {
      thread.votos_count--;
    }
  }
  
  return {
    success: true,
    error: null
  };
};
