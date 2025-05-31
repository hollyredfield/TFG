import React, { useState, useEffect, useMemo } from 'react';
import AIChat from '../components/AIChat';
import { 
  FaRobot, FaSpinner, FaShoppingCart, 
  FaUser, FaBox, FaTicketAlt, FaQuestionCircle,
  FaShieldAlt, FaHistory, FaBookmark
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import supabase from '../services/supabase';
import { Link } from 'react-router-dom';

const AIAssistant = () => {
  const { user, initialized } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('assistant');
  const startTime = useMemo(() => performance.now(), []);

  useEffect(() => {
    let mounted = true;

    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('perfiles')
          .select(`
            *,
            pedidos (count),
            ofertas_guardadas (count),
            tickets (count)
          `)
          .eq('user_id', user.id)
          .single();

        if (mounted) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    if (initialized && !isLoaded) {
      loadUserProfile();
      setIsLoaded(true);
    }

    const timeout = setTimeout(() => {
      if (mounted && !initialized) {
        console.warn('[AIAssistant] ⚠️ Timeout de inicialización - Forzando carga');
        setIsLoaded(true);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [initialized, isLoaded, startTime, user]);

  const navigationItems = [
    { id: 'assistant', icon: FaRobot, label: 'Asistente IA' },
    { id: 'orders', icon: FaBox, label: 'Mis Pedidos', requiresAuth: true },
    { id: 'tickets', icon: FaTicketAlt, label: 'Soporte', requiresAuth: true },
    { id: 'saved', icon: FaBookmark, label: 'Guardados', requiresAuth: true },
    { id: 'account', icon: FaUser, label: 'Mi Cuenta', requiresAuth: true },
    { id: 'privacy', icon: FaShieldAlt, label: 'Privacidad' },
    { id: 'help', icon: FaQuestionCircle, label: 'Ayuda' },
    { id: 'history', icon: FaHistory, label: 'Historial', requiresAuth: true }
  ];

  const shouldShowSpinner = !initialized && !isLoaded;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de navegación */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                  <FaRobot className="text-indigo-400 mr-2" />
                  Asistente IA
                </h2>
                <p className="text-sm text-gray-400">
                  Tu asistente personal para CazaOfertas
                </p>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  (!item.requiresAuth || user) && (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center px-4 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === item.id
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="mr-3" />
                      {item.label}
                    </button>
                  )
                ))}
              </nav>

              {userProfile && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="text-xs text-gray-500">
                    <div className="flex justify-between mb-2">
                      <span>Miembro desde</span>
                      <span>{new Date(userProfile.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Pedidos</span>
                      <span>{userProfile.pedidos?.[0]?.count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ofertas guardadas</span>
                      <span>{userProfile.ofertas_guardadas?.[0]?.count || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {shouldShowSpinner ? (
              <div className="flex justify-center my-12">
                <FaSpinner className="text-4xl text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
                {activeSection === 'assistant' && <AIChat />}
                
                {/* Otras secciones se cargarán condicionalmente aquí */}
                {activeSection === 'account' && user && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Mi Cuenta</h2>
                    {/* Aquí irá el contenido de la cuenta */}
                  </div>
                )}

                {/* Mostrar mensaje si se requiere autenticación */}
                {(!user && navigationItems.find(item => item.id === activeSection)?.requiresAuth) && (
                  <div className="text-center py-12">
                    <div className="bg-gray-700/50 rounded-lg p-8 max-w-md mx-auto">
                      <FaUser className="mx-auto text-4xl text-gray-400 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Inicia sesión para continuar
                      </h3>
                      <p className="text-gray-400 mb-6">
                        Necesitas iniciar sesión para acceder a esta función
                      </p>
                      <Link 
                        to="/login" 
                        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Iniciar sesión
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;