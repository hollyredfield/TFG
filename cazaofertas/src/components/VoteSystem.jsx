import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import forumService from '../services/forumService';

const VoteSystem = ({ itemId, itemType, initialVotes = 0, initialUserVote = null }) => {
  const { user, isAuthenticated } = useAuth();
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && itemId) {
      const fetchUserVote = async () => {
        try {
          const { data } = await forumService.getUserVote(itemId, user.id, itemType);
          setUserVote(data);
        } catch (error) {
          console.error('Error fetching user vote:', error);
        }
      };
      
      const fetchVoteCount = async () => {
        try {
          const { data } = await forumService.getVoteCount(itemId, itemType);
          setVotes(data || 0);
        } catch (error) {
          console.error('Error fetching vote count:', error);
        }
      };
      
      fetchUserVote();
      fetchVoteCount();
    }
  }, [isAuthenticated, user, itemId, itemType]);

  const handleVote = async (value) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para votar');
      return;
    }
    
    setLoading(true);
    
    try {
      const newVote = userVote === value ? null : value;
      
      let result;
      if (itemType === 'thread') {
        result = await forumService.voteThread(itemId, user.id, newVote);
      } else if (itemType === 'message') {
        result = await forumService.voteMessage(itemId, user.id, newVote);
      } else {
        throw new Error('Tipo de item no válido');
      }
      
      if (result.error) throw result.error;
      
      // Update local state
      const voteDiff = (newVote || 0) - (result.oldVote || 0);
      setVotes(prev => prev + voteDiff);
      setUserVote(newVote);
      
    } catch (error) {
      console.error('Error al votar:', error);
      toast.error('Error al procesar tu voto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <button
        disabled={loading}
        onClick={() => handleVote(1)}
        className={`flex items-center mr-2 ${
          userVote === 1 
          ? 'text-green-600' 
          : 'text-gray-500 hover:text-green-600'
        }`}
        aria-label="Me gusta"
      >
        <FaThumbsUp className={`transition-transform ${userVote === 1 ? 'transform scale-110' : ''}`} />
      </button>
      <span className={`font-medium text-sm ${
        votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-gray-500'
      }`}>
        {votes}
      </span>
      <button
        disabled={loading}
        onClick={() => handleVote(-1)}
        className={`flex items-center ml-2 ${
          userVote === -1 
          ? 'text-red-600' 
          : 'text-gray-500 hover:text-red-600'
        }`}
        aria-label="No me gusta"
      >
        <FaThumbsDown className={`transition-transform ${userVote === -1 ? 'transform scale-110' : ''}`} />
      </button>
    </div>
  );
};

export default VoteSystem;
