import React, { Component, Suspense, lazy, memo, useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { ShoppingCartProvider } from './context/ShoppingCartContext';
import { NotificationProvider } from './context/NotificationContext';
import { WishlistProvider } from './context/WishlistContext'; // Import WishlistProvider
import { ForumProvider } from './context/ForumContext'; // Import ForumProvider
import { SmartLogger } from './utils/smartLogger';
import MonitoringDashboard from './components/MonitoringDashboard';

// Lazy load Admin components
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminOffers = lazy(() => import('./pages/Admin/Offers'));
const AdminStores = lazy(() => import('./pages/Admin/Stores'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminReports = lazy(() => import('./pages/Admin/Reports'));
const AdminSettings = lazy(() => import('./pages/Admin/Settings'));
const AdminComments = lazy(() => import('./pages/Admin/Comments')); // Added this line
const AdminNotifications = lazy(() => import('./pages/Admin/Notifications')); // Added this line

// Import styles
import './styles/accessibility.css';
import './index.css';
import './styles/sidebar-fix.css';
import './App.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    SmartLogger.logError('react-error-boundary', error, {
      component: this.props.name,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Something went wrong</h3>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy loading with error boundaries
const withErrorBoundary = (Component, name) => {
  return function WithErrorBoundary(props) {
    return (
      <Suspense fallback={
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-10 w-10 border-3 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      }>
        <ErrorBoundary name={name}>
          <Component {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  };
};

// Lazy load components
const Home = withErrorBoundary(lazy(() => import('./pages/Home')), 'Home');
const Login = withErrorBoundary(lazy(() => import('./pages/Login')), 'Login');
const Register = withErrorBoundary(lazy(() => import('./pages/Register')), 'Register');
const EmailConfirmation = withErrorBoundary(lazy(() => import('./pages/EmailConfirmation')), 'EmailConfirmation');
const ResetPassword = withErrorBoundary(lazy(() => import('./pages/ResetPassword')), 'ResetPassword');
const CreateOffer = withErrorBoundary(lazy(() => import('./pages/CreateOffer')), 'CreateOffer');
const AIAssistant = withErrorBoundary(lazy(() => import('./pages/AIAssistant')), 'AIAssistant');
const Notifications = withErrorBoundary(lazy(() => import('./pages/Notifications')), 'Notifications');
const Categories = withErrorBoundary(lazy(() => import('./pages/Categories')), 'Categories');
const OffersList = withErrorBoundary(lazy(() => import('./pages/OffersList')), 'OffersList');
const OfferDetail = withErrorBoundary(lazy(() => import('./pages/OfferDetail')), 'OfferDetail');
const Profile = withErrorBoundary(lazy(() => import('./pages/Profile')), 'Profile');
const ProductDetail = withErrorBoundary(lazy(() => import('./pages/ProductDetail')), 'ProductDetail');
const PopularOffers = withErrorBoundary(lazy(() => import('./pages/PopularOffers')), 'PopularOffers');
const RecentOffers = withErrorBoundary(lazy(() => import('./pages/RecentOffers')), 'RecentOffers');
const StorePage = withErrorBoundary(lazy(() => import('./pages/StorePage')), 'StorePage');
const AllStores = withErrorBoundary(lazy(() => import('./pages/AllStores')), 'AllStores');
const MyOffers = withErrorBoundary(lazy(() => import('./pages/MyOffers')), 'MyOffers');
const WishlistPage = withErrorBoundary(lazy(() => import('./pages/WishlistPage')), 'WishlistPage');
const MyOrders = withErrorBoundary(lazy(() => import('./pages/MyOrders')), 'MyOrders');
const OrderTracking = withErrorBoundary(lazy(() => import('./pages/OrderTracking')), 'OrderTracking');
const Checkout = withErrorBoundary(lazy(() => import('./pages/Checkout')), 'Checkout');
const SobreNosotros = withErrorBoundary(lazy(() => import('./pages/SobreNosotros')), 'SobreNosotros');
const TerminosCondiciones = withErrorBoundary(lazy(() => import('./pages/TerminosCondiciones')), 'TerminosCondiciones');
const PoliticaPrivacidad = withErrorBoundary(lazy(() => import('./pages/PoliticaPrivacidad')), 'PoliticaPrivacidad');
const TerminosServicio = withErrorBoundary(lazy(() => import('./pages/TerminosServicio')), 'TerminosServicio');
const ForumPage = withErrorBoundary(lazy(() => import('./pages/ForumPage')), 'ForumPage');
const ThreadDetail = withErrorBoundary(lazy(() => import('./pages/ThreadDetail')), 'ThreadDetail');
const CreateThread = withErrorBoundary(lazy(() => import('./pages/CreateThread')), 'CreateThread');
const UserProfile = withErrorBoundary(lazy(() => import('./pages/UserProfile')), 'UserProfile');
const Support = withErrorBoundary(lazy(() => import('./pages/Support')), 'Support');
const FAQ = withErrorBoundary(lazy(() => import('./pages/FAQ')), 'FAQ');
const Contacto = withErrorBoundary(lazy(() => import('./pages/Contacto')), 'Contacto');

// Admin components
const Admin = withErrorBoundary(lazy(() => import('./pages/Admin/Admin')), 'Admin');

// Widget dock component
const WidgetDock = () => {
  return (
    <div className="widget-container">
      <button className="widget-button">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

// Main content component
const AppContent = memo(function AppContent() {
  const { loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  
  useEffect(() => {
    SmartLogger.logComponentState('AppContent', {
      status: 'mounted',
      loading,
      sidebarOpen
    });

    return () => {
      SmartLogger.logComponentState('AppContent', {
        status: 'unmounting'
      });
    };
  }, [loading, sidebarOpen]);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <ErrorBoundary name="Sidebar">
        <Suspense fallback={
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-gray-800 dark:bg-gray-950 text-gray-100"></div>
        }>
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        </Suspense>
      </ErrorBoundary>
      
      <div className="lg:ml-[280px] min-h-screen flex flex-col">
        <ErrorBoundary name="Navbar">
          <Navbar toggleSidebar={toggleSidebar} />
        </ErrorBoundary>
        
        <main className="flex-grow px-4 py-8 lg:px-8 lg:py-12">
          <ErrorBoundary name="Routes">
            <Routes>
              {/* Rutas públicas */}              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/auth/confirm" element={<EmailConfirmation />} />
              <Route path="/email-confirmation" element={<EmailConfirmation />} />
              <Route path="/recuperar-password" element={<ResetPassword />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/ofertas" element={<OffersList />} />
              <Route path="/oferta/:offerSlug" element={<OfferDetail />} />
              <Route path="/ofertas/populares" element={<PopularOffers />} />
              <Route path="/ofertas/recientes" element={<RecentOffers />} />
              <Route path="/categoria/:slug" element={<OffersList />} />
              <Route path="/tienda/:storeName" element={<StorePage />} />
              <Route path="/tiendas" element={<AllStores />} />
              <Route path="/producto/:productId" element={<ProductDetail />} />
              
              {/* Rutas privadas */}
              <Route path="/crear-oferta" element={
                <PrivateRoute>
                  <CreateOffer />
                </PrivateRoute>
              } />
              <Route path="/asistente" element={
                <PrivateRoute>
                  <AIAssistant />
                </PrivateRoute>
              } />
              <Route path="/notificaciones" element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              } />
              <Route path="/perfil" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/mis-ofertas" element={
                <PrivateRoute>
                  <MyOffers />
                </PrivateRoute>
              } />
              <Route path="/guardadas" element={
                <PrivateRoute>
                  {/* <SavedOffers /> */}
                  <WishlistPage />
                </PrivateRoute>
              } />
              <Route path="/lista-deseos" element={
                <PrivateRoute>
                  <WishlistPage />
                </PrivateRoute>
              } />
              <Route path="/checkout" element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              } />
              
              {/* Rutas de pedidos */}
              <Route path="/mis-pedidos" element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              } />
              <Route path="/pedido/:orderId" element={
                <PrivateRoute>
                  <OrderTracking />
                </PrivateRoute>
              } />
              
              {/* Rutas de soporte */}
              <Route path="/soporte" element={<Support />} />              <Route path="/preguntas-frecuentes" element={<FAQ />} />
              
              {/* Rutas del foro */}
              <Route path="/foro" element={<ForumPage />} />
              <Route path="/foro/tema/:threadId" element={<ThreadDetail />} />
              <Route path="/foro/nuevo" element={<PrivateRoute><CreateThread /></PrivateRoute>} />
              <Route path="/perfil/:userId" element={<UserProfile />} />              {/* Admin Routes */}
              <Route path="/admin" element={<PrivateRoute requiredRole="admin"><Admin /></PrivateRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="comments" element={<AdminComments />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              {/* Páginas estáticas */}
              <Route path="/sobre-nosotros" element={<SobreNosotros />} />
              <Route path="/terminos" element={<TerminosCondiciones />} />
              <Route path="/privacidad" element={<PoliticaPrivacidad />} />
              <Route path="/contacto" element={<Contacto />} />
                {/* Admin route moved to nested routes above */}
              
              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                  <h1 className="text-4xl font-bold mb-4 text-white">Página no encontrada</h1>
                  <p className="text-gray-400 mb-8">La página que buscas no existe o ha sido movida.</p>
                  <Link 
                    to="/"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Volver al inicio
                  </Link>
                </div>
              } />
            </Routes>
          </ErrorBoundary>
        </main>
        
        <footer className="bg-white dark:bg-gray-800 py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold mb-4 text-primary">CazaOfertas</h3>
                <p className="text-secondary dark:text-secondary-light text-sm mb-4">
                  La mejor plataforma para encontrar, compartir y votar las mejores ofertas en línea.
                  Únete a nuestra comunidad y ahorra en tus compras.
                </p>
              </div>

              <div>
                <h3 className="text-md font-bold mb-3 text-gray-800 dark:text-gray-200">Enlaces rápidos</h3>
                <ul className="space-y-2">
                  <li><Link to="/ofertas" className="text-secondary dark:text-secondary-light hover:text-primary dark:hover:text-primary-light text-sm transition-colors">Todas las ofertas</Link></li>
                  <li><Link to="/ofertas/populares" className="text-secondary dark:text-secondary-light hover:text-primary dark:hover:text-primary-light text-sm transition-colors">Ofertas populares</Link></li>
                  <li><Link to="/categorias" className="text-secondary dark:text-secondary-light hover:text-primary dark:hover:text-primary-light text-sm transition-colors">Categorías</Link></li>
                  <li><Link to="/tiendas" className="text-secondary dark:text-secondary-light hover:text-primary dark:hover:text-primary-light text-sm transition-colors">Tiendas</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-md font-bold mb-3 text-gray-800 dark:text-gray-200">Información</h3>
                <ul className="space-y-2">
                  <li><Link to="/sobre-nosotros" className="text-secondary dark:text-secondary-light hover:text-primary dark:hover:text-primary-light text-sm transition-colors">Sobre nosotros</Link></li>
                  <li><Link to="/terminos" className="text-secondary dark:text-secondary-light hover:text-primary dark:hover:text-primary-light text-sm transition-colors">Términos y condiciones</Link></li>
                  <li><Link to="/privacidad" className="text-secondary dark:text-secondary-light hover:text-primary dark:hover:text-primary-light text-sm transition-colors">Política de privacidad</Link></li>
                  <li><Link to="/contacto" className="text-secondary dark:text-secondary-light hover:text-primary dark:hover:text-primary-light text-sm transition-colors">Contacto</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-sm">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-secondary dark:text-secondary-light">
                  © {new Date().getFullYear()} CazaOfertas. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      <WidgetDock />
    </div>
  );
});

// Root App component with monitoring functionality
const App = memo(() => {
  // Initialize state
  const [showMonitoring, setShowMonitoring] = useState(false);
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      const error = event.error || new Error(event.message);
      SmartLogger.logError('app-error', error, {
        location: event.filename,
        line: event.lineno,
        column: event.colno,
        type: 'uncaught-error'
      });
      setAppError(error);
    };

    const handleUnhandledRejection = (event) => {      SmartLogger.logError('unhandled-rejection', event.reason, {
        type: 'unhandled-promise-rejection',
        timestamp: new Date().toISOString()
      });
      setAppError(event.reason);
    };    // Set up error handlers only once on mount
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []); // Empty dependency array since handlers don't change

  if (appError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-xl p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-700 mb-4">{appError.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  return (
    <ErrorBoundary name="Root">
      <AuthProvider>
        <NotificationProvider>
          <ShoppingCartProvider>            <WishlistProvider> {/* Add WishlistProvider here */}
              <ForumProvider> {/* Add ForumProvider here */}
                <div className="app-container">
                  <AppContent />
                  <Toaster position="bottom-center" />
                  {process.env.NODE_ENV === 'development' && (
                    <button 
                      onClick={() => setShowMonitoring(!showMonitoring)}
                      className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg"
                    >
                      {showMonitoring ? 'Hide' : 'Show'} Monitoring
                    </button>
                  )}
                  {showMonitoring && <MonitoringDashboard />}
                </div>
              </ForumProvider> {/* Close ForumProvider */}
            </WishlistProvider> {/* Close WishlistProvider */}
          </ShoppingCartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
});

export default App;
