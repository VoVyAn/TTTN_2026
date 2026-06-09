const mongoose = require('mongoose');

const menuPanelSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  theme: { type: String, enum: ['navy', 'photo', 'wine', 'info'], default: 'photo' },
  isInfo: { type: Boolean, default: false },
  scrollTarget: { type: String, default: '' },
  lang: { type: String, required: true, enum: ['EN', 'VN', 'BOTH'] },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MenuPanel', menuPanelSchema);
