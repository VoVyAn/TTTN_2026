import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import '../css/pages/ReservationForm.css';

function ReservationForm() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 1,
    date: new Date().toISOString().split('T')[0], // Default to today
    time: '17:15', // Default time to match screenshot
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const validateStep1 = () => {
    const newErrors = {};
    if (formData.guests < 1) newErrors.guests = t.errGuests;
    
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = t.errDatePast;
      }
    } else {
      newErrors.date = t.errDateEmpty;
    }

    if (!formData.time) {
      newErrors.time = t.errTimeEmpty;
    } else if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(formData.time)) {
      newErrors.time = t.errTimeInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t.errName;
    if (!formData.phone.trim()) newErrors.phone = t.errPhone;
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = t.errPhoneInvalid;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) {
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email.trim(),
        guests: formData.guests,
        date: formData.date,
        time: formData.time,
        note: formData.note
      };

      const response = await axios.post('http://localhost:5000/api/reservations', payload);
      if (response.data.success) {
        setBookingData(response.data.reservation);
        setSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          guests: 1,
          date: new Date().toISOString().split('T')[0],
          time: '17:15',
          note: ''
        });
        setCurrentStep(1);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || t.errSubmit;
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleNewBooking = () => {
    setSubmitted(false);
    setBookingData(null);
    setErrors({});
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = months[date.getMonth()];
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  };

  if (submitted && bookingData) {
    return (
      <div className="success-page-wrapper">
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>{t.resSuccess}</h2>
            <p>{t.resSuccessDesc}</p>
            
            <div className="booking-summary">
              <h3>{t.resSummaryTitle}</h3>
              <div className="summary-item">
                <span className="summary-label">{t.resSummaryName}</span>
                <span className="summary-value">{bookingData.name}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.resSummaryPhone}</span>
                <span className="summary-value">{bookingData.phone}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.resSummaryGuests}</span>
                <span className="summary-value">{bookingData.guests}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.resSummaryDate}</span>
                <span className="summary-value">{formatDate(bookingData.date)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">{t.resSummaryTime}</span>
                <span className="summary-value">{bookingData.time}</span>
              </div>
              {bookingData.email && (
                <div className="summary-item">
                  <span className="summary-label">{t.resEmail}</span>
                  <span className="summary-value">{bookingData.email}</span>
                </div>
              )}
              {bookingData.note && (
                <div className="summary-item">
                  <span className="summary-label">{t.resSummaryNote}</span>
                  <span className="summary-value">{bookingData.note}</span>
                </div>
              )}
              <div className="summary-item">
                <span className="summary-label">{t.resSummaryCode}</span>
                <span className="summary-value">#{bookingData.id.slice(-6)}</span>
              </div>
            </div>
            
            <button className="new-booking-btn" onClick={handleNewBooking}>
              {t.resNewBooking}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-page">
      <div className="reservation-split-container">
        {/* Left Column: Google Map */}
        <div className="reservation-media-column">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4974913222384!2d106.6910475147489!3d10.770588692325368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3c2c0d35dd%3A0xf5813054670219ce!2zMjQgTmd1eeG7hW4gVGjhu4sgTmdoxKlhLCBC4bq_biBUaMOgbmgsIFF14bqtbiAxLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1717320000000!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          ></iframe>
        </div>
        
        {/* Right Column: Form Container */}
        <div className="reservation-form-column">
          <h2 className="reservation-main-title">
            {t.navReservations.toUpperCase()}
          </h2>
          
          {/* Selection Summary Pill Bar */}
          <div className="reservation-summary-pill">
            <span className="summary-pill-item">
              <img src="/calendar-clock.png" alt="Calendar" className="pill-icon-img" /> {formatDate(formData.date)}
            </span>
            <span className="summary-pill-item">
              <img src="/clock-three.png" alt="Clock" className="pill-icon-img" /> {formData.time}
            </span>
            <span className="summary-pill-item">
              <img src="/people.png" alt="People" className="pill-icon-img" /> {formData.guests}
            </span>
          </div>
          
          {currentStep === 1 && (
            <div className="step-content">
              <h3 className="step-title">{t.resStep1Title}</h3>
              
              <div className="form-group">
                <label>{t.resDate.replace(/\s*\*/, '')}</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{t.resGuests.replace(/\s*\*/, '')}</label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className={errors.guests ? 'error' : ''}
                  />
                  {errors.guests && <span className="error-message">{errors.guests}</span>}
                </div>
                
                <div className="form-group">
                  <label>{t.resTime.replace(/\s*\*/, '')}</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={errors.time ? 'error' : ''}
                  />
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label>{t.resStore}</label>
                <input
                  type="text"
                  value="BỜM - Kitchen & Wine Bar"
                  disabled
                  className="disabled-input"
                />
              </div>
              
              <button type="button" className="action-btn next-btn" onClick={handleNextStep}>
                {t.resNext}
              </button>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="step-content">
              <h3 className="step-title">{t.resStep2Title}</h3>
              
              <div className="form-group">
                <label>{t.resPhone.replace(/\s*\*/, '')}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.resPhonePlaceholder}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{t.resName.replace(/\s*\*/, '')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.resNamePlaceholder}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                <div className="form-group">
                  <label>{t.resEmail}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>{t.resNote.replace(/\s*\([^)]+\)/, '')}</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="3"
                  placeholder={t.resNotePlaceholder}
                />
              </div>
              
              {errors.submit && (
                <div className="submit-error">{errors.submit}</div>
              )}
              
              <div className="button-group">
                <button type="button" className="action-btn prev-btn" onClick={handlePrevStep}>
                  {t.resBack}
                </button>
                <button type="button" className="action-btn submit-btn" disabled={loading} onClick={handleSubmit}>
                  {loading ? t.resProcessing : t.resNext}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservationForm;
