import React from 'react';

function AdminBookingSidebar({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
  morningStats,
  afternoonStats,
  eveningStats
}) {
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

  return (
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

            return (
              <span
                key={i}
                className={`${!d.isCurrentMonth ? 'fade' : ''} ${isSelected ? 'active-day' : ''} cal-day-hover`}
                onClick={() => {
                  setSelectedDate(d.date);
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
          <div className="bk-summary-info">
            <strong>MORNING (7:00-12:00)</strong>
            <span>{morningStats.bookings} Bookings | {morningStats.pax} PAX</span>
          </div>
        </div>
        <div className={`bk-summary-card ${afternoonStats.bookings === 0 ? 'fade-card' : ''}`}>
          <div className="bk-summary-info">
            <strong>AFTERNOON (12:00-17:00)</strong>
            <span>{afternoonStats.bookings} Bookings | {afternoonStats.pax} PAX</span>
          </div>
        </div>
        <div className={`bk-summary-card ${eveningStats.bookings === 0 ? 'fade-card' : ''}`}>
          <div className="bk-summary-info">
            <strong>EVENING (17:00-22:00)</strong>
            <span>{eveningStats.bookings} Bookings | {eveningStats.pax} PAX</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBookingSidebar;
