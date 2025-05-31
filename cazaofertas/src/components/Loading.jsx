import React from 'react';

const Loading = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default Loading;
