import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';
import { io } from 'socket.io-client';

const COLUMNS = [
  { id: 'customer_name', label: 'Tên khách' },
  { id: 'phone', label: 'SĐT' },
  { id: 'date', label: 'Ngày' },
  { id: 'time', label: 'Giờ' },
  { id: 'guests', label: 'Số lượng' },
  { id: 'note', label: 'Ghi chú' },
  { id: 'code', label: 'Mã đặt bàn' },
  { id: 'status', label: 'Trạng thái' }
];

const formatDate = (dateString) => {
  if (!dateString) return '';
  if (!dateString.includes('-')) return dateString;
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowColumnFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    // Khởi tạo kết nối WebSockets
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

    // Lắng nghe sự kiện có đơn đặt bàn mới
    socket.on('new_reservation', (newRes) => {
      // Khi có đơn mới, tải lại danh sách để tự động cập nhật
      fetchReservations();
    });

    // Ngắt kết nối khi chuyển trang
    return () => {
      socket.disconnect();
    };
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

  const filteredReservations = reservations.filter(res => {
    const term = searchTerm.toLowerCase();
    const code = res._id.slice(-6).toLowerCase();
    const matchesSearch = (
      res.customer_name.toLowerCase().includes(term) ||
      res.phone.includes(term) ||
      code.includes(term) ||
      (res.note && res.note.toLowerCase().includes(term))
    );

    let matchesDate = true;
    if (startDate || endDate) {
      // res.date is YYYY-MM-DD format
      const resDate = new Date(res.date).getTime();
      if (startDate) {
        const sDate = new Date(startDate).getTime();
        if (resDate < sDate) matchesDate = false;
      }
      if (endDate) {
        const eDate = new Date(endDate).getTime();
        if (resDate > eDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesDate;
  });

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    }
    if (sortConfig.key === 'time') {
      if (a.time < b.time) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a.time > b.time) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const activeColumnCount = Object.values(visibleColumns).filter(Boolean).length + 1; // +1 for Hành động

  const toggleColumn = (id) => {
    setVisibleColumns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Quản lý Đặt bàn</h1>
      </div>

      <div style={{ 
        display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', 
        background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', 
        border: '1px solid var(--border-color)', flexWrap: 'wrap', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Lọc theo khoảng ngày:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem' }}>Từ ngày:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
            />
          </div>
          <span style={{ color: 'var(--text-main)' }}>-</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem' }}>Đến ngày:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: '#fff' }}
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              style={{ 
                padding: '6px 12px', background: 'transparent', 
                color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '4px', cursor: 'pointer' 
              }}
            >
              Xóa lọc
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Tìm kiếm tên, SĐT, mã đặt bàn..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '10px 15px', 
              borderRadius: '6px', 
              border: '1px solid var(--border-color)', 
              background: 'rgba(255,255,255,0.05)', 
              color: 'var(--text-main)', 
              width: '250px' 
            }}
          />
          <div style={{ position: 'relative' }} ref={filterRef}>
            <button 
              className="admin-btn-logout" 
              style={{ margin: 0, padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '5px' }} 
              onClick={() => setShowColumnFilter(!showColumnFilter)}
            >
              Cột hiển thị ▼
            </button>
            {showColumnFilter && (
              <div style={{ 
                position: 'absolute', 
                right: 0, 
                top: '100%', 
                marginTop: '8px', 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                padding: '15px', 
                zIndex: 100,
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', fontSize: '1rem' }}>Chọn cột hiển thị</h4>
                {COLUMNS.map(col => (
                  <label key={col.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={visibleColumns[col.id]}
                      onChange={() => toggleColumn(col.id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table" style={{ tableLayout: 'auto', width: '100%' }}>
          <thead>
            <tr>
              {visibleColumns.customer_name && <th>Tên khách</th>}
              {visibleColumns.phone && <th>SĐT</th>}
              {visibleColumns.date && (
                <th onClick={() => handleSort('date')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Ngày {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
              )}
              {visibleColumns.time && (
                <th onClick={() => handleSort('time')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Giờ {sortConfig.key === 'time' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
              )}
              {visibleColumns.guests && <th>Số lượng</th>}
              {visibleColumns.note && <th>Ghi chú</th>}
              {visibleColumns.code && <th>Mã đặt bàn</th>}
              {visibleColumns.status && <th>Trạng thái</th>}
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedReservations.map((res) => (
              <tr key={res._id}>
                {visibleColumns.customer_name && <td>{res.customer_name}</td>}
                {visibleColumns.phone && <td>{res.phone}</td>}
                {visibleColumns.date && <td>{formatDate(res.date)}</td>}
                {visibleColumns.time && <td>{res.time}</td>}
                {visibleColumns.guests && <td>{res.guests} người</td>}
                {visibleColumns.note && <td>{res.note}</td>}
                {visibleColumns.code && <td><strong style={{ color: 'var(--primary)' }}>{res._id.slice(-6).toUpperCase()}</strong></td>}
                {visibleColumns.status && <td>
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
                </td>}
                <td>
                  <button className="btn-small btn-delete" onClick={() => deleteReservation(res._id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {sortedReservations.length === 0 && (
              <tr><td colSpan={activeColumnCount} style={{ textAlign: 'center' }}>Không tìm thấy đơn đặt bàn nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReservations;
