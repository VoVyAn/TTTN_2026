import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './css/index.css';
import App from './App';

axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

// Intercept all API responses to automatically prepend Backend URL to image paths
axios.interceptors.response.use((response) => {
  const transformUrls = (obj) => {
    if (obj && typeof obj === 'object') {
      if (Array.isArray(obj)) {
        obj.forEach(transformUrls);
      } else {
        Object.keys(obj).forEach(key => {
          if ((key === 'image' || key === 'url') && typeof obj[key] === 'string' && obj[key].startsWith('/uploads')) {
            obj[key] = (process.env.REACT_APP_API_URL || '') + obj[key];
          } else {
            transformUrls(obj[key]);
          }
        });
      }
    }
  };
  transformUrls(response.data);
  return response;
}, (error) => {
  return Promise.reject(error);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);