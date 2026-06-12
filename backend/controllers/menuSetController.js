const MenuSet = require('../models/MenuSet');
const { parseMenuSetBody, isValidObjectId } = require('../utils/helpers');

const getPublicMenuSets = async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const sets = await MenuSet.find({ lang: { $in: [lang, 'BOTH'] } }).sort({ sortOrder: 1, title: 1 });
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminMenuSets = async (req, res) => {
  try {
    const sets = await MenuSet.find().sort({ lang: 1, sortOrder: 1, title: 1 });
    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMenuSet = async (req, res) => {
  try {
    const parsed = parseMenuSetBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const doc = new MenuSet(parsed.data);
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMenuSet = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID không hợp lệ' });
    const parsed = parseMenuSetBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const updated = await MenuSet.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy SET MENU' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMenuSet = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID không hợp lệ' });
    const deleted = await MenuSet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy SET MENU' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPublicMenuSets,
  getAdminMenuSets,
  createMenuSet,
  updateMenuSet,
  deleteMenuSet
};
