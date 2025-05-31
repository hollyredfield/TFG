import React from 'react';
import { motion } from 'framer-motion';

const PoliticaPrivacidad = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-8 border-b border-gray-700 pb-4">Política de Privacidad</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <p className="text-sm italic mb-4 text-gray-400">
              Última actualización: 1 de mayo, 2025
            </p>
            
            <p className="leading-relaxed mb-4">
              En CazaOfertas, accesible desde cazaofertas.com, una de nuestras principales prioridades es la privacidad de 
              nuestros visitantes. Este documento de Política de Privacidad contiene los tipos de información que es 
              recopilada y registrada por CazaOfertas y cómo la utilizamos.
            </p>
            
            <p className="leading-relaxed">
              Si tienes preguntas adicionales o requieres más información sobre nuestra Política de Privacidad, 
              no dudes en contactarnos a través de nuestra página de contacto.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">1. Información que recopilamos</h2>
            <p className="leading-relaxed mb-4">
              Cuando te registras en nuestro sitio, se te puede pedir que introduzcas cierta información:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tu nombre y apellidos</li>
              <li>Tu dirección de correo electrónico</li>
              <li>Tu nombre de usuario y contraseña</li>
              <li>Opcionalmente, tu imagen de perfil</li>
            </ul>
            <p className="leading-relaxed mt-4">
              También podemos recopilar información sobre tu actividad en la plataforma, como las ofertas que has publicado, 
              guardado o votado, y tus interacciones con otros usuarios.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">2. Cómo utilizamos tu información</h2>
            <p className="leading-relaxed mb-2">
              Utilizamos la información que recopilamos de varias formas, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Proporcionar, operar y mantener nuestra plataforma</li>
              <li>Mejorar, personalizar y expandir nuestra plataforma</li>
              <li>Comprender y analizar cómo utilizas nuestra plataforma</li>
              <li>Desarrollar nuevos productos, servicios, características y funcionalidades</li>
              <li>Comunicarnos contigo, ya sea directamente o a través de uno de nuestros socios, incluso para servicio al cliente</li>
              <li>Enviarte actualizaciones y otra información relacionada con la plataforma</li>
              <li>Encontrar y prevenir el fraude</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">3. Archivos de registro</h2>
            <p className="leading-relaxed">
              CazaOfertas sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los 
              visitantes cuando visitan sitios web. Todas las empresas de alojamiento hacen esto como parte de los 
              servicios de análisis. La información recopilada por los archivos de registro incluye direcciones de 
              protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), 
              fecha y hora, páginas de referencia/salida y posiblemente el número de clics. 
              Esta información se utiliza para analizar tendencias, administrar el sitio, rastrear el movimiento 
              del usuario en el sitio y recopilar información demográfica.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">4. Cookies y web beacons</h2>
            <p className="leading-relaxed">
              Como cualquier otro sitio web, CazaOfertas utiliza 'cookies'. Estas cookies se utilizan para almacenar 
              información, incluyendo las preferencias de los visitantes y las páginas del sitio web que el visitante 
              accedió o visitó. La información se utiliza para optimizar la experiencia de los usuarios al personalizar 
              el contenido de nuestra página web según el tipo de navegador de los visitantes y/u otra información.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">5. Socios publicitarios</h2>
            <p className="leading-relaxed">
              Los servidores o redes publicitarias de terceros utilizan tecnologías como cookies, JavaScript o web beacons 
              que se utilizan en sus respectivos anuncios y enlaces que aparecen en CazaOfertas. Reciben tu dirección IP 
              directamente cuando esto ocurre. Estas tecnologías se utilizan para medir la efectividad de sus campañas 
              publicitarias y/o para personalizar el contenido publicitario que ves en los sitios web que visitas.
            </p>
            <p className="leading-relaxed mt-4">
              Ten en cuenta que CazaOfertas no tiene acceso ni control sobre estas cookies que utilizan los anunciantes de terceros.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">6. Derechos RGPD</h2>
            <p className="leading-relaxed mb-4">
              Si eres residente de la Unión Europea, tienes los siguientes derechos de protección de datos:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>El derecho a acceder, actualizar o eliminar la información que tenemos sobre ti.</li>
              <li>El derecho de rectificación.</li>
              <li>El derecho a oponerte.</li>
              <li>El derecho de restricción.</li>
              <li>El derecho a la portabilidad de datos.</li>
              <li>El derecho a retirar el consentimiento.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">7. Información para menores</h2>
            <p className="leading-relaxed">
              Otra parte de nuestra prioridad es agregar protección para niños mientras usan Internet. 
              Alentamos a los padres y tutores a observar, participar y/o monitorear y guiar su actividad en línea.
              CazaOfertas no recopila deliberadamente ninguna información de identificación personal de niños menores 
              de 16 años. Si crees que tu hijo proporcionó este tipo de información en nuestro sitio web, 
              te recomendamos encarecidamente que te pongas en contacto con nosotros de inmediato y haremos todo lo 
              posible para eliminar rápidamente dicha información de nuestros registros.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-indigo-400 mb-3">8. Cambios en esta política de privacidad</h2>
            <p className="leading-relaxed">
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Por lo tanto, se te aconseja revisar esta 
              página periódicamente para cualquier cambio. Te notificaremos de cualquier cambio publicando la nueva 
              Política de Privacidad en esta página. Estos cambios son efectivos inmediatamente después de que se publican 
              en esta página.
            </p>
          </section>
          
          <section className="border-t border-gray-700 pt-6">
            <p className="leading-relaxed">
              Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos a través de nuestra 
              página de <a href="/contacto" className="text-indigo-400 hover:underline">contacto</a>.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PoliticaPrivacidad;