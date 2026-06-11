import React, { useRef, useState } from 'react';

function AdminBookingTable({
  sortedReservations,
  filteredReservations,
  handleSort,
  sortConfig,
  setEditingRes
}) {
  const tableWrapperRef = useRef(null);
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

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div 
      className="bk-table-wrapper"
      ref={tableWrapperRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: isDragging ? 'none' : 'auto', overflowX: 'auto' }}
    >
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
            <th onClick={() => handleSort('channel')} style={{ cursor: 'pointer', userSelect: 'none' }}>Channel<span>{renderSortIcon('channel')}</span></th>
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
              <td className="bk-col-channel">{res.channel || 'Website'}</td>
              <td className="bk-col-source">{res.creator || ''}</td>
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
            <tr><td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>No bookings found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookingTable;
