const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB.');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const keywords = ['Japan', 'Malaysia', 'American', 'Eddie', 'Tales', 'Tastes'];
    
    for (let col of collections) {
      const docs = await db.collection(col.name).find({}).toArray();
      const matches = [];
      docs.forEach(d => {
        const str = JSON.stringify(d).toLowerCase();
        const hasKeyword = keywords.some(k => str.includes(k.toLowerCase()));
        if (hasKeyword) {
          matches.push(d);
        }
      });
      if (matches.length > 0) {
        console.log(`\nFound matches in collection "${col.name}" (${matches.length} matches):`);
        matches.forEach(m => {
          console.log(`  - Title/Name: "${m.title || m.name || m.customer_name}", ID: ${m._id}`);
          if (m.description || m.description_vn || m.content) {
            console.log(`    Desc snippet: ${String(m.description || m.description_vn || m.content).slice(0, 100)}`);
          }
          if (m.image) console.log(`    Image: "${m.image}"`);
        });
      }
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
