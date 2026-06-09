import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', lang: 'VN', sortOrder: 0 });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories/admin', { headers: getAuthHeaders() });
      setCategories(res.data);
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải danh mục'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentId(item._id);
      setFormData({
        name: item.name,
        lang: item.lang,
        sortOrder: item.sortOrder ?? 0
      });
    } else {
      setIsEdit(false);
      setCurrentId(null);
      setFormData({ name: '', lang: 'VN', sortOrder: 0 });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      lang: formData.lang,
      sortOrder: Number(formData.sortOrder) || 0
    };
    try {
      const headers = getAuthHeaders();
      if (isEdit) {
        await api.put(`/categories/${currentId}`, payload, { headers });
      } else {
        await api.post('/categories', payload, { headers });
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      alert(handleAdminError(error, 'Có lỗi khi lưu danh mục'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      await api.delete(`/categories/${id}`, { headers: getAuthHeaders() });
      fetchCategories();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi xóa danh mục'));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Quản lý Danh mục</h1>
        <button
          className="admin-btn"
          style={{ width: 'auto', padding: '10px 20px' }}
          onClick={() => handleOpenModal()}
        >
          + Thêm danh mục
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Ngôn ngữ</th>
              <th>Thứ tự</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.lang === 'BOTH' ? 'Cả hai' : item.lang}</td>
                <td>{item.sortOrder}</td>
                <td>
                  <button className="btn-small" onClick={() => handleOpenModal(item)}>Sửa</button>
                  <button className="btn-small btn-delete" onClick={() => handleDelete(item._id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Chưa có danh mục nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2>{isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Tên danh mục</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ví dụ: Món chính, Khai vị"
                />
              </div>
              <div className="admin-form-group">
                <label>Ngôn ngữ</label>
                <select
                  value={formData.lang}
                  onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                >
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
                <label>Thứ tự hiển thị</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
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

export default AdminCategories;
