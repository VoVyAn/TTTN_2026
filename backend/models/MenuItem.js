const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  price: { type: Number, min: 0, default: 0 },
  description: { type: String, default: '' },
  category: { type: String, default: 'Menu' },
  lang: { type: String, required: true, enum: ['EN', 'VN', 'BOTH'] },
  image: { type: String, default: '' },
  isHidden: { type: Boolean, default: false }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
