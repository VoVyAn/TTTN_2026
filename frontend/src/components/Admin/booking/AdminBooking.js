import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, handleAdminError, getAuthHeaders } from '../../../api/adminApi';
import { io } from 'socket.io-client';
import '../../../css/pages/AdminBooking.css';

function AdminBooking() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
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
  const adminRole = localStorage.getItem('adminRole') || 'user';

  // States for Edit Modal
  const [editingRes, setEditingRes] = useState(null);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [phoneSuggestions, setPhoneSuggestions] = useState([]);
  const [showPhoneSuggestions, setShowPhoneSuggestions] = useState(false);

  const TABLES = [
    ...Array.from({ length: 20 }, (_, i) => `1${(i + 1).toString().padStart(2, '0')}`),
    ...Array.from({ length: 10 }, (_, i) => `2${(i + 1).toString().padStart(2, '0')}`),
    ...Array.from({ length: 10 }, (_, i) => `3${(i + 1).toString().padStart(2, '0')}`),
    ...Array.from({ length: 5 }, (_, i) => `4${(i + 1).toString().padStart(2, '0')}`)
  ];

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
      creator: ''
    });
  };

  useEffect(() => {
    fetchReservations();
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('new_reservation', () => {
      fetchReservations();
    });
    return () => socket.disconnect();
  }, [fetchReservations]);

  // Handle Edit Logic
  const handleEditChange = (field, value) => {
    setEditingRes(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'phone') {
        if (value.length >= 3) {
          const matches = [];
          const seen = new Set();
          for (let r of reservations) {
            if (r.phone && r.phone.includes(value) && !seen.has(r.phone)) {
              seen.add(r.phone);
              matches.push(r);
            }
          }
          setPhoneSuggestions(matches);
          setShowPhoneSuggestions(matches.length > 0);
        } else {
          setShowPhoneSuggestions(false);
        }
        updated.isAutoFilled = false;
      }
      return updated;
    });
  };

  const handleSelectSuggestion = (r) => {
    setEditingRes(prev => ({
      ...prev,
      phone: r.phone,
      customer_name: r.customer_name || prev.customer_name,
      email: r.email || prev.email,
      nationality: r.nationality || prev.nationality,
      isAutoFilled: true
    }));
    setShowPhoneSuggestions(false);
  };

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

    // Lọc theo selectedDate. res.date có dạng 'YYYY-MM-DD'
    const resDateStr = res.date;

    // Xử lý múi giờ để format ngày chính xác (tránh bị lệch ngày)
    const localDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
    const selectedDateStr = localDate.toISOString().split('T')[0];

    const matchesDate = resDateStr === selectedDateStr;

    // Lọc theo khung giờ (Time filter)
    let matchesTime = true;
    if (timeFilter !== 'All' && res.time) {
      const hour = parseInt(res.time.split(':')[0], 10);
      if (timeFilter === 'Lunch') {
        matchesTime = hour >= 10 && hour < 17; // 10:00 - 16:59
      } else if (timeFilter === 'Evening') {
        matchesTime = hour >= 17; // 17:00 trở đi
      }
    }

    return matchesSearch && matchesDate && matchesTime;
  });

  const handleSort = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' });
      } else {
        // Tắt sắp xếp
        setSortConfig({ key: null, direction: 'asc' });
      }
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const { key, direction } = sortConfig;
    let aVal = key === 'creator' ? (a.creator || 'Website') : a[key];
    let bVal = key === 'creator' ? (b.creator || 'Website') : b[key];

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

  // Lịch logic
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: daysInPrevMonth - firstDay + i + 1, isCurrentMonth: false, date: new Date(year, month - 1, daysInPrevMonth - firstDay + i + 1) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const headerDateStr = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;

  if (!localStorage.getItem('adminToken')) {
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
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminRole');
              localStorage.removeItem('adminUsername');
              navigate('/admin/reservations/booking/login');
            }}
            style={{ background: '#f5365c' }}
          >
            Logout
          </button>
        </div>

        <div className="bk-main-content">
          {/* Left Sidebar */}
          <div className="bk-sidebar">
            <div className="bk-calendar-widget">
              <div className="bk-cal-header">
                <button onClick={prevMonth} className="bk-cal-btn">&lt;</button>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <select
                    className="cal-month-select"
                    value={currentMonth.getMonth()}
                    onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1))}
                  >
                    {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                  <input
                    type="number"
                    className="cal-year-input"
                    value={currentMonth.getFullYear()}
                    onChange={(e) => {
                      const newYear = parseInt(e.target.value);
                      if (newYear > 2000 && newYear < 2100) {
                        setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1));
                      }
                    }}
                    min="2000" max="2100"
                  />
                </div>
                <button onClick={nextMonth} className="bk-cal-btn">&gt;</button>
              </div>
              <div className="bk-cal-grid">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                {generateCalendarDays().map((d, i) => {
                  const isSelected = selectedDate.getDate() === d.day &&
                    selectedDate.getMonth() === d.date.getMonth() &&
                    selectedDate.getFullYear() === d.date.getFullYear();

                  // Chỉ hiện các ngày trong tháng hoặc cho phép click đổi tháng nếu muốn. Ở đây mình cho click hết.
                  return (
                    <span
                      key={i}
                      className={`${!d.isCurrentMonth ? 'fade' : ''} ${isSelected ? 'active-day' : ''} cal-day-hover`}
                      onClick={() => {
                        setSelectedDate(d.date);
                        // Tự động chuyển lịch nếu ngày đó thuộc tháng khác
                        if (!d.isCurrentMonth) setCurrentMonth(new Date(d.date.getFullYear(), d.date.getMonth(), 1));
                      }}
                    >
                      {d.day}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bk-summary-widget">
              <h4>TODAY'S SUMMARY</h4>
              <div className={`bk-summary-card ${morningStats.bookings === 0 ? 'fade-card' : ''}`}>
                <span className="bk-icon">☀️</span>
                <div className="bk-summary-info">
                  <strong>MORNING (7:00-12:00)</strong>
                  <span>{morningStats.bookings} Bookings | {morningStats.pax} PAX</span>
                </div>
              </div>
              <div className={`bk-summary-card ${afternoonStats.bookings === 0 ? 'fade-card' : ''}`}>
                <span className="bk-icon">🌤️</span>
                <div className="bk-summary-info">
                  <strong>AFTERNOON (12:00-17:00)</strong>
                  <span>{afternoonStats.bookings} Bookings | {afternoonStats.pax} PAX</span>
                </div>
              </div>
              <div className={`bk-summary-card ${eveningStats.bookings === 0 ? 'fade-card' : ''}`}>
                <span className="bk-icon">🌆</span>
                <div className="bk-summary-info">
                  <strong>EVENING (17:00-22:00)</strong>
                  <span>{eveningStats.bookings} Bookings | {eveningStats.pax} PAX</span>
                </div>
              </div>
            </div>
          </div>

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

            <div className="bk-table-wrapper">
              <table className="bk-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th onClick={() => handleSort('status')} style={{ cursor: 'pointer', userSelect: 'none' }}>Status<span>{renderSortIcon('status')}</span></th>
                    <th onClick={() => handleSort('table')} style={{ cursor: 'pointer', userSelect: 'none' }}>Table<span>{renderSortIcon('table')}</span></th>
                    <th onClick={() => handleSort('guests')} style={{ cursor: 'pointer', userSelect: 'none' }}>Pax<span>{renderSortIcon('guests')}</span></th>
                    <th onClick={() => handleSort('time')} style={{ cursor: 'pointer', userSelect: 'none' }}>Time<span>{renderSortIcon('time')}</span></th>
                    <th>Notes</th>
                    <th onClick={() => handleSort('creator')} style={{ cursor: 'pointer', userSelect: 'none' }}>Creator<span>{renderSortIcon('creator')}</span></th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReservations.map(res => (
                    <tr key={res._id}>
                      <td className="bk-col-name">{res.customer_name}</td>
                      <td className="bk-col-phone">{res.phone}</td>
                      <td className="bk-col-status">
                        <span className={`status-badge status-${res.status ? res.status.replace(' ', '-') : 'new'}`}>
                          {res.status || 'new'}
                        </span>
                      </td>
                      <td className="bk-col-table">{res.table || '-'}</td>
                      <td className="bk-col-pax">{res.guests}</td>
                      <td className="bk-col-time">{res.time}</td>
                      <td className="bk-col-note">
                        <div className="note-text">{res.note || 'Không có ghi chú'}</div>
                      </td>
                      <td className="bk-col-source">{res.creator || 'Website'}</td>
                      <td className="bk-col-actions">
                        <button className="bk-edit-btn" onClick={() => setEditingRes({ ...res })}>
                          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReservations.length === 0 && (
                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No bookings found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bk-panel-footer">
              <div className="bk-sum">
                Sum Party Size: <span className="highlight">{totalPartySize}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRes && (
        <div className="bk-modal-overlay">
          <div className="bk-modal-content">
            <h3 className="bk-modal-title">{editingRes.isNew ? 'Add New Booking' : 'Edit Reservation'}</h3>
            <div className="bk-modal-grid">
              <div className="bk-form-group" style={{ position: 'relative' }}>
                <label>Phone</label>
                <input
                  type="text"
                  value={editingRes.phone || ''}
                  onChange={(e) => handleEditChange('phone', e.target.value)}
                  onFocus={() => { if (editingRes.phone && phoneSuggestions.length > 0) setShowPhoneSuggestions(true); }}
                  onBlur={() => setTimeout(() => setShowPhoneSuggestions(false), 200)}
                  placeholder="Nhập SĐT..."
                  disabled={adminRole === 'user' && !editingRes.isNew}
                  style={adminRole === 'user' && !editingRes.isNew ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
                {showPhoneSuggestions && (
                  <div className="bk-autocomplete-dropdown">
                    {phoneSuggestions.map(s => (
                      <div key={s.phone} className="bk-autocomplete-item" onClick={() => handleSelectSuggestion(s)}>
                        <strong>{s.phone}</strong> - <span className="dim-text">{s.customer_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bk-form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={editingRes.customer_name || ''} 
                  onChange={(e) => handleEditChange('customer_name', e.target.value)} 
                  disabled={adminRole === 'user' && (!editingRes.isNew || editingRes.isAutoFilled)}
                  style={adminRole === 'user' && (!editingRes.isNew || editingRes.isAutoFilled) ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
              </div>
              <div className="bk-form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={editingRes.email || ''} 
                  onChange={(e) => handleEditChange('email', e.target.value)} 
                  disabled={adminRole === 'user' && (!editingRes.isNew || editingRes.isAutoFilled)}
                  style={adminRole === 'user' && (!editingRes.isNew || editingRes.isAutoFilled) ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
              </div>
              <div className="bk-form-group">
                <label>Status</label>
                <select value={editingRes.status || 'new'} onChange={(e) => handleEditChange('status', e.target.value)}>
                  <option value="new">New</option>
                  <option value="confirm">Confirm</option>
                  <option value="reservation">Reservation</option>
                  <option value="seated">Seated</option>
                  <option value="no show">No Show</option>
                  <option value="cancel">Cancel</option>
                </select>
              </div>
              <div className="bk-form-group">
                <label>Guests</label>
                <input type="number" min="1" value={editingRes.guests || ''} onChange={(e) => handleEditChange('guests', e.target.value)} />
              </div>
              <div className="bk-form-group">
                <label>Date</label>
                <input type="date" value={editingRes.date || ''} onChange={(e) => handleEditChange('date', e.target.value)} />
              </div>
              <div className="bk-form-group">
                <label>Time</label>
                <input type="time" value={editingRes.time || ''} onChange={(e) => handleEditChange('time', e.target.value)} />
              </div>
              <div className="bk-form-group">
                <label>Nationality</label>
                <input type="text" value={editingRes.nationality || ''} onChange={(e) => handleEditChange('nationality', e.target.value)} />
              </div>
              <div className="bk-form-group">
                <label>Creator</label>
                <input type="text" value={editingRes.creator || ''} onChange={(e) => handleEditChange('creator', e.target.value)} />
              </div>

              <div className="bk-form-group" style={{ position: 'relative' }}>
                <label>Table</label>
                <input
                  type="text"
                  readOnly
                  value={editingRes.table || 'Select Table...'}
                  onClick={() => setShowTablePicker(!showTablePicker)}
                  style={{ cursor: 'pointer', background: '#f8f9fe' }}
                />
                {showTablePicker && (
                  <div className="bk-table-picker">
                    {TABLES.map(t => (
                      <div
                        key={t}
                        className={`bk-table-cell ${editingRes.table === t ? 'selected' : ''}`}
                        onClick={() => { handleEditChange('table', t); setShowTablePicker(false); }}
                      >
                        {t}
                      </div>
                    ))}
                    <div className="bk-table-cell clear-table" onClick={() => { handleEditChange('table', ''); setShowTablePicker(false); }}>
                      Clear
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bk-form-group full-width">
              <label>Note</label>
              <textarea value={editingRes.note || ''} onChange={(e) => handleEditChange('note', e.target.value)} rows="3" />
            </div>

            <div className="bk-modal-actions">
              <button className="bk-btn-cancel" onClick={() => { setEditingRes(null); setShowTablePicker(false); }}>Cancel</button>
              <button className="bk-btn-save" onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBooking;
