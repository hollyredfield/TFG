import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { FaSearch, FaUserCircle, FaBars, FaTimes, FaPlus, FaRobot, FaShoppingCart } from 'react-icons/fa';
import Cart from './Cart';
import NotificationIcon from './NotificationIcon';

console.log('Navbar.jsx: Iniciando renderizado del componente Navbar');

const Navbar = ({ toggleSidebar }) => {
  console.log('Navbar.jsx: Ejecutando función de componente Navbar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, toggleCart } = useShoppingCart();
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  // Cerrar el menú de perfil cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
  };

  return (
    <header className={`sticky top-0 w-full z-40 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${
      scrolled ? 'shadow-lg' : ''
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menu button (mobile & tablet) and logo */}
          <div className="flex items-center">
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              <FaBars className="text-lg" />
            </button>
            
            <Link to="/" className="flex items-center lg:hidden">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                CazaOfertas
              </span>
            </Link>
          </div>
          
          {/* Search bar */}
          <div 
            ref={searchInputRef}
            className={`hidden md:flex items-center flex-1 max-w-xl mx-6 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 transition-all ${
              searchFocused ? 'ring-2 ring-blue-500/30' : ''
            }`}
          >
            <FaSearch className="text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Buscar ofertas, productos, tiendas..."
              className="ml-2 flex-1 bg-transparent border-none focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
              onFocus={() => setSearchFocused(true)}
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search icon (mobile) */}
            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaSearch />
            </button>
            
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Carrito de compra"
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            
            {isAuthenticated ? (
              <>                {/* Notifications */}
                <NotificationIcon />
                
                {/* Create offer button (tablet & desktop) */}
                <Link 
                  to="/crear-oferta" 
                  className="hidden sm:flex items-center button-modern button-primary ml-2"
                >
                  <FaPlus className="mr-2" /> Publicar
                </Link>
                
                {/* User profile */}
                <div className="relative" ref={profileMenuRef}>
                  <button 
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent-light flex items-center justify-center text-white font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                  
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right">
                      <div className="glass-panel dark:glass-panel-dark shadow-medium animate-scale-in">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent-light flex items-center justify-center text-white font-medium mr-3">
                              {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium">{user?.email?.split('@')[0]}</p>
                              <p className="text-xs text-secondary">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="py-2">
                          <Link 
                            to="/perfil" 
                            className="flex items-center px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Mi Perfil
                          </Link>
                          <Link 
                            to="/mis-ofertas" 
                            className="flex items-center px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Mis Ofertas
                          </Link>
                          <Link 
                            to="/guardadas" 
                            className="flex items-center px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Guardadas
                          </Link>
                          <Link 
                            to="/notificaciones" 
                            className="flex items-center px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            Notificaciones
                          </Link>
                        </div>
                        
                        <div className="py-2 border-t border-gray-200 dark:border-gray-800">
                          <button 
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Link 
                    to="/login" 
                    className="hidden sm:block button-modern button-secondary"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/registro" 
                    className="button-modern button-primary ml-2"
                  >
                    Registrarse
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart component */}
      <Cart />
    </header>
  );
};

export default Navbar;