import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaUsers, FaShoppingBag, FaComments, FaFlag, FaBell, FaCog } from 'react-icons/fa';

const AdminNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/admin', icon: FaChartBar, label: 'Dashboard' },
    { path: '/admin/usuarios', icon: FaUsers, label: 'Usuarios' },
    { path: '/admin/ofertas', icon: FaShoppingBag, label: 'Ofertas' },
    { path: '/admin/comentarios', icon: FaComments, label: 'Comentarios' },
    { path: '/admin/reportes', icon: FaFlag, label: 'Reportes' },
    { path: '/admin/notificaciones', icon: FaBell, label: 'Notificaciones' },
    { path: '/admin/ajustes', icon: FaCog, label: 'Ajustes' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-4 inline-flex items-center min-w-fit ${
                currentPath === path
                  ? 'border-b-2 border-primary text-primary dark:text-primary-light dark:border-primary-light font-medium'
                  : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
