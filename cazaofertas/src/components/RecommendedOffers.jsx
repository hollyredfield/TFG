import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaStar, FaRegStar, FaChevronLeft, FaChevronRight,
  FaHeart, FaRegHeart, FaSpinner, FaEllipsisV,
  FaRegClock, FaStore, FaLightbulb, FaBell, FaBellSlash, FaArrowRight
} from 'react-icons/fa';
import mockData from '../data/mockData'; // Ensure mockData path is correct
import OfferCard from './OfferCard';
import { useAuth } from '../hooks/useAuth';
import { generateRecommendations } from '../services/openrouter';
import { NotificationService } from '../services/notificationService';
import toast from 'react-hot-toast';
import supabase from '../services/supabase';

const RecommendedOffers = ({ currentOfferId, categoryId, storeId, limit = 4, title = "También te podría interesar" }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true); // Initially true
  const [error, setError] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError(null);
      let fetchedRecommendations = [];

      if (user) {
        try {
          // Attempt to load notification preferences (assuming this table might be real for a logged-in user)
          try {
            const { data: prefData } = await supabase
              .from('notificaciones_preferencias')
              .select('recommendation_notifications')
              .eq('user_id', user.id)
              .single();
            if (prefData) {
              setNotificationsEnabled(prefData.recommendation_notifications !== false);
            }
          } catch (prefError) {
            console.warn('Could not load notification preferences, defaulting to enabled:', prefError.message);
            // Do not set main error state here, as it's a non-critical feature
          }

          // Attempt to get AI recommendations if user exists and OpenRouter is meant to be functional
          // For now, let's assume generateRecommendations might fail or is secondary to mock data
          // const aiRecommendations = await generateRecommendations(purchaseHistory, userPreferences);
          // For stability, we will rely on mock data primarily, as per user's guidance on simulated data

        } catch (apiError) {
          console.error('Error fetching API-based recommendations:', apiError);
          setError('Error al cargar recomendaciones personalizadas. Mostrando sugerencias generales.');
          // Proceed to load mock data in the next step
        }
      }

      // Fallback or primary logic: Use mock data
      // This part is similar to the original second useEffect but integrated here.
      let candidates = mockData.ofertas.filter(offer => offer.id !== currentOfferId);
      const sameCategoryOrStore = candidates.filter(offer => 
        (categoryId && offer.categoriaId === categoryId) || 
        (storeId && offer.tiendaId === storeId) // Updated field names to match our new schema
      );

      let finalMockRecommendations = [];
      if (sameCategoryOrStore.length > 0) {
        finalMockRecommendations = [...sameCategoryOrStore];
      }

      if (finalMockRecommendations.length < limit) {
        const otherOffers = candidates.filter(offer => 
          !finalMockRecommendations.some(rec => rec.id === offer.id)
        );
        const shuffledOthers = otherOffers.sort(() => 0.5 - Math.random());
        finalMockRecommendations.push(...shuffledOthers.slice(0, limit - finalMockRecommendations.length));
      }
      
      setRecommendations(finalMockRecommendations.sort(() => 0.5 - Math.random()).slice(0, limit));
      setLoading(false);
    };

    loadRecommendations();
  }, [user, currentOfferId, categoryId, storeId, limit]); // Dependencies for mock data filtering

  const toggleNotifications = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para configurar notificaciones');
      return;
    }

    try {
      const newValue = !notificationsEnabled;
      setNotificationsEnabled(newValue);

      const { error } = await supabase
        .from('notificaciones_preferencias')
        .upsert({
          user_id: user.id,
          recommendation_notifications: newValue,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success(
        newValue
          ? 'Notificaciones de recomendaciones activadas'
          : 'Notificaciones de recomendaciones desactivadas'
      );
    } catch (err) {
      console.error('Error toggling notifications:', err);
      toast.error('No se pudieron actualizar las preferencias');
      setNotificationsEnabled(!notificationsEnabled); // Revert on error
    }
  };

  // Removed the second useEffect that was purely for mock data as its logic is now integrated.

  if (loading) { // Show loading indicator while processing
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center my-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  // If there was an error fetching API data, it's logged, and error state might be set,
  // but we still proceed to show mock recommendations.
  // We only show a top-level error if mock recommendations are also empty.
  if (error && recommendations.length === 0) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg">
            {error} (Y no se encontraron recomendaciones de muestra)
          </div>
        </div>
      </section>
    );
  }

  if (!user && recommendations.length === 0) { // If not logged in and no mock data (should not happen if mockData is populated)
    return null; // Or a message prompting login to see recommendations
  }
  
  if (recommendations.length === 0) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No hay recomendaciones disponibles en este momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaLightbulb className="text-yellow-500 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recomendaciones para ti
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleNotifications}
              className={`flex items-center space-x-2 text-sm ${
                notificationsEnabled
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              aria-label={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
              title={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
            >
              {notificationsEnabled ? <FaBell /> : <FaBellSlash />}
              <span className="hidden sm:inline">{notificationsEnabled ? 'Notificar' : 'Sin notificar'}</span>
            </button>
            
            <Link to="/recomendaciones" className="text-primary flex items-center text-sm font-medium hover:underline">
              <span>Ver más</span>
              <FaArrowRight className="ml-1" />
            </Link>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No hay recomendaciones disponibles en este momento
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedOffers;
