import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, handleAdminError, getAuthHeaders } from '../../../api/adminApi';
import { io } from 'socket.io-client';
import '../../../css/pages/AdminBooking.css';

import AdminBookingSidebar from './AdminBookingSidebar';
import AdminBookingTable from './AdminBookingTable';
import AdminBookingModal from './AdminBookingModal';

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
};

function AdminBooking() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = safeGetItem('adminToken');
    if (!token) {
      navigate('/admin/reservations/booking/login');
    }
  }, [navigate]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeFilter, setTimeFilter] = useState('All'); // 'All', 'Lunch', 'Evening'
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentView, setCurrentView] = useState('active'); // 'active' or 'history'
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const adminRole = safeGetItem('adminRole') || 'user';
  
  const [customChannels] = useState(() => {
    const saved = safeGetItem('bk_custom_channels');
    return saved ? JSON.parse(saved) : ['Website', 'Facebook', 'Instagram', 'Dinning City'];
  });

  const [customTables] = useState(() => {
    const saved = safeGetItem('bk_custom_tables');
    const defaultTables = [
      ...Array.from({ length: 20 }, (_, i) => `1${(i + 1).toString().padStart(2, '0')}`),
      ...Array.from({ length: 10 }, (_, i) => `2${(i + 1).toString().padStart(2, '0')}`),
      ...Array.from({ length: 10 }, (_, i) => `3${(i + 1).toString().padStart(2, '0')}`),
      ...Array.from({ length: 5 }, (_, i) => `4${(i + 1).toString().padStart(2, '0')}`)
    ];
    return saved ? JSON.parse(saved) : defaultTables;
  });

  // States for Edit Modal
  const [editingRes, setEditingRes] = useState(null);

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

  // Handle Add New Logic
  const handleAddNew = () => {
    const localDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
    const selectedDateStr = localDate.toISOString().split('T')[0];

    setEditingRes({
      isNew: true,
      customer_name: '',
      phone: '',
      email: '',
      guests: 1,
      date: selectedDateStr,
      time: '19:00',
      note: '',
      status: 'new',
      table: '',
      nationality: '',
      channel: 'Website',
      creator: ''
    });
  };

  useEffect(() => {
    fetchReservations();
    const socket = io(process.env.REACT_APP_API_URL || '', { path: '/socket.io' });
    socket.on('new_reservation', () => {
      fetchReservations();
    });
    return () => socket.disconnect();
  }, [fetchReservations]);

  const handleSaveEdit = async () => {
    try {
      if (editingRes.isNew) {
        const dataToSave = { ...editingRes };
        delete dataToSave.isNew;
        dataToSave.name = dataToSave.customer_name; // Tương thích với Backend (yêu cầu name)
        
        await api.post('/reservations', dataToSave, { headers: getAuthHeaders() });
      } else {
        await api.put(`/reservations/${editingRes._id}`, editingRes, { headers: getAuthHeaders() });
      }
      setEditingRes(null);
      fetchReservations();
    } catch (e) {
      alert(handleAdminError(e, 'Lỗi khi lưu'));
    }
  };

  const filteredReservations = reservations.filter(res => {
    if (currentView === 'active') {
      if (res.status === 'no show' || res.status === 'cancel') return false;
    } else {
      if (res.status !== 'no show' && res.status !== 'cancel') return false;
    }

    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (res.customer_name && res.customer_name.toLowerCase().includes(term)) ||
      (res.note && res.note.toLowerCase().includes(term)) ||
      (res.phone && res.phone.includes(term)) ||
      (res.email && res.email.toLowerCase().includes(term))
    );

    const localDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
    const selectedDateStr = localDate.toISOString().split('T')[0];

    const matchesDate = res.date === selectedDateStr;

    let matchesTime = true;
    if (timeFilter !== 'All' && res.time) {
      const hour = parseInt(res.time.split(':')[0], 10);
      if (timeFilter === 'Lunch') {
        matchesTime = hour >= 10 && hour < 17;
      } else if (timeFilter === 'Evening') {
        matchesTime = hour >= 17;
      }
    }

    return matchesSearch && matchesDate && matchesTime;
  });

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

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const { key, direction } = sortConfig;
    let aVal = a[key];
    let bVal = b[key];

    if (key === 'channel') {
      aVal = aVal || 'Website';
      bVal = bVal || 'Website';
    } else if (key === 'creator') {
      aVal = aVal || '';
      bVal = bVal || '';
    }

    if (key === 'guests') {
      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
    } else {
      aVal = aVal ? aVal.toString().toLowerCase() : '';
      bVal = bVal ? bVal.toString().toLowerCase() : '';
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Tính toán số liệu Thống kê trong ngày (Today's Summary)
  const dayReservations = reservations.filter(res => {
    const localDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
    const selectedDateStr = localDate.toISOString().split('T')[0];
    return res.date === selectedDateStr;
  });

  const getStats = (startHour, endHour) => {
    const list = dayReservations.filter(res => {
      if (!res.time) return false;
      const h = parseInt(res.time.split(':')[0], 10);
      return h >= startHour && h < endHour;
    });
    const pax = list.reduce((sum, r) => sum + (Number(r.guests) || 0), 0);
    return { bookings: list.length, pax };
  };

  const morningStats = getStats(7, 12);
  const afternoonStats = getStats(12, 17);
  const eveningStats = getStats(17, 24);

  const totalPartySize = filteredReservations.reduce((sum, res) => sum + (Number(res.guests) || 0), 0);

  if (loading) return <div style={{ padding: '20px', color: '#333', fontFamily: 'sans-serif' }}>Loading...</div>;

  if (!safeGetItem('adminToken')) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f6f9fc', color: '#5e72e4', fontWeight: '600', fontSize: '16px' }}>
        Đang kiểm tra bảo mật... Chuyển hướng đăng nhập...
      </div>
    );
  }

  return (
    <div className="bk-dashboard">
      <div className="bk-glass-container">
        {/* Navigation Tabs */}
        <div className="bk-nav-tabs">
          <div 
            className="bk-tab active" 
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setShowViewDropdown(!showViewDropdown)}
          >
            {currentView === 'active' ? 'Reservations' : 'History Reservation'}
            
            {showViewDropdown && (
              <div className="bk-view-dropdown">
                <div className="bk-view-dropdown-item" onClick={(e) => { e.stopPropagation(); setCurrentView('active'); setShowViewDropdown(false); }}>
                  Reservations
                </div>
                <div className="bk-view-dropdown-item" onClick={(e) => { e.stopPropagation(); setCurrentView('history'); setShowViewDropdown(false); }}>
                  History Reservation
                </div>
              </div>
            )}
          </div>
          <button 
            className="bk-inquiry-btn" 
            onClick={() => {
              try {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminRole');
                localStorage.removeItem('adminUsername');
              } catch (e) {}
              window.location.href = '/admin/reservations/booking/login';
            }}
            style={{ background: '#f5365c' }}
          >
            Logout
          </button>
        </div>

        <div className="bk-main-content">
          <AdminBookingSidebar 
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            morningStats={morningStats}
            afternoonStats={afternoonStats}
            eveningStats={eveningStats}
          />

          {/* Right Panel */}
          <div className="bk-data-panel">
            <div className="bk-panel-header">
              <h3>Bookings for {selectedDate.toLocaleDateString()}</h3>
              <div className="bk-panel-actions" style={{ display: 'flex', gap: '10px' }}>
                <button className="bk-inquiry-btn" onClick={fetchReservations}>Inquiry</button>
                <button className="bk-btn-add" onClick={handleAddNew}>+ ADD NEW BOOKING</button>
              </div>
            </div>

            <div className="bk-filters">
              <div className="bk-time-filter">
                <span>Time:</span>
                <button className={timeFilter === 'All' ? 'active' : ''} onClick={() => setTimeFilter('All')}>All</button>
                <button className={timeFilter === 'Lunch' ? 'active' : ''} onClick={() => setTimeFilter('Lunch')}>Lunch</button>
                <button className={timeFilter === 'Evening' ? 'active' : ''} onClick={() => setTimeFilter('Evening')}>Evening</button>
              </div>
              <div className="bk-search">
                <label>Search:</label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <AdminBookingTable 
              sortedReservations={sortedReservations}
              filteredReservations={filteredReservations}
              handleSort={handleSort}
              sortConfig={sortConfig}
              setEditingRes={setEditingRes}
            />

            <div className="bk-panel-footer">
              <div className="bk-sum">
                Sum Party Size: <span className="highlight">{totalPartySize}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminBookingModal 
        editingRes={editingRes}
        setEditingRes={setEditingRes}
        handleSaveEdit={handleSaveEdit}
        reservations={reservations}
        adminRole={adminRole}
        customChannels={customChannels}
        customTables={customTables}
      />
    </div>
  );
}

export default AdminBooking;
