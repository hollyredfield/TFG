import React, { useState, useEffect } from 'react';
import { FaUsers, FaTags, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { adminService } from '../../services/mockAdmin';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    offers: 0,
    comments: 0,
    reports: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, offers, comments, reports] = await Promise.all([
          adminService.getUsers(),
          adminService.getOffers(),
          adminService.getComments(),
          adminService.getReports()
        ]);

        setStats({
          users: users.length,
          offers: offers.length,
          comments: comments.length,
          reports: reports.filter(r => r.status === 'pending').length
        });
      } catch (error) {
        toast.error('Error al cargar las estadísticas');
      }
    };

    loadStats();
  }, []);

  const recentActivity = [
    { type: 'user', action: 'registro', user: 'María G.', time: '2 minutos' },
    { type: 'offer', action: 'nueva oferta', user: 'Carlos R.', time: '5 minutos' },
    { type: 'report', action: 'reporte', user: 'Ana M.', time: '10 minutos' },
    { type: 'comment', action: 'comentario', user: 'Juan P.', time: '15 minutos' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Usuarios</h3>
              <p className="text-2xl font-semibold">{stats.users}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FaTags className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Ofertas</h3>
              <p className="text-2xl font-semibold">{stats.offers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaChartLine className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Comentarios</h3>
              <p className="text-2xl font-semibold">{stats.comments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Reportes</h3>
              <p className="text-2xl font-semibold">{stats.reports}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center">
                <div className={`p-2 rounded-lg mr-4 ${
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'offer' ? 'bg-green-100' :
                  activity.type === 'report' ? 'bg-red-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'user' && <FaUsers className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'offer' && <FaTags className="h-5 w-5 text-green-600" />}
                  {activity.type === 'report' && <FaExclamationTriangle className="h-5 w-5 text-red-600" />}
                  {activity.type === 'comment' && <FaChartLine className="h-5 w-5 text-purple-600" />}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' - '}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500">Hace {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
