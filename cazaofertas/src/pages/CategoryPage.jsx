import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import mockData from '../data/mockData';
import { motion } from 'framer-motion';
import OfferCard from '../components/OfferCard';
import { FaStore } from 'react-icons/fa';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalOffers, setTotalOffers] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  const [priceFilter, setPriceFilter] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    setLoading(true);
    // Find the category based on the slug
    const categoryData = mockData.categorias.find(cat => cat.slug === slug);
    if (!categoryData) {
      navigate('/categorias');
      return;
    }
    setCategory(categoryData);

    // Filter offers by category
    let filtered = mockData.ofertas.filter(offer => offer.categoriaId === categoryData.id);
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Filtros de precio
    if (priceFilter) {
      if (priceFilter.min !== null) filtered = filtered.filter(offer => offer.precio_actual >= priceFilter.min);
      if (priceFilter.max !== null) filtered = filtered.filter(offer => offer.precio_actual <= priceFilter.max);
    }
    setFilteredOffers(filtered);
    setTotalOffers(filtered.length);
    setLoading(false);
  }, [slug, priceFilter]);

  const handleStoreToggle = (store) => {
    setSelectedStores(prev => {
      if (prev.includes(store)) {
        return prev.filter(s => s !== store);
      } else {
        return [...prev, store];
      }
    });
    setPage(1); // Resetear a la primera página al cambiar filtros
  };

  const setPriceRange = (min, max) => {
    setPriceFilter({ min, max });
    setPage(1); // Resetear a la primera página al cambiar filtros
  };

  const clearFilters = () => {
    setSortBy('date');
    setPriceFilter(null);
    setSelectedStores([]);
    setPage(1);
  };

  // Componente de paginación
  const Pagination = () => {
    const totalPages = Math.ceil(totalOffers / pageSize);
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center space-x-2 mt-10">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50"
        >
          Anterior
        </button>
        
        <div className="text-white">
          Página {page} de {totalPages}
        </div>
        
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="w-full h-32 bg-gray-800 animate-pulse rounded-xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Oops!</h1>
          <p className="text-xl text-gray-400 mb-8">
            {error || 'Esta categoría no existe o ha sido eliminada.'}
          </p>
          <Link 
            to="/categorias"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Ver todas las categorías
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4">
      <div className="container mx-auto">
        {/* Encabezado de la categoría */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ 
            background: `linear-gradient(135deg, ${category.color || '#6366f1'}, #1f2937)` 
          }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-5xl mr-5">{category.icono}</span>
              <div>
                <h1 className="text-3xl font-bold">{category.nombre}</h1>
                <p className="text-gray-400">{category.descripcion}</p>
              </div>
            </div>
            
            <div className="bg-gray-900/80 rounded-lg px-4 py-2 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold">{totalOffers}</div>
              <div className="text-sm text-gray-400">ofertas activas</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filtros y ordenación (sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Filtros</h2>
              
              {/* Ordenación */}
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Ordenar por</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="date">Más recientes</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                  <option value="discount">Mayor descuento</option>
                  <option value="votes">Más votados</option>
                </select>
              </div>
              
              {/* Filtro de precio */}
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Rango de precio</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setPriceRange(0, 50)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      priceFilter?.min === 0 && priceFilter?.max === 50
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    0€ - 50€
                  </button>
                  <button 
                    onClick={() => setPriceRange(50, 100)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      priceFilter?.min === 50 && priceFilter?.max === 100
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    50€ - 100€
                  </button>
                  <button 
                    onClick={() => setPriceRange(100, 300)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      priceFilter?.min === 100 && priceFilter?.max === 300
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    100€ - 300€
                  </button>
                  <button 
                    onClick={() => setPriceRange(300, null)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      priceFilter?.min === 300 && priceFilter?.max === null
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    +300€
                  </button>
                </div>
              </div>
              
              {/* Filtro de tiendas */}
              {stores.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Tiendas</h3>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                    {stores.map((store, idx) => (
                      <div key={idx} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`store-${idx}`}
                          checked={selectedStores.includes(store)}
                          onChange={() => handleStoreToggle(store)}
                          className="mr-2"
                        />
                        <label htmlFor={`store-${idx}`} className="text-gray-300">
                          {store}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Botón limpiar filtros */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
          
          {/* Listado de ofertas */}
          <div className="lg:col-span-3">
            {filteredOffers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredOffers.map((offer) => (
                    <OfferCard 
                      key={offer.id} 
                      offer={offer}
                    />
                  ))}
                </div>
                
                <Pagination />
              </>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">No hay ofertas disponibles</h2>
                <p className="text-gray-400 mb-6">
                  No se encontraron ofertas activas que coincidan con los filtros seleccionados.
                </p>
                {(priceFilter || selectedStores.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;