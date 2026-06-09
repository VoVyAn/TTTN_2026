const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/file_TTTN/restaurant-booking/backend/.env' });
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).then(async () => {
  const items = await MenuItem.find({});
  console.log("Total MenuItem:", items.length);
  
  const langs = {};
  items.forEach(i => {
    langs[i.lang] = (langs[i.lang] || 0) + 1;
  });
  console.log("Langs:", langs);

  process.exit(0);
});
