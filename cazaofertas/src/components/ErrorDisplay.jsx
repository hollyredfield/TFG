import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorDisplay = ({ error, message = 'Ocurrió un error', retryAction = null }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50">
      <FaExclamationTriangle size={40} className="text-red-500 mb-4" />
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">{message}</h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
        {error?.message || 'Algo salió mal. Por favor intenta de nuevo más tarde.'}
      </p>
      {retryAction && (
        <button 
          onClick={retryAction}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-200"
        >
          Intentar de nuevo
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
