const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const result = await Admin.updateOne({ username: 'test1' }, { $set: { role: 'user' } });
  console.log('Downgraded test1 to user:', result);
  mongoose.disconnect();
}).catch(console.error);
