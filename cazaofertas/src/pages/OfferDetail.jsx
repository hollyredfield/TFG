import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ofertas as mockOfertas, tiendas as mockTiendas, categorias as mockCategorias, comentariosOfertas as mockComentariosOfertas } from '../data/mockData.js'; // Direct import, corrected path
import { FaShoppingCart, FaHeart, FaRegHeart, FaTag, FaStore, FaCalendarAlt, FaCommentDots, FaStar, FaShareAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import CommentSystem from '../components/CommentSystem';
import RecommendedOffers from '../components/RecommendedOffers';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper function to simulate adding to cart (can be expanded)
const mockAddToCart = (offer, user) => {
  if (!user) {
    toast.error("Debes iniciar sesión para añadir al carrito");
    return false;
  }
  console.log(`Añadiendo ${offer.titulo} al carrito`);
  // Retrieve current cart from localStorage or initialize if not present
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  // Check if offer already in cart
  const existingOfferIndex = cart.findIndex(item => item.id === offer.id);
  if (existingOfferIndex > -1) {
    // Optionally, increase quantity or just notify it's already there
    toast.info(`${offer.titulo} ya está en tu carrito.`);
  } else {
    cart.push({...offer, quantity: 1}); // Add offer with quantity 1
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${offer.titulo} añadido al carrito!`);
  }
  // Dispatch a custom event to update cart icon in Navbar, for example
  window.dispatchEvent(new CustomEvent('cartUpdated')); 
  return true;
};

// Mock wishlist state and functions (similar to OfferCard, but could be centralized in context)
let mockWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

const OfferDetail = () => {
  const { offerSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offer, setOffer] = useState(null);
  const [tienda, setTienda] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  useEffect(() => {
    console.log("[OfferDetail] Hook useEffect ejecutado. offerSlug de URL:", offerSlug);
    console.log("[OfferDetail] Total de ofertas en mockData:", mockOfertas.length);
    
    // Log de todos los slugs disponibles para depuración
    const availableSlugs = mockOfertas.map(o => o.slug);
    console.log("[OfferDetail] Slugs disponibles:", availableSlugs);

    const currentOffer = mockOfertas.find(o => o.slug === offerSlug);

    if (currentOffer) {
      console.log("[OfferDetail] Oferta encontrada:", currentOffer);
      setOffer(currentOffer);
      setTienda(mockTiendas.find(t => t.id === currentOffer.tiendaId));
      setCategoria(mockCategorias.find(c => c.id === currentOffer.categoriaId));
      if (mockComentariosOfertas) {
        setComentarios(mockComentariosOfertas.filter(c => c.ofertaId === currentOffer.id));
      } else {
        setComentarios([]);
      }
      setIsInWishlist(mockWishlist.some(item => item.id === currentOffer.id));    } else {
      console.error("[OfferDetail] Oferta NO encontrada para el slug:", offerSlug);
      // Considerar si es necesario mostrar un mensaje al usuario o redirigir
    }
  }, [offerSlug, user]); // Asegúrate de que 'user' esté definido o quitarlo si no es relevante aquí

  const handleAddToCart = () => {
    if (offer) {
      mockAddToCart(offer, user);
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para gestionar tu lista de deseos.");
      return;
    }
    if (offer) {
      const existingIndex = mockWishlist.findIndex(item => item.id === offer.id);
      if (existingIndex > -1) {
        mockWishlist = mockWishlist.filter(item => item.id !== offer.id);
        toast.info(`${offer.titulo} eliminado de tu lista de deseos.`);
      } else {
        mockWishlist.push(offer);
        toast.success(`${offer.titulo} añadido a tu lista de deseos!`);
      }
      localStorage.setItem('wishlist', JSON.stringify(mockWishlist));
      setIsInWishlist(!isInWishlist);
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    }
  };

  const handleShare = (platform) => {
    if (!offer) return;
    const url = window.location.href;
    const text = `¡Mira esta increíble oferta que encontré en CazaOfertas: ${offer.titulo}!`;
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          toast.success("Enlace copiado al portapapeles");
        }).catch(err => {
          toast.error("No se pudo copiar el enlace");
          console.error('Error al copiar enlace: ', err);
        });
        setShowShareModal(false);
        return;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason) {
        toast.error("Por favor, selecciona un motivo para el reporte.");
        return;
    }
    // Simulate report submission
    console.log("Reporte enviado:", { offerId: offer.id, reason: reportReason, message: reportMessage });
    toast.success("Oferta reportada. Gracias por tu colaboración.");
    setShowReportModal(false);
    setReportReason('');
    setReportMessage('');
  };

  if (!offer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
          Cargando detalles de la oferta...
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Si este mensaje persiste, la oferta podría no existir o no estar disponible.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          (Slug buscado: {offerSlug})
        </p>
      </div>
    );
  }

  const discountPercentage = offer.precio_original > 0 ? Math.round(((offer.precio_original - offer.precio_oferta) / offer.precio_original) * 100) : 0;

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6 text-gray-400">
          <Link to="/" className="hover:text-indigo-400">Inicio</Link> / 
          <Link to="/ofertas" className="hover:text-indigo-400"> Ofertas</Link> / 
          {categoria && <><Link to={`/ofertas/categoria/${categoria.slug}`} className="hover:text-indigo-400"> {categoria.nombre}</Link> / </>}
          <span className="text-gray-500"> {offer.titulo}</span>
        </nav>

        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden md:flex">
          <div className="md:w-1/2 relative">
            <img 
              src={offer.imagen_url || 'https://via.placeholder.com/600x400.png?text=Imagen+no+disponible'} 
              alt={offer.titulo} 
              className="w-full h-auto object-cover md:h-full max-h-[500px] md:max-h-none"
            />
            {discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                {discountPercentage}% DESCUENTO
              </span>
            )}
            {/* Gift badge */}
            {offer.tags && offer.tags.includes('REGALO') && (
              <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                ¡INCLUYE REGALO!
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">{offer.titulo}</h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">{Array(Math.round(offer.rating || 0)).fill('★').join('')}</span>
                <span className="text-gray-500">({offer.rating})</span>
              </div>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">{offer.descripcion}</p>
              
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-indigo-400 mr-3">{offer.precio_oferta.toFixed(2)}€</span>
                {offer.precio_original > offer.precio_oferta && (
                  <span className="text-lg text-gray-500 line-through mr-3">{offer.precio_original.toFixed(2)}€</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                {categoria && (
                  <div className="flex items-center">
                    <FaTag className="text-indigo-400 mr-2" />
                    <span>Categoría: <Link to={`/ofertas/categoria/${categoria.slug}`} className="text-indigo-400 hover:underline">{categoria.nombre}</Link></span>
                  </div>
                )}
                {tienda && (
                  <div className="flex items-center">
                    <FaStore className="text-indigo-400 mr-2" />
                    <span>Tienda: <Link to={`/ofertas/tienda/${tienda.slug}`} className="text-indigo-400 hover:underline">{tienda.nombre}</Link></span>
                  </div>
                )}
                <div className="flex items-center">
                  <FaCalendarAlt className="text-indigo-400 mr-2" />
                  <span>Válido hasta: {offer.fecha_fin || 'No especificado'}</span>
                </div>
                <div className="flex items-center">
                  <FaCommentDots className="text-indigo-400 mr-2" />
                  <span>{offer.comentarios_count || 0} Comentarios</span>
                </div>
                {offer.valoracion && (
                    <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-2" />
                        <span>Valoración: {offer.valoracion}/5 ({offer.numero_valoraciones || 0} votos)</span>
                    </div>
                )}
              </div>

              {/* Tags */}
              {offer.tags && offer.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Etiquetas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {offer.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaShoppingCart className="mr-2" /> Añadir al Carrito
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  className={`flex-grow border-2 ${isInWishlist ? 'border-pink-500 bg-pink-500 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'} font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg shadow-md hover:shadow-lg transform hover:scale-105`}
                >
                  {isInWishlist ? <FaHeart className="mr-2" /> : <FaRegHeart className="mr-2" />} 
                  {isInWishlist ? 'En Lista de Deseos' : 'Guardar Oferta'}
                </button>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button 
                    onClick={() => setShowShareModal(true)}
                    className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center text-sm"
                >
                    <FaShareAlt className="mr-1" /> Compartir
                </button>
                <button 
                    onClick={() => setShowReportModal(true)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center text-sm"
                >
                    <FaExclamationTriangle className="mr-1" /> Reportar Oferta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description Section */}
        <div className="mt-10 bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Descripción Completa</h2>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: offer.descripcion_larga || '<p>No hay descripción detallada disponible para esta oferta.</p>' }} />
        </div>

        {/* Comments Section (Placeholder) */}
        <div className="mt-10 bg-gray-800 shadow-lg rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Comentarios ({comentarios.length})</h2>
          {comentarios.length > 0 ? (
            <ul className="space-y-6">
              {comentarios.map(comment => (
                <li key={comment.id} className="p-4 bg-gray-700 rounded-lg shadow">
                  <div className="flex items-center mb-2">
                    <img src={comment.usuario_avatar || 'https://via.placeholder.com/40.png?text=User'} alt={comment.usuario_nombre} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-semibold text-indigo-400">{comment.usuario_nombre}</p>
                      <p className="text-xs text-gray-500">{new Date(comment.fecha).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{comment.texto}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Sé el primero en comentar esta oferta.</p>
          )}
          {/* Add comment form could go here */}
                    {/* Comment System */}
          <CommentSystem 
            productId={offer.id}
            productType="offer"
          />
        </div>

        {/* Recommendations */}
        <h2 className="text-2xl font-bold mb-4 mt-10">Te puede interesar</h2>
        <RecommendedOffers currentOfferId={offer.id} categoryId={offer.categoriaId} storeId={offer.tiendaId} />
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Compartir Oferta</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleShare('whatsapp')} className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg flex items-center justify-center"><FaShareAlt className="mr-2"/> WhatsApp</button>
              <button onClick={() => handleShare('twitter')} className="bg-blue-400 hover:bg-blue-500 text-white py-3 rounded-lg flex items-center justify-center"><FaShareAlt className="mr-2"/> Twitter</button>
              <button onClick={() => handleShare('facebook')} className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center"><FaShareAlt className="mr-2"/> Facebook</button>
              <button onClick={() => handleShare('copy')} className="bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg flex items-center justify-center"><FaShareAlt className="mr-2"/> Copiar Enlace</button>
            </div>
            <button onClick={() => setShowShareModal(false)} className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg">Cancelar</button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleReportSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Reportar Oferta</h3>
            <p className="text-sm text-gray-400 mb-1">Estás reportando: <strong className='text-indigo-400'>{offer.titulo}</strong></p>
            <p className="text-xs text-gray-500 mb-4">Ayúdanos a mantener la comunidad segura y las ofertas actualizadas.</p>
            
            <div className="mb-4">
                <label htmlFor="reportReason" className="block text-sm font-medium text-gray-300 mb-1">Motivo del reporte <span className="text-red-500">*</span></label>
                <select 
                    id="reportReason" 
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-200"
                    required
                >
                    <option value="">Selecciona un motivo...</option>
                    <option value="expirada">Oferta expirada / No disponible</option>
                    <option value="precio_incorrecto">Precio incorrecto / Engañoso</option>
                    <option value="enlace_roto">Enlace roto o incorrecto</option>
                    <option value="contenido_inapropiado">Contenido inapropiado / Spam</option>
                    <option value="otro">Otro (especifica abajo)</option>
                </select>
            </div>

            <div className="mb-6">
                <label htmlFor="reportMessage" className="block text-sm font-medium text-gray-300 mb-1">Mensaje adicional (opcional)</label>
                <textarea 
                    id="reportMessage" 
                    rows="3" 
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 placeholder-gray-500"
                    placeholder="Proporciona más detalles si es necesario..."
                ></textarea>
            </div>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowReportModal(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-200 rounded-md transition-colors">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center"><FaExclamationTriangle className="mr-2"/> Enviar Reporte</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default OfferDetail;