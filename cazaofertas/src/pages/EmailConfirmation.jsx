import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { simulateDelay } from '../data/mockData';
import { verifyEmailToken, createUserProfile } from '../services/supabase';

const EmailConfirmation = () => {
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Simular un pequeño retraso para que sea más realista
        await simulateDelay(1000, 2000);

        // Verificar el token
        const verifyResult = await verifyEmailToken(token);
        
        if (verifyResult.error) {
          throw verifyResult.error;
        }
        
        const { user } = verifyResult.data;
        
        if (user) {
          // Crear o actualizar el perfil del usuario
          const username = user.nombre || user.email.split('@')[0];
          const profileData = {
            nombre_usuario: username,
            email: user.email,
            avatar_url: user.avatar_url || `https://i.pravatar.cc/300?u=${user.id}`,
            rol: 'user'
          };

          const profileResult = await createUserProfile(user.id, profileData);
          
          if (profileResult.error) {
            throw profileResult.error;
          }
          
          setStatus('success');
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          throw new Error('No se pudo obtener la información del usuario');
        }
        
      } catch (error) {
        console.error("Error en el proceso de verificación:", error);
        setStatus('error');
        setErrorMessage(error.message || 'Ha ocurrido un error al verificar tu cuenta. Por favor, inténtalo de nuevo.');
      }
    };

    confirmEmail();   
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pt-20 pb-12 px-4">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
          <h1 className="text-white text-xl font-bold text-center">Verificación de Cuenta</h1>
        </div>
        
        <div className="p-6">
          {status === 'loading' && (
            <div className="text-center py-8">
              <FaSpinner className="animate-spin text-4xl text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-300">Verificando tu cuenta...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-6 rounded flex flex-col items-center">
              <FaCheck className="text-4xl text-green-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">¡Cuenta verificada!</h2>
              <p className="text-center mb-4">Tu cuenta ha sido verificada correctamente.</p>
              <p className="text-center text-gray-400">
                Serás redirigido a la página de inicio de sesión en unos segundos...
              </p>
              <Link to="/login" className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors">
                Iniciar sesión ahora
              </Link>
            </div>
          )}
          
          {status === 'error' && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-6 rounded flex flex-col items-center">
              <FaExclamationTriangle className="text-4xl text-red-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error de verificación</h2>
              <p className="text-center mb-4">{errorMessage}</p>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                  Volver al registro
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;