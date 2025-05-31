import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaChartLine, FaExclamationCircle, FaEye, FaExternalLinkAlt, FaTag, FaStore } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('published');
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserOffers() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Obtener ofertas publicadas por el usuario
        const { data, error } = await supabase
          .from('ofertas')
          .select(`
            *,
            categorias(*),
            tiendas(*),
            comentarios_count:comentarios(count)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOffers(data || []);
      } catch (err) {
        console.error('Error cargando ofertas del usuario:', err);
        setError('No se pudieron cargar tus ofertas. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserOffers();
  }, [user]);

  const handleDeleteOffer = async (offerId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('ofertas')
        .delete()
        .eq('id', offerId);

      if (error) throw error;

      // Actualizar estado local
      setOffers(offers.filter(offer => offer.id !== offerId));
      toast.success('Oferta eliminada correctamente');
    } catch (err) {
      console.error('Error eliminando oferta:', err);
      setError('No se pudo eliminar la oferta. Por favor, inténtalo de nuevo.');
      toast.error('No se pudo eliminar la oferta');
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    switch (activeTab) {
      case 'published':
        return offers.filter(offer => offer.estado === 'activa');
      case 'draft':
        return offers.filter(offer => offer.estado === 'borrador');
      case 'expired':
        return offers.filter(offer => offer.estado === 'expirada' || new Date(offer.fecha_fin) < new Date());
      default:
        return offers;
    }
  };

  const filteredOffers = filterOffers();

  if (loading && offers.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin h-10 w-10 border-3 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Ofertas</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gestiona todas las ofertas que has publicado en la plataforma
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Link to="/crear-oferta" className="button-modern button-primary inline-flex items-center">
            <FaPlus className="mr-2" /> Publicar nueva oferta
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
          <nav className="flex flex-wrap">
            <button
              onClick={() => setActiveTab('published')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'published'
                  ? 'border-b-2 border-primary text-primary dark:text-primary-light'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Publicadas
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'draft'
                  ? 'border-b-2 border-primary text-primary dark:text-primary-light'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Borradores
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
              <FaTag className="text-3xl text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tienes ofertas {activeTab === 'published' ? 'publicadas' : activeTab === 'draft' ? 'en borrador' : 'expiradas'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {activeTab === 'published' 
                ? 'Comienza a publicar ofertas para que otros usuarios puedan beneficiarse de ellas.'
                : activeTab === 'draft' 
                  ? 'Guarda ofertas como borrador mientras las preparas para publicar.'
                  : 'Aquí aparecerán las ofertas que hayan llegado a su fecha de expiración.'}
            </p>
            <Link to="/crear-oferta" className="button-modern button-primary">
              <FaPlus className="mr-2" /> Crear una oferta
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOffers.map(offer => (
              <div key={offer.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
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
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {offer.titulo}
                        </h3>
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
                      
                      <div className="flex items-start space-x-2 mt-1">
                        {offer.estado === 'activa' && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 rounded">
                            Activa
                          </span>
                        )}
                        {offer.estado === 'borrador' && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded">
                            Borrador
                          </span>
                        )}
                        {offer.estado === 'expirada' || new Date(offer.fecha_fin) < new Date() ? (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 rounded">
                            Expirada
                          </span>
                        ) : null}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {offer.descripcion}
                    </p>
                    
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FaEye className="mr-1" />
                          <span>{offer.vista_count || 0} vistas</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <FaChartLine className="mr-1" />
                          <span>{offer.comentarios_count || 0} comentarios</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                        <Link 
                          to={`/oferta/${offer.id}`} 
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                        >
                          <FaExternalLinkAlt className="mr-1 h-3 w-3" />
                          Ver
                        </Link>
                        
                        <Link 
                          to={`/editar-oferta/${offer.id}`}
                          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/60 flex items-center"
                        >
                          <FaEdit className="mr-1 h-3 w-3" />
                          Editar
                        </Link>
                        
                        <button 
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="px-3 py-1.5 text-sm bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/60 flex items-center"
                        >
                          <FaTrash className="mr-1 h-3 w-3" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOffers;
