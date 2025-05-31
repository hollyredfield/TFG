import React, { useEffect, useRef } from 'react';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { FaTimes, FaTrash, FaPlus, FaMinus, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CartItem = ({ item, updateQuantity, removeFromCart, isHighlighted }) => {
  const itemRef = useRef(null);
  
  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isHighlighted]);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div 
      ref={itemRef}
      className={`flex items-center py-4 border-b border-gray-700 transition-all duration-500 ${
        isHighlighted ? 'bg-green-900/20 rounded-lg' : ''
      }`}
    >
      {/* Imagen */}
      <div className="w-16 h-16 flex-shrink-0 bg-gray-700 rounded overflow-hidden">
        <img 
          src={item.image_url} 
          alt={item.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/64?text=${encodeURIComponent(item.title.charAt(0))}`;
          }}
        />
      </div>
      
      {/* Información */}
      <div className="ml-4 flex-grow">
        <h3 className="text-sm font-medium text-white line-clamp-1">{item.title}</h3>
        <p className="text-xs text-gray-400">{item.store}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-indigo-400 font-semibold">
            {formatPrice(item.current_price)}
          </span>
          
          <div className="flex items-center">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 bg-gray-700 rounded-l text-white hover:bg-gray-600 transition-colors"
            >
              <FaMinus size={10} />
            </button>
            <span className="px-2 py-1 bg-gray-700 text-white text-xs">
              {item.quantity}
            </span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 bg-gray-700 rounded-r text-white hover:bg-gray-600 transition-colors"
            >
              <FaPlus size={10} />
            </button>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="ml-2 p-1 text-red-400 hover:text-red-300 transition-colors"
              aria-label="Eliminar"
            >
              <FaTrash size={12} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Added to cart indicator */}
      {isHighlighted && (
        <div className="absolute right-2 top-2 bg-green-500 text-white rounded-full p-1 animate-pulse">
          <FaCheck size={10} />
        </div>
      )}
    </div>
  );
};

const Cart = () => {
  const { 
    cartItems, 
    cartCount, 
    subtotal, 
    isCartOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    recentlyAddedItem,
    isItemAdded
  } = useShoppingCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />
      
      {/* Cart panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gray-800 shadow-xl transition-transform duration-300 transform translate-x-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaShoppingCart className="mr-2" />
              Carrito de compra
              {cartCount > 0 && (
                <span className="ml-2 text-sm bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </h2>
            <button 
              onClick={closeCart}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Item added notification */}
          {isItemAdded && recentlyAddedItem && (
            <div className="bg-green-900/30 text-green-300 px-6 py-3 flex items-center justify-between border-b border-green-900/50">
              <div className="flex items-center">
                <FaCheck className="mr-2" />
                <span>¡Añadido al carrito!</span>
              </div>
              <span className="text-sm font-medium">{recentlyAddedItem.quantity}x</span>
            </div>
          )}
          
          {/* Cart content */}
          <div className="flex-grow overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <FaShoppingCart className="text-gray-600 text-5xl mb-4" />
                <p className="text-gray-400 mb-6">Tu carrito está vacío</p>
                <button 
                  onClick={closeCart}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Explorar ofertas
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    isHighlighted={isItemAdded && recentlyAddedItem && item.id === recentlyAddedItem.id}
                  />
                ))}
                
                {cartItems.length > 0 && (
                  <div className="mt-4 text-right">
                    <button 
                      onClick={clearCart}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center justify-end ml-auto"
                    >
                      <FaTrash className="mr-1" size={12} />
                      Vaciar carrito
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Footer with checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-700 px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-lg font-semibold text-white">{formatPrice(subtotal)}</span>
              </div>
              
              <Link
                to="/checkout"
                onClick={closeCart}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all"
              >
                Finalizar compra
              </Link>
              
              <button 
                onClick={closeCart}
                className="w-full mt-2 bg-transparent border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
