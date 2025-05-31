import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { motion } from 'framer-motion';
import { FaStoreAlt, FaShoppingBag, FaSearch, FaExternalLinkAlt, FaStar, FaStore } from 'react-icons/fa';
import { getImagenBruta } from '../utils/imageHelpers';
import ImageWithFallback from '../components/ImageWithFallback';

const AllStores = () => {
  const [filteredStores, setFilteredStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const filtered = searchTerm
        ? mockData.tiendas.filter(store => 
            store.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : mockData.tiendas;
      
      setFilteredStores(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchTerm]);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center mb-4">
            <FaStoreAlt className="text-indigo-500 mr-3" />
            Tiendas
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar tiendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg pl-10"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white mb-4">No se encontraron tiendas</h2>
            <p className="text-gray-400">No hay tiendas que coincidan con tu búsqueda. Intenta con otro término.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link to={`/tienda/${store.slug}`} className="block p-6">
                  <div className="h-20 flex items-center justify-center mb-4">
                    <ImageWithFallback
                      src={store.logo}
                      alt={store.nombre}
                      storeName={store.nombre}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.nombre}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{store.descripcion}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaShoppingBag className="mr-1" />
                      <span>{store.ofertas_activas} ofertas activas</span>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="mr-1 text-yellow-400" />
                      <span>{store.valoracion}</span>
                    </div>
                  </div>
                  {store.sitio_web && (
                    <a
                      href={store.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
                    >
                      Visitar web <FaExternalLinkAlt className="ml-1" />
                    </a>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStores;