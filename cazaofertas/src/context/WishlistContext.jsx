import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (offer) => {
    if (!wishlistItems.find(item => item.id === offer.id)) {
      setWishlistItems(prevItems => [...prevItems, offer]);
      toast.success(`${offer.nombre} añadido a tu lista de deseos!`);
    } else {
      toast.info(`${offer.nombre} ya está en tu lista de deseos.`);
    }
  };

  const removeFromWishlist = (offerId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== offerId));
    toast.warn('Oferta eliminada de tu lista de deseos.');
  };

  const isInWishlist = (offerId) => {
    return wishlistItems.some(item => item.id === offerId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
