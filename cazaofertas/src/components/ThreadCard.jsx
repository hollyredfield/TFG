import React from 'react';
import { Link } from 'react-router-dom';
import { FaComment, FaEye, FaThumbsUp, FaClock, FaUser, FaThumbtack, FaExclamationCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ThreadCard = ({ thread }) => {
  const {
    id,
    titulo,
    user,
    created_at,
    comentarios_count,
    votos_count,
    vistas_count,
    tags,
    is_pinned,
    is_expired
  } = thread;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft hover:shadow-medium transition-shadow p-4">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={user.avatar_url}
            alt={user.nombre_usuario}
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {is_pinned && (
              <FaThumbtack className="text-primary" title="Tema fijado" />
            )}
            {is_expired && (
              <FaExclamationCircle className="text-red-500" title="Oferta expirada" />
            )}
            <Link 
              to={`/foro/tema/${id}`}
              className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light transition-colors line-clamp-2"
            >
              {titulo}
            </Link>
          </div>

          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <FaUser className="mr-1" />
              <Link 
                to={`/perfil/${user.id}`}
                className="hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                {user.nombre_usuario}
              </Link>
            </span>
            <span className="flex items-center">
              <FaClock className="mr-1" />
              {formatDistanceToNow(new Date(created_at), { locale: es, addSuffix: true })}
            </span>
          </div>

          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <FaComment className="mr-1" />
              {comentarios_count} comentarios
            </span>
            <span className="flex items-center">
              <FaThumbsUp className="mr-1" />
              {votos_count} votos
            </span>
            <span className="flex items-center">
              <FaEye className="mr-1" />
              {vistas_count} vistas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
