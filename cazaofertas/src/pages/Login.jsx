import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { signIn, resendVerificationEmail } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar mensajes de estado de navegación
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      
      // Limpiar el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from || '/';
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, location.state]);

  // Verificar si se navegó desde el registro para mostrar opción de reenvío
  useEffect(() => {
    if (location.state?.showResendOption && location.state?.resendEmail) {
      setEmail(location.state.resendEmail);
      setError('Por favor verifica tu email primero'); // Para forzar mostrar el bloque de reenvío
    }
  }, [location.state]);

  // Función para validar el formulario
  const validateForm = () => {
    let isValid = true;
    
    // Reiniciar errores
    setEmailError('');
    setPasswordError('');
    setError('');
    
    // Validar email
    if (!email) {
      setEmailError('El email es obligatorio');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Por favor, introduce un email válido');
      isValid = false;
    }
    
    // Validar contraseña
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación del formulario
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log("Intentando iniciar sesión...");
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.log("Error en inicio de sesión:", error.message);
        setError(error.message);
      } else if (data?.session?.user) {
        setUser(data.session.user);
        navigate('/');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para reenviar correo de verificación
  const handleResendVerificationEmail = async () => {
    if (!email) {
      setEmailError('Por favor, introduce tu dirección de email para reenviar el correo de verificación.');
      return;
    }
    
    setIsResendingEmail(true);
    setEmailError('');
    
    try {
      console.log("Enviando correo de verificación a:", email);
      const { data, error } = await resendVerificationEmail(email);
      
      if (error) {
        console.error("Error al reenviar correo:", error);
        setError(error.message);
      } else {
        console.log("Respuesta de reenvío:", data);
        setSuccessMessage('Se ha enviado un nuevo correo de verificación. Por favor, revisa tu bandeja de entrada y carpeta de spam. Puede tardar unos minutos en llegar.');
        setError('');
      }
    } catch (error) {
      console.error('Error al reenviar correo de verificación:', error);
      setError('No se pudo reenviar el correo de verificación. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
          <h1 className="text-white text-xl font-bold text-center">Iniciar Sesión</h1>
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
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  autoComplete="email"
                  className={`block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border ${
                    emailError ? 'border-red-500' : 'border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="tu@email.com"
                  disabled={isSubmitting}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>
            
            {/* Contraseña */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
                <Link to="/recuperar-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                  ¿Olvidaste la contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  autoComplete="current-password"
                  className={`block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border ${
                    passwordError ? 'border-red-500' : 'border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Tu contraseña"
                  disabled={isSubmitting}
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            
            {/* Recordarme */}
            <div className="flex items-center mb-6">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                disabled={isSubmitting}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Recordarme
              </label>
            </div>
            
            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
            >
              {isSubmitting && <FaSpinner className="animate-spin" />}
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            
            {/* Opción para reenviar correo de verificación */}
            {(error && error.includes('verificado') || location.state?.showResendOption) && (
              <div className="mt-4 p-3 bg-indigo-900/30 border border-indigo-500 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">
                  ¿No has recibido el correo de verificación o ha expirado?
                </p>
                <button
                  type="button"
                  disabled={isResendingEmail}
                  className="w-full flex justify-center items-center gap-2 text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded-md text-sm font-medium disabled:opacity-70"
                  onClick={handleResendVerificationEmail}
                >
                  {isResendingEmail && <FaSpinner className="animate-spin" />}
                  {isResendingEmail ? 'Enviando...' : 'Reenviar correo de verificación'}
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado. Los correos pueden tardar hasta 5 minutos en entregarse.
                </p>
              </div>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-indigo-400 font-medium hover:text-indigo-300">
                Regístrate ahora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;