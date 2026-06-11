require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_booking');
  const items = await MenuItem.find({}, 'image');
  console.log(items.slice(0, 5));
  process.exit(0);
};
run();
