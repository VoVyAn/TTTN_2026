import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';

const emptyCourse = () => ({ label: '', items: [{ name: '', desc: '' }] });

const emptyForm = (defaultType = 'set') => ({
  title: '',
  theme: 'green',
  image: '',
  lang: 'VN',
  sortOrder: 0,
  isImageOnly: true,
  menuType: defaultType,
  isHidden: false
});

function AdminSetMenus() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(emptyForm('set'));
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('set');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      };
      const res = await api.post('/upload', formData, { headers });
      setForm((prev) => ({ ...prev, image: res.data?.url || res.url || '' }));
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải ảnh lên'));
    } finally {
      setUploading(false);
    }
  };

  const fetchItems = useCallback(async () => {
    try {
      const res = await api.get('/menu-sets/admin', { headers: getAuthHeaders() });
      setItems(res.data);
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi tải SET MENU'));
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
        theme: item.theme,
        image: item.image || '',
        lang: item.lang,
        sortOrder: item.sortOrder ?? 0,
        isImageOnly: true,
        menuType: item.menuType || 'set',
        isHidden: item.isHidden || false
      });
    } else {
      setIsEdit(false);
      setCurrentId(null);
      setForm(emptyForm(activeTab));
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      theme: form.theme,
      image: form.image,
      pricing: [],
      courses: [],
      footer: '',
      lang: form.lang,
      sortOrder: Number(form.sortOrder) || 0,
      isImageOnly: true,
      menuType: form.menuType,
      isHidden: form.isHidden
    };
    try {
      const headers = getAuthHeaders();
      if (isEdit) {
        await api.put(`/menu-sets/${currentId}`, payload, { headers });
      } else {
        await api.post('/menu-sets', payload, { headers });
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi lưu SET MENU'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa SET MENU này?')) return;
    try {
      await api.delete(`/menu-sets/${id}`, { headers: getAuthHeaders() });
      fetchItems();
    } catch (error) {
      alert(handleAdminError(error, 'Lỗi khi xóa'));
    }
  };

  const filteredItems = items.filter((item) => (item.menuType || 'set') === activeTab);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="admin-header">
        <h1>Quản lý Menu</h1>
        <button type="button" className="admin-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => openModal()}>
          + Thêm SET MENU
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '12px' }}>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'set' ? '#235055' : '#e0e0e0',
            color: activeTab === 'set' ? '#fff' : '#333',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('set')}
        >
          Set Menu
        </button>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'alacarte' ? '#235055' : '#e0e0e0',
            color: activeTab === 'alacarte' ? '#fff' : '#333',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('alacarte')}
        >
          Alacarte menu
        </button>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'wine' ? '#235055' : '#e0e0e0',
            color: activeTab === 'wine' ? '#fff' : '#333',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('wine')}
        >
          WINE
        </button>
        <button
          type="button"
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'khung' ? '#235055' : '#e0e0e0',
            color: activeTab === 'khung' ? '#fff' : '#333',
            cursor: 'pointer',
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onClick={() => setActiveTab('khung')}
        >
          DRINK MENU
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tiêu đề</th>
              <th>Kiểu hiển thị</th>
              <th>Ngôn ngữ</th>
              <th>Thứ tự</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ height: '60px', width: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#999', fontSize: '0.85rem' }}>Không có ảnh</span>
                  )}
                </td>
                <td>{item.title}</td>
                <td>{item.isImageOnly ? 'Chỉ hiển thị ảnh' : 'Dàn trang text'}</td>
                <td>{item.lang === 'BOTH' ? 'Cả hai' : item.lang}</td>
                <td>{item.sortOrder}</td>
                <td>{item.isHidden ? <span style={{ color: 'red' }}>Đã ẩn</span> : <span style={{ color: 'green' }}>Hiển thị</span>}</td>
                <td>
                  <button type="button" className="btn-small" onClick={() => openModal(item)}>Sửa</button>
                  <button type="button" className="btn-small btn-delete" onClick={() => handleDelete(item._id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  Không tìm thấy thực đơn nào ở mục này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-modal--wide">
            <h2>{isEdit ? 'Sửa thực đơn' : 'Thêm thực đơn'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Tiêu đề</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Phân loại</label>
                  <select value={form.menuType} onChange={(e) => setForm({ ...form, menuType: e.target.value })}>
                    <option value="set">SET MENU</option>
                    <option value="alacarte">ALACARTE MENU</option>
                    <option value="wine">WINE</option>
                    <option value="khung">DRINK MENU</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Ngôn ngữ</label>
                  <select value={form.lang} onChange={(e) => setForm({ ...form, lang: e.target.value })}>
                    <option value="VN">Tiếng Việt</option>
                    <option value="EN">English</option>
                    <option value="BOTH">Cả hai</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Thứ tự</label>
                  <input type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} style={{ width: '100px' }} />
                </div>
                <div className="admin-form-group">
                  <label>Trạng thái</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      id="isHidden"
                      checked={form.isHidden}
                      onChange={(e) => setForm({ ...form, isHidden: e.target.checked })}
                    />
                    <label htmlFor="isHidden" style={{ margin: 0, fontWeight: 'normal' }}>Ẩn thực đơn này</label>
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Ảnh thực đơn (Tải ảnh lên hoặc nhập URL)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="menu-image-upload"
                  />
                  <button
                    type="button"
                    className="admin-btn"
                    style={{ width: 'auto', margin: 0, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => document.getElementById('menu-image-upload').click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Đang tải lên...' : 'Chọn file ảnh'}
                  </button>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Hoặc nhập URL ảnh: https://..."
                    style={{ flex: 1 }}
                    required
                  />
                </div>
                {form.image && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={form.image} alt="Preview" style={{ maxHeight: '120px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: '' })}
                      style={{ marginLeft: '10px', padding: '4px 8px', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', verticalAlign: 'top' }}
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="admin-btn" style={{ width: 'auto' }}>
                  {isEdit ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSetMenus;
