import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaRegHeart, FaClock, FaStore, FaTag, FaExclamationCircle, FaShare, FaQuestion, FaRegCommentDots, FaBell } from 'react-icons/fa';
import { getProductById, getProductReviews, addProductReview, saveOffer, isOfferSaved, removeSavedOffer } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { useNotifications } from '../context/NotificationContext';
import ChatPopup, { ChatButton } from '../components/ChatPopup';
import { getImagenBruta, getProductFallbackImage } from '../utils/imageHelpers';
import toast from 'react-hot-toast';
import NotificationService from '../services/notificationService';
import StarRating from '../components/StarRating';
import CommentSystem from '../components/CommentSystem';
import ImageWithFallback from '../components/ImageWithFallback';

const ProductDetail = () => {  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useShoppingCart();
  const { createNotification } = useNotifications();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ title: '', rating: 5, comment: '' });
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [priceAlertEnabled, setPriceAlertEnabled] = useState(false);
  const [stockAlertEnabled, setStockAlertEnabled] = useState(false);
  const [priceAlertThreshold, setPriceAlertThreshold] = useState(0);
  const [showPriceAlertSettings, setShowPriceAlertSettings] = useState(false);
  
  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch product details
        const { data, success, error } = await getProductById(productId);
        
        if (!success || !data) {
          throw new Error(error?.message || 'No se pudo cargar el producto');
        }
        
        setProduct(data);
        console.log('ESTRUCTURA DEL PRODUCTO:', JSON.stringify(data, null, 2));
        
        // Fetch reviews
        const reviewsResult = await getProductReviews(productId);
        if (reviewsResult.success) {
          setReviews(reviewsResult.data || []);
        }
        
        // Check if product is saved (if user is logged in)
        if (user) {
          const { isSaved, savedId, alertSettings } = await isOfferSaved(user.id, productId);
          setSaved(isSaved);
          setSavedId(savedId);
          
          // Set alert settings if they exist
          if (alertSettings) {
            setPriceAlertEnabled(alertSettings.priceAlert || false);
            setStockAlertEnabled(alertSettings.stockAlert || false);
            if (alertSettings.priceThreshold) {
              setPriceAlertThreshold(alertSettings.priceThreshold);
            }
          }
        }
        
        // Todo: Fetch similar products based on category
        // For now, we'll leave this as an empty array
        setSimilarProducts([]);
        
      } catch (err) {
        console.error('Error loading product details:', err);
        setError('No se pudo cargar el detalle del producto');
        toast.error('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProductDetails();
  }, [productId, user]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.nombre,
      price: product.precio_actual || product.precio,
      image: product.imagen_url,
      quantity: 1
    });
    
    toast.success('Producto añadido al carrito');
  };
  
  const handleSaveProduct = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar productos');
      return;
    }
    
    try {
      if (!saved) {
        const { data, error } = await saveOffer(user.id, product.id);
        if (error) throw error;
        
        setSaved(true);
        setSavedId(data?.[0]?.id);
        toast.success('Producto guardado');
        
        // Create notification for wishlist update
        await NotificationService.notifyWishlistUpdated(
          user.id, 
          product.nombre, 
          'add'
        );
      } else {
        const { error } = await removeSavedOffer(savedId);
        if (error) throw error;
        
        setSaved(false);
        setSavedId(null);
        toast.success('Producto eliminado de guardados');
        
        // Create notification for wishlist update
        await NotificationService.notifyWishlistUpdated(
          user.id,
          product.nombre,
          'remove'
        );
      }
    } catch (err) {
      console.error('Error al guardar/eliminar producto:', err);
      toast.error('Error al guardar/eliminar producto');
    }
  };
  
  // Toggle price alert for this product
  const handleTogglePriceAlert = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para configurar alertas');
      return;
    }
    
    try {
      // We need to save the product first if it's not already saved
      let currentSavedId = savedId;
      
      if (!saved) {
        const { data, error } = await saveOffer(user.id, product.id);
        if (error) throw error;
        
        setSaved(true);
        currentSavedId = data?.[0]?.id;
        setSavedId(currentSavedId);
        toast.success('Producto guardado');
      }
      
      // Now toggle the price alert
      const newPriceAlertState = !priceAlertEnabled;
      
      // Update database with alert preference
      const { error } = await supabase
        .from('productos_guardados')
        .update({ 
          price_alert: newPriceAlertState,
          price_threshold: priceAlertThreshold,
          updated_at: new Date().toISOString() 
        })
        .eq('id', currentSavedId);
      
      if (error) throw error;
      
      setPriceAlertEnabled(newPriceAlertState);
      
      // Create a notification to show the feature working
      if (newPriceAlertState) {
        await createNotification({
          userId: user.id,
          type: 'PRICE_DROP',
          title: 'Alerta de precio configurada',
          message: `Te notificaremos cuando ${product.nombre} baje a ${priceAlertThreshold}€ o menos.`,
          data: {
            product_id: product.id,
            threshold: priceAlertThreshold
          }
        });
        
        toast.success(`Te avisaremos cuando el precio baje a ${priceAlertThreshold}€`);
      } else {
        toast.success('Alerta de precio desactivada');
      }
    } catch (err) {
      console.error('Error al configurar alerta de precio:', err);
      toast.error('Error al configurar alerta de precio');
    }
  };
  
  // Toggle stock alert
  const handleToggleStockAlert = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para configurar alertas');
      return;
    }
    
    try {
      // We need to save the product first if it's not already saved
      let currentSavedId = savedId;
      
      if (!saved) {
        const { data, error } = await saveOffer(user.id, product.id);
        if (error) throw error;
        
        setSaved(true);
        currentSavedId = data?.[0]?.id;
        setSavedId(currentSavedId);
        toast.success('Producto guardado');
      }
      
      // Toggle the stock alert
      const newStockAlertState = !stockAlertEnabled;
      
      // Update database with alert preference
      const { error } = await supabase
        .from('productos_guardados')
        .update({ 
          stock_alert: newStockAlertState,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSavedId);
      
      if (error) throw error;
      
      setStockAlertEnabled(newStockAlertState);
      
      // Create a notification to show the feature working
      if (newStockAlertState) {
        await createNotification({
          userId: user.id,
          type: 'STOCK_ALERT',
          title: 'Alerta de disponibilidad configurada',
          message: `Te notificaremos cuando ${product.nombre} vuelva a estar disponible.`,
          data: {
            product_id: product.id
          }
        });
        
        toast.success('Te avisaremos cuando el producto vuelva a estar disponible');
      } else {
        toast.success('Alerta de disponibilidad desactivada');
      }
    } catch (err) {
      console.error('Error al configurar alerta de disponibilidad:', err);
      toast.error('Error al configurar alerta de disponibilidad');
    }
  };
  
  // Update price alert threshold
  const handlePriceThresholdChange = (e) => {
    setPriceAlertThreshold(parseFloat(e.target.value));
  };
  
  // Save price threshold setting
  const handleSavePriceThreshold = async () => {
    if (!user || !savedId) return;
    
    try {
      const { error } = await supabase
        .from('productos_guardados')
        .update({ 
          price_threshold: priceAlertThreshold,
          updated_at: new Date().toISOString()
        })
        .eq('id', savedId);
      
      if (error) throw error;
      
      setShowPriceAlertSettings(false);
      toast.success('Umbral de precio actualizado');
      
      // Create notification confirmation
      if (priceAlertEnabled) {
        await createNotification({
          userId: user.id,
          type: 'PRICE_DROP',
          title: 'Umbral de alerta actualizado',
          message: `Te notificaremos cuando ${product.nombre} baje a ${priceAlertThreshold}€ o menos.`,
          data: {
            product_id: product.id,
            threshold: priceAlertThreshold
          }
        });
      }
    } catch (err) {
      console.error('Error al actualizar umbral de precio:', err);
      toast.error('Error al actualizar umbral');
    }
  };
  
  const handleAddReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Debes iniciar sesión para añadir una reseña');
      return;
    }
    
    try {
      const reviewData = {
        productId: product.id,
        userId: user.id,
        title: reviewForm.title || 'Reseña',
        rating: reviewForm.rating,
        comment: reviewForm.comment
      };
      
      const { success, data, error } = await addProductReview(reviewData);
      
      if (!success) {
        throw new Error(error?.message || 'Error al añadir reseña');
      }
      
      // Add user info to new review for display purposes
      const newReview = {
        ...data,
        perfiles_usuario: {
          nombre_usuario: user.user_metadata?.nombre_usuario || 'Usuario',
          avatar_url: user.user_metadata?.avatar_url || null
        }
      };
      
      // Add new review to list
      setReviews([newReview, ...reviews]);
      
      // Reset form and hide it
      setReviewForm({ title: '', rating: 5, comment: '' });
      setShowAddReview(false);
      
      toast.success('Reseña añadida con éxito');
    } catch (err) {
      console.error('Error al añadir reseña:', err);
      toast.error('Error al añadir reseña');
    }
  };
  
  const handleShareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Enlace copiado al portapapeles');
  };
  
  // La función handleTogglePriceAlert ya está definida arriba

  
  // La función handleToggleStockAlert ya está definida arriba

    // Calculate average rating from reviews moved to top for clarity
  
  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.puntuacion, 0);
    return (sum / reviews.length).toFixed(1);
  };
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin h-10 w-10 border-3 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
          <div className="flex">
            <FaExclamationCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p>{error || 'No se pudo cargar el producto'}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="button-modern button-secondary inline-flex items-center"
        >
          Volver
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4 flex flex-wrap gap-2 text-sm breadcrumbs">
        <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
          Inicio
        </Link>
        <span className="text-gray-400 dark:text-gray-500 mx-1">/</span>
        {product.categorias && (
          <>
            <Link 
              to={`/categoria/${product.categorias.slug}`} 
              className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
            >
              {product.categorias.nombre}
            </Link>
            <span className="text-gray-400 dark:text-gray-500 mx-1">/</span>
          </>
        )}
        <span className="text-gray-700 dark:text-gray-300">{product.nombre}</span>
      </div>
      
      {/* Product Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-80 md:h-96 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={product.imagen_url || product.url_imagen}
                alt={product.nombre || product.titulo || 'Imagen del producto'}
                categoryId={product.categoria_id || (product.categoria && product.categoria.id) || product.categoria}
                storeName={product.tienda || product.store_name || ''}
                product={product}
                className="w-full h-full object-contain" // Cambiado a object-contain para mejor visualización
                style={{padding: '16px'}} // Añadimos padding para que la imagen no toque los bordes
              />
              {(product.descuento > 0 || product.porcentaje_descuento > 0) && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md">
                  -{product.descuento || product.porcentaje_descuento}%
                </div>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.nombre}
            </h1>
            
            {/* Rating */}            <div className="flex items-center mb-4">
              <StarRating rating={calculateAverageRating()} />
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {(product.precio_actual || product.precio).toFixed(2)}€
              </span>
              {product.precio_original && product.precio_actual < product.precio_original && (
                <span className="ml-2 line-through text-gray-500 dark:text-gray-400">
                  {product.precio_original.toFixed(2)}€
                </span>
              )}
              
              {product.stock > 0 ? (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                  En stock
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                  Agotado
                </span>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Descripción</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {product.descripcion || 'No hay descripción disponible para este producto.'}
              </p>
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              {product.marca && (
                <div>
                  <span className="block text-gray-500 dark:text-gray-400">Marca</span>
                  <span className="font-medium text-gray-900 dark:text-white">{product.marca}</span>
                </div>
              )}
              
              {product.modelo && (
                <div>
                  <span className="block text-gray-500 dark:text-gray-400">Modelo</span>
                  <span className="font-medium text-gray-900 dark:text-white">{product.modelo}</span>
                </div>
              )}
              
              <div>
                <span className="block text-gray-500 dark:text-gray-400">Categoría</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {product.categorias ? product.categorias.nombre : 'Sin categoría'}
                </span>
              </div>
              
              {product.tiendas && (
                <div className="flex items-center">
                  <span className="block text-gray-500 dark:text-gray-400 mr-1">Tienda</span>
                  <Link 
                    to={`/tienda/${product.tiendas.slug}`}
                    className="font-medium text-primary dark:text-primary-light hover:underline"
                  >
                    {product.tiendas.nombre}
                  </Link>
                </div>
              )}
            </div>
            
            {/* Actions */}            <div className="flex flex-wrap gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`button-modern button-primary flex-1 flex items-center justify-center ${
                  product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaShoppingCart className="mr-2" />
                Añadir al carrito
              </button>
              
              <button
                onClick={handleSaveProduct}
                className="button-modern button-secondary w-12 flex items-center justify-center"
                title={saved ? "Quitar de guardados" : "Guardar producto"}
              >
                {saved ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              </button>
              
              <button
                onClick={handleTogglePriceAlert}
                className={`button-modern ${priceAlertEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'button-secondary'} w-12 flex items-center justify-center`}
                title={priceAlertEnabled ? "Desactivar alerta de precio" : "Activar alerta de bajada de precio"}
              >
                <FaBell className={priceAlertEnabled ? "text-white" : ""} />
              </button>
              
              {priceAlertEnabled && (
                <button
                  onClick={() => setShowPriceAlertSettings(true)}
                  className="button-modern bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  title="Configurar precio objetivo"
                >
                  Precio: {priceAlertThreshold}€
                </button>
              )}
              
              {product.stock <= 0 && (
                <button
                  onClick={handleToggleStockAlert}
                  className={`button-modern ${stockAlertEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'button-secondary'} w-12 flex items-center justify-center`}
                  title={stockAlertEnabled ? "Desactivar alerta de disponibilidad" : "Notificarme cuando esté disponible"}
                >
                  <FaBell className={stockAlertEnabled ? "text-white" : ""} />
                </button>
              )}
              
              <button
                onClick={handleShareProduct}
                className="button-modern button-secondary w-12 flex items-center justify-center"
                title="Compartir producto"
              >
                <FaShare />
              </button>
              
              <button
                onClick={() => setShowChatPopup(true)}
                className="button-modern button-secondary flex items-center justify-center"
                title="Hacer una pregunta sobre este producto"
              >
                <FaQuestion className="mr-2" />
                <span className="hidden sm:inline">Preguntar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Reviews */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reseñas</h2>
          {user && !showAddReview && (
            <button
              onClick={() => setShowAddReview(true)}
              className="button-modern button-secondary"
            >
              Escribir reseña
            </button>
          )}
        </div>
        
        {/* Add Review Form */}
        {showAddReview && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Añadir reseña</h3>
            <form onSubmit={handleAddReview}>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Puntuación
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating})}
                      className="text-2xl focus:outline-none"
                    >
                      {rating <= reviewForm.rating ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                  placeholder="Resumen de tu opinión"
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Comentario
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="Comparte tu experiencia con este producto"
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddReview(false)}
                  className="button-modern button-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="button-modern button-primary"
                >
                  Publicar reseña
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Reviews List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                      {review.perfiles_usuario?.avatar_url ? (
                        <img
                          src={review.perfiles_usuario.avatar_url}
                          alt={review.perfiles_usuario.nombre_usuario}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          {review.perfiles_usuario?.nombre_usuario?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {review.perfiles_usuario?.nombre_usuario || 'Usuario Anónimo'}
                      </h4>
                      <div className="flex items-center">                        <StarRating rating={review.puntuacion} size="sm" />
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
                
                {review.titulo && (
                  <h5 className="font-medium text-gray-900 dark:text-white mt-3 mb-1">
                    {review.titulo}
                  </h5>
                )}
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {review.comentario}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <FaRegCommentDots className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Todavía no hay reseñas
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Sé el primero en valorar este producto
              </p>
              {user ? (
                <button
                  onClick={() => setShowAddReview(true)}
                  className="mt-4 button-modern button-secondary"
                >
                  Escribir una reseña
                </button>
              ) : (
                <Link to="/login" className="mt-4 button-modern button-secondary inline-block">
                  Iniciar sesión para escribir una reseña
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Comment System */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Comentarios
        </h2>
        <CommentSystem 
          productId={product?.id}
          productType="product"
        />
      </div>
      
      {/* Recommendations */}
      {similarProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Productos similares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Similar products would be mapped here */}
          </div>
        </div>
      )}
      
      {/* Chat Popup */}
      {showChatPopup && (
        <ChatPopup
          productId={product.id}
          productName={product.nombre}
          onClose={() => setShowChatPopup(false)}
        />
      )}
      
      {/* Chat Button (only visible when popup is not open) */}
      {!showChatPopup && (
        <ChatButton onClick={() => setShowChatPopup(true)} />
      )}
      
      {/* Price alert threshold settings modal */}
      {showPriceAlertSettings && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <FaBell className="text-primary mr-2" /> 
              Configurar alerta de precio
            </h3>
            
            <p className="text-gray-300 mb-4">
              Te notificaremos cuando el precio de este producto baje del valor especificado.
            </p>
            
            <div className="mb-6">
              <label htmlFor="priceThreshold" className="block text-gray-300 mb-2">
                Precio objetivo (€)
              </label>
              <input
                type="number"
                id="priceThreshold"
                min="0"
                step="0.01"
                value={priceAlertThreshold}
                onChange={handlePriceThresholdChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
              />
              {product && (
                <p className="text-xs text-gray-400 mt-2">
                  Precio actual: {product.precio_actual || product.precio}€
                  {product.precio_anterior && (
                    <span className="ml-2">
                      (Antes: <span className="line-through">{product.precio_anterior}€</span>)
                    </span>
                  )}
                </p>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPriceAlertSettings(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePriceThreshold}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
              >
                Guardar configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
