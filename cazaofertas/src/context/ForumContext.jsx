import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

// Contexto para gestionar el estado relacionado con el foro
const ForumContext = createContext();

// Proveedor del contexto
export const ForumProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [bookmarkedThreads, setBookmarkedThreads] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  
  // Cargar los favoritos guardados cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // En un entorno real, esto cargaría los hilos favoritos desde la base de datos
      // Como es simulado, usamos localStorage
      try {
        const savedBookmarks = localStorage.getItem(`bookmarked_threads_${user.id}`);
        if (savedBookmarks) {
          setBookmarkedThreads(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      } finally {
        setLoadingBookmarks(false);
      }
    } else {
      setBookmarkedThreads([]);
      setLoadingBookmarks(false);
    }
  }, [isAuthenticated, user]);
  
  // Guardar cambios en los favoritos
  const saveBookmarkedThreads = (threads) => {
    if (isAuthenticated && user) {
      try {
        localStorage.setItem(`bookmarked_threads_${user.id}`, JSON.stringify(threads));
      } catch (error) {
        console.error('Error saving bookmarks:', error);
      }
    }
  };
  
  // Añadir un hilo a favoritos
  const addBookmark = (threadId, threadTitle) => {
    if (!isAuthenticated) return false;
    
    const newBookmarks = [...bookmarkedThreads, { 
      id: threadId, 
      title: threadTitle,
      added_at: new Date().toISOString()
    }];
    
    setBookmarkedThreads(newBookmarks);
    saveBookmarkedThreads(newBookmarks);
    return true;
  };
  
  // Eliminar un hilo de favoritos
  const removeBookmark = (threadId) => {
    if (!isAuthenticated) return false;
    
    const newBookmarks = bookmarkedThreads.filter(bookmark => bookmark.id !== threadId);
    setBookmarkedThreads(newBookmarks);
    saveBookmarkedThreads(newBookmarks);
    return true;
  };
  
  // Verificar si un hilo está en favoritos
  const isBookmarked = (threadId) => {
    return bookmarkedThreads.some(bookmark => bookmark.id === threadId);
  };
  
  // Valor del contexto
  const contextValue = {
    bookmarkedThreads,
    loadingBookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked
  };
  
  return (
    <ForumContext.Provider value={contextValue}>
      {children}
    </ForumContext.Provider>
  );
};

// Hook personalizado para usar el contexto del foro
export const useForum = () => {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForum debe ser usado dentro de un ForumProvider');
  }
  return context;
};

export default ForumContext;
