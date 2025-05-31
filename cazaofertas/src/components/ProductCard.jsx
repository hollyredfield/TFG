import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ 
  id, 
  title, 
  price, 
  originalPrice,
  image, 
  store,
  isFavorite = false,
  onFavoriteToggle,
  onAddToCart
}) => {
  const discount = originalPrice ? Math.round((originalPrice - price) / originalPrice * 100) : 0;
  
  return (
    <div className="product-card">
      <div className="relative overflow-hidden">
        <Link to={`/oferta/${id}`}>
          <img 
            src={image} 
            alt={title} 
            className="product-card-img"
          />
        </Link>
        
        {discount > 0 && (
          <div className="product-discount-badge">
            -{discount}%
          </div>
        )}
        
        <button 
          onClick={onFavoriteToggle}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center transition-all hover:bg-white"
          aria-label={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-800 dark:text-white line-clamp-2">{title}</h3>
        </div>
        
        <div className="flex items-baseline mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">{price}€</span>
          {originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">{originalPrice}€</span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <Link 
            to={`/tienda/${store.slug}`} 
            className="text-xs text-gray-500 hover:text-primary"
          >
            {store.name}
          </Link>
          
          <button
            onClick={onAddToCart}
            className="btn-shine bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-all"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
