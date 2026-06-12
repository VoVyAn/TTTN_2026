const MenuCategory = require('../models/MenuCategory');
const MenuItem = require('../models/MenuItem');
const { isValidObjectId } = require('../utils/helpers');

const getPublicCategories = async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const categories = await MenuCategory.find({ lang: { $in: [lang, 'BOTH'] } }).sort({ sortOrder: 1, name: 1 });
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminCategories = async (req, res) => {
  try {
    const categories = await MenuCategory.find().sort({ lang: 1, sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, lang, sortOrder } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
    if (!['EN', 'VN'].includes(lang)) return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ' });

    const category = new MenuCategory({
      name: name.trim(),
      lang,
      sortOrder: Number(sortOrder) || 0
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Danh mục đã tồn tại cho ngôn ngữ này' });
    }
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    const existing = await MenuCategory.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy danh mục' });

    const { name, lang, sortOrder } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
    if (!['EN', 'VN'].includes(lang)) return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ' });

    const newName = name.trim();
    const oldName = existing.name;
    const oldLang = existing.lang;

    const updated = await MenuCategory.findByIdAndUpdate(
      req.params.id,
      { name: newName, lang, sortOrder: Number(sortOrder) || 0 },
      { new: true, runValidators: true }
    );

    if (oldName !== newName || oldLang !== lang) {
      await MenuItem.updateMany(
        { category: oldName, lang: oldLang },
        { $set: { category: newName, lang } }
      );
    }

    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Danh mục đã tồn tại cho ngôn ngữ này' });
    }
    res.status(400).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    const category = await MenuCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Không tìm thấy danh mục' });

    const itemCount = await MenuItem.countDocuments({
      category: category.name,
      lang: category.lang
    });
    if (itemCount > 0) {
      return res.status(400).json({
        error: `Không thể xóa: còn ${itemCount} món trong danh mục này`
      });
    }

    await MenuCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPublicCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
