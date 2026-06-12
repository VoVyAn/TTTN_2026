const MenuItem = require('../models/MenuItem');
const MenuCategory = require('../models/MenuCategory');
const { parseMenuBody, isValidObjectId } = require('../utils/helpers');

const getPublicMenu = async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const items = await MenuItem.find({ lang: { $in: [lang, 'BOTH'] } });
    
    const menuGrouped = items.reduce((acc, item) => {
      const catName = 'Menu'; // Force single category
      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(item);
      return acc;
    }, {});
    
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(menuGrouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminMenu = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ lang: 1, category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const parsed = parseMenuBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const newItem = new MenuItem(parsed.data);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const parsed = parseMenuBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy món ăn' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy món ăn' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPublicMenu,
  getAdminMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
