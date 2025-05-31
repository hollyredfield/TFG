import React from 'react';
import { motion } from 'framer-motion';

const SobreNosotros = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8 border-b border-gray-700 pb-4">Sobre Nosotros</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">Nuestra Misión</h2>
            <p className="leading-relaxed">
              En CazaOfertas, nuestra misión es simple pero poderosa: conectar a los consumidores con las mejores ofertas disponibles en línea. 
              Creemos que todos merecen acceso a precios justos y descuentos reales, y trabajamos incansablemente para crear una plataforma 
              donde nuestra comunidad pueda encontrar, compartir y votar las mejores oportunidades de ahorro.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">Nuestra Historia</h2>
            <p className="leading-relaxed">
              CazaOfertas nació en 2023 como un proyecto universitario con una visión ambiciosa: revolucionar la forma en que las personas 
              descubren ofertas en línea. Lo que comenzó como una simple idea se ha convertido en una comunidad vibrante de cazadores 
              de ofertas que comparten su conocimiento y experiencia colectiva para beneficio de todos.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-xl font-medium text-indigo-300 mb-2">Transparencia</h3>
                <p>Nos comprometemos a presentar ofertas genuinas y a ser completamente transparentes sobre cómo funcionamos.</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-xl font-medium text-indigo-300 mb-2">Comunidad</h3>
                <p>CazaOfertas está construido sobre el poder de nuestra comunidad. Sus contribuciones son el corazón de nuestra plataforma.</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-xl font-medium text-indigo-300 mb-2">Accesibilidad</h3>
                <p>Nos esforzamos por hacer que nuestra plataforma sea accesible para todos, independientemente de sus habilidades técnicas.</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-xl font-medium text-indigo-300 mb-2">Innovación</h3>
                <p>Constantemente buscamos formas de mejorar nuestra plataforma y ofrecer nuevas características que beneficien a nuestra comunidad.</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">Nuestro Equipo</h2>
            <p className="leading-relaxed mb-6">
              Detrás de CazaOfertas hay un equipo apasionado de desarrolladores, diseñadores y amantes de las ofertas 
              que trabajan juntos para crear la mejor experiencia posible para nuestra comunidad.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Aquí puedes añadir información de los miembros del equipo si lo deseas */}
              <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                <div className="w-24 h-24 mx-auto bg-gray-600 rounded-full mb-4"></div>
                <h3 className="text-lg font-medium text-white">Fundador & CEO</h3>
                <p className="text-gray-400">Apasionado por la tecnología y el ahorro inteligente</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                <div className="w-24 h-24 mx-auto bg-gray-600 rounded-full mb-4"></div>
                <h3 className="text-lg font-medium text-white">Desarrollo Full-Stack</h3>
                <p className="text-gray-400">Creando la magia detrás de cada funcionalidad</p>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg text-center">
                <div className="w-24 h-24 mx-auto bg-gray-600 rounded-full mb-4"></div>
                <h3 className="text-lg font-medium text-white">Diseño UX/UI</h3>
                <p className="text-gray-400">Asegurando una experiencia de usuario excepcional</p>
              </div>
            </div>
          </section>
          
          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">Contáctanos</h2>
            <p className="leading-relaxed">
              ¿Tienes alguna pregunta o sugerencia? Nos encantaría saber de ti. Puedes ponerte en contacto con nosotros a través 
              de nuestra página de <a href="/contacto" className="text-indigo-400 hover:underline">contacto</a> o seguirnos 
              en nuestras redes sociales para mantenerte actualizado sobre las últimas novedades.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default SobreNosotros;