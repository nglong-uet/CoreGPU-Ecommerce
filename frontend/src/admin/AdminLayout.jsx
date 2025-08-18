import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

export default function AdminLayout() {
  return (
    <div className="admin-layout" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="admin-main-content" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}
