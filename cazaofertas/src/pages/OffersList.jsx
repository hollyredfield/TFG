import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import mockData from '../data/mockData';
import OfferCard from '../components/OfferCard';
import { FaFilter, FaSortAmountDown, FaThList, FaThLarge, FaUndo, FaChevronDown } from 'react-icons/fa';

const OffersList = () => {
  const { filterType, filterValue } = useParams();
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [title, setTitle] = useState('Todas las Ofertas');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 12;
  const [sortCriteria, setSortCriteria] = useState('relevancia');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { key: 'relevancia', label: 'Relevancia' },
    { key: 'precio_asc', label: 'Precio: Más Bajo a Más Alto' },
    { key: 'precio_desc', label: 'Precio: Más Alto a Más Bajo' },
    { key: 'descuento', label: 'Mayor Descuento' },
    { key: 'popularidad', label: 'Popularidad (Mejor Valorados)' },
    { key: 'nuevos', label: 'Más Recientes' },
  ];

  useEffect(() => {
    let offersToShow = [...mockData.ofertas];
    let currentTitle = 'Todas las Ofertas';

    if (filterType && filterValue) {
      if (filterType === 'categoria') {
        const category = mockData.categorias.find(cat => cat.slug === filterValue);
        if (category) {
          currentTitle = `Ofertas de ${category.nombre}`;
          offersToShow = mockData.ofertas.filter(offer => offer.categoriaId === category.id);
        } else {
          currentTitle = `Categoría no encontrada: ${filterValue}`;
          offersToShow = [];
        }
      } else if (filterType === 'tienda') {
        const store = mockData.tiendas.find(t => t.slug === filterValue);
        if (store) {
          currentTitle = `Ofertas de ${store.nombre}`;
          offersToShow = mockData.ofertas.filter(offer => offer.tiendaId === store.id);
        } else {
          currentTitle = `Tienda no encontrada: ${filterValue}`;
          offersToShow = [];
        }
      } else if (filterType === 'busqueda') {
        currentTitle = `Resultados para "${filterValue}"`;
        offersToShow = mockData.ofertas.filter(offer =>
          offer.titulo.toLowerCase().includes(filterValue.toLowerCase()) ||
          offer.descripcion.toLowerCase().includes(filterValue.toLowerCase()) ||
          (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(filterValue.toLowerCase())))
        );
      }
    }
    setTitle(currentTitle);

    // Apply sorting
    switch (sortCriteria) {
      case 'precio_asc':
        offersToShow.sort((a, b) => a.precio_oferta - b.precio_oferta);
        break;
      case 'precio_desc':
        offersToShow.sort((a, b) => b.precio_oferta - a.precio_oferta);
        break;
      case 'descuento':
        offersToShow.sort((a, b) => {
          const discountA = a.precio_original > 0 ? (a.precio_original - a.precio_oferta) / a.precio_original : 0;
          const discountB = b.precio_original > 0 ? (b.precio_original - b.precio_oferta) / b.precio_original : 0;
          return discountB - discountA;
        });
        offersToShow.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'nuevos':
        offersToShow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'relevancia':
      default:
        break;
    }

    setFilteredOffers(offersToShow);
    setCurrentPage(1);
  }, [filterType, filterValue, sortCriteria]);

  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
    setShowSortDropdown(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-lg shadow-xl mb-8">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-indigo-200">Explora las mejores ofertas seleccionadas para ti. Usa los filtros y opciones de ordenación para encontrar exactamente lo que buscas.</p>
        {(filterType && filterValue) && (
          <Link 
            to="/ofertas" 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaUndo className="mr-2" /> Ver Todas las Ofertas / Limpiar Filtros
          </Link>
        )}
      </div>

      {/* Controls: View Mode, Sort, Filter */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-800 rounded-lg shadow">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm mr-2">Vista:</span>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
            title="Vista de Lista"
          >
            <FaThList />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
            title="Vista de Cuadrícula"
          >
            <FaThLarge />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors"
            >
              <FaSortAmountDown /> 
              {sortOptions.find(opt => opt.key === sortCriteria)?.label || 'Ordenar'}
              <FaChevronDown className={`ml-1 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-700 rounded-md shadow-lg z-10 py-1">
                {sortOptions.map(option => (
                  <a
                    key={option.key}
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleSortChange(option.key); }}
                    className={`block px-4 py-2 text-sm ${sortCriteria === option.key ? 'bg-indigo-500 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
                  >
                    {option.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition-colors" title="Funcionalidad de filtro próximamente">
            <FaFilter /> Filtrar (Próximamente)
          </button>
        </div>
      </div>

      {currentOffers.length > 0 ? (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
          {currentOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <img src="/img/empty-box.svg" alt="No hay ofertas" className="mx-auto mb-6 h-40 w-40 text-gray-500" />
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">No se encontraron ofertas</h2>
          <p className="text-gray-400 mb-6">
            {filterType && filterValue ? 'Intenta ajustar tu búsqueda o filtros, o ' : 'Parece que no hay ofertas que coincidan con tus criterios. ' }
            Explora nuestras <Link to="/categorias" className="text-indigo-400 hover:underline">categorías populares</Link> o <Link to="/ofertas" className="text-indigo-400 hover:underline">mira todas las ofertas</Link>.
          </p>
          {(filterType && filterValue) && (
             <Link 
                to="/ofertas" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
              Ver Todas las Ofertas
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default OffersList;
