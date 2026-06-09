const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/file_TTTN/restaurant-booking/backend/.env' });
const MenuSet = require('./models/MenuSet');
const { menuSets } = require('./data/menuShowcaseSeed');

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).then(async () => {
  const vnSets = menuSets.filter(s => s.lang === 'VN');
  
  // Check if VN sets already exist
  const existingVN = await MenuSet.countDocuments({ lang: 'VN' });
  if (existingVN === 0) {
    await MenuSet.insertMany(vnSets);
    console.log(`Inserted ${vnSets.length} VN sets.`);
  } else {
    console.log(`VN sets already exist (${existingVN}).`);
  }
  process.exit(0);
});
