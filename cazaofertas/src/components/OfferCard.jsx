import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaStar, FaClock, FaStore, FaPercent, FaShoppingCart, FaCheck, FaGift, FaHeart, FaEye, FaRegHeart } from 'react-icons/fa';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import ImageWithFallback from './ImageWithFallback';
import StarRating from './StarRating';
import { getImagenBruta, getFallbackImageByCategory, getCategoryInfo } from '../utils/imageHelpers';
import toast from 'react-hot-toast';

const OfferCard = ({ offer, viewMode = 'grid' }) => {
  const { addToCart } = useShoppingCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const isOfferInWishlist = offer?.id ? isInWishlist(offer.id) : false;

  // Obtener información de la categoría de manera memoizada
  const categoryInfo = useMemo(() => {
    if (!offer) return null;
    const categoryId = offer.categoria_id || (offer.categoria && offer.categoria.id);
    return categoryId ? getCategoryInfo(categoryId) : null;
  }, [offer]);
  
  // IMAGEN DESDE URL DIRECTA (ahora pasamos el objeto completo del producto)
  const imagenBruta = useMemo(() => {
    const categoryId = offer?.categoria_id || (offer?.categoria && offer.categoria.id);
    const storeName = offer?.tienda || offer?.store_name || '';
    return getImagenBruta(offer?.url_imagen || offer?.imagen_url, offer?.titulo, categoryId, storeName, offer);
  }, [offer]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  const formatDate= (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };
  
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation to offer detail
    e.stopPropagation(); // Prevent card click event
    
    // Set adding animation
    setIsAdding(true);
    
    // Add to cart
    addToCart({
      id: offer.id,
      title: offer.titulo,
      price: offer.precio_oferta,
      originalPrice: offer.precio_original,
      discountPercentage: offer.discountPercentage,
      image: offer.imageUrl,
      store: offer.tiendaId,
      url: offer.link_oferta || `/oferta/${offer.slug}`,
      quantity: 1
    });
    
    // Reset after animation completes
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  const calculateDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 2); // 2 días después
    
    const day = deliveryDate.getDate();
    const month = deliveryDate.toLocaleString('es-ES', { month: 'long' });
    
    return `Recíbelo el martes, ${day} de ${month}`;
  };
  
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Debes iniciar sesión para guardar ofertas.');
      navigate('/login');
      return;
    }

    if (isOfferInWishlist) { // Use isOfferInWishlist
      removeFromWishlist(offer.id); // Use context's removeFromWishlist
    } else {
      addToWishlist(offer); // Use context's addToWishlist
    }
  };

  const cardLink = `/oferta/${offer.slug}`;
  console.log(`Creando enlace con slug: ${offer.slug} para oferta:`, offer.titulo);

  // Vista de lista como en PC Componentes
  if (viewMode === 'list') {
    return (
      <div className="group relative flex bg-white dark:bg-gray-800 shadow-soft hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden my-3 border border-transparent hover:border-indigo-500">
        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 z-20 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title={isOfferInWishlist ? "Quitar de la lista de deseos" : "Guardar en lista de deseos"}
        >
          {isOfferInWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>
        
        <Link to={cardLink} className="flex w-full">
          {/* Imagen y descuento */}
          <div className="relative w-1/4 p-3 flex-shrink-0">
            {offer.porcentaje_descuento > 0 && (
              <div className="absolute left-1 top-1 z-10 bg-red-600 text-white text-xs font-bold rounded px-1.5 py-0.5">
                -{offer.porcentaje_descuento}%
              </div>
            )}
            {/* List view image section */}            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 rounded-md">              <ImageWithFallback
                src={imagenBruta}
                alt={offer.titulo}
                categoryId={offer?.categoria_id || (offer?.categoria && offer.categoria.id)}
                storeName={offer?.tienda || offer?.store_name || ''}
                product={offer}
                className="h-full w-full object-contain p-1"
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-3 flex flex-col">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
              <FaStore className="mr-1.5 text-indigo-500" />
              <span>{offer.tienda}</span>
              {categoryInfo && (
                <>
                  <span className="mx-1.5">·</span>
                  <span style={{ color: categoryInfo.color }}>{categoryInfo.icon}</span>
                  <span className="ml-1">{categoryInfo.name}</span>
                </>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {offer.titulo}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 mb-2 line-clamp-2 text-sm">
              {offer.descripcion}
            </p>
            
            <div className="flex items-end justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(offer.precio_oferta)}
                </span>
                {offer.precio_original && offer.precio_original > offer.precio_oferta && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(offer.precio_original)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Changed Link to div to avoid nesting <a> tags */}
                <div
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors inline-flex items-center cursor-pointer"
                  title="Ver detalles"
                  // onClick event can be added here if specific non-navigation action is needed
                  // For now, clicking this will navigate due to the parent Link
                >
                  <FaEye className="mr-1.5" /> Ver Detalles
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors inline-flex items-center ${
                    isAdding 
                      ? 'bg-green-600 text-white' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <FaCheck className="mr-1.5" /> Añadido
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="mr-1.5" /> Añadir
                    </>
                  )}
                </button>
              </div>
            </div>
             {/* Rating */}
             {offer.likes !== undefined && (
                <div className="flex items-center gap-1">
                  <StarRating rating={offer.rating || 0} size="sm" />
                  <span className="text-gray-600 dark:text-gray-300">{offer.likes} valoraciones</span>
                </div>
              )}
          </div>
        </Link>
      </div>
    );
  }

  // Vista de cuadrícula (vista por defecto)
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-soft transition-all duration-300 hover:shadow-xl h-full border border-transparent hover:border-indigo-500">
      {/* Wishlist button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-20 p-2 bg-white/80 dark:bg-gray-900/80 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        title={isOfferInWishlist ? "Quitar de la lista de deseos" : "Guardar en lista de deseos"}
      >
        {isOfferInWishlist ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      </button>
      
      <Link to={cardLink} className="flex flex-col h-full">
        {/* Imagen y descuento */}
        <div className="relative p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30">
          {offer.porcentaje_descuento > 0 && (
            <div className="absolute left-2 top-2 z-10 bg-red-600 text-white text-xs font-bold rounded px-1.5 py-0.5">
              -{offer.porcentaje_descuento}%
            </div>
          )}
          {/* Gift badge */}
          {offer.tags && offer.tags.includes('REGALO') && (
            <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              🎁 REGALO
            </div>
          )}
          {/* Grid view image section */}          <div className="w-full aspect-square overflow-hidden flex items-center justify-center h-[160px] sm:h-[180px]">            <ImageWithFallback
              src={imagenBruta}
              alt={offer.titulo}
              categoryId={offer?.categoria_id || (offer?.categoria && offer.categoria.id)}
              storeName={offer?.tienda || offer?.store_name || ''}
              product={offer}
              className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="flex flex-grow flex-col p-4">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
            <FaStore className="mr-1.5 text-indigo-500" />
            <span>{offer.tienda}</span>
            {categoryInfo && (
                <>
                  <span className="mx-1.5">|</span>
                  <span style={{ color: categoryInfo.color }} className="font-medium">{categoryInfo.name}</span>
                </>
            )}
          </div>
          
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2 h-[40px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {offer.titulo}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(offer.precio_oferta)}
            </span>
            {offer.precio_original && offer.precio_original > offer.precio_oferta && (
              <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(offer.precio_original)}
              </span>
            )}
          </div>
          
          {offer.likes !== undefined && (
            <div className="flex items-center mb-3 text-xs">
              <FaStar className="mr-1 text-yellow-400" />
              <span className="text-gray-600 dark:text-gray-300">{offer.likes} valoraciones</span>
            </div>
          )}
          
          <div className="text-xs text-green-600 dark:text-green-400 mb-3">
            <span>{calculateDeliveryDate()}</span>
          </div>
          
          <div className="mt-auto space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full flex justify-center items-center py-2 px-4 rounded-md transition-colors text-sm font-medium ${
                isAdding 
                  ? 'bg-green-600 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isAdding ? (
                <>
                  <FaCheck className="mr-2" />
                  Añadido
                </>
              ) : (
                <>
                  <FaShoppingCart className="mr-2" />
                  Añadir al carrito
                </>
              )}
            </button>
            <Link
              to={cardLink}
              className="w-full block text-center py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors text-sm font-medium"
              title="Ver detalles"
            >
              Ver Detalles
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

OfferCard.propTypes = {
  offer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    precio_actual: PropTypes.number.isRequired,
    precio_original: PropTypes.number.isRequired,
    porcentaje_descuento: PropTypes.number,
    url_imagen: PropTypes.string,
    tienda: PropTypes.string,
    votos_positivos: PropTypes.number,
    comentarios_count: PropTypes.number, // Added for list view
    creado_en: PropTypes.string,
    slug: PropTypes.string.isRequired,
    id_categoria: PropTypes.number, // Assuming this is a number now based on getCategoryInfo
    tags: PropTypes.arrayOf(PropTypes.string), // Changed from etiquetas
    isHot: PropTypes.bool,
    rating: PropTypes.number,
    likes: PropTypes.number, // Changed from votos_positivos
    dislikes: PropTypes.number,
    commentsCount: PropTypes.number,
    createdAt: PropTypes.string, // Changed from creado_en
    updatedAt: PropTypes.string, // Changed from actualizado_en if needed
  }).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list'])
};

export default OfferCard;
