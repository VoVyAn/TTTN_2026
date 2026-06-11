import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../css/pages/AdminBooking.css';

function AdminBookingLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post((process.env.REACT_APP_API_URL || '') + '/api/auth/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUsername', res.data.username);
      localStorage.setItem('adminRole', res.data.role || 'user');
      window.location.href = '/admin/reservations/booking';
    } catch (err) {
      if (!err.response) {
        setError('Không kết nối được Backend. Vui lòng kiểm tra server.');
      } else {
        setError(err.response?.data?.error || 'Đăng nhập thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bk-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bk-glass-container" style={{ width: '100%', maxWidth: '400px', padding: '40px', height: 'auto' }}>
        <h2 style={{ textAlign: 'center', color: '#32325d', marginBottom: '30px', fontWeight: 700 }}>Staff Login</h2>
        {error && <div style={{ color: '#f5365c', textAlign: 'center', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="bk-form-group">
            <label>Tài khoản</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="bk-form-group">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} style={{ 
            background: loading ? '#8898aa' : '#5e72e4', color: '#fff', border: 'none', padding: '14px', 
            borderRadius: '4px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' 
          }}>
            {loading ? 'Đang xử lý...' : 'Truy cập Bảng điều khiển'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminBookingLogin;
