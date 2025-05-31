import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import OfferCard from '../components/OfferCard';
import { FaShoppingBag, FaStore, FaFilter, FaSortAmountDown, FaSearch } from 'react-icons/fa';
import { fetchStoreData } from '../services/productScraper';
import { getImagenBruta } from '../utils/imageHelpers';

const StorePage = () => {
  const { storeName } = useParams();
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [storeInfo, setStoreInfo] = useState(null);
  const [error, setError] = useState(null);

  // Filtros
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      console.error('[StorePage] ⏰ Timeout después de 10s');
      setIsLoading(false);
      setError('Tiempo de espera agotado. Por favor, intenta de nuevo.');
    }, 10000);

    const fetchStoreOffers = async () => {
      const startTime = performance.now();
      console.log('[StorePage] 🟡 Iniciando fetch de tienda:', decodeURIComponent(storeName));
      
      try {
        setIsLoading(true);
        setError(null);
        
        const decodedStoreName = decodeURIComponent(storeName);
        
        // Realizar todas las peticiones en paralelo
        console.log('[StorePage] ⬇️ Solicitando datos...');
        const [storeData, offersResult] = await Promise.all([
          Promise.race([
            fetchStoreData(decodedStoreName),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
          ]),
          supabase
            .from('ofertas')
            .select(`
              *,
              categorias:id_categoria (
                nombre,
                slug,
                icono,
                color
              ),
              perfiles_usuario:id_usuario (
                nombre_usuario,
                url_avatar,
                esta_verificado
              )
            `)
            .eq('tienda', decodedStoreName)
            .eq('ha_expirado', false)
        ]);

        // Procesar resultados
        const { data: offersData, error: offersError } = offersResult;

        if (offersError) throw offersError;
        if (!offersData) throw new Error('No se recibieron datos de ofertas');

        console.log('[StorePage] ✅ Datos recibidos:',
          'Ofertas:', offersData.length,
          'Info tienda:', storeData ? 'Sí' : 'No'
        );

        const endTime = performance.now();
        console.log('[StorePage] ⏱️ Tiempo total:', Math.round(endTime - startTime), 'ms');

        setStoreInfo(storeData || {
          name: decodedStoreName,
          logo: null,
          description: `Ofertas de ${decodedStoreName}`,
        });

        setOffers(offersData);
        setFilteredOffers(offersData);

      } catch (err) {
        console.error('[StorePage] 🔴 Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        clearTimeout(timeout);
      }
    };

    fetchStoreOffers();

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [storeName]);

  // Efecto para filtrar ofertas
  useEffect(() => {
    if (!offers.length) return;

    let filtered = [...offers];

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de precio
    filtered = filtered.filter(offer => 
      offer.precio_actual >= priceRange[0] && 
      offer.precio_actual <= priceRange[1]
    );

    // Aplicar filtro de descuento
    if (minDiscount > 0) {
      filtered = filtered.filter(offer => 
        (offer.porcentaje_descuento || 0) >= minDiscount
      );
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.precio_actual - b.precio_actual);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.precio_actual - a.precio_actual);
        break;
      case 'discount':
        filtered.sort((a, b) => (b.porcentaje_descuento || 0) - (a.porcentaje_descuento || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.creado_en) - new Date(b.creado_en));
        break;
      default: // 'newest'
        filtered.sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en));
    }

    setFilteredOffers(filtered);
  }, [offers, searchTerm, priceRange, minDiscount, sortBy]);

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setMinDiscount(0);
    setSortBy('newest');
    setSearchTerm('');
  };
  
  // Decodificar el nombre de la tienda para mostrarlo correctamente
  const formattedStoreName = decodeURIComponent(storeName);

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-500 overflow-hidden"
                >                  {storeInfo?.logo ? (
                    <img 
                      src={getImagenBruta(storeInfo.logo, `${formattedStoreName} logo`, null, formattedStoreName)} 
                      alt={`${formattedStoreName} logo`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-2xl font-bold">
                      {formattedStoreName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{formattedStoreName}</h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {storeInfo?.description || `Explora las mejores ofertas disponibles en ${formattedStoreName}`}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {filteredOffers.length} ofertas disponibles
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Actualizado: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100 px-4 py-2 rounded-lg flex items-center"
                >
                  <FaFilter className="mr-2" />
                  Filtros
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-grow">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Buscar ofertas en ${formattedStoreName}`}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none dark:bg-gray-700 dark:text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="absolute right-2 top-2 text-gray-400 dark:text-gray-300">
                      <FaSearch className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <select 
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:outline-none dark:bg-gray-700 dark:text-white"
                  onChange={(e) => setSortBy(e.target.value)}
                  value={sortBy}
                >
                  <option value="newest">Más recientes</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="discount">Mayor descuento</option>
                  <option value="popularity">Más populares</option>
                </select>
              </div>
              
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Filtros avanzados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rango de precio
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        />
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descuento mínimo
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={minDiscount}
                          onChange={(e) => setMinDiscount(parseInt(e.target.value))}
                          className="w-full"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300 w-10 text-center">
                          {minDiscount}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        Restablecer filtros
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
              <FaShoppingBag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
              <h3 className="mt-4 text-2xl font-medium text-gray-900 dark:text-gray-100">
                No hay ofertas disponibles
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                No se encontraron ofertas de {formattedStoreName} con los filtros seleccionados.
                Intenta cambiar los filtros o busca más tarde.
                {error && <span className="block mt-2 text-red-500">Error: {error}</span>}
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          )}
          
          {filteredOffers.length > 20 && (
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-1">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-indigo-600 text-white font-medium">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StorePage;