const Press = require('../models/Press');
const { isValidObjectId } = require('../utils/helpers');

const getPress = async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const press = await Press.find({ lang: { $in: [lang, 'BOTH'] } });
    res.json(press);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPress = async (req, res) => {
  try {
    const newPress = new Press(req.body);
    await newPress.save();
    res.status(201).json(newPress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePress = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const { title, source, description, link, image, lang } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Tiêu đề là bắt buộc' });
    if (!['EN', 'VN'].includes(lang)) {
      return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ' });
    }
    const updated = await Press.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        source: source?.trim() || '',
        description: description?.trim() || '',
        link: link?.trim() || '',
        image: image?.trim() || '',
        lang
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy bài báo' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePress = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const deleted = await Press.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy bài báo' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPress,
  createPress,
  updatePress,
  deletePress
};
