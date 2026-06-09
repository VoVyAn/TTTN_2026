const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  category: { type: String, default: 'Menu' },
  lang: { type: String, required: true, enum: ['EN', 'VN', 'BOTH'] },
  image: { type: String, default: '' }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
