import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle, FaSpinner, FaKey } from 'react-icons/fa';
import { resetPassword, updatePassword } from '../services/supabase';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tokenFromUrl, setTokenFromUrl] = useState(null);
  const [mode, setMode] = useState('request'); // 'request' or 'reset'
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a token in the URL (for password reset confirmation)
  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.includes('type=recovery')) {
      try {
        // Extract the token from the URL hash
        const hashParams = new URLSearchParams(hash.substring(1));
        const token = hashParams.get('access_token');
        if (token) {
          setTokenFromUrl(token);
          setMode('reset');
        }
      } catch (error) {
        console.error('Error extracting token:', error);
        setError('El enlace de recuperación no es válido. Por favor, solicita otro.');
      }
    }
  }, [location]);
  
  // Request password reset email
  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor, introduce tu dirección de correo electrónico');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Solicitando reestablecimiento de contraseña para:', email);
      const { error } = await resetPassword(email);
      
      if (error) {
        console.error('Error al solicitar reestablecimiento:', error);
        setError(error.message);
      } else {
        setSuccessMessage('Se ha enviado un correo electrónico con instrucciones para reestablecer tu contraseña. Por favor, revisa tu bandeja de entrada y carpeta de spam.');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Por favor, introduce tu nueva contraseña');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Actualizando contraseña...');
      const { error } = await updatePassword(password);
      
      if (error) {
        console.error('Error al actualizar contraseña:', error);
        setError(error.message);
      } else {
        setSuccessMessage('Tu contraseña ha sido actualizada correctamente');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Tu contraseña ha sido actualizada. Por favor, inicia sesión con tu nueva contraseña.' } 
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
          <h1 className="text-white text-xl font-bold text-center">
            {mode === 'request' ? 'Recuperar Contraseña' : 'Establecer Nueva Contraseña'}
          </h1>
        </div>
        
        <div className="p-6">
          {/* Mensajes de error o éxito */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 flex items-start">
              <FaExclamationCircle className="mr-2 mt-1 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded mb-4 flex items-start">
              <FaCheckCircle className="mr-2 mt-1 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          
          {mode === 'request' ? (
            // Formulario para solicitar reestablecimiento
            <form onSubmit={handleRequestReset} noValidate>
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Introduce tu dirección de correo electrónico y te enviaremos un enlace para reestablecer tu contraseña.
                </p>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="tu@email.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
              >
                {isSubmitting && <FaSpinner className="animate-spin" />}
                {isSubmitting ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
              </button>
            </form>
          ) : (
            // Formulario para establecer nueva contraseña
            <form onSubmit={handleResetPassword} noValidate>
              <div className="mb-4">
                <p className="text-gray-300 mb-4">
                  Por favor, introduce tu nueva contraseña.
                </p>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nueva contraseña"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirmar contraseña"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
              >
                {isSubmitting && <FaSpinner className="animate-spin" />}
                {isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Volver a Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
