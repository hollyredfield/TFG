import React from 'react';
import { Outlet } from 'react-router-dom';
import { FaChartBar, FaUsers, FaTags, FaComments, FaFlag } from 'react-icons/fa';
import AdminSidebar from '../../components/Admin/AdminSidebar';

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

export default Admin;
