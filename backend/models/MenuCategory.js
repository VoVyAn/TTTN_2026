const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lang: { type: String, required: true, enum: ['EN', 'VN', 'BOTH'] },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

menuCategorySchema.index({ name: 1, lang: 1 }, { unique: true });

module.exports = mongoose.model('MenuCategory', menuCategorySchema);
