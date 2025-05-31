import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';
import NotificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    notifyOnResponse: true // Default to true for notification preference
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // Auth and notification hooks
  const { user } = useAuth();
  const { createNotification } = useNotifications();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send the data to the backend
      // For now we'll simulate a successful submission
      
      // If user is logged in and wants notifications, create a notification for confirmation
      if (user && formData.notifyOnResponse) {
        await NotificationService.notifyContactResponse(user.id, formData.asunto);
        
        // Create a local notification to show the feature working
        await createNotification({
          userId: user.id,
          type: 'CONTACT',
          title: 'Formulario de contacto enviado',
          message: `Hemos recibido tu mensaje. Te responderemos lo antes posible.`,
          data: {
            subject: formData.asunto
          }
        });
      }
      
      // Simulate API delay
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        
        toast.success('Mensaje enviado con éxito');
        
        setFormData({
          nombre: '',
          email: '',
          asunto: '',
          mensaje: '',
          notifyOnResponse: true
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }, 1500);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-4 text-indigo-400">Contacto</h1>
        <p className="text-xl text-center text-gray-300 mb-10">
          Estamos aquí para ayudarte. ¡Contáctanos!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <svg className="w-12 h-12 mx-auto text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Correo Electrónico</h3>
            <p className="text-gray-400">contacto@cazaofertas.com</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <svg className="w-12 h-12 mx-auto text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Redes Sociales</h3>
            <p className="text-gray-400">@CazaOfertas</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <svg className="w-12 h-12 mx-auto text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Soporte</h3>
            <p className="text-gray-400">Visita nuestra página de <a href="/soporte" className="text-indigo-400 hover:underline">soporte</a></p>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
          
          {submitStatus === 'success' && (
            <div className="bg-green-800/50 border border-green-600 text-green-100 px-4 py-3 rounded mb-6">
              ¡Mensaje enviado con éxito! Te responderemos lo antes posible.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="nombre" className="block text-gray-300 mb-2">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="asunto" className="block text-gray-300 mb-2">Asunto</label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="mensaje" className="block text-gray-300 mb-2">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="5"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:border-indigo-500"
                required
              ></textarea>
            </div>
            
            {/* Notification preference checkbox */}
            {user && (
              <div className="mb-6">
                <label className="flex items-center text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="notifyOnResponse"
                    checked={formData.notifyOnResponse}
                    onChange={handleChange}
                    className="mr-2 rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <FaBell className="text-indigo-400 mr-2" />
                  <span>Recibir notificación cuando respondan a mi mensaje</span>
                </label>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 inline-flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Contacto;