import React, { useState, useEffect } from 'react';
import { 
  FaRegComment, FaReply, FaEllipsisV, FaTrash, FaEdit, FaFlag,
  FaUser, FaRegClock, FaThumbsUp, FaThumbsDown
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import VoteSystem from './VoteSystem';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import supabase from '../services/supabase';

const CommentSystem = ({ productId, productType, initialComments = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showMenu, setShowMenu] = useState(null);
  
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      
      // En un entorno real, esto buscaría los comentarios en la base de datos
      // Como es simulado, generamos algunos comentarios de ejemplo o usamos localStorage
      try {
        const storageKey = `comments_${productType}_${productId}`;
        const savedComments = localStorage.getItem(storageKey);
        
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        } else if (initialComments.length === 0) {
          // Si no hay comentarios guardados ni iniciales, generar algunos de ejemplo
          const sampleComments = [
            {
              id: 'comment-1',
              user_id: 'user-1',
              user_name: 'MaríaGarcía',
              avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
              content: '¡Este producto es fantástico! Lo recomiendo totalmente.',
              created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              votes: 5,
              parent_id: null
            },
            {
              id: 'comment-2',
              user_id: 'user-2',
              user_name: 'CarlosRodriguez',
              avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
              content: 'La calidad es buena pero el envío tardó demasiado.',
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              votes: 2,
              parent_id: null
            },
            {
              id: 'comment-3',
              user_id: 'user-3',
              user_name: 'LauraLopez',
              avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
              content: '¿Alguien sabe si hay tallas más grandes disponibles?',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              votes: 0,
              parent_id: null
            },
            {
              id: 'comment-4',
              user_id: 'user-1',
              user_name: 'MaríaGarcía',
              avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
              content: 'Yo compré la talla XL y me quedó bien.',
              created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              votes: 1,
              parent_id: 'comment-3'
            }
          ];
          
          setComments(sampleComments);
          localStorage.setItem(storageKey, JSON.stringify(sampleComments));
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('No se pudieron cargar los comentarios');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [productId, productType, initialComments]);
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comentar');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }
    
    setLoading(true);
    
    try {
      const commentId = `comment-${Date.now()}`;
      const newCommentObj = {
        id: commentId,
        user_id: user.id,
        user_name: user.nombre_usuario || user.email,
        avatar_url: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre_usuario || user.email)}&background=random`,
        content: newComment,
        created_at: new Date().toISOString(),
        votes: 0,
        parent_id: replyTo
      };
      
      // En un entorno real, esto guardaría el comentario en la base de datos
      const storageKey = `comments_${productType}_${productId}`;
      const updatedComments = [...comments, newCommentObj];
      localStorage.setItem(storageKey, JSON.stringify(updatedComments));
      
      setComments(updatedComments);
      setNewComment('');
      setReplyTo(null);
      
      toast.success('Comentario publicado con éxito');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Error al publicar el comentario');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      toast.error('El comentario no puede estar vacío');
      return;
    }
    
    setLoading(true);
    
    try {
      // En un entorno real, esto actualizaría el comentario en la base de datos
      const storageKey = `comments_${productType}_${productId}`;
      const updatedComments = comments.map(comment => 
        comment.id === commentId ? { ...comment, content: editText } : comment
      );
      
      localStorage.setItem(storageKey, JSON.stringify(updatedComments));
      setComments(updatedComments);
      setEditingComment(null);
      setEditText('');
      
      toast.success('Comentario actualizado con éxito');
    } catch (error) {
      console.error('Error editing comment:', error);
      toast.error('Error al editar el comentario');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      // En un entorno real, esto eliminaría el comentario de la base de datos
      const storageKey = `comments_${productType}_${productId}`;
      
      // Eliminar el comentario y sus respuestas
      const deleteRecursive = (comments, commentId) => {
        const commentIds = [commentId];
        
        // Encontrar todas las respuestas
        comments.forEach(comment => {
          if (comment.parent_id === commentId) {
            commentIds.push(...deleteRecursive(comments, comment.id));
          }
        });
        
        return commentIds;
      };
      
      const commentIdsToDelete = deleteRecursive(comments, commentId);
      const updatedComments = comments.filter(comment => !commentIdsToDelete.includes(comment.id));
      
      localStorage.setItem(storageKey, JSON.stringify(updatedComments));
      setComments(updatedComments);
      
      toast.success('Comentario eliminado con éxito');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error al eliminar el comentario');
    } finally {
      setLoading(false);
    }
  };
  
  const startEditing = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.content);
    setShowMenu(null);
  };
  
  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };
  
  const timeAgo = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: es });
  };
  
  // Organizar comentarios en estructura jerárquica para mostrarlos correctamente
  const organizeComments = () => {
    const topLevel = comments.filter(comment => !comment.parent_id);
    const replies = comments.filter(comment => comment.parent_id);
    
    // Ordenar por fecha (más recientes primero)
    topLevel.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    return topLevel.map(comment => ({
      ...comment,
      replies: replies
        .filter(reply => reply.parent_id === comment.id)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }));
  };
  
  const organizedComments = organizeComments();
  
  const renderComment = (comment, isReply = false) => (
    <div 
      key={comment.id} 
      className={`mb-4 ${isReply ? 'ml-12 border-l-2 border-gray-100 pl-4' : ''}`}
    >
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start">
          <img 
            src={comment.avatar_url} 
            alt={comment.user_name} 
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">{comment.user_name}</h4>
                <p className="text-xs text-gray-500 flex items-center">
                  <FaRegClock className="mr-1" /> {timeAgo(comment.created_at)}
                </p>
              </div>
              {isAuthenticated && (user.id === comment.user_id || user.role === 'admin') && (
                <div className="relative">
                  <button 
                    onClick={() => setShowMenu(showMenu === comment.id ? null : comment.id)} 
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaEllipsisV />
                  </button>
                  
                  {showMenu === comment.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => startEditing(comment)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FaEdit className="inline mr-2" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <FaTrash className="inline mr-2" /> Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {editingComment === comment.id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                  rows="3"
                ></textarea>
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={cancelEditing}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => handleEditComment(comment.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-800">{comment.content}</p>
            )}
            
            <div className="mt-3 flex justify-between items-center">
              <VoteSystem 
                itemId={comment.id} 
                itemType="comment"
                initialVotes={comment.votes || 0}
              />
              
              {!isReply && (
                <button 
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} 
                  className={`text-sm flex items-center ${replyTo === comment.id ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                >
                  <FaReply className="mr-1" /> Responder
                </button>
              )}
            </div>
            
            {replyTo === comment.id && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <form onSubmit={handleCommentSubmit} className="flex flex-col">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    className="w-full border border-gray-300 rounded-md p-2 mb-2"
                    rows="2"
                  ></textarea>
                  <div className="flex justify-end space-x-2">
                    <button 
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      disabled={loading}
                    >
                      Responder
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Render replies */}
      {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
    </div>
  );
  
  return (
    <div className="mt-8 bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <FaRegComment className="mr-2 text-primary" />
        Comentarios ({comments.length})
      </h2>
      
      {/* Comment form for top-level comments */}
      {replyTo === null && (
        <div className="mb-6">
          <form onSubmit={handleCommentSubmit} className="bg-white rounded-lg shadow-sm p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isAuthenticated ? "Escribe tu comentario..." : "Inicia sesión para comentar"}
              className="w-full border border-gray-300 rounded-md p-3 mb-3"
              rows="3"
              disabled={!isAuthenticated}
            ></textarea>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {!isAuthenticated && "Debes iniciar sesión para comentar"}
              </p>
              <button 
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                disabled={!isAuthenticated || loading}
              >
                {loading ? 'Enviando...' : 'Publicar comentario'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Comments list */}
      <div>
        {loading && comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando comentarios...</p>
          </div>
        ) : organizedComments.length > 0 ? (
          organizedComments.map(comment => renderComment(comment))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg">
            <p className="text-gray-500">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSystem;
