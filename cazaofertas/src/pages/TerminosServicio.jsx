import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const TerminosServicio = () => {
  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <Link 
          to="/"
          className="flex items-center text-primary hover:underline"
        >
          <FaArrowLeft className="mr-1" /> Volver al inicio
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Términos de Servicio</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">1. Aceptación de los términos</h2>
            <p className="text-gray-600 mb-4">
              Al acceder y utilizar CazaOfertas, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">2. Descripción del servicio</h2>
            <p className="text-gray-600 mb-4">
              CazaOfertas es una plataforma que permite a los usuarios descubrir, compartir y comentar ofertas de productos y servicios. Los usuarios pueden publicar ofertas, interactuar con otros usuarios y recibir notificaciones sobre ofertas relevantes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">3. Registro de cuenta</h2>
            <p className="text-gray-600 mb-4">
              Para acceder a ciertas funciones de la plataforma, deberás crear una cuenta. Te comprometes a proporcionar información precisa y mantenerla actualizada. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">4. Contenido del usuario</h2>
            <p className="text-gray-600 mb-4">
              Al publicar contenido en CazaOfertas, garantizas que:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Tienes el derecho de publicar dicho contenido</li>
              <li>El contenido es preciso y no es engañoso</li>
              <li>El contenido no infringe los derechos de terceros</li>
              <li>El contenido cumple con todas las leyes y regulaciones aplicables</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">5. Conducta del usuario</h2>
            <p className="text-gray-600 mb-4">
              Te comprometes a no:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600">
              <li>Publicar contenido falso o engañoso</li>
              <li>Acosar o intimidar a otros usuarios</li>
              <li>Usar la plataforma para fines ilegales</li>
              <li>Intentar acceder a cuentas de otros usuarios</li>
              <li>Interferir con el funcionamiento normal del servicio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">6. Propiedad intelectual</h2>
            <p className="text-gray-600 mb-4">
              El servicio y su contenido original, características y funcionalidad son propiedad de CazaOfertas y están protegidos por leyes de propiedad intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">7. Modificaciones del servicio</h2>
            <p className="text-gray-600 mb-4">
              Nos reservamos el derecho de modificar o descontinuar el servicio en cualquier momento, con o sin previo aviso. No seremos responsables ante ti ni ante terceros por cualquier modificación, suspensión o interrupción del servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">8. Limitación de responsabilidad</h2>
            <p className="text-gray-600 mb-4">
              CazaOfertas no será responsable de ningún daño indirecto, incidental, especial o consecuente que surja del uso o la imposibilidad de usar el servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">9. Contacto</h2>
            <p className="text-gray-600">
              Si tienes alguna pregunta sobre estos Términos de Servicio, por favor contáctanos a través de la sección de{' '}
              <Link to="/contacto" className="text-primary hover:underline">
                Contacto
              </Link>.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Última actualización: 23 de Mayo de 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default TerminosServicio;
