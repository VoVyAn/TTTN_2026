import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    lang: 'VN',
    image: ''
  });

  const fetchMenu = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [menuRes, catRes] = await Promise.all([
        api.get('/menu/admin', { headers }),
        api.get('/categories/admin', { headers })
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải thực đơn'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const categoriesForLang = formData.lang === 'BOTH' ? categories : categories.filter((c) => c.lang === formData.lang || c.lang === 'BOTH');

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

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEdit(true);
      setCurrentId(item._id);
      setFormData({
        name: item.name,
        price: String(item.price),
        description: item.description || '',
        category: item.category,
        lang: item.lang,
        image: item.image || ''
      });
    } else {
      setIsEdit(false);
      setCurrentId(null);
      const defaultLang = 'VN';
      const firstCategory = categories.find((c) => c.lang === defaultLang);
      setFormData({
        name: '',
        price: '',
        description: '',
        category: firstCategory?.name || '',
        lang: defaultLang,
        image: ''
      });
    }
    setShowModal(true);
  };

  const handleLangChange = (lang) => {
    const firstCategory = categories.find((c) => c.lang === lang);
    setFormData({
      ...formData,
      lang,
      category: firstCategory?.name || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      lang: formData.lang,
      image: formData.image
    };
    try {
      const headers = getAuthHeaders();
      if (isEdit) {
        await api.put(`/menu/${currentId}`, payload, { headers });
      } else {
        await api.post('/menu', payload, { headers });
      }
      setShowModal(false);
      fetchMenu();
    } catch (error) {
      alert(handleAdminError(error, 'Có lỗi khi lưu món ăn'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa món này?')) return;
    try {
      await api.delete(`/menu/${id}`, { headers: getAuthHeaders() });
      fetchMenu();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi xóa món ăn'));
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Quản lý Thực đơn</h1>
        <button
          className="admin-btn"
          style={{ width: 'auto', padding: '10px 20px' }}
          onClick={() => handleOpenModal()}
        >
          + Thêm món mới
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên món</th>
              <th>Giá</th>
              <th>Ngôn ngữ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ height: '60px', width: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#999', fontSize: '0.85rem' }}>Không có ảnh</span>
                  )}
                </td>
                <td>{item.name}</td>
                <td>{Number(item.price).toLocaleString()}đ</td>
                <td>{item.lang === 'BOTH' ? 'Cả hai' : item.lang}</td>
                <td>
                  <button className="btn-small" onClick={() => handleOpenModal(item)}>Sửa</button>
                  <button className="btn-small btn-delete" onClick={() => handleDelete(item._id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {menuItems.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>Chưa có món nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '700px' }}>
            <h2>{isEdit ? 'Sửa món ăn' : 'Thêm món mới'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
                {/* Cột trái: Ảnh */}
                <div style={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ width: '100%', height: '200px', border: '2px dashed var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', padding: '10px' }}>Chưa có ảnh</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="item-image-upload"
                  />
                  <button
                    type="button"
                    className="admin-btn"
                    style={{ width: '100%', padding: '10px', fontSize: '0.95rem' }}
                    onClick={() => document.getElementById('item-image-upload').click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                  </button>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Hoặc URL ảnh..."
                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '4px' }}
                  />
                </div>

                {/* Cột phải: Thông tin */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Tên món</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Giá (VNĐ)</label>
                    <input type="number" min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Ngôn ngữ</label>
                    <select value={formData.lang} onChange={(e) => handleLangChange(e.target.value)}>
                      <option value="VN">Tiếng Việt</option>
                      <option value="EN">Tiếng Anh</option>
                      <option value="BOTH">Cả hai (Tiếng Việt & Tiếng Anh)</option>
                    </select>
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        id="langBoth" 
                        checked={formData.lang === 'BOTH'}
                        onChange={(e) => handleLangChange(e.target.checked ? 'BOTH' : 'VN')}
                        style={{ width: 'auto', margin: 0 }}
                      />
                      <label htmlFor="langBoth" style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer' }}>Hiển thị cho cả 2 ngôn ngữ</label>
                    </div>
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Mô tả (không bắt buộc)</label>
                    <textarea rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="admin-modal-actions" style={{ marginTop: '25px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button type="button" className="admin-btn btn-cancel" onClick={() => setShowModal(false)} style={{ width: '100px' }}>Hủy</button>
                <button type="submit" className="admin-btn" style={{ width: '120px' }} disabled={categoriesForLang.length === 0}>
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMenu;
