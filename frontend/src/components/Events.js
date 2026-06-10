import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import '../css/pages/Events.css';

function Events() {
  const { t, lang } = useLanguage();
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/events?lang=${lang}`);
        setEventsData(response.data);
      } catch (error) {
        console.error("Lỗi tải sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [lang]);

  if (loading) {
    return (
      <div className="events-page">
        <h2>{t.eventsTitle}</h2>
        <p style={{ textAlign: 'center' }}>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <h2>{t.eventsTitle}</h2>
      <div className="events-grid">
        {eventsData.map(event => {
          const titleLower = (event.title || '').toLowerCase();
          let cardClass = "event-card";
          if (titleLower.includes("viet nam") || titleLower.includes("vietnam")) {
            cardClass += " event-card--vietnam";
          } else if (titleLower.includes("japan")) {
            cardClass += " event-card--japan";
          } else if (titleLower.includes("malaysia")) {
            cardClass += " event-card--malaysia";
          } else if (titleLower.includes("american") || titleLower.includes("usa") || titleLower.includes("america")) {
            cardClass += " event-card--american";
          }

          return (
            <div key={event._id || event.id} className={cardClass}>
              <img src={event.image} alt={event.title} />
              <div className="event-info">
                <h3>{event.title}</h3>
                <p className="event-date">📅 {event.date}</p>
                <p className="event-desc">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Events;