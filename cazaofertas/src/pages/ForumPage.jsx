import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaUser, FaComment, FaEye, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import forumService from '../services/forumService';
import Loading from '../components/Loading';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ForumPage = () => {
  const [threads, setThreads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    const fetchThreadsAndCategories = async () => {
      try {
        // Fetch categories using simulated service
        const { data: categoriesData, error: categoriesError } = await forumService.getCategories();

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          setCategories(categoriesData || []);
        }

        // Fetch threads using simulated service
        const { data: threadsData, error: threadsError } = await forumService.getThreads();

        if (threadsError) {
          console.error('Error fetching threads:', threadsError);
        } else {
          setThreads(threadsData || []);
        }
      } catch (error) {
        console.error('Error in forum fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreadsAndCategories();
  }, []);

  const handleCreateThread = () => {
    if (isAuthenticated) {
      navigate('/foro/nuevo');
    } else {
      navigate('/login', { state: { from: '/foro' } });
    }
  };

  const handleViewThread = (threadId) => {
    navigate(`/foro/tema/${threadId}`);
  };
  const filteredThreads = threads
    .filter(thread => 
      (selectedCategory === 'all' || thread.categoria_id === selectedCategory) &&
      (thread.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
       thread.contenido.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: es
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Foro de CazaOfertas</h1>
          <p className="text-gray-600">Comparte y discute sobre todo tipo de ofertas y productos</p>
        </div>
        <button
          onClick={handleCreateThread}
          className="mt-4 md:mt-0 bg-primary text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Nuevo tema
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              placeholder="Buscar temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-auto pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay temas que coincidan con tu búsqueda</p>
            {selectedCategory !== 'all' && (
              <button 
                className="mt-4 text-primary hover:underline"
                onClick={() => setSelectedCategory('all')}
              >
                Ver todas las categorías
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tema
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estadísticas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última actualización
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredThreads.map((thread) => (
                  <tr 
                    key={thread.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewThread(thread.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-primary">{thread.titulo}</span>
                        <div className="md:hidden mt-1 flex items-center text-xs text-gray-500">
                          <span className="inline-flex items-center mr-3">
                            <FaUser className="mr-1" size={10} /> {thread.profiles?.nombre_usuario || 'Anónimo'}
                          </span>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            {thread.foro_categorias?.nombre}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {thread.foro_categorias?.nombre}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={thread.profiles?.avatar_url || "https://via.placeholder.com/40"}
                            alt={thread.profiles?.nombre_usuario || 'Avatar'}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-900">{thread.profiles?.nombre_usuario || 'Anónimo'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center">
                          <FaComment className="mr-1 text-gray-400" /> {thread.replies_count}
                        </span>
                        <span className="inline-flex items-center">
                          <FaEye className="mr-1 text-gray-400" /> {thread.vistas || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-gray-400" />
                        <span>{formatDate(thread.updated_at || thread.created_at)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;
