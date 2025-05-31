import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export const useProfileStats = (userId) => {
  const [stats, setStats] = useState({
    totalOffers: 0,
    savedOffers: 0,
    votedOffers: 0,
    totalContributions: 0,
    lastOfferDate: null,
    bestOffer: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .rpc('get_user_statistics', { user_id: userId });

        if (error) throw error;

        setStats({
          ...data,
          lastOfferDate: data.lastOfferDate ? new Date(data.lastOfferDate) : null,
        });
      } catch (err) {
        console.error('Error fetching user statistics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  const refreshStats = () => {
    setLoading(true);
    setError(null);
    return fetchStats();
  };

  return {
    stats,
    loading,
    error,
    refreshStats
  };
};
