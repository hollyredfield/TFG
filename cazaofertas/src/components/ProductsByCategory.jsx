// ProductsByCategory.jsx
// Componente para mostrar productos organizados por categorías

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { 
  FaChevronRight, FaChevronLeft, 
  FaTag, FaShoppingCart, 
  FaEye, FaHeart 
} from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import mockData from '../data/mockData';
import OfferCard from './OfferCard';

const ProductsByCategory = ({ limit = 0, showControls = true, initialCategory = 0 }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredOffers, setFilteredOffers] = useState([]);
  
  // Efecto para filtrar las ofertas cuando cambian las dependencias
  useEffect(() => {
    let filtered = selectedCategory === 0 
      ? [...mockData.ofertas]
      : mockData.ofertas.filter(offer => offer.id_categoria === selectedCategory);
    
    // Ordenar las ofertas según el criterio seleccionado
    switch (sortBy) {
      case 'popular':
        filtered = filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
        break;
      case 'price-asc':
        filtered = filtered.sort((a, b) => a.precio_actual - b.precio_actual);
        break;
      case 'price-desc':
        filtered = filtered.sort((a, b) => b.precio_actual - a.precio_actual);
        break;
      case 'discount':
        filtered = filtered.sort((a, b) => b.porcentaje_descuento - a.porcentaje_descuento);
        break;
      default:
        // Mantener el orden por defecto (popularidad)
        break;
    }
    
    // Limitar la cantidad de ofertas si se especifica
    if (limit > 0) {
      filtered = filtered.slice(0, limit);
    }
    
    setFilteredOffers(filtered);
  }, [selectedCategory, sortBy, limit]);

  return (
    <div>
      {showControls && (
        <div className="mb-6">
          {/* Navegación de categorías */}
          <div className="flex overflow-x-auto py-2 scrollbar-hide mb-4">
            <button
              onClick={() => setSelectedCategory(0)}
              className={`px-4 py-2 whitespace-nowrap rounded-full mr-2 transition-all ${
                selectedCategory === 0
                  ? 'bg-orange-500 text-white font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas las categorías
            </button>
            
            {mockData.categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 whitespace-nowrap rounded-full mr-2 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500 text-white font-medium'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Controles de ordenación y visualización */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden sm:inline">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded py-1 px-2 bg-white"
              >
                <option value="popular">Más populares</option>
                <option value="recent">Más recientes</option>
                <option value="price-asc">Precio (de menor a mayor)</option>
                <option value="price-desc">Precio (de mayor a menor)</option>
                <option value="discount">Mayor descuento</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 hidden sm:inline">Vista:</span>
              <div className="flex border rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 ${
                    viewMode === 'grid'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 ${
                    viewMode === 'list'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Título de la categoría seleccionada */}
      {selectedCategory !== 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {mockData.categorias.find(cat => cat.id === selectedCategory)?.nombre || 'Categoría'}
          </h2>
          <p className="text-sm text-gray-600">
            {mockData.categorias.find(cat => cat.id === selectedCategory)?.descripcion}
          </p>
        </div>
      )}

      {/* Lista de productos */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron productos para la categoría seleccionada.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div 
            className={viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4"
              : "space-y-4"
            }
          >
            {filteredOffers.map(offer => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
                viewMode={viewMode}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Ver todos los productos link */}
      {limit > 0 && filteredOffers.length >= limit && (
        <div className="mt-6 text-center">
          <Link 
            to={selectedCategory === 0 ? "/ofertas" : `/categoria/${selectedCategory}`}
            className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
          >
            Ver todas las ofertas
            <FaArrowRight className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};

ProductsByCategory.propTypes = {
  limit: PropTypes.number,
  showControls: PropTypes.bool,
  initialCategory: PropTypes.number
};

export default ProductsByCategory;
