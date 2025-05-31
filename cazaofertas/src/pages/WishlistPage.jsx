import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import OfferCard from '../components/OfferCard';
import { Link } from 'react-router-dom';
import { FaHeartBroken } from 'react-icons/fa';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FaHeartBroken className="text-6xl text-gray-400 dark:text-gray-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Tu Lista de Deseos está Vacía</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Parece que aún no has guardado ninguna oferta. ¡Empieza a explorar y añade tus favoritas!
        </p>
        <Link 
          to="/ofertas"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Descubrir Ofertas
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">
        Mi Lista de Deseos <span className="text-indigo-600">({wishlistItems.length})</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(offer => (
          <OfferCard key={offer.id} offer={offer} viewMode="grid" />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
