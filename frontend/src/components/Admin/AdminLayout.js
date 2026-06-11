import React from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import '../../css/pages/Admin.css';

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

function AdminLayout() {
  const navigate = useNavigate();
  const username = safeGetItem('adminUsername');

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUsername');
    } catch (e) {}
    navigate('/admin/login');
  };

  if (!safeGetItem('adminToken')) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          Dashboard Admin
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/reservations" className={({ isActive }) => isActive ? 'active' : ''}>
            Quản lý Đặt bàn
          </NavLink>
          <NavLink to="/admin/menu" className={({ isActive }) => isActive ? 'active' : ''}>
            Quản lý Thực đơn
          </NavLink>
          <NavLink to="/admin/set-menus" className={({ isActive }) => isActive ? 'active' : ''}>
            Quản lý Menu
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => isActive ? 'active' : ''}>
            Quản lý Sự kiện
          </NavLink>
          <NavLink to="/admin/press" className={({ isActive }) => isActive ? 'active' : ''}>
            Quản lý Truyền thông
          </NavLink>
        </nav>
        <div className="admin-footer">
          <p>Xin chào, {username}</p>
          <button onClick={handleLogout} className="admin-btn-logout">Đăng xuất</button>
        </div>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
