const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const parseMenuBody = (body) => {
  const price = Number(body.price);
  if (Number.isNaN(price) || price < 0) {
    return { error: 'Giá không hợp lệ' };
  }
  if (!body.name?.trim()) return { error: 'Tên món là bắt buộc' };
  if (!['EN', 'VN', 'BOTH'].includes(body.lang)) return { error: 'Ngôn ngữ không hợp lệ' };
  return {
    data: {
      name: body.name.trim(),
      price,
      description: body.description?.trim() || '',
      category: body.category?.trim() || 'Menu',
      lang: body.lang,
      image: body.image?.trim() || ''
    }
  };
};

const parseMenuSetBody = (body) => {
  if (!body.title?.trim()) return { error: 'Tiêu đề là bắt buộc' };
  if (!['EN', 'VN', 'BOTH'].includes(body.lang)) return { error: 'Ngôn ngữ không hợp lệ' };
  const themes = ['green', 'rose', 'cream', 'gold'];
  const theme = themes.includes(body.theme) ? body.theme : 'green';
  const menuTypes = ['set', 'alacarte', 'wine', 'khung'];
  const menuType = menuTypes.includes(body.menuType) ? body.menuType : 'set';
  const pricing = Array.isArray(body.pricing)
    ? body.pricing.filter((p) => p && String(p).trim())
    : String(body.pricing || '').split('\n').map((p) => p.trim()).filter(Boolean);
  const courses = Array.isArray(body.courses) ? body.courses.map((c) => ({
    label: String(c.label || '').trim(),
    items: (c.items || []).map((i) => ({
      name: String(i.name || '').trim(),
      desc: String(i.desc || '').trim()
    })).filter((i) => i.name)
  })).filter((c) => c.label && c.items.length) : [];
  return {
    data: {
      title: body.title.trim(),
      theme,
      image: body.image?.trim() || '',
      pricing,
      courses,
      footer: body.footer?.trim() || '',
      lang: body.lang,
      sortOrder: Number(body.sortOrder) || 0,
      isImageOnly: Boolean(body.isImageOnly),
      menuType
    }
  };
};

const parseMenuPanelBody = (body) => {
  if (!body.title?.trim()) return { error: 'Tiêu đề là bắt buộc' };
  if (!['EN', 'VN', 'BOTH'].includes(body.lang)) return { error: 'Ngôn ngữ không hợp lệ' };
  const themes = ['navy', 'photo', 'wine', 'info'];
  return {
    data: {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || '',
      image: body.image?.trim() || '',
      theme: themes.includes(body.theme) ? body.theme : 'photo',
      isInfo: Boolean(body.isInfo),
      scrollTarget: body.scrollTarget?.trim() || '',
      lang: body.lang,
      sortOrder: Number(body.sortOrder) || 0
    }
  };
};

module.exports = {
  isValidObjectId,
  parseMenuBody,
  parseMenuSetBody,
  parseMenuPanelBody
};
