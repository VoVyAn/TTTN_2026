const mongoose = require('mongoose');

const pressSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String },
  description: { type: String },
  link: { type: String },
  image: { type: String },
  lang: { type: String, required: true }
});

module.exports = mongoose.model('Press', pressSchema);
