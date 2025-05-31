// ImageValidationDashboard.jsx
// Componente para administrar y validar las imágenes de productos

import React, { useState, useEffect } from 'react';
import {
  FaCheck, FaTimes, FaExclamationTriangle,
  FaImage, FaSortAmountDown, FaFilter, FaEllipsisV
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import mockData from '../data/mockData';
import { verifyAllProductImages } from '../utils/imageValidator';
import { ofertas, categorias } from '../data/mockData';
import ImageWithFallback from './ImageWithFallback';
import { categoryMapping, getFallbackImageByCategory } from '../utils/imageHelpers';

const ImageValidationDashboard = () => {
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    percentSuccess: '0%',
    byCategory: {}
  });

  useEffect(() => {
    // Actualizar estadísticas cuando cambian los resultados de validación
    if (validationResults) {
      const byCategory = {};
      
      // Agrupar resultados por categoría
      validationResults.details.forEach(item => {
        const offer = ofertas.find(o => o.id === item.id);
        if (offer) {
          const categoryId = offer.id_categoria;
          if (!byCategory[categoryId]) {
            byCategory[categoryId] = { total: 0, valid: 0, invalid: 0 };
          }
          byCategory[categoryId].total++;
          
          if (item.valid) {
            byCategory[categoryId].valid++;
          } else {
            byCategory[categoryId].invalid++;
          }
        }
      });
      
      // Calcular estadísticas
      setStats({
        total: validationResults.total,
        success: validationResults.success,
        failed: validationResults.failed,
        percentSuccess: `${((validationResults.success / validationResults.total) * 100).toFixed(2)}%`,
        byCategory
      });
    }
  }, [validationResults]);
  
  // Función para iniciar la validación
  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const results = await verifyAllProductImages(ofertas);
      setValidationResults(results);
    } catch (error) {
      console.error('Error al validar imágenes:', error);
    } finally {
      setIsValidating(false);
    }
  };

  // Obtener imágenes con problemas
  const getFailedImages = () => {
    if (!validationResults) return [];
    
    return validationResults.details.filter(item => !item.valid).map(item => {
      const offer = ofertas.find(o => o.id === item.id);
      return {
        ...item,
        categoria: offer ? offer.id_categoria : 'desconocida'
      };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Validación de Imágenes</h2>
        <button
          onClick={handleValidate}
          disabled={isValidating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isValidating ? (
            <>
              <FaSync className="animate-spin mr-2" />
              Validando...
            </>
          ) : (
            <>
              <FaImage className="mr-2" />
              Verificar Imágenes
            </>
          )}
        </button>
      </div>

      {/* Resumen de validación */}
      {validationResults && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Resumen</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <div className="text-sm text-gray-500">Total de imágenes</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <div className="text-sm text-green-600">Imágenes válidas</div>
              <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            </div>
            <div className={`${stats.failed > 0 ? 'bg-red-50' : 'bg-gray-50'} p-4 rounded border ${stats.failed > 0 ? 'border-red-200' : 'border-gray-200'}`}>
              <div className={`text-sm ${stats.failed > 0 ? 'text-red-600' : 'text-gray-500'}`}>Imágenes con problemas</div>
              <div className={`text-2xl font-bold ${stats.failed > 0 ? 'text-red-600' : 'text-gray-500'}`}>{stats.failed}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <div className="text-sm text-blue-600">Porcentaje de éxito</div>
              <div className="text-2xl font-bold text-blue-600">{stats.percentSuccess}</div>
            </div>
          </div>
        </div>
      )}

      {/* Imágenes con problemas */}
      {validationResults && stats.failed > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Imágenes con problemas ({stats.failed})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL de la imagen
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFailedImages().map((item, index) => {
                  const categoryInfo = categoryMapping[item.categoria] || { name: 'Desconocida' };
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/oferta/${item.id}`} className="text-blue-600 hover:text-blue-800">
                          {item.titulo}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 truncate max-w-xs">
                            {item.url}
                          </span>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="ml-2 text-gray-400 hover:text-blue-500"
                          >
                            <FaExternalLinkAlt size={12} />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span>{categoryInfo.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <FaBan className="mr-1" /> No válida
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estado por categoría */}
      {validationResults && Object.keys(stats.byCategory).length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Estado por categoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.byCategory).map(([categoryId, data]) => {
              const categoryInfo = categoryMapping[categoryId] || { name: 'Desconocida', color: '#999' };
              const percentValid = data.total > 0 ? (data.valid / data.total) * 100 : 0;
              
              return (
                <div key={categoryId} className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{categoryInfo.name}</h4>
                    <span className={`text-sm ${percentValid < 100 ? 'text-orange-500' : 'text-green-500'} font-medium`}>
                      {percentValid.toFixed(0)}% válidas
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded">
                    <div 
                      className={`h-full rounded ${percentValid < 100 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ width: `${percentValid}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex justify-between">
                    <span>Total: {data.total}</span>
                    <span>{data.valid} válidas / {data.invalid} con problemas</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageValidationDashboard;
