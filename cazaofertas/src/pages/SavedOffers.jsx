import React, { useState, useEffect } from 'react';
import { FaRegStar, FaStar, FaStore, FaExclamationCircle, FaTag, FaCalendarAlt, FaExternalLinkAlt, FaTrash, FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import { supabase } from '../services/supabase';
import NotificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const SavedOffers = () => {
  const [savedOffers, setSavedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const { user } = useAuth();
  const { createNotification } = useNotifications();

  // Track which offers have price alerts enabled
  const [priceAlerts, setPriceAlerts] = useState({});

  useEffect(() => {
    async function fetchSavedOffers() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener guarardadas por el usuario
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
          .eq('user_id', user.id)
          .order('fecha_guardado', { ascending: false });

        if (error) throw error;

        setSavedOffers(data || []);
      } catch (err) {
        console.error('Error cargando ofertas guardadas:', err);
        setError('No se pudieron cargar tus ofertas guardadas. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }

    fetchSavedOffers();
  }, [user]);

  // Load existing price alert preferences when component mounts
  useEffect(() => {
    const loadPriceAlertPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('notificaciones_preferencias')
          .select('price_alerts')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error loading price alert preferences:', error);
          return;
        }
        
        if (data && data.price_alerts) {
          setPriceAlerts(data.price_alerts);
        }
      } catch (err) {
        console.error('Error loading price alert preferences:', err);
      }
    };
    
    loadPriceAlertPreferences();
  }, [user]);

  const handleRemoveFromSaved = async (savedId) => {
    try {
      // Find the offer data before removing it
      const savedItem = savedOffers.find(item => item.id === savedId);
      const offerName = savedItem?.ofertas?.nombre || 'Oferta';

      const { error } = await supabase
        .from('ofertas_guardadas')
        .delete()
        .eq('id', savedId);

      if (error) throw error;

      setSavedOffers(savedOffers.filter(item => item.id !== savedId));
      toast.success('Oferta eliminada de guardadas');
      
      // Create notification for wishlist update
      if (user) {
        try {
          await NotificationService.notifyWishlistUpdated(user.id, offerName, 'remove');
        } catch (notifErr) {
          console.error('Error creating notification:', notifErr);
        }
      }
    } catch (err) {
      console.error('Error eliminando oferta de guardadas:', err);
      toast.error('No se pudo eliminar la oferta de guardadas');
    }
  };

  // Toggle price alert for a specific offer
  const handleTogglePriceAlert = async (offerId, offerTitle, currentPrice) => {
    if (!user) {
      toast.error('Debes iniciar sesión para configurar alertas de precio');
      return;
    }
    
    try {
      // Update local state
      const newPriceAlerts = { ...priceAlerts };
      
      if (newPriceAlerts[offerId]) {
        // Disable alert
        delete newPriceAlerts[offerId];
        toast.success('Alerta de bajada de precio desactivada');
      } else {
        // Enable alert
        newPriceAlerts[offerId] = {
          title: offerTitle,
          currentPrice: currentPrice,
          createdAt: new Date().toISOString()
        };
        toast.success('Te notificaremos cuando el precio baje');
        
        // Create initial notification
        await NotificationService.createNotification({
          userId: user.id,
          type: 'PRICE_DROP',
          title: 'Alerta de precio activada',
          message: `Te avisaremos cuando ${offerTitle} baje de precio.`,
          data: {
            offer_id: offerId,
            current_price: currentPrice
          }
        });
      }
      
      setPriceAlerts(newPriceAlerts);
      
      // Update in database
      const { error } = await supabase
        .from('notificaciones_preferencias')
        .upsert({
          user_id: user.id,
          price_alerts: newPriceAlerts,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
    } catch (err) {
      console.error('Error toggling price alert:', err);
      toast.error('No se pudo actualizar la alerta de precio');
    }
  };

  const filteredOffers = activeTab === 'active' 
    ? savedOffers.filter(item => {
        const offer = item.ofertas;
        return offer.estado === 'activa' && new Date(offer.fecha_fin) > new Date();
      })
    : savedOffers.filter(item => {
        const offer = item.ofertas;
        return offer.estado === 'expirada' || new Date(offer.fecha_fin) < new Date();
      });

  if (loading && savedOffers.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ofertas Guardadas</h1>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <FaExclamationCircle className="mr-2" />
            <p>Debes iniciar sesión para acceder a tus ofertas guardadas</p>
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <Link to="/login" className="button-modern button-primary">
            Iniciar sesión
          </Link>
          <Link to="/" className="button-modern button-secondary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ofertas Guardadas</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Revisa todas las ofertas que has guardado para seguir más tarde
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link to="/" className="button-modern button-secondary inline-flex items-center">
            <FaTag className="mr-2" /> Explorar más ofertas
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-start">
          <FaExclamationCircle className="mt-1 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden mb-8">
        <div className="border-b dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'active'
                  ? 'border-b-2 border-primary text-primary dark:text-primary-light'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Activas
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'expired'
                  ? 'border-b-2 border-primary text-primary dark:text-primary-light'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Expiradas
            </button>
          </nav>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <FaStar className="text-3xl text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tienes ofertas guardadas {activeTab === 'active' ? 'activas' : 'expiradas'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {activeTab === 'active' 
                ? 'Guarda las ofertas que te interesen para no perderlas de vista.'
                : 'Las ofertas que has guardado y que ya han expirado aparecerán aquí.'}
            </p>
            <Link to="/" className="button-modern button-primary">
              Descubrir ofertas
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOffers.map(item => {
              const offer = item.ofertas;
              return (
                <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                      {offer.imagen_url ? (
                        <img 
                          src={offer.imagen_url} 
                          alt={offer.titulo} 
                          className="w-full md:w-32 h-32 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-full md:w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <FaTag className="text-gray-400 text-3xl" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between">
                        <div>
                          <Link to={`/oferta/${offer.id}`} className="inline-block">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light mb-1">
                              {offer.titulo}
                            </h3>
                          </Link>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <FaStore className="mr-1" />
                            <span>{offer.tiendas?.nombre || 'Tienda no especificada'}</span>
                            {offer.categorias && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{offer.categorias.nombre}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-1">
                          {new Date(offer.fecha_fin) < new Date() ? (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 rounded">
                              Expirada
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 rounded">
                              Activa
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded text-sm font-medium">
                            {offer.precio_original ? (
                              <>
                                <span className="line-through">{offer.precio_original}€</span>{' '}
                                <span className="font-bold">{offer.precio_oferta}€</span>
                              </>
                            ) : (
                              <span className="font-bold">{offer.precio_oferta}€</span>
                            )}
                          </div>
                          
                          {offer.precio_original && (
                            <span className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 px-2 py-1 rounded">
                              {Math.round(((offer.precio_original - offer.precio_oferta) / offer.precio_original) * 100)}% dto.
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FaCalendarAlt className="mr-1" />
                          <span>Guardada el {new Date(item.fecha_guardado).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {offer.descripcion}
                        </p>
                        
                        <div className="flex items-center space-x-2 mt-4 sm:mt-0">                          <Link 
                            to={`/oferta/${offer.id}`} 
                            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                          >
                            <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                            Ver detalles
                          </Link>
                          
                          <button
                            onClick={() => handleTogglePriceAlert(offer.id, offer.titulo, offer.precio_oferta)}
                            className={`px-3 py-1.5 text-sm ${
                              priceAlerts[offer.id] 
                                ? 'bg-green-600 text-white' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400'
                            } rounded hover:opacity-90 flex items-center`}
                            title={priceAlerts[offer.id] ? "Desactivar alerta" : "Alertarme si baja de precio"}
                          >
                            <FaBell className="mr-1 h-3 w-3" />
                            {priceAlerts[offer.id] ? 'Alerta activa' : 'Alertar bajada'}
                          </button>
                          
                          <button 
                            onClick={() => handleRemoveFromSaved(item.id)}
                            className="px-3 py-1.5 text-sm bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/60 flex items-center"
                          >
                            <FaTrash className="mr-1 h-3 w-3" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price alert section */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Alerta de precio
                      </h4>
                      
                      <button
                        onClick={() => handleTogglePriceAlert(offer.id, offer.titulo, offer.precio_oferta)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 transition-all flex items-center ${
                          priceAlerts[offer.id]
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400'
                        }`}
                      >
                        {priceAlerts[offer.id] ? (
                          <>
                            <FaBell className="mr-1" />
                            Desactivar alerta
                          </>
                        ) : (
                          <>
                            <FaBell className="mr-1" />
                            Activar alerta
                          </>
                        )}
                      </button>
                    </div>
                    
                    {priceAlerts[offer.id] && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Te notificaremos cuando el precio baje de {priceAlerts[offer.id].currentPrice}€
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedOffers;
