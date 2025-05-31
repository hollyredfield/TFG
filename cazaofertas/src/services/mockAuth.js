// Utilidades y constantes
import { generateId, simulateDelay, users } from '../data/mockData';

// Sistema de autenticación simulado
let currentSession = null;

const mockAuth = {
  // Simular hash de contraseña (solo para demostración)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },

  // Iniciar sesión
  async login(email, password) {
    await simulateDelay();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { data: null, error: new Error('Usuario no encontrado') };
    }
    
    if (!user.verified) {
      return { data: null, error: new Error('Por favor verifica tu email primero') };
    }

    // En un entorno real, verificaríamos el hash de la contraseña
    // aquí solo simulamos la verificación
    const hashedPassword = await this.hashPassword(password);
    if (user.passwordHash && user.passwordHash !== hashedPassword) {
      return { data: null, error: new Error('Contraseña incorrecta') };
    }

    currentSession = {
      user: {
        id: user.id,
        email: user.email,
        nombre_usuario: user.nombre_usuario,
        avatar_url: user.avatar_url,
        role: user.role
      }
    };

    return {
      data: {
        session: {
          access_token: 'fake-token',
          user: currentSession.user
        }
      },
      error: null
    };
  },

  // Registrar nuevo usuario
  async register(email, password, nombre) {
    await simulateDelay();
    
    if (users.some(u => u.email === email)) {
      return { data: null, error: new Error('Email ya registrado') };
    }

    const passwordHash = await this.hashPassword(password);
    const newUser = {
      id: generateId(),
      email,
      nombre_usuario: nombre,
      passwordHash,
      avatar_url: `https://i.pravatar.cc/300?u=${email}`,
      creado_en: new Date().toISOString(),
      role: 'user',
      verified: false,
      bio: '',
      ubicacion: '',
      intereses: [],
      sitio_web: '',
      redes_sociales: {
        twitter: '',
        telegram: ''
      },
      preferencias: {
        notificaciones_email: true,
        notificaciones_push: true,
        perfil_publico: true
      },
      notifications: [],
      favorites: []
    };

    users.push(newUser);
    return {
      data: {
        user: newUser,
        session: null
      },
      error: null
    };
  },

  // Verificar email
  async verifyEmail(token) {
    await simulateDelay();
    const user = users.find(u => u.id === token || u.email === token);
    
    if (user) {
      user.verified = true;
      return {
        data: {
          user: {
            id: user.id,
            email: user.email,
            nombre_usuario: user.nombre_usuario,
            avatar_url: user.avatar_url,
            role: user.role
          }
        },
        error: null
      };
    }
    
    return {
      data: null,
      error: new Error('Token de verificación inválido')
    };
  },

  // Reenviar email de verificación
  async resendVerificationEmail(email) {
    await simulateDelay();
    const user = users.find(u => u.email === email);
    if (user) {
      if (user.verified) {
        return { data: null, error: new Error('El usuario ya está verificado') };
      }
      // En un entorno real, enviaríamos aquí el email
      return { data: { sent: true }, error: null };
    }
    return { data: null, error: new Error('Usuario no encontrado') };
  },

  // Cerrar sesión
  async logout() {
    await simulateDelay();
    currentSession = null;
    return { error: null };
  },

  // Obtener sesión actual
  getSession() {
    if (!currentSession) {
      return { data: { session: null }, error: null };
    }
    return {
      data: {
        session: {
          access_token: 'fake-token',
          user: currentSession.user
        }
      },
      error: null
    };
  },

  // Obtener usuario actual
  getUser() {
    if (!currentSession?.user) {
      return { data: { user: null }, error: null };
    }
    return {
      data: { user: currentSession.user },
      error: null
    };
  },

  // Actualizar perfil de usuario
  async updateUserProfile(profile) {
    await simulateDelay();
    const userIndex = users.findIndex(u => u.id === profile.id);
    
    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        ...profile,
        updated_at: new Date().toISOString()
      };

      if (currentSession?.user?.id === profile.id) {
        currentSession.user = {
          ...currentSession.user,
          ...profile
        };
      }

      return {
        data: users[userIndex],
        error: null
      };
    }

    return {
      data: null,
      error: new Error('Usuario no encontrado')
    };
  },

  // Crear perfil de usuario
  async createUserProfile(userId, profile) {
    await simulateDelay();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        ...profile,
        creado_en: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return {
        data: users[userIndex],
        error: null
      };
    }

    return {
      data: null,
      error: new Error('Usuario no encontrado')
    };
  }
};

export default mockAuth;
