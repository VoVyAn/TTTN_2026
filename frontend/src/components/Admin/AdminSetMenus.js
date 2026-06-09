import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders, handleAdminError } from '../../api/adminApi';

const emptyCourse = () => ({ label: '', items: [{ name: '', desc: '' }] });

const emptyForm = (defaultType = 'set') => ({
  title: '',
  theme: 'green',
  image: '',
  pricingText: '',
  courses: [emptyCourse()],
  footer: '',
  lang: 'VN',
  sortOrder: 0,
  isImageOnly: false,
  menuType: defaultType
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
        pricingText: (item.pricing || []).join('\n'),
        courses: item.courses?.length
          ? item.courses.map((c) => ({
            label: c.label,
            items: c.items?.length ? c.items.map((i) => ({ name: i.name, desc: i.desc || '' })) : [{ name: '', desc: '' }]
          }))
          : [emptyCourse()],
        footer: item.footer || '',
        lang: item.lang,
        sortOrder: item.sortOrder ?? 0,
        isImageOnly: item.isImageOnly ?? false,
        menuType: item.menuType || 'set'
      });
    } else {
      setIsEdit(false);
      setCurrentId(null);
      setForm(emptyForm(activeTab));
    }
    setShowModal(true);
  };

  const updateCourse = (ci, field, value) => {
    const courses = [...form.courses];
    courses[ci] = { ...courses[ci], [field]: value };
    setForm({ ...form, courses });
  };

  const updateDish = (ci, di, field, value) => {
    const courses = [...form.courses];
    const itemsList = [...courses[ci].items];
    itemsList[di] = { ...itemsList[di], [field]: value };
    courses[ci] = { ...courses[ci], items: itemsList };
    setForm({ ...form, courses });
  };

  const addCourse = () => setForm({ ...form, courses: [...form.courses, emptyCourse()] });

  const removeCourse = (ci) => {
    if (form.courses.length <= 1) return;
    setForm({ ...form, courses: form.courses.filter((_, i) => i !== ci) });
  };

  const addDish = (ci) => {
    const courses = [...form.courses];
    courses[ci] = { ...courses[ci], items: [...courses[ci].items, { name: '', desc: '' }] };
    setForm({ ...form, courses });
  };

  const removeDish = (ci, di) => {
    const courses = [...form.courses];
    if (courses[ci].items.length <= 1) return;
    courses[ci] = { ...courses[ci], items: courses[ci].items.filter((_, i) => i !== di) };
    setForm({ ...form, courses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      theme: form.theme,
      image: form.image,
      pricing: form.isImageOnly ? [] : form.pricingText.split('\n').map((p) => p.trim()).filter(Boolean),
      courses: form.isImageOnly ? [] : form.courses,
      footer: form.isImageOnly ? '' : form.footer,
      lang: form.lang,
      sortOrder: Number(form.sortOrder) || 0,
      isImageOnly: form.isImageOnly,
      menuType: form.menuType
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
              <th>Tiêu đề</th>
              <th>Kiểu hiển thị</th>
              <th>Ngôn ngữ</th>
              <th>Thứ tự</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.isImageOnly ? 'Chỉ hiển thị ảnh' : 'Dàn trang text'}</td>
                <td>{item.lang === 'BOTH' ? 'Cả hai' : item.lang}</td>
                <td>{item.sortOrder}</td>
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
              <div className="admin-form-row">
                <div className="admin-form-group" style={{ flex: 2 }}>
                  <label>Tiêu đề</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px', flex: 1 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    <input
                      type="checkbox"
                      checked={form.isImageOnly}
                      onChange={(e) => setForm({ ...form, isImageOnly: e.target.checked })}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    Chỉ hiển thị ảnh thiết kế sẵn
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label>Ảnh thực đơn (Tải ảnh từ máy tính hoặc nhập URL)</label>
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
                    required={form.isImageOnly}
                  />
                </div>
                {form.image && (
                  <div style={{ marginTop: '10px' }}>
                    <img src={form.image} alt="Preview" style={{ maxHeight: '120px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                )}
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Phân loại thực đơn</label>
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
                    <option value="BOTH">Cả hai ngôn ngữ</option>
                  </select>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="langBoth" 
                      checked={form.lang === 'BOTH'}
                      onChange={(e) => setForm({ ...form, lang: e.target.checked ? 'BOTH' : 'VN' })}
                    />
                    <label htmlFor="langBoth" style={{ margin: 0, fontWeight: 'normal' }}>Hiển thị cho cả 2 ngôn ngữ</label>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Thứ tự hiển thị</label>
                  <input type="number" min="0" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
                </div>
              </div>

              {!form.isImageOnly && (
                <>

                  <div className="admin-form-group">
                    <label>Giá (mỗi dòng một mức giá)</label>
                    <textarea rows="2" value={form.pricingText} onChange={(e) => setForm({ ...form, pricingText: e.target.value })} />
                  </div>

                  <div className="admin-form-group">
                    <label>Các món trong set / thực đơn</label>
                    {form.courses.map((course, ci) => (
                      <div key={ci} className="admin-course-block">
                        <div className="admin-course-header">
                          <input
                            type="text"
                            placeholder="Nhãn (VD: KHAI VỊ / MÓN CHÍNH / ĐỒ UỐNG)"
                            value={course.label}
                            onChange={(e) => updateCourse(ci, 'label', e.target.value)}
                            required
                          />
                          <button type="button" className="btn-small btn-delete" onClick={() => removeCourse(ci)}>Xóa nhóm</button>
                        </div>
                        {course.items.map((dish, di) => (
                          <div key={di} className="admin-dish-row">
                            <input
                              type="text"
                              placeholder="Tên món / Tên đồ uống"
                              value={dish.name}
                              onChange={(e) => updateDish(ci, di, 'name', e.target.value)}
                              required
                            />
                            <input
                              type="text"
                              placeholder="Mô tả thành phần / Chi tiết"
                              value={dish.desc}
                              onChange={(e) => updateDish(ci, di, 'desc', e.target.value)}
                            />
                            <button type="button" className="btn-small btn-delete" onClick={() => removeDish(ci, di)}>×</button>
                          </div>
                        ))}
                        <button type="button" className="btn-small" onClick={() => addDish(ci)}>+ Món</button>
                      </div>
                    ))}
                    <button type="button" className="btn-small" style={{ marginTop: '8px' }} onClick={addCourse}>+ Nhóm món</button>
                  </div>

                  <div className="admin-form-group">
                    <label>Ghi chú cuối thẻ</label>
                    <textarea rows="2" value={form.footer} onChange={(e) => setForm({ ...form, footer: e.target.value })} />
                  </div>
                </>
              )}

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

export default AdminSetMenus;
