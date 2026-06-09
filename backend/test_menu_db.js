const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/file_TTTN/restaurant-booking/backend/.env' });
const MenuItem = require('./models/MenuItem');
const MenuCategory = require('./models/MenuCategory');
const MenuSet = require('./models/MenuSet');
const MenuPanel = require('./models/MenuPanel');

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).then(async () => {
  const items = await MenuItem.find({});
  console.log("Total MenuItem:", items.length);

  const categories = await MenuCategory.find({});
  console.log("Total MenuCategory:", categories.length);

  const sets = await MenuSet.find({});
  console.log("Total MenuSet:", sets.length);

  const panels = await MenuPanel.find({});
  console.log("Total MenuPanel:", panels.length);

  process.exit(0);
});
