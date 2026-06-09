const MenuPanel = require('../models/MenuPanel');
const { parseMenuPanelBody, isValidObjectId } = require('../utils/helpers');

const getPublicMenuPanels = async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const panels = await MenuPanel.find({ lang: { $in: [lang, 'BOTH'] } }).sort({ sortOrder: 1, title: 1 });
    res.json(panels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminMenuPanels = async (req, res) => {
  try {
    const panels = await MenuPanel.find().sort({ lang: 1, sortOrder: 1, title: 1 });
    res.json(panels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMenuPanel = async (req, res) => {
  try {
    const parsed = parseMenuPanelBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const doc = new MenuPanel(parsed.data);
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMenuPanel = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID không hợp lệ' });
    const parsed = parseMenuPanelBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const updated = await MenuPanel.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy panel' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMenuPanel = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID không hợp lệ' });
    const deleted = await MenuPanel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy panel' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPublicMenuPanels,
  getAdminMenuPanels,
  createMenuPanel,
  updateMenuPanel,
  deleteMenuPanel
};
