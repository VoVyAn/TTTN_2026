const mongoose = require('mongoose');

const courseItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, default: '' }
}, { _id: false });

const courseBlockSchema = new mongoose.Schema({
  label: { type: String, required: true },
  items: [courseItemSchema]
}, { _id: false });

const menuSetSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  theme: { type: String, enum: ['green', 'rose', 'cream', 'gold'], default: 'green' },
  image: { type: String, default: '' },
  pricing: [{ type: String }],
  courses: [courseBlockSchema],
  footer: { type: String, default: '' },
  lang: { type: String, required: true, enum: ['EN', 'VN', 'BOTH'] },
  sortOrder: { type: Number, default: 0 },
  isImageOnly: { type: Boolean, default: false },
  menuType: { type: String, enum: ['set', 'alacarte', 'wine', 'khung'], default: 'set' }
}, { timestamps: true });

module.exports = mongoose.model('MenuSet', menuSetSchema);
