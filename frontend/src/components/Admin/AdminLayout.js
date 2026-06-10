import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../css/pages/Admin.css';

function AdminLayout() {
  const navigate = useNavigate();
  const username = localStorage.getItem('adminUsername');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  if (!localStorage.getItem('adminToken')) {
    navigate('/admin/login');
    return null;
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
