import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/pages/Admin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUsername', res.data.username);
      localStorage.setItem('adminRole', res.data.role || 'user');
      navigate('/admin/reservations');
    } catch (err) {
      if (!err.response) {
        setError('Không kết nối được Backend. Vui lòng kiểm tra lại server (npm start).');
      } else if (err.response.status === 404) {
        setError('Lỗi 404: API chưa được cập nhật. Bạn vui lòng tắt hẳn và khởi động lại Backend.');
      } else {
        setError(err.response?.data?.error || 'Đăng nhập thất bại');
      }
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <h2>Đăng Nhập Quản Trị</h2>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label>Tài khoản</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ margin: 0 }}>Mật khẩu</label>
              <span 
                style={{ fontSize: '0.85rem', color: 'var(--primary)', cursor: 'pointer' }}
                onClick={() => alert('Vui lòng liên hệ Quản trị viên hệ thống để được hỗ trợ cấp lại mật khẩu.')}
              >
                Quên mật khẩu?
              </span>
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="admin-btn">Đăng nhập</button>
        </form>
        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Chưa có tài khoản? <Link to="/admin/register" style={{ color: 'var(--primary)' }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
