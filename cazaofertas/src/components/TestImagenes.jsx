// TestImagenes.jsx - Componente para probar todas las imágenes brutales
import React from 'react';
import { getImagenBruta, categoryFallbackImages, getFallbackImageByCategory } from '../utils/imageHelpers';

const TestImagenes = () => {
  const categorias = [1, 2, 3, 4, 5, 6];
  const tiendas = ['Amazon', 'El Corte Inglés', 'PcComponentes', 'Otra tienda'];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">🚀 TEST DE IMÁGENES BRUTALES</h1>
      
      {/* Test de categorías */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">📂 Imágenes por Categoría</h2>
        <div className="grid grid-cols-3 gap-4">
          {categorias.map(catId => (
            <div key={catId} className="border p-4 rounded">
              <h3 className="font-bold mb-2">Categoría {catId}</h3>
              <img 
                src={getFallbackImageByCategory(catId)} 
                alt={`Categoría ${catId}`}
                className="w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Test de tiendas */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🏪 Avatares de Tiendas</h2>
        <div className="grid grid-cols-4 gap-4">
          {tiendas.map(tienda => (
            <div key={tienda} className="border p-4 rounded">
              <h3 className="font-bold mb-2">{tienda}</h3>
              <img 
                src={getImagenBruta(null, tienda, null, tienda)} 
                alt={tienda}
                className="w-full h-24 object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Test con URLs rotas */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">💥 Test con URLs Rotas</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">URL undefined</h3>
            <img 
              src={getImagenBruta('undefined', 'Test', 1)} 
              alt="URL undefined"
              className="w-full h-32 object-cover"
            />
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">URL null</h3>
            <img 
              src={getImagenBruta(null, 'Test', 2)} 
              alt="URL null"
              className="w-full h-32 object-cover"
            />
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">URL vacía</h3>
            <img 
              src={getImagenBruta('', 'Test', 3)} 
              alt="URL vacía"
              className="w-full h-32 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Test combinado */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🎯 Test Combinado Real</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Oferta Amazon Electrónica</h3>
            <img 
              src={getImagenBruta('https://invalid-url.com/image.jpg', 'Laptop Gaming', 1, 'Amazon')} 
              alt="Oferta Amazon"
              className="w-full h-40 object-cover"
            />
          </div>
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">Oferta PcComponentes</h3>
            <img 
              src={getImagenBruta(undefined, 'Tarjeta Gráfica', 1, 'PcComponentes')} 
              alt="Oferta PC"
              className="w-full h-40 object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestImagenes;
