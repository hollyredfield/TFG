import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaReply, FaEdit, FaTrash, FaClock, FaExclamationCircle, FaShare, FaBookmark, FaRegBookmark, FaAngleLeft } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useForum } from '../context/ForumContext';
import forumService from '../services/forumService';
import Loading from '../components/Loading';
import VoteSystem from '../components/VoteSystem';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';

const ThreadDetail = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addBookmark, removeBookmark, isBookmarked: checkBookmark } = useForum();  useEffect(() => {
    const fetchThreadAndMessages = async () => {
      try {
        // Fetch thread details using simulated service
        const { data: threadData, error: threadError } = await forumService.getThread(threadId);

        if (threadError) {
          console.error('Error fetching thread:', threadError);
          navigate('/foro');
          return;
        }

        if (!threadData) {
          navigate('/foro');
          return;
        }

        setThread(threadData);

        // Fetch messages using simulated service
        const { data: messagesData, error: messagesError } = await forumService.getThreadMessages(threadId);

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
        } else {
          setMessages(messagesData || []);
        }

        // Check if thread is bookmarked using the Forum context
        if (isAuthenticated && user) {
          setIsBookmarked(checkBookmark(threadId));
        }
      } catch (error) {
        console.error('Error in thread detail fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreadAndMessages();
  }, [threadId, navigate, isAuthenticated, user, checkBookmark]);
  const handleSubmitReply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/foro/tema/${threadId}` } });
      return;
    }

    if (!replyContent.trim()) {
      toast.error('No puedes enviar una respuesta vacía');
      return;
    }

    setReplyLoading(true);

    try {
      const newMessage = {
        tema_id: threadId,
        user_id: user.id,
        contenido: replyContent,
      };

      const { error } = await forumService.createMessage(newMessage);

      if (error) {
        toast.error('Error al publicar tu respuesta');
        console.error('Error posting reply:', error);
        return;
      }

      // Refresh messages
      const { data: messagesData } = await forumService.getThreadMessages(threadId);
      setMessages(messagesData || []);
      setReplyContent('');
      toast.success('Tu respuesta ha sido publicada');
    } catch (error) {
      toast.error('Error al publicar tu respuesta');
      console.error('Error in submit reply:', error);
    } finally {
      setReplyLoading(false);
    }
  };
  const handleDeleteMessage = async (messageId) => {
    if (!isAuthenticated) return;

    if (!window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      return;
    }

    try {
      const { error } = await forumService.deleteMessage(messageId, user.id);

      if (error) {
        toast.error('Error al eliminar el mensaje');
        console.error('Error deleting message:', error);
        return;
      }

      // Remove message from state
      setMessages(messages.filter(msg => msg.id !== messageId));
      toast.success('Mensaje eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el mensaje');
      console.error('Error in delete message:', error);
    }
  };

  const handleDeleteThread = async () => {
    if (!isAuthenticated || !thread || thread.user_id !== user.id) return;

    if (!window.confirm('¿Estás seguro de que quieres eliminar este tema? Se eliminarán todos los mensajes asociados.')) {
      return;
    }

    try {
      const { error } = await forumService.deleteThread(threadId, user.id);

      if (error) {
        toast.error('Error al eliminar el tema');
        console.error('Error deleting thread:', error);
        return;
      }

      toast.success('Tema eliminado correctamente');
      navigate('/foro');
    } catch (error) {
      toast.error('Error al eliminar el tema');
      console.error('Error in delete thread:', error);
    }
  };
  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/foro/tema/${threadId}` } });
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        const success = removeBookmark(threadId);
        
        if (success) {
          setIsBookmarked(false);
          toast.success('Tema eliminado de tus favoritos');
        } else {
          toast.error('Error al quitar de favoritos');
        }
      } else {
        // Add bookmark
        const success = addBookmark(threadId, thread.titulo);
        
        if (success) {
          setIsBookmarked(true);
          toast.success('Tema añadido a tus favoritos');
        } else {
          toast.error('Error al añadir a favoritos');
        }
      }
    } catch (error) {
      toast.error('Error al gestionar favoritos');
      console.error('Error toggling bookmark:', error);
    }
  };

  const formatDate = (date) => {
    return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: es });
  };

  const timeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: es
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!thread) {
    navigate('/foro');
    return null;
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/foro')} 
          className="flex items-center text-primary hover:underline"
        >
          <FaAngleLeft className="mr-1" /> Volver al foro
        </button>
      </div>
      
      {/* Thread Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{thread.titulo}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {thread.foro_categorias?.nombre}
              </span>
              <span className="flex items-center">
                <FaClock className="mr-1" /> Creado {timeAgo(thread.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleBookmark}
              className="text-gray-500 hover:text-primary"
              title={isBookmarked ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              {isBookmarked ? <FaBookmark size={18} className="text-primary" /> : <FaRegBookmark size={18} />}
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Enlace copiado al portapapeles');
              }}
              className="text-gray-500 hover:text-primary"
              title="Compartir enlace"
            >
              <FaShare size={18} />
            </button>
            {isAuthenticated && user && thread.user_id === user.id && (
              <button 
                onClick={handleDeleteThread}
                className="text-red-500 hover:text-red-700"
                title="Eliminar tema"
              >
                <FaTrash size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Thread Content */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b">
          <div className="flex items-start">
            <div className="mr-4">
              <img 
                src={thread.profiles?.avatar_url || "https://via.placeholder.com/60"} 
                alt={thread.profiles?.nombre_usuario || 'Avatar'} 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {thread.profiles?.nombre_usuario || 'Usuario desconocido'}
                </h3>
                <span className="text-sm text-gray-500">{formatDate(thread.created_at)}</span>          </div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: thread.contenido }}
              />
              <div className="mt-4">
                <VoteSystem 
                  itemId={thread.id} 
                  itemType="thread"
                  initialVotes={thread.votos_total || 0} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {messages.length > 0 ? (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">{messages.length} {messages.length === 1 ? 'Respuesta' : 'Respuestas'}</h3>
          </div>
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              id={`message-${message.id}`}
              className={`p-6 ${index !== messages.length - 1 ? 'border-b' : ''}`}
            >
              <div className="flex items-start">
                <div className="mr-4">
                  <img 
                    src={message.profiles?.avatar_url || "https://via.placeholder.com/50"} 
                    alt={message.profiles?.nombre_usuario || 'Avatar'} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {message.profiles?.nombre_usuario || 'Usuario desconocido'}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{formatDate(message.created_at)}</span>
                      {isAuthenticated && user && message.user_id === user.id && (
                        <button 
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Eliminar mensaje"
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
                  </div>                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: message.contenido }}
                  />
                  <div className="mt-3">
                    <VoteSystem 
                      itemId={message.id} 
                      itemType="message"
                      initialVotes={message.votos_total || 0} 
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow mb-6 p-8 text-center">
          <p className="text-gray-500">No hay respuestas todavía. ¡Sé el primero en responder!</p>
        </div>
      )}

      {/* Reply Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Responder</h3>
        {isAuthenticated ? (
          <form onSubmit={handleSubmitReply}>
            <div className="mb-4">
              <ReactQuill
                theme="snow"
                value={replyContent}
                onChange={setReplyContent}
                placeholder="Escribe tu respuesta aquí..."
              />
            </div>
            <button
              type="submit"
              disabled={replyLoading}
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center disabled:opacity-70"
            >
              <FaReply className="mr-2" /> {replyLoading ? 'Enviando...' : 'Responder'}
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
            <FaExclamationCircle className="text-primary mx-auto mb-2" size={24} />
            <p className="mb-4">Necesitas iniciar sesión para responder</p>
            <button
              onClick={() => navigate('/login', { state: { from: `/foro/tema/${threadId}` } })}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadDetail;
