import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await api.get('/reservations');
      setReservations(res.data);
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải danh sách đặt bàn'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}`, { status }, { headers: getAuthHeaders() });
      fetchReservations();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi cập nhật trạng thái'));
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn này?')) return;
    try {
      await api.delete(`/reservations/${id}`, { headers: getAuthHeaders() });
      fetchReservations();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi xóa đơn đặt bàn'));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Quản lý Đặt bàn</h1>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên khách</th>
              <th>SĐT</th>
              <th>Ngày & Giờ</th>
              <th>Số lượng</th>
              <th>Ghi chú</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res._id}>
                <td>{res.customer_name}</td>
                <td>{res.phone}</td>
                <td>{res.date} {res.time}</td>
                <td>{res.guests} người</td>
                <td>{res.note}</td>
                <td>
                  <select
                    value={res.status}
                    onChange={(e) => updateStatus(res._id, e.target.value)}
                    style={{
                      padding: '5px',
                      background: 'var(--bg-card)',
                      color: res.status === 'confirmed' ? '#51cf66' : res.status === 'cancelled' ? '#ff6b6b' : '#fcc419',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>
                  <button className="btn-small btn-delete" onClick={() => deleteReservation(res._id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Chưa có đơn đặt bàn nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReservations;
