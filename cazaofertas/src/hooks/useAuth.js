import { useContext } from 'react';
import AuthContext from '../context/AuthContextInstance';

export const useAuth = () => {
  console.log('useAuth.js: Intentando acceder al contexto de autenticación');
  const context = useContext(AuthContext);
  console.log('useAuth.js: Contexto obtenido:', context ? 'Disponible' : 'No disponible');
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
