import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/pages/Admin.css';

function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { username, password, role });
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      if (!err.response) {
        setError('Không kết nối được Backend. Vui lòng kiểm tra lại server (npm start).');
      } else if (err.response.status === 404) {
        setError('Lỗi 404: API chưa được cập nhật. Bạn vui lòng tắt hẳn và khởi động lại Backend.');
      } else {
        setError(err.response?.data?.error || 'Đăng ký thất bại');
      }
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <h2>Đăng Ký Tài Khoản</h2>
        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}
        <form onSubmit={handleRegister}>
          <div className="admin-form-group">
            <label>Tài khoản</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <label>Phân quyền</label>
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #eef2f6', background: '#f6f9fc', color: '#32325d' }}>
              <option value="user">User (Nhân viên)</option>
              <option value="admin">Admin (Quản trị viên)</option>
            </select>
          </div>
          <button type="submit" className="admin-btn">Đăng ký</button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Đã có tài khoản? <Link to="/admin/login" style={{ color: 'var(--primary)' }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminRegister;
