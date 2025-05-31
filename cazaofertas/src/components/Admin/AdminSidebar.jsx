import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChartBar,
  FaUsers,
  FaTags,
  FaComments,
  FaFlag,
  FaBox,
  FaBell,
  FaCog
} from 'react-icons/fa';

const adminMenuItems = [
  { path: '/admin', icon: FaChartBar, label: 'Dashboard', exact: true },
  { path: '/admin/users', icon: FaUsers, label: 'Usuarios' },
  { path: '/admin/offers', icon: FaTags, label: 'Ofertas' },
  { path: '/admin/comments', icon: FaComments, label: 'Comentarios' },
  { path: '/admin/reports', icon: FaFlag, label: 'Reportes' },
  { path: '/admin/notifications', icon: FaBell, label: 'Notificaciones' },
  { path: '/admin/settings', icon: FaCog, label: 'Configuración' }
];

const AdminSidebar = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-8">
          Panel Admin
        </h1>
        
        <nav>
          <ul className="space-y-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
