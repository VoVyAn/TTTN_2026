require('dotenv').config();
const mongoose = require('mongoose');

const MenuItem = require('./models/MenuItem');
const MenuSet = require('./models/MenuSet');
const MenuPanel = require('./models/MenuPanel');
const Event = require('./models/Event');
const Press = require('./models/Press');

const fixUrls = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const updateImage = async (Model, name) => {
      const items = await Model.find({ image: { $regex: 'http://localhost:5000' } });
      for (let item of items) {
        item.image = item.image.replace('http://localhost:5000', '');
        await item.save();
      }
      console.log(`Updated ${items.length} ${name}`);
    };

    await updateImage(MenuItem, 'MenuItems');
    await updateImage(MenuSet, 'MenuSets');
    await updateImage(MenuPanel, 'MenuPanels');
    await updateImage(Event, 'Events');
    await updateImage(Press, 'Presses');

    console.log('Done fixing image URLs!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

fixUrls();
