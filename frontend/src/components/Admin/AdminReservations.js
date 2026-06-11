import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';
import { io } from 'socket.io-client';

const COLUMNS = [
  { id: 'customer_name', label: 'Tên khách' },
  { id: 'phone', label: 'SĐT' },
  { id: 'email', label: 'Email' },
  { id: 'date', label: 'Ngày' },
  { id: 'time', label: 'Giờ' },
  { id: 'guests', label: 'Số lượng' },
  { id: 'table', label: 'Bàn' },
  { id: 'nationality', label: 'Quốc tịch' },
  { id: 'channel', label: 'Kênh' },
  { id: 'creator', label: 'Người tạo' },
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
  const navigate = useNavigate();
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
  const tableWrapperRef = useRef(null);
  const [editingRes, setEditingRes] = useState(null);
  
  // Drag to scroll states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tableWrapperRef.current.offsetLeft);
    setScrollLeft(tableWrapperRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tableWrapperRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableWrapperRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const [showAddChannelPrompt, setShowAddChannelPrompt] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const [showAddTablePrompt, setShowAddTablePrompt] = useState(false);
  const [newTableName, setNewTableName] = useState('');

  const [customChannels, setCustomChannels] = useState(() => {
    const saved = localStorage.getItem('bk_custom_channels');
    return saved ? JSON.parse(saved) : ['Website', 'Facebook', 'Instagram', 'Dinning City'];
  });

  const handleChannelChange = (e) => {
    const val = e.target.value;
    if (val === '__add_new__') {
      setShowAddChannelPrompt(true);
      setNewChannelName('');
    } else {
      setEditingRes({...editingRes, channel: val});
    }
  };

  const handleAddCustomChannel = () => {
    if (newChannelName && newChannelName.trim() !== '') {
      const formatted = newChannelName.trim();
      if (!customChannels.includes(formatted)) {
        const updatedChannels = [...customChannels, formatted];
        setCustomChannels(updatedChannels);
        localStorage.setItem('bk_custom_channels', JSON.stringify(updatedChannels));
      }
      setEditingRes({...editingRes, channel: formatted});
    } else {
      setEditingRes({...editingRes, channel: editingRes.channel || 'Website'});
    }
    setShowAddChannelPrompt(false);
  };

  const handleCancelAddChannel = () => {
    setEditingRes({...editingRes, channel: editingRes.channel || 'Website'});
    setShowAddChannelPrompt(false);
  };

  const [customTables, setCustomTables] = useState(() => {
    const saved = localStorage.getItem('bk_custom_tables');
    const defaultTables = [
      ...Array.from({ length: 20 }, (_, i) => `1${(i + 1).toString().padStart(2, '0')}`),
      ...Array.from({ length: 10 }, (_, i) => `2${(i + 1).toString().padStart(2, '0')}`),
      ...Array.from({ length: 10 }, (_, i) => `3${(i + 1).toString().padStart(2, '0')}`),
      ...Array.from({ length: 5 }, (_, i) => `4${(i + 1).toString().padStart(2, '0')}`)
    ];
    return saved ? JSON.parse(saved) : defaultTables;
  });

  const handleTableChange = (e) => {
    const val = e.target.value;
    if (val === '__add_new__') {
      setShowAddTablePrompt(true);
      setNewTableName('');
    } else {
      setEditingRes({...editingRes, table: val});
    }
  };

  const handleAddCustomTable = () => {
    if (newTableName && newTableName.trim() !== '') {
      const formatted = newTableName.trim();
      if (!customTables.includes(formatted)) {
        const updatedTables = [...customTables, formatted];
        setCustomTables(updatedTables);
        localStorage.setItem('bk_custom_tables', JSON.stringify(updatedTables));
      }
      setEditingRes({...editingRes, table: formatted});
    } else {
      setEditingRes({...editingRes, table: editingRes.table || ''});
    }
    setShowAddTablePrompt(false);
  };

  const handleCancelAddTable = () => {
    setEditingRes({...editingRes, table: editingRes.table || ''});
    setShowAddTablePrompt(false);
  };

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
    const socket = io(process.env.REACT_APP_API_URL || '', { path: '/socket.io' });

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

  const handleSaveEdit = async () => {
    try {
      await api.put(`/reservations/${editingRes._id}`, editingRes, { headers: getAuthHeaders() });
      setEditingRes(null);
      fetchReservations();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi lưu thay đổi'));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const filteredReservations = reservations.filter(res => {
    const term = searchTerm.toLowerCase();
    const code = res._id.slice(-6).toLowerCase();
    const matchesSearch = (
      (res.customer_name && res.customer_name.toLowerCase().includes(term)) ||
      (res.phone && res.phone.includes(term)) ||
      (res.email && res.email.toLowerCase().includes(term)) ||
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
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' });
      } else if (sortConfig.direction === 'desc') {
        setSortConfig({ key: null, direction: null });
      }
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  return (
    <div>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Quản lý Đặt bàn</h1>
        <button 
          onClick={() => navigate('/admin/reservations/booking')} 
          style={{ background: '#cda45e', color: '#1a1814', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Booking
        </button>
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

      <div 
        className="admin-table-wrapper"
        ref={tableWrapperRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: isDragging ? 'none' : 'auto', overflowX: 'auto' }}
      >
        <table className="admin-table admin-reservations-table" style={{ tableLayout: 'auto', width: '100%' }}>
          <thead>
            <tr>
              {visibleColumns.customer_name && <th>Tên khách</th>}
              {visibleColumns.phone && <th>SĐT</th>}
              {visibleColumns.email && <th>Email</th>}
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
              {visibleColumns.table && <th>Bàn</th>}
              {visibleColumns.nationality && <th>Quốc tịch</th>}
              {visibleColumns.channel && <th>Kênh</th>}
              {visibleColumns.creator && <th>Người tạo</th>}
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
                {visibleColumns.email && <td>{res.email}</td>}
                {visibleColumns.date && <td>{formatDate(res.date)}</td>}
                {visibleColumns.time && <td>{res.time}</td>}
                {visibleColumns.guests && <td>{res.guests} người</td>}
                {visibleColumns.table && <td>{res.table || '-'}</td>}
                {visibleColumns.nationality && <td>{res.nationality || '-'}</td>}
                {visibleColumns.channel && <td>{res.channel || 'Website'}</td>}
                {visibleColumns.creator && <td>{res.creator || ''}</td>}
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-small" style={{ background: '#fcc419', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setEditingRes({...res})}>Sửa</button>
                    <button className="btn-small btn-delete" onClick={() => deleteReservation(res._id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedReservations.length === 0 && (
              <tr><td colSpan={activeColumnCount} style={{ textAlign: 'center' }}>Không tìm thấy đơn đặt bàn nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editingRes && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '8px', width: '600px', maxWidth: '90%', border: '1px solid var(--primary)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Chỉnh sửa thông tin</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Tên khách hàng</label>
                <input style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.customer_name || ''} onChange={e => setEditingRes({...editingRes, customer_name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Số điện thoại</label>
                <input style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.phone || ''} onChange={e => setEditingRes({...editingRes, phone: e.target.value})} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Email</label>
                <input style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.email || ''} onChange={e => setEditingRes({...editingRes, email: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Số lượng khách</label>
                <input type="number" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.guests || ''} onChange={e => setEditingRes({...editingRes, guests: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Trạng thái</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.status || 'pending'} onChange={e => setEditingRes({...editingRes, status: e.target.value})}>
                  <option value="pending" style={{ color: '#000' }}>Chờ xác nhận</option>
                  <option value="confirmed" style={{ color: '#000' }}>Đã xác nhận</option>
                  <option value="completed" style={{ color: '#000' }}>Đã hoàn thành</option>
                  <option value="cancelled" style={{ color: '#000' }}>Đã hủy</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Ngày đặt</label>
                <input type="date" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.date || ''} onChange={e => setEditingRes({...editingRes, date: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Giờ đặt</label>
                <input type="time" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.time || ''} onChange={e => setEditingRes({...editingRes, time: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Bàn</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.table || ''} onChange={handleTableChange}>
                  <option value="" style={{ color: '#000' }}>-- Chọn Bàn --</option>
                  {Array.from(new Set([...customTables, editingRes.table].filter(Boolean))).map(t => (
                    <option key={t} value={t} style={{ color: '#000' }}>{t}</option>
                  ))}
                  <option value="__add_new__" style={{ color: '#000', fontWeight: 'bold', background: '#eef2f6' }}>+ Thêm mới...</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Quốc tịch</label>
                <input style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.nationality || ''} onChange={e => setEditingRes({...editingRes, nationality: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Kênh (Channel)</label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.channel || 'Website'} onChange={handleChannelChange}>
                  {Array.from(new Set([...customChannels, editingRes.channel || 'Website'])).map(ch => (
                    <option key={ch} value={ch} style={{ color: '#000' }}>{ch}</option>
                  ))}
                  <option value="__add_new__" style={{ color: '#000', fontWeight: 'bold', background: '#eef2f6' }}>+ Thêm mới...</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Người tạo (Creator)</label>
                <input style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.creator || ''} onChange={e => setEditingRes({...editingRes, creator: e.target.value})} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#ccc' }}>Ghi chú</label>
                <textarea rows="3" style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff' }} value={editingRes.note || ''} onChange={e => setEditingRes({...editingRes, note: e.target.value})}></textarea>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <button style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #ccc', color: '#ccc', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setEditingRes(null)}>Hủy</button>
              <button style={{ padding: '8px 20px', background: 'var(--primary)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleSaveEdit}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {showAddChannelPrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '8px', width: '400px', maxWidth: '90%', border: '1px solid var(--primary)', textAlign: 'center' }}>
            <h3 style={{ marginTop: 0, color: 'var(--primary)', marginBottom: '15px' }}>Thêm Kênh mới</h3>
            <input 
              type="text" 
              placeholder="Nhập tên kênh..." 
              value={newChannelName} 
              onChange={e => setNewChannelName(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Enter') handleAddCustomChannel(); }}
              autoFocus
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', marginBottom: '20px' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #ccc', color: '#ccc', borderRadius: '4px', cursor: 'pointer' }} onClick={handleCancelAddChannel}>Hủy</button>
              <button style={{ padding: '8px 20px', background: 'var(--primary)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleAddCustomChannel}>Thêm</button>
            </div>
          </div>
        </div>
      )}

      {showAddTablePrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '8px', width: '400px', maxWidth: '90%', border: '1px solid var(--primary)', textAlign: 'center' }}>
            <h3 style={{ marginTop: 0, color: 'var(--primary)', marginBottom: '15px' }}>Thêm Bàn mới</h3>
            <input 
              type="text" 
              placeholder="Nhập tên bàn..." 
              value={newTableName} 
              onChange={e => setNewTableName(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Enter') handleAddCustomTable(); }}
              autoFocus
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', marginBottom: '20px' }} 
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #ccc', color: '#ccc', borderRadius: '4px', cursor: 'pointer' }} onClick={handleCancelAddTable}>Hủy</button>
              <button style={{ padding: '8px 20px', background: 'var(--primary)', border: 'none', color: '#000', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleAddCustomTable}>Thêm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReservations;
