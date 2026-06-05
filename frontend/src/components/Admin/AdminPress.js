import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';

function AdminPress() {
  const [press, setPress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    source: '',
    description: '',
    link: '',
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

  const fetchPress = useCallback(async () => {
    try {
      const resEN = await api.get('/press?lang=EN');
      const resVN = await api.get('/press?lang=VN');
      setPress([...resEN.data, ...resVN.data]);
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải truyền thông'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPress();
  }, [fetchPress]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentId(item._id);
      setFormData({
        title: item.title,
        source: item.source || '',
        description: item.description || '',
        link: item.link || '',
        image: item.image || '',
        lang: item.lang
      });
    } else {
      setIsEdit(false);
      setCurrentId(null);
      setFormData({ title: '', source: '', description: '', link: '', image: '', lang: 'VN' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title.trim(),
      source: formData.source.trim(),
      description: formData.description.trim(),
      link: formData.link.trim(),
      image: formData.image.trim(),
      lang: formData.lang
    };
    try {
      const headers = getAuthHeaders();
      if (isEdit) {
        await api.put(`/press/${currentId}`, payload, { headers });
      } else {
        await api.post('/press', payload, { headers });
      }
      setShowModal(false);
      fetchPress();
    } catch (error) {
      alert(handleAdminError(error, 'Có lỗi khi lưu bài báo'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài báo này?')) return;
    try {
      await api.delete(`/press/${id}`, { headers: getAuthHeaders() });
      fetchPress();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi xóa bài báo'));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Quản lý Truyền thông</h1>
        <button
          className="admin-btn"
          style={{ width: 'auto', padding: '10px 20px' }}
          onClick={() => handleOpenModal()}
        >
          + Thêm bài báo
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Nguồn</th>
              <th>Ngôn ngữ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {press.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.source}</td>
                <td>{item.lang}</td>
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
            <h2>{isEdit ? 'Sửa bài báo' : 'Thêm bài báo'}</h2>
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
                <label>Nguồn báo</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  required
                  placeholder="Ví dụ: VnExpress"
                />
              </div>
              <div className="admin-form-group">
                <label>Mô tả / Tóm tắt bài viết</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  placeholder="Nhập đoạn mô tả ngắn về bài viết..."
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', color: '#000' }}
                />
              </div>
              <div className="admin-form-group">
                <label>Link bài viết</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>
              <div className="admin-form-group">
                <label>Ngôn ngữ</label>
                <select value={formData.lang} onChange={(e) => setFormData({ ...formData, lang: e.target.value })}>
                  <option value="VN">Tiếng Việt</option>
                  <option value="EN">Tiếng Anh</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Ảnh bài báo (Tải ảnh lên hoặc nhập URL)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="press-image-upload"
                  />
                  <button
                    type="button"
                    className="admin-btn"
                    style={{ width: 'auto', margin: 0, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => document.getElementById('press-image-upload').click()}
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

export default AdminPress;
