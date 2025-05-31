import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShippingFast, FaCheck, FaInfoCircle, FaTimes, FaExclamationCircle, FaSearch, FaExternalLinkAlt, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getOrdersByUser } from '../services/mockOrders';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error, success } = await getOrdersByUser(user.id);

        if (!success || error) {
          throw new Error(error?.message || 'No se pudieron cargar tus pedidos');
        }

        setOrders(data || []);
      } catch (err) {
        console.error('Error cargando pedidos:', err);
        setError('No se pudieron cargar tus pedidos. Por favor, inténtalo de nuevo.');
        toast.error('Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  // Función para filtrar los pedidos
  const getFilteredOrders = () => {
    let filtered = orders;

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order => 
        order.codigo_seguimiento.toLowerCase().includes(term) ||
        order.id.toString().includes(term)
      );
    }

    // Filtrar por estado
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.estado === activeFilter);
    }

    return filtered;
  };

  // Helper para obtener el icono y color según el estado
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pendiente':
        return { icon: <FaInfoCircle />, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/40', textColor: 'text-blue-800 dark:text-blue-400' };
      case 'procesando':
        return { icon: <FaBox />, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/40', textColor: 'text-yellow-800 dark:text-yellow-400' };
      case 'enviado':
        return { icon: <FaShippingFast />, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/40', textColor: 'text-purple-800 dark:text-purple-400' };
      case 'entregado':
        return { icon: <FaCheck />, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/40', textColor: 'text-green-800 dark:text-green-400' };
      case 'cancelado':
        return { icon: <FaTimes />, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/40', textColor: 'text-red-800 dark:text-red-400' };
      default:
        return { icon: <FaInfoCircle />, color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700', textColor: 'text-gray-800 dark:text-gray-400' };
    }
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <FaExclamationCircle className="mr-2" />
            <p>Debes iniciar sesión para acceder a tus pedidos</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Pedidos</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Revisa y gestiona todos tus pedidos
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex">
          <Link to="/tienda" className="button-modern button-secondary inline-flex items-center">
            Seguir comprando
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 flex items-start">
          <FaExclamationCircle className="mt-1 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'all'
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('pendiente')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'pendiente'
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setActiveFilter('procesando')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'procesando'
                  ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Procesando
            </button>
            <button
              onClick={() => setActiveFilter('enviado')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'enviado'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Enviados
            </button>
            <button
              onClick={() => setActiveFilter('entregado')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                activeFilter === 'entregado'
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Entregados
            </button>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Buscar por código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin h-10 w-10 border-3 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : getFilteredOrders().length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <FaBox className="text-3xl text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay pedidos {activeFilter !== 'all' ? `${activeFilter}s` : ''}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? 'No se encontraron pedidos que coincidan con tu búsqueda.'
              : activeFilter !== 'all'
                ? `No tienes pedidos con estado "${activeFilter}".`
                : 'Aún no has realizado ningún pedido.'}
          </p>
          <Link to="/tienda" className="button-modern button-primary">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Productos
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {getFilteredOrders().map((order) => {
                  const { icon, bgColor, textColor } = getStatusInfo(order.estado);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          #{order.codigo_seguimiento}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                          {icon}
                          <span className="ml-1">
                            {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.total.toFixed(2)}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {order.pedidos_items?.length} producto{order.pedidos_items?.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/pedido/${order.id}`}
                            className="text-primary hover:text-primary-dark dark:hover:text-primary-light"
                          >
                            <FaExternalLinkAlt />
                            <span className="sr-only">Ver pedido</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ayuda y soporte */}
      <div className="mt-8">
        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-xl p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">¿Necesitas ayuda con tu pedido?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Si tienes alguna pregunta o problema con tu pedido, nuestro equipo de soporte está listo para ayudarte.
              </p>
            </div>
            <div className="space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
              <Link to="/soporte" className="button-modern button-primary">
                Contactar soporte
              </Link>
              <Link to="/preguntas-frecuentes" className="button-modern button-secondary">
                Preguntas frecuentes
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 opacity-10">
            <FaShippingFast className="text-9xl text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
