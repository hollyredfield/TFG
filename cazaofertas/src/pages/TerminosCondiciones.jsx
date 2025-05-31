import React from 'react';
import { motion } from 'framer-motion';

const TerminosCondiciones = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8 border-b border-gray-700 pb-4">Términos y Condiciones</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <p className="text-sm italic mb-4 text-gray-400">
              Última actualización: 1 de mayo, 2025
            </p>
            
            <p className="leading-relaxed mb-4">
              Bienvenido a CazaOfertas. Estos términos y condiciones describen las reglas y regulaciones 
              para el uso del sitio web de CazaOfertas.
            </p>
            
            <p className="leading-relaxed">
              Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad. 
              No continúes usando el sitio web de CazaOfertas si no aceptas todos los términos y condiciones 
              establecidos en esta página.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">1. Definiciones</h2>
            <p className="leading-relaxed mb-2">
              Para los fines de estos Términos y Condiciones:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Usuario"</strong> se refiere a la persona que accede a CazaOfertas y acepta estos términos.</li>
              <li><strong>"Contenido"</strong> se refiere a toda la información, textos, imágenes y material disponible en nuestro sitio.</li>
              <li><strong>"Ofertas"</strong> se refiere a las promociones, descuentos y oportunidades de ahorro compartidas en la plataforma.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">2. Licencia de uso</h2>
            <p className="leading-relaxed mb-4">
              A menos que se indique lo contrario, CazaOfertas y/o sus licenciatarios poseen los derechos de propiedad intelectual 
              de todo el material en CazaOfertas. Todos los derechos de propiedad intelectual están reservados.
            </p>
            <p className="leading-relaxed">
              Puedes ver y/o imprimir páginas desde el sitio para tu uso personal, sujeto a las restricciones 
              establecidas en estos términos y condiciones.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">3. Restricciones</h2>
            <p className="leading-relaxed mb-2">
              Específicamente acordas que no:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Publicarás material falso, engañoso, ofensivo o fraudulento en CazaOfertas.</li>
              <li>Utilizarás CazaOfertas para fines ilegales, engañosos, maliciosos o discriminatorios.</li>
              <li>Interferirás con el funcionamiento normal del sitio o cargarás virus u otro código malicioso.</li>
              <li>Recopilarás información o contenido de los usuarios sin su consentimiento.</li>
              <li>Venderás, licenciarás o comprarás cualquier cuenta o dato obtenido de CazaOfertas.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">4. Publicación de ofertas</h2>
            <p className="leading-relaxed mb-4">
              CazaOfertas permite a los usuarios compartir y publicar ofertas encontradas en línea. 
              Al publicar una oferta, garantizas que:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>La oferta es legítima y está disponible en el momento de la publicación.</li>
              <li>Has verificado la información proporcionada y es precisa según tu mejor conocimiento.</li>
              <li>No estás intentando promocionar tus propios productos o servicios sin divulgación adecuada.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">5. Exactitud de las ofertas</h2>
            <p className="leading-relaxed">
              Nos esforzamos por garantizar que todas las ofertas publicadas en CazaOfertas sean precisas y estén actualizadas. 
              Sin embargo, no podemos garantizar la exactitud, integridad o actualidad de las ofertas compartidas 
              por los usuarios. Las ofertas pueden expirar o cambiar sin previo aviso, y no somos responsables por 
              cualquier pérdida o inconveniencia que pueda surgir como resultado.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">6. Enlaces a terceros</h2>
            <p className="leading-relaxed">
              Nuestro sitio puede contener enlaces a sitios web de terceros. No tenemos control sobre el contenido y las prácticas 
              de estos sitios y no podemos aceptar responsabilidad por sus respectivas políticas de privacidad. 
              Te recomendamos leer las políticas de privacidad de cualquier sitio web que visites a través de enlaces en nuestro sitio.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">7. Modificaciones</h2>
            <p className="leading-relaxed">
              Podemos revisar estos términos de servicio del sitio web en cualquier momento sin previo aviso. 
              Al usar este sitio web, aceptas estar sujeto a la versión actual de estos términos y condiciones.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">8. Ley aplicable</h2>
            <p className="leading-relaxed">
              Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes de España, 
              y te sometes irrevocablemente a la jurisdicción exclusiva de los tribunales de dicho estado o localidad.
            </p>
          </section>
          
          <section className="border-t border-gray-700 pt-6">
            <p className="leading-relaxed">
              Si tienes alguna pregunta sobre estos términos y condiciones, por favor contáctanos a través de nuestra 
              página de <a href="/contacto" className="text-indigo-400 hover:underline">contacto</a>.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default TerminosCondiciones;