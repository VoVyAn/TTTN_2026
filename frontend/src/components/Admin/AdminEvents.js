import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    image: '',
    lang: 'VN'
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    setUploading(true);
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      };
      const res = await api.post('/upload', data, { headers });
      setFormData((prev) => ({ ...prev, image: res.data?.url || res.url || '' }));
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải ảnh lên'));
    } finally {
      setUploading(false);
    }
  };

  const fetchEvents = useCallback(async () => {
    try {
      const resEN = await api.get('/events?lang=EN');
      const resVN = await api.get('/events?lang=VN');
      setEvents([...resEN.data, ...resVN.data]);
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải sự kiện'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentId(item._id);
      setFormData({
        title: item.title,
        date: item.date,
        description: item.description || '',
        image: item.image || '',
        lang: item.lang
      });
    } else {
      setIsEdit(false);
      setCurrentId(null);
      setFormData({ title: '', date: '', description: '', image: '', lang: 'VN' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title.trim(),
      date: formData.date.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      lang: formData.lang
    };
    try {
      const headers = getAuthHeaders();
      if (isEdit) {
        await api.put(`/events/${currentId}`, payload, { headers });
      } else {
        await api.post('/events', payload, { headers });
      }
      setShowModal(false);
      fetchEvents();
    } catch (error) {
      alert(handleAdminError(error, 'Có lỗi khi lưu sự kiện'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sự kiện này?')) return;
    try {
      await api.delete(`/events/${id}`, { headers: getAuthHeaders() });
      fetchEvents();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi xóa sự kiện'));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Quản lý Sự kiện</h1>
        <button
          className="admin-btn"
          style={{ width: 'auto', padding: '10px 20px' }}
          onClick={() => handleOpenModal()}
        >
          + Thêm sự kiện
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Ngày</th>
              <th>Ngôn ngữ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {events.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.date}</td>
                <td>{item.lang === 'BOTH' ? 'Cả hai' : item.lang}</td>
                <td>
                  <button className="btn-small" onClick={() => handleOpenModal(item)}>Sửa</button>
                  <button className="btn-small btn-delete" onClick={() => handleDelete(item._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2>{isEdit ? 'Sửa sự kiện' : 'Thêm sự kiện'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Thời gian</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  placeholder="Ví dụ: 14/02/2025"
                />
              </div>
              <div className="admin-form-group">
                <label>Ngôn ngữ</label>
                <select value={formData.lang} onChange={(e) => setFormData({ ...formData, lang: e.target.value })}>
                  <option value="VN">Tiếng Việt</option>
                  <option value="EN">Tiếng Anh</option>
                  <option value="BOTH">Cả hai (Tiếng Việt & Tiếng Anh)</option>
                </select>
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="langBoth" 
                    checked={formData.lang === 'BOTH'}
                    onChange={(e) => setFormData({ ...formData, lang: e.target.checked ? 'BOTH' : 'VN' })}
                  />
                  <label htmlFor="langBoth" style={{ margin: 0, fontWeight: 'normal' }}>Hiển thị cho cả 2 ngôn ngữ</label>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Ảnh sự kiện (Tải ảnh lên hoặc nhập URL)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="event-image-upload"
                  />
                  <button
                    type="button"
                    className="admin-btn"
                    style={{ width: 'auto', margin: 0, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => document.getElementById('event-image-upload').click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Đang tải...' : 'Chọn file ảnh'}
                  </button>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Hoặc nhập URL ảnh: https://..."
                    style={{ flex: 1 }}
                  />
                </div>
                {formData.image && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={formData.image} alt="Preview" style={{ maxHeight: '80px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                )}
              </div>
              <div className="admin-form-group">
                <label>Mô tả (không bắt buộc)</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="admin-btn" style={{ width: 'auto' }}>Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEvents;
