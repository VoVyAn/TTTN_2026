const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/file_TTTN/restaurant-booking/backend/.env' });
const MenuItem = require('./models/MenuItem');
const MenuCategory = require('./models/MenuCategory');

const menuEN = [
  { name: "Shrimp & Pork Spring Rolls", price: 89000, description: "Shrimp, pork, vermicelli, herbs in rice paper", category: "Appetizers", lang: "EN", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80" },
  { name: "Hanoi Fried Spring Rolls", price: 79000, description: "Crispy fried rolls, served with fresh herbs", category: "Appetizers", lang: "EN", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80" },
  { name: "Banana Blossom Salad", price: 69000, description: "Banana blossom, pig ears, herbs", category: "Appetizers", lang: "EN", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
  { name: "Special Beef Pho", price: 129000, description: "Pho with rare beef, flank, brisket, tendon", category: "Main Courses", lang: "EN", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1ccd20?w=600&q=80" },
  { name: "Hanoi Bun Cha", price: 119000, description: "Vermicelli, grilled pork, spring rolls, herbs", category: "Main Courses", lang: "EN", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80" },
  { name: "Vu Dai Village Braised Fish", price: 199000, description: "Grass carp braised with turmeric and chili", category: "Main Courses", lang: "EN", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80" },
  { name: "Wagyu Beef Steak", price: 450000, description: "Japanese Wagyu Beef, black pepper sauce", category: "Western Cuisine", lang: "EN", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" },
  { name: "Lobster Pasta", price: 350000, description: "Spaghetti with lobster cream sauce", category: "Western Cuisine", lang: "EN", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80" },
  { name: "Sticky Rice Balls in Ginger Syrup", price: 49000, description: "Hot sticky rice balls, ginger", category: "Desserts", lang: "EN", image: "https://images.unsplash.com/photo-1551024506-0bccd281d307?w=600&q=80" },
  { name: "Caramel Flan", price: 39000, description: "Soft and smooth flan", category: "Desserts", lang: "EN", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80" },
  { name: "Lotus Tea", price: 45000, description: "Tay Ho lotus-scented tea", category: "Beverages", lang: "EN", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80" },
  { name: "Cabernet Sauvignon Wine", price: 280000, description: "Chilean red wine", category: "Beverages", lang: "EN", image: "https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=600&q=80" }
];

const menuVN = [
  { name: "Gỏi cuốn tôm thịt", price: 89000, description: "Tôm, thịt, bún, rau sống cuốn bánh tráng", category: "Khai vị", lang: "VN", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80" },
  { name: "Chả giò Hà Nội", price: 79000, description: "Chả giò chiên giòn, ăn kèm rau sống", category: "Khai vị", lang: "VN", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80" },
  { name: "Nộm hoa chuối", price: 69000, description: "Hoa chuối, tai heo, rau thơm", category: "Khai vị", lang: "VN", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
  { name: "Phở bò đặc biệt", price: 129000, description: "Phở tái, nạm, gầu, bắp bò", category: "Món chính", lang: "VN", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1ccd20?w=600&q=80" },
  { name: "Bún chả Hà Nội", price: 119000, description: "Bún, chả nướng, nem, rau sống", category: "Món chính", lang: "VN", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80" },
  { name: "Cá kho làng Vũ Đại", price: 199000, description: "Cá trắm kho nghệ, ớt", category: "Món chính", lang: "VN", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80" },
  { name: "Wagyu Beef Steak", price: 450000, description: "Bò Wagyu Nhật, sốt tiêu đen", category: "Món Âu", lang: "VN", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" },
  { name: "Lobster Pasta", price: 350000, description: "Mì Ý sốt kem tôm hùm", category: "Món Âu", lang: "VN", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80" },
  { name: "Chè trôi nước", price: 49000, description: "Bánh trôi nước nóng, gừng", category: "Tráng miệng", lang: "VN", image: "https://images.unsplash.com/photo-1551024506-0bccd281d307?w=600&q=80" },
  { name: "Bánh flan caramen", price: 39000, description: "Bánh flan mềm mịn", category: "Tráng miệng", lang: "VN", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80" },
  { name: "Trà sen", price: 45000, description: "Trà ướp sen Tây Hồ", category: "Đồ uống", lang: "VN", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80" },
  { name: "Wine Cabernet Sauvignon", price: 280000, description: "Rượu vang đỏ Chile", category: "Đồ uống", lang: "VN", image: "https://images.unsplash.com/photo-1510812431408-41bd2fbd41c9?w=600&q=80" }
];

const categorySeed = [
  { name: 'Appetizers', lang: 'EN', sortOrder: 1 },
  { name: 'Main Courses', lang: 'EN', sortOrder: 2 },
  { name: 'Western Cuisine', lang: 'EN', sortOrder: 3 },
  { name: 'Desserts', lang: 'EN', sortOrder: 4 },
  { name: 'Beverages', lang: 'EN', sortOrder: 5 },
  { name: 'Khai vị', lang: 'VN', sortOrder: 1 },
  { name: 'Món chính', lang: 'VN', sortOrder: 2 },
  { name: 'Món Âu', lang: 'VN', sortOrder: 3 },
  { name: 'Tráng miệng', lang: 'VN', sortOrder: 4 },
  { name: 'Đồ uống', lang: 'VN', sortOrder: 5 }
];

mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).then(async () => {
  let insertedItems = 0;
  for (const item of [...menuEN, ...menuVN]) {
    const exists = await MenuItem.exists({ name: item.name, lang: item.lang });
    if (!exists) {
      await MenuItem.create(item);
      insertedItems++;
    }
  }
  console.log(`Inserted ${insertedItems} missing menu items.`);

  let insertedCats = 0;
  for (const cat of categorySeed) {
    const exists = await MenuCategory.exists({ name: cat.name, lang: cat.lang });
    if (!exists) {
      await MenuCategory.create(cat);
      insertedCats++;
    }
  }
  console.log(`Inserted ${insertedCats} missing menu categories.`);

  process.exit(0);
});
