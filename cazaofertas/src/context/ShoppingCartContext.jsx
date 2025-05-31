import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

console.log('ShoppingCartContext.jsx: Inicializando contexto del carrito');

const ShoppingCartContext = createContext();

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};

export const ShoppingCartProvider = ({ children }) => {
  console.log('ShoppingCartContext.jsx: Renderizando ShoppingCartProvider');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [recentlyAddedItem, setRecentlyAddedItem] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Error parsing stored cart data:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Reset item added animation after timeout
  useEffect(() => {
    if (isItemAdded) {
      const timeout = setTimeout(() => {
        setIsItemAdded(false);
        setRecentlyAddedItem(null);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isItemAdded]);

  // Add item to cart
  const addToCart = (item) => {
    const newItem = {
      id: item.id,
      title: item.title,
      current_price: item.price,
      original_price: item.originalPrice,
      discount_percentage: item.discountPercentage,
      image_url: item.image,
      store: item.store,
      url: item.url,
      quantity: item.quantity || 1
    };
    
    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === newItem.id
      );

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, newItem];
      }
    });
    
    // Trigger animation
    setIsItemAdded(true);
    setRecentlyAddedItem(newItem);
    
    // Automatically open cart when adding items
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.current_price * item.quantity,
    0
  );

  // Toggle cart open/closed
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const value = {
    cartItems,
    cartCount,
    subtotal,
    isCartOpen,
    isItemAdded,
    recentlyAddedItem,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  };

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartContext;
