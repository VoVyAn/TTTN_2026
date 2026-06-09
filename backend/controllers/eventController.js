const Event = require('../models/Event');
const { isValidObjectId } = require('../utils/helpers');

const getEvents = async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const events = await Event.find({ lang: { $in: [lang, 'BOTH'] } });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const { title, date, description, image, lang } = req.body;
    if (!title?.trim() || !date?.trim()) {
      return res.status(400).json({ error: 'Tiêu đề và thời gian là bắt buộc' });
    }
    if (!['EN', 'VN'].includes(lang)) {
      return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ' });
    }
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        date: date.trim(),
        description: description?.trim() || '',
        image: image?.trim() || '',
        lang
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
