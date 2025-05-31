import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaExclamationCircle, FaArrowLeft, FaTrophy, FaComment, FaHeart } from 'react-icons/fa';
import mockData from '../data/mockData';

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Find user in mock data
        const user = mockData.users.find(u => u.id === userId);
        if (!user) {
          setError('Usuario no encontrado');
          return;
        }

        // Calculate user stats
        const userThreads = mockData.forumThreads.filter(t => t.user_id === userId);
        const userPosts = mockData.forumPosts.filter(p => p.user_id === userId);
        const totalVotes = mockData.forumVotes
          .filter(v => 
            (v.item_type === 'thread' && mockData.forumThreads.some(t => t.id === v.item_id && t.user_id === userId)) ||
            (v.item_type === 'message' && mockData.forumPosts.some(p => p.id === v.item_id && p.user_id === userId))
          )
          .reduce((sum, vote) => sum + vote.vote_value, 0);

        setUserData(user);
        setUserStats({
          threadsCount: userThreads.length,
          postsCount: userPosts.length,
          totalVotes: totalVotes,
          reputation: user.reputation || 0
        });

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-8">
        <div className="mb-6">
          <Link 
            to="/foro"
            className="flex items-center text-primary hover:underline"
          >
            <FaArrowLeft className="mr-1" /> Volver al foro
          </Link>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <FaExclamationCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <Link 
          to="/foro"
          className="flex items-center text-primary hover:underline"
        >
          <FaArrowLeft className="mr-1" /> Volver al foro
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              <img
                src={userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0ea5e9&color=fff&size=128`}
                alt={userData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0ea5e9&color=fff&size=128`;
                }}
              />
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{userData.name}</h1>
              {userData.location && (
                <p className="flex items-center mt-2 text-white/80">
                  <FaMapMarkerAlt className="mr-2" />
                  {userData.location}
                </p>
              )}
              {userData.joinedAt && (
                <p className="flex items-center mt-1 text-white/80">
                  <FaCalendarAlt className="mr-2" />
                  Miembro desde {new Date(userData.joinedAt).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Bio */}
          {userData.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Acerca de</h3>
              <p className="text-gray-600 leading-relaxed">{userData.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{userStats.reputation}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                <FaStar className="mr-1" /> Reputación
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{userStats.threadsCount}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                <FaTrophy className="mr-1" /> Temas
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.postsCount}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                <FaComment className="mr-1" /> Respuestas
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.totalVotes}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                <FaHeart className="mr-1" /> Votos
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
            
            {/* Recent Threads */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">Últimos Temas</h4>
              <div className="space-y-2">
                {mockData.forumThreads
                  .filter(t => t.user_id === userId)
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .slice(0, 3)
                  .map(thread => (
                    <div key={thread.id} className="border-l-4 border-primary pl-4 py-2">
                      <Link 
                        to={`/foro/tema/${thread.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {thread.titulo}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(thread.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  ))
                }
                {mockData.forumThreads.filter(t => t.user_id === userId).length === 0 && (
                  <p className="text-gray-500 italic">No ha creado ningún tema aún.</p>
                )}
              </div>
            </div>

            {/* Recent Posts */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Últimas Respuestas</h4>
              <div className="space-y-2">
                {mockData.forumPosts
                  .filter(p => p.user_id === userId)
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .slice(0, 3)
                  .map(post => {
                    const thread = mockData.forumThreads.find(t => t.id === post.tema_id);
                    return (
                      <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2">
                        <Link 
                          to={`/foro/tema/${thread?.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Re: {thread?.titulo}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(post.created_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    );
                  })
                }
                {mockData.forumPosts.filter(p => p.user_id === userId).length === 0 && (
                  <p className="text-gray-500 italic">No ha escrito ninguna respuesta aún.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
