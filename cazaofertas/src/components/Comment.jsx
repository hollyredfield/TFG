import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaReply, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const Comment = ({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  onVote,
  isEditing,
  depth = 0 
}) => {
  const { user: currentUser } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const maxDepth = 3; // Maximum nesting level

  const canModify = currentUser?.id === comment.user_id;

  return (
    <div 
      className={`relative ${depth > 0 ? 'ml-8' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img
            src={comment.user.avatar_url}
            alt={comment.user.nombre_usuario}
            className="h-10 w-10 rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <a 
              href={`/perfil/${comment.user_id}`}
              className="font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light"
            >
              {comment.user.nombre_usuario}
            </a>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              {formatDistanceToNow(new Date(comment.created_at), { locale: es, addSuffix: true })}
            </span>
          </div>
          
          <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            {comment.contenido}
          </div>

          <div className="mt-2 flex items-center space-x-4 text-sm">
            <button
              onClick={() => onVote(comment.id, 'up')}
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
            >
              <FaThumbsUp className="mr-1" />
              <span>{comment.votos_count}</span>
            </button>
            
            {depth < maxDepth && (
              <button
                onClick={() => onReply(comment)}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors"
              >
                <FaReply className="mr-1" />
                Responder
              </button>
            )}

            {canModify && isHovered && (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <button
                  onClick={() => onEdit(comment)}
                  className="hover:text-primary dark:hover:text-primary-light transition-colors"
                  title="Editar comentario"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(comment.id)}
                  className="hover:text-red-500 transition-colors"
                  title="Eliminar comentario"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Line connector for nested comments */}
      {depth > 0 && (
        <div 
          className="absolute left-[-24px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"
          style={{ height: '100%' }}
        />
      )}

      {/* Render nested comments recursively */}
      {comment.replies?.map(reply => (
        <Comment
          key={reply.id}
          comment={reply}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onVote={onVote}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

export default Comment;
