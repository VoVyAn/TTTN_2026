const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/file_TTTN/restaurant-booking/backend/.env' });
const Event = require('./models/Event');
const Press = require('./models/Press');

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).then(async () => {
  const events = await Event.find({});
  console.log("Total events:", events.length);
  const eventsVN = await Event.find({ lang: 'VN' });
  console.log("VN events:", eventsVN.length);

  const press = await Press.find({});
  console.log("Total press:", press.length);
  const pressVN = await Press.find({ lang: 'VN' });
  console.log("VN press:", pressVN.length);

  process.exit(0);
});
