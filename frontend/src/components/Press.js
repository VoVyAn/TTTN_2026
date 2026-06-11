import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import '../css/pages/Press.css';

function Press() {
  const { t, lang } = useLanguage();
  const [pressData, setPressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPress = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/press?lang=${lang}`);
        setPressData(response.data);
      } catch (error) {
        console.error("Lỗi tải báo chí:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPress();
  }, [lang]);

  if (loading) {
    return (
      <div className="press-page">
        <h2>{t.pressTitle}</h2>
        <p style={{ textAlign: 'center' }}>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="press-page">
      <h2>{t.pressTitle}</h2>
      <div className="press-grid">
        {pressData.map((article, index) => (
          <div key={article._id || article.id} className={`press-card ${index % 2 === 1 ? 'press-card--reverse' : ''}`}>
            <div className="press-info">
              <h3>{article.title}</h3>
              {article.description && <p className="press-desc">{article.description}</p>}
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="press-readmore-btn">
                {t.pressReadMore.replace(' →', '').toUpperCase()}
              </a>
            </div>
            <img src={article.image} alt={article.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Press;