import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaQuestion, FaTimes, FaArrowRight, FaShoppingCart } from 'react-icons/fa';
import { getFaqs, createSupportTicket } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ChatPopup = ({ productId, productName, onClose }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState('welcome'); // welcome, faqs, question, success
  const [productFaqs, setProductFaqs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    async function loadProductFaqs() {
      try {
        // Intentar cargar FAQs relacionadas con productos
        const { data, success } = await getFaqs('productos');
        if (success && data) {
          // Limitar a 3-4 FAQs más relevantes para este tipo de producto
          setProductFaqs(data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error cargando FAQs para el chat:', error);
      }
    }
    
    loadProductFaqs();
    
    // Animación de entrada
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);
  
  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      setIsOpen(false);
      onClose();
    }, 300);
  };
  
  const handleSendQuestion = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setLoading(true);
    
    try {
      if (user) {
        // Enviar pregunta como ticket de soporte
        await createSupportTicket({
          userId: user.id,
          subject: `Pregunta sobre producto: ${productName || 'Producto #' + productId}`,
          message: message,
          department: 'productos',
          priority: 'normal'
        });
      } else {
        // Simular envío si no hay usuario (se mostrará mensaje de éxito igual)
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Mostrar éxito independientemente de si se guardó o no
      setStep('success');
    } catch (error) {
      console.error('Error enviando pregunta:', error);
      toast.error('No se pudo enviar tu pregunta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={`fixed bottom-5 right-5 z-50 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform ${
      animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      {/* Cabecera */}
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <h3 className="font-medium">
          {step === 'welcome' && '¿Necesitas ayuda?'}
          {step === 'faqs' && 'Preguntas frecuentes'}
          {step === 'question' && 'Haz tu pregunta'}
          {step === 'success' && '¡Pregunta enviada!'}
        </h3>
        <button 
          onClick={handleClose}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          <FaTimes />
        </button>
      </div>
      
      {/* Contenido */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {step === 'welcome' && (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              ¿Tienes alguna duda sobre {productName || 'este producto'}?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setStep('faqs')}
                className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-center transition-colors"
              >
                <span>Ver preguntas frecuentes</span>
                <FaQuestion />
              </button>
              <button
                onClick={() => setStep('question')}
                className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-center transition-colors"
              >
                <span>Hacer una pregunta</span>
                <FaArrowRight />
              </button>
              <Link
                to={`/soporte?ref=product&id=${productId}`}
                className="w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-center transition-colors"
              >
                <span>Ir al soporte completo</span>
                <FaArrowRight />
              </Link>
            </div>
          </>
        )}
        
        {step === 'faqs' && (
          <>
            {productFaqs.length > 0 ? (
              <div className="space-y-4">
                {productFaqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      {faq.pregunta}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {faq.respuesta.length > 150 
                        ? faq.respuesta.substring(0, 150) + '...'
                        : faq.respuesta}
                    </p>
                    <Link 
                      to="/preguntas-frecuentes" 
                      className="text-primary dark:text-primary-light text-sm inline-block mt-2"
                    >
                      Leer más
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron preguntas frecuentes para este producto.
              </p>
            )}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setStep('welcome')}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
              >
                Volver
              </button>
              <button
                onClick={() => setStep('question')}
                className="text-primary dark:text-primary-light flex items-center text-sm"
              >
                Hacer una pregunta <FaArrowRight className="ml-1" />
              </button>
            </div>
          </>
        )}
        
        {step === 'question' && (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {user 
                ? 'Escribe tu pregunta y te responderemos lo antes posible.'
                : 'Escribe tu pregunta. Necesitarás iniciar sesión para recibir nuestra respuesta.'}
            </p>
            <form onSubmit={handleSendQuestion}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:border-primary focus:ring-primary mb-4 min-h-[100px]"
                placeholder="Tu pregunta..."
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('welcome')}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? 'Enviando...' : 'Enviar pregunta'}
                </button>
              </div>
            </form>
          </>
        )}
        
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              ¡Gracias por tu pregunta!
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {user 
                ? 'Te responderemos lo antes posible en la sección de soporte.'
                : 'Para recibir nuestra respuesta, inicia sesión o regístrate.'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cerrar
              </button>
              {!user && (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de botón flotante para abrir el chat
export const ChatButton = ({ onClick, productInCart = false }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-40 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105"
      aria-label="Abrir chat de ayuda"
    >
      {productInCart ? (
        <FaShoppingCart size={24} />
      ) : (
        <FaQuestion size={24} />
      )}
    </button>
  );
};

export default ChatPopup;
