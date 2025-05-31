// Admin.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import { getImagenBruta } from '../utils/imageHelpers';

const Admin = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

// Componente para los botones de pestañas
const TabButton = ({ active, onClick, icon, label }) => {
  return (
    <button 
      className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 border-transparent ${
        active
          ? 'text-orange-500 border-orange-500'
          : 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
};

// Componente para el dashboard principal
const AdminDashboard = () => {
  const stats = [
    { label: 'Ofertas Activas', value: mockData.ofertas.length, icon: <FaTag className="text-blue-500" />, trend: '+5 hoy' },
    { label: 'Categorías Totales', value: mockData.categorias.length, icon: <FaList className="text-green-500" />, trend: '+1 nueva' },
    { label: 'Usuarios Registrados', value: 248, icon: <FaUser className="text-purple-500" />, trend: '+12 esta semana' },
    { label: 'Tiendas Asociadas', value: 52, icon: <FaStore className="text-orange-500" />, trend: 'Verificadas' },
    { label: 'Imágenes Validadas', value: mockData.ofertas.length - 3, icon: <FaImage className="text-teal-500" />, trend: '3 pendientes' },
    { label: 'Tickets de Soporte', value: 15, icon: <FaCog className="text-red-500" />, trend: '2 urgentes' },
  ];

  const recentActivities = [
    { type: 'Nueva Oferta', description: 'iPhone 15 Pro Max 512GB añadido por Tienda Ejemplo Alfa', time: 'Hace 15 min', icon: <FaTag className="text-blue-400" /> },
    { type: 'Nuevo Usuario', description: 'usuario_nuevo_007 se ha registrado', time: 'Hace 1 hora', icon: <FaUser className="text-purple-400" /> },
    { type: 'Comentario', description: 'Nuevo comentario en "Oferta Portátil Gaming ASUS ROG"', time: 'Hace 3 horas', icon: <FaChartBar className="text-yellow-400" /> },
    { type: 'Imagen Validada', description: 'Imagen para "Smart TV Samsung 55\" validada correctamente', time: 'Hace 5 horas', icon: <FaImage className="text-teal-400" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-[500px]">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Resumen General del Sistema</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-full bg-gray-100 mr-4">
                {React.cloneElement(stat.icon, { className: stat.icon.props.className + ' h-6 w-6' })}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-right">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Actividad Reciente</h3>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{activity.type}: <span className="font-normal text-gray-600">{activity.description}</span></p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Accesos Rápidos</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
              <FaTag className="mr-2"/> Añadir Oferta
            </button>
            <button className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
              <FaList className="mr-2"/> Gestionar Categorías
            </button>
            <button className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
              <FaUser className="mr-2"/> Ver Usuarios
            </button>
            <button className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
              <FaChartBar className="mr-2"/> Ver Analíticas
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Utiliza estos botones para acceder rápidamente a las funciones más comunes del panel de administración.
          </p>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm mt-8 text-center">
        Este es un resumen del estado actual de CazaOfertas. Para más detalles, navega a las secciones específicas usando el menú superior.
      </p>
    </div>
  );
};

// Placeholder para gestión de productos
const ProductsManagement = () => {
  const mockProducts = mockData.ofertas.slice(0, 5).map(o => ({ ...o, stock: Math.floor(Math.random() * 100), status: Math.random() > 0.5 ? 'Activo' : 'Inactivo' }));

  return (
  <div className="p-6 bg-gray-50 min-h-[500px]">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-700">Gestión de Productos y Ofertas</h2>
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center">
        <FaTag className="mr-2"/> Añadir Nuevo Producto
      </button>
    </div>
    <div className="mb-6 flex space-x-4">
        <input 
          type="text" 
          placeholder="Buscar por nombre, ID, categoría..." 
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <select className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Todas las Categorías</option>
            {mockData.categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
        </select>
        <select className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Todos los Estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
        </select>
    </div>
    <p className="text-gray-600 mb-6">
      Aquí podrás añadir, editar, y eliminar productos y ofertas de la plataforma. Mantén la información de los productos actualizada, incluyendo precios, descripciones, imágenes y stock. Las ofertas bien gestionadas son clave para atraer y retener usuarios.
    </p>
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Producto</th>
            <th className="py-3 px-6 text-left">Precio Oferta</th>
            <th className="py-3 px-6 text-left">Categoría</th>
            <th className="py-3 px-6 text-left">¿Oferta Caliente?</th>
            <th className="py-3 px-6 text-center">Stock</th>
            <th className="py-3 px-6 text-center">Estado</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {mockProducts.map((product) => (
            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
              <td className="py-4 px-6 text-left whitespace-nowrap">{product.id}</td>
              <td className="py-4 px-6 text-left">                <div className="flex items-center">
                  <img
                    src={getImagenBruta(product.url_imagen, product.titulo, product.categoriaId)}
                    alt={product.titulo}
                    className="w-10 h-10 rounded-md mr-3 object-cover"
                  />
                  <span className="font-medium">{product.titulo}</span>
                </div>
              </td>
              <td className="py-4 px-6 text-left">{product.precio_oferta} €</td>
              <td className="py-4 px-6 text-left">{mockData.categorias.find(c => c.id === product.categoriaId)?.nombre || 'N/A'}</td>
              <td className="py-4 px-6 text-left">{product.isHot ? 'Sí' : 'No'}</td>
              <td className="py-4 px-6 text-center">{product.stock}</td>
              <td className="py-4 px-6 text-center">
                <span className={`py-1 px-3 rounded-full text-xs ${product.status === 'Activo' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {product.status}
                </span>
              </td>
              <td className="py-4 px-6 text-center">
                <button className="text-blue-500 hover:text-blue-700 mr-2 transition-colors">Editar</button>
                <button className="text-red-500 hover:text-red-700 transition-colors">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Simulación de Paginación */}
    <div className="py-6 flex justify-between items-center">
        <span className="text-sm text-gray-600">Mostrando 1-5 de {mockData.ofertas.length} productos</span>
        <div className="flex space-x-1">
            <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 text-sm">Anterior</button>
            <button className="px-3 py-1 border rounded-md bg-orange-500 text-white text-sm">1</button>            <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 text-sm">2</button>
            <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 text-sm">3</button>
            <button className="px-3 py-1 border rounded-md bg-white hover:bg-gray-100 text-sm">Siguiente</button>
        </div>
    </div>
    <p className="mt-4 text-sm text-gray-500">
      Esta tabla muestra una selección de productos. Utiliza los filtros y la paginación para navegar por todo el catálogo.
    </p>
  </div>
  );
};

// Placeholder para gestión de categorías
const CategoriesManagement = () => {
  const mockCategories = mockData.categorias.map(cat => ({
    ...cat, 
    productCount: mockData.ofertas.filter(o => o.categoriaId === cat.id).length
  }));
  return (
  <div className="p-6 bg-gray-50 min-h-[500px]">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-700">Gestión de Categorías</h2>
      <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center">
        <FaList className="mr-2"/> Añadir Nueva Categoría
      </button>
    </div>
    <p className="text-gray-600 mb-6">
      Organiza y gestiona las categorías de productos. Una estructura de categorías clara y bien definida ayuda a los usuarios a encontrar fácilmente lo que buscan. Puedes añadir nuevas categorías, editar las existentes, o eliminarlas (asegúrate de reasignar los productos asociados primero).
    </p>
    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Nombre de Categoría</th>
            <th className="py-3 px-6 text-center">Nº de Productos</th>
            <th className="py-3 px-6 text-center">Icono</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {mockCategories.map((category) => (
            <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
              <td className="py-4 px-6 text-left whitespace-nowrap">{category.id}</td>
              <td className="py-4 px-6 text-left font-medium">{category.nombre}</td>
              <td className="py-4 px-6 text-center">{category.productCount}</td>
              <td className="py-4 px-6 text-center text-2xl">{category.icono}</td>
              <td className="py-4 px-6 text-center">
                <button className="text-blue-500 hover:text-blue-700 mr-2 transition-colors">Editar</button>
                <button className="text-red-500 hover:text-red-700 transition-colors">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="mt-6 text-sm text-gray-500">
      Considera la posibilidad de permitir reordenar las categorías para destacar las más populares o relevantes según la temporada.
    </p>
  </div>
  );
};

// Placeholder para gestión de tiendas
const StoresManagement = () => (
  <div className="p-6 bg-gray-50 min-h-[400px]">
    <h2 className="text-xl font-semibold text-gray-700 mb-6">Gestión de Tiendas</h2>
    <div className="mb-6">
      <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center">
        <FaStore className="mr-2"/> Añadir Nueva Tienda
      </button>
    </div>
    <p className="text-gray-600 mb-4">
      Administra las tiendas asociadas a la plataforma. Puedes añadir nuevas tiendas, actualizar la información de las existentes o eliminarlas si ya no colaboran con CazaOfertas. Asegúrate de que la información de cada tienda (nombre, URL, logo) esté siempre actualizada para proporcionar la mejor experiencia a los usuarios.
    </p>
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Nombre</th>
            <th className="py-3 px-6 text-left">URL</th>
            <th className="py-3 px-6 text-center">Ofertas Activas</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {/* Ejemplo de tienda - Debería venir de datos reales o mock */}
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">STORE-001</td>
            <td className="py-3 px-6 text-left">Tienda Ejemplo Alfa</td>
            <td className="py-3 px-6 text-left"><a href="#" className="text-blue-500 hover:underline">ejemploalfa.com</a></td>
            <td className="py-3 px-6 text-center">120</td>
            <td className="py-3 px-6 text-center">
              <button className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
              <button className="text-red-500 hover:text-red-700">Eliminar</button>
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-100 bg-gray-50">
            <td className="py-3 px-6 text-left whitespace-nowrap">STORE-002</td>
            <td className="py-3 px-6 text-left">Ofertas Beta</td>
            <td className="py-3 px-6 text-left"><a href="#" className="text-blue-500 hover:underline">ofertasbeta.es</a></td>
            <td className="py-3 px-6 text-center">85</td>
            <td className="py-3 px-6 text-center">
              <button className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
              <button className="text-red-500 hover:text-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="mt-6 text-sm text-gray-500">
      Actualmente mostrando 2 tiendas de ejemplo. En un sistema real, esta tabla se poblaría dinámicamente.
    </p>
  </div>
);

// Placeholder para gestión de usuarios
const UsersManagement = () => (
  <div className="p-6 bg-gray-50 min-h-[400px]">
    <h2 className="text-xl font-semibold text-gray-700 mb-6">Gestión de Usuarios</h2>
     <div className="mb-6">
      <input 
        type="text" 
        placeholder="Buscar usuarios por nombre, email o ID..." 
        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>
    <p className="text-gray-600 mb-4">
      Gestiona todos los usuarios registrados en CazaOfertas. Desde aquí puedes ver detalles de los usuarios, modificar sus roles (por ejemplo, de usuario estándar a moderador o administrador), y tomar acciones como suspender o eliminar cuentas en caso de incumplimiento de las normas de la comunidad. Es crucial mantener una base de usuarios saludable para el buen funcionamiento de la plataforma.
    </p>
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID Usuario</th>
            <th className="py-3 px-6 text-left">Nombre de Usuario</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-center">Rol</th>
            <th className="py-3 px-6 text-center">Fecha de Registro</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {/* Ejemplo de usuario */}
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">USR-001</td>
            <td className="py-3 px-6 text-left">AdminUser</td>
            <td className="py-3 px-6 text-left">admin@cazaofertas.com</td>
            <td className="py-3 px-6 text-center"><span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs">Admin</span></td>
            <td className="py-3 px-6 text-center">2023-01-15</td>
            <td className="py-3 px-6 text-center">
              <button className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
              <button className="text-yellow-500 hover:text-yellow-700 mr-2">Suspender</button>
              <button className="text-red-500 hover:text-red-700">Eliminar</button>
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-100 bg-gray-50">
            <td className="py-3 px-6 text-left whitespace-nowrap">USR-002</td>
            <td className="py-3 px-6 text-left">UsuarioEjemplo</td>
            <td className="py-3 px-6 text-left">user@example.com</td>
            <td className="py-3 px-6 text-center"><span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs">Usuario</span></td>
            <td className="py-3 px-6 text-center">2023-03-22</td>
            <td className="py-3 px-6 text-center">
              <button className="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
              <button className="text-yellow-500 hover:text-yellow-700 mr-2">Suspender</button>
              <button className="text-red-500 hover:text-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
     <p className="mt-6 text-sm text-gray-500">
      La gestión de usuarios es crítica. Recuerda que los datos de email, registro e inicio de sesión son funcionales y se conectan a una base de datos real.
    </p>
  </div>
);

// Placeholder para Analíticas
const Analytics = () => (
  <div className="p-6 bg-gray-50 min-h-[400px]">
    <h2 className="text-xl font-semibold text-gray-700 mb-6">Analíticas de la Plataforma</h2>
    <p className="text-gray-600 mb-6">
      Visualiza las métricas clave y el rendimiento de CazaOfertas. Esta sección te proporciona una visión general del tráfico del sitio, la participación de los usuarios, las ofertas más populares, y mucho más. Utiliza estos datos para tomar decisiones informadas sobre estrategias de contenido, marketing y desarrollo de la plataforma.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Usuarios Activos Hoy</h3>
        <p className="text-3xl font-bold text-blue-600">1,234</p>
        <p className="text-sm text-green-500">+5% desde ayer</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Ofertas Publicadas (Mes)</h3>
        <p className="text-3xl font-bold text-green-600">567</p>
        <p className="text-sm text-gray-500">7 nuevas hoy</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Tasa de Conversión (Wishlist)</h3>
        <p className="text-3xl font-bold text-orange-600">12.5%</p>
        <p className="text-sm text-red-500">-0.5% desde la semana pasada</p>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Gráfico de Visitas (Últimos 30 días)</h3>
      {/* Aquí iría un componente de gráfico real, por ahora un placeholder */}
      <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
        <p className="text-gray-500">[Placeholder para Gráfico de Visitas]</p>
      </div>
    </div>
    <p className="mt-6 text-sm text-gray-500">
      Las analíticas son simuladas por ahora, pero en una implementación real se integrarían con servicios como Google Analytics o una solución de backend personalizada.
    </p>
  </div>
);

// Placeholder para Configuración
const Settings = () => (
  <div className="p-6 bg-gray-50 min-h-[400px]">
    <h2 className="text-xl font-semibold text-gray-700 mb-6">Configuración General</h2>
    <p className="text-gray-600 mb-6">
      Ajusta la configuración global de la plataforma CazaOfertas. Aquí puedes modificar parámetros importantes como el nombre del sitio, la configuración de notificaciones por defecto para los usuarios, activar o desactivar el modo mantenimiento, y gestionar integraciones con servicios de terceros.
    </p>
    <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
      <div>
        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Sitio</label>
        <input type="text" id="siteName" defaultValue="CazaOfertas" className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
      </div>
      <div>
        <label htmlFor="defaultEmail" className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto Principal</label>
        <input type="email" id="defaultEmail" defaultValue="contacto@cazaofertas.com" className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
      </div>
      <div className="flex items-center">
        <input id="maintenanceMode" type="checkbox" className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"/>
        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">Activar Modo Mantenimiento</label>
      </div>
       <div>
        <h3 className="text-md font-medium text-gray-800 mb-2">Umbrales de Notificación de Ofertas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="hotThreshold" className="block text-sm font-medium text-gray-700 mb-1">Votos para Oferta "Caliente"</label>
            <input type="number" id="hotThreshold" defaultValue="100" className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"/>
          </div>
          <div>
            <label htmlFor="superHotThreshold" className="block text-sm font-medium text-gray-700 mb-1">Votos para Oferta "Super Caliente"</label>
            <input type="number" id="superHotThreshold" defaultValue="250" className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"/>
          </div>
        </div>
      </div>
      <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out">
        Guardar Configuración
      </button>
    </div>
    <p className="mt-6 text-sm text-gray-500">
      Los cambios en esta sección afectarían la configuración global de la aplicación. Por ahora, son campos de ejemplo.
    </p>
  </div>
);


export default Admin;
