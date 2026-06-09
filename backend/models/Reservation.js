const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  guests: { type: Number, required: true, min: 1 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  note: { type: String, default: '' },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
