import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

export function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    throw new Error('NOT_AUTHENTICATED');
  }
  return { Authorization: `Bearer ${token}` };
}

export function handleAdminError(error, defaultMessage = 'Có lỗi xảy ra') {
  const loginPath = window.location.pathname.includes('/booking') ? '/admin/reservations/booking/login' : '/admin/login';
  
  if (error.message === 'NOT_AUTHENTICATED') {
    window.location.href = loginPath;
    return defaultMessage;
  }
  const status = error.response?.status;
  if (status === 401 || status === 403) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    window.location.href = loginPath;
    return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
  }
  return error.response?.data?.error || defaultMessage;
}
