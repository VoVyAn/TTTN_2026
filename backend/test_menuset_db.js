const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/file_TTTN/restaurant-booking/backend/.env' });
const MenuSet = require('./models/MenuSet');

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).then(async () => {
  const sets = await MenuSet.find({});
  console.log("Total MenuSet:", sets.length);
  
  const langs = {};
  sets.forEach(s => {
    langs[s.lang] = (langs[s.lang] || 0) + 1;
  });
  console.log("Langs:", langs);

  process.exit(0);
});
