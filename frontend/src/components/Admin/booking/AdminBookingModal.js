import React, { useState } from 'react';

function AdminBookingModal({
  editingRes,
  setEditingRes,
  handleSaveEdit,
  reservations,
  adminRole,
  customChannels,
  customTables
}) {
  const [phoneSuggestions, setPhoneSuggestions] = useState([]);
  const [showPhoneSuggestions, setShowPhoneSuggestions] = useState(false);

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

  if (!editingRes) return null;

  return (
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
            <label>Channel</label>
            <select value={editingRes.channel || 'Website'} onChange={(e) => handleEditChange('channel', e.target.value)}>
              {Array.from(new Set([...customChannels, editingRes.channel || 'Website'])).map(ch => (
                <option key={ch} value={ch} style={{ color: '#000' }}>{ch}</option>
              ))}
            </select>
          </div>
          <div className="bk-form-group">
            <label>Creator</label>
            <input type="text" value={editingRes.creator || ''} onChange={(e) => handleEditChange('creator', e.target.value)} />
          </div>

          <div className="bk-form-group">
            <label>Table</label>
            <select value={editingRes.table || ''} onChange={(e) => handleEditChange('table', e.target.value)}>
              <option value="">-- Chọn Bàn --</option>
              {Array.from(new Set([...customTables, editingRes.table].filter(Boolean))).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bk-form-group full-width">
          <label>Note</label>
          <textarea value={editingRes.note || ''} onChange={(e) => handleEditChange('note', e.target.value)} rows="3" />
        </div>

        <div className="bk-modal-actions">
          <button className="bk-btn-cancel" onClick={() => { setEditingRes(null); }}>Cancel</button>
          <button className="bk-btn-save" onClick={handleSaveEdit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default AdminBookingModal;
