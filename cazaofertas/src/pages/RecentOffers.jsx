import React, { useState, useEffect } from 'react';
import mockData from '../data/mockData';
import { motion } from 'framer-motion';
import OfferCard from '../components/OfferCard';
import { FaFilter, FaSortAmountDown, FaSearch, FaClock, FaThLarge, FaList, FaPercent } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const RecentOffers = () => {
  const [displayedOffers, setDisplayedOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      try {
        let filtered = [...mockData.ofertas];

        // Aplicar filtros
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(offer => offer.id_categoria === parseInt(selectedCategory));
        }

        if (priceRange.min) {
          filtered = filtered.filter(offer => offer.precio_actual >= parseFloat(priceRange.min));
        }

        if (priceRange.max) {
          filtered = filtered.filter(offer => offer.precio_actual <= parseFloat(priceRange.max));
        }

        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          filtered = filtered.filter(offer => 
            offer.titulo.toLowerCase().includes(search) ||
            offer.descripcion.toLowerCase().includes(search)
          );
        }

        // Aplicar ordenamiento
        filtered.sort((a, b) => {
          switch (sortOption) {
            case 'price_asc':
              return a.precio_actual - b.precio_actual;
            case 'price_desc':
              return b.precio_actual - a.precio_actual;
            case 'popular':
              return b.likes - a.likes;
            case 'discount':
              return b.porcentaje_descuento - a.porcentaje_descuento;
            case 'newest':
            default:
              return new Date(b.createdAt) - new Date(a.createdAt);
          }
        });

        setDisplayedOffers(filtered);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading offers:', error);
        setError('No se pudieron cargar las ofertas');
        setIsLoading(false);
      }
    }, 500);
  }, [sortOption, selectedCategory, priceRange, searchTerm]);

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
            <FaClock className="text-orange-500 mr-3" />
            Ofertas Recientes
          </h1>
          <p className="text-gray-600">
            + {displayedOffers.length} resultados para tus búsquedas
          </p>
        </div>

        {/* Búsqueda y filtros */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <div className="flex-1 flex">
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600">
                <FaSearch />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
            >
              <FaFilter className="mr-2" />
              Filtros
            </button>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Más recientes</option>
              <option value="popular">Más populares</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="discount">Mayor descuento</option>
            </select>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FaThLarge />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FaList />
              </button>
            </div>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="p-4 border-t border-gray-200 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="px-4 pb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Todas las categorías</option>
                    {mockData.categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    placeholder="€"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    placeholder="€"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de ofertas */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
          </div>
        ) : displayedOffers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No hay ofertas disponibles</h2>
            <p className="text-gray-600">No se encontraron ofertas que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {displayedOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOffers;
