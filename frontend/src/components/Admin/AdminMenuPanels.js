import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';

const emptyForm = () => ({
  title: '',
  subtitle: '',
  image: '',
  theme: 'photo',
  isInfo: false,
  scrollTarget: '',
  lang: 'VN',
  sortOrder: 0
});

function AdminMenuPanels() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const fetchItems = useCallback(async () => {
    try {
      const res = await api.get('/menu-panels/admin', { headers: getAuthHeaders() });
      setItems(res.data);
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải panel'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentId(item._id);
      setForm({
        title: item.title,
        subtitle: item.subtitle || '',
        image: item.image || '',
        theme: item.theme,
        isInfo: Boolean(item.isInfo),
        scrollTarget: item.scrollTarget || '',
        lang: item.lang,
        sortOrder: item.sortOrder ?? 0
      });
    } else {
      setIsEdit(false);
      setCurrentId(null);
      setForm(emptyForm());
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders();
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder) || 0
      };
      if (isEdit) {
        await api.put(`/menu-panels/${currentId}`, payload, { headers });
      } else {
        await api.post('/menu-panels', payload, { headers });
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi lưu panel'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa panel này?')) return;
    try {
      await api.delete(`/menu-panels/${id}`, { headers: getAuthHeaders() });
      fetchItems();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi xóa'));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Quản lý Panel A La Carte</h1>
        <button type="button" className="admin-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => openModal()}>
          + Thêm panel
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Theme</th>
              <th>Loại</th>
              <th>Ngôn ngữ</th>
              <th>Thứ tự</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.theme}</td>
                <td>{item.isInfo ? 'Thông tin' : 'Ảnh'}</td>
                <td>{item.lang}</td>
                <td>{item.sortOrder}</td>
                <td>
                  <button type="button" className="btn-small" onClick={() => openModal(item)}>Sửa</button>
                  <button type="button" className="btn-small btn-delete" onClick={() => handleDelete(item._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2>{isEdit ? 'Sửa panel' : 'Thêm panel'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Tiêu đề</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label>Phụ đề</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label>URL ảnh (hoặc /logo.png)</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label>Theme</label>
                <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
                  <option value="navy">Navy (Tráng miệng)</option>
                  <option value="photo">Photo</option>
                  <option value="wine">Wine</option>
                  <option value="info">Info (Thông tin NH)</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={form.isInfo}
                    onChange={(e) => setForm({ ...form, isInfo: e.target.checked, theme: e.target.checked ? 'info' : form.theme })}
                  />
                  {' '}Thẻ thông tin nhà hàng (logo, giờ mở cửa)
                </label>
              </div>
              {!form.isInfo && (
                <div className="admin-form-group">
                  <label>Cuộn tới mục (dessert / wine)</label>
                  <input
                    type="text"
                    value={form.scrollTarget}
                    onChange={(e) => setForm({ ...form, scrollTarget: e.target.value })}
                    placeholder="dessert hoặc wine"
                  />
                </div>
              )}
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Ngôn ngữ</label>
                  <select value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value })}>
                    <option value="VN">Tiếng Việt</option>
                    <option value="EN">English</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Thứ tự</label>
                  <input type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="admin-btn" style={{ width: 'auto' }}>Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMenuPanels;
