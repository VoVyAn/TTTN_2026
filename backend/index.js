const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'bom_kitchen_secret_key_2025';

const app = express();
app.use(cors());
app.use(express.json());

// Lấy connection string từ .env
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Đang kiểm tra kết nối...');
console.log('📡 URI:', MONGODB_URI ? '✅ Có URI' : '❌ Không có URI');

if (!MONGODB_URI) {
  console.error('❌ Lỗi: Không tìm thấy MONGODB_URI trong file .env');
  process.exit(1);
}

// Kết nối MongoDB với options đầy đủ
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout sau 5 giây
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Đã kết nối MongoDB Atlas thành công!');
  console.log('📦 Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('❌ Lỗi kết nối MongoDB:', err.message);
  console.log('\n💡 Kiểm tra lại:');
  console.log('   1. Mật khẩu trong file .env có đúng không?');
  console.log('   2. IP đã được thêm vào Network Access chưa?');
  console.log('   3. User có quyền đọc/ghi không?');
  process.exit(1);
});

// Schema
const reservationSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true, min: 1 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  note: { type: String, default: '' },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

// --- Các Models Mới (Menu, Event, Press) ---
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  lang: { type: String, required: true }
});
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  lang: { type: String, required: true }
});
const Event = mongoose.model('Event', eventSchema);

const pressSchema = new mongoose.Schema({
  title: { type: String, required: true },
  source: { type: String },
  link: { type: String },
  image: { type: String },
  lang: { type: String, required: true }
});
const Press = mongoose.model('Press', pressSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

// Middleware xác thực token (cho các route Admin cần bảo mật)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Không có quyền truy cập' });
  try {
    const decoded = jwt.verify(token.split(' ')[1] || token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

// --- Hàm Tự Động Thêm Dữ Liệu Mẫu (Seed Data) ---
const seedDatabase = async () => {
  try {
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      console.log('🌱 Đang tạo dữ liệu mẫu cho Database...');
      
      const menuEN = [
        { name: "Shrimp & Pork Spring Rolls", price: 89000, description: "Shrimp, pork, vermicelli, herbs in rice paper", category: "Appetizers", lang: "EN" },
        { name: "Hanoi Fried Spring Rolls", price: 79000, description: "Crispy fried rolls, served with fresh herbs", category: "Appetizers", lang: "EN" },
        { name: "Banana Blossom Salad", price: 69000, description: "Banana blossom, pig ears, herbs", category: "Appetizers", lang: "EN" },
        { name: "Special Beef Pho", price: 129000, description: "Pho with rare beef, flank, brisket, tendon", category: "Main Courses", lang: "EN" },
        { name: "Hanoi Bun Cha", price: 119000, description: "Vermicelli, grilled pork, spring rolls, herbs", category: "Main Courses", lang: "EN" },
        { name: "Vu Dai Village Braised Fish", price: 199000, description: "Grass carp braised with turmeric and chili", category: "Main Courses", lang: "EN" },
        { name: "Wagyu Beef Steak", price: 450000, description: "Japanese Wagyu Beef, black pepper sauce", category: "Western Cuisine", lang: "EN" },
        { name: "Lobster Pasta", price: 350000, description: "Spaghetti with lobster cream sauce", category: "Western Cuisine", lang: "EN" },
        { name: "Sticky Rice Balls in Ginger Syrup", price: 49000, description: "Hot sticky rice balls, ginger", category: "Desserts", lang: "EN" },
        { name: "Caramel Flan", price: 39000, description: "Soft and smooth flan", category: "Desserts", lang: "EN" },
        { name: "Lotus Tea", price: 45000, description: "Tay Ho lotus-scented tea", category: "Beverages", lang: "EN" },
        { name: "Cabernet Sauvignon Wine", price: 280000, description: "Chilean red wine", category: "Beverages", lang: "EN" }
      ];

      const menuVN = [
        { name: "Gỏi cuốn tôm thịt", price: 89000, description: "Tôm, thịt, bún, rau sống cuốn bánh tráng", category: "Khai vị", lang: "VN" },
        { name: "Chả giò Hà Nội", price: 79000, description: "Chả giò chiên giòn, ăn kèm rau sống", category: "Khai vị", lang: "VN" },
        { name: "Nộm hoa chuối", price: 69000, description: "Hoa chuối, tai heo, rau thơm", category: "Khai vị", lang: "VN" },
        { name: "Phở bò đặc biệt", price: 129000, description: "Phở tái, nạm, gầu, bắp bò", category: "Món chính", lang: "VN" },
        { name: "Bún chả Hà Nội", price: 119000, description: "Bún, chả nướng, nem, rau sống", category: "Món chính", lang: "VN" },
        { name: "Cá kho làng Vũ Đại", price: 199000, description: "Cá trắm kho nghệ, ớt", category: "Món chính", lang: "VN" },
        { name: "Wagyu Beef Steak", price: 450000, description: "Bò Wagyu Nhật, sốt tiêu đen", category: "Món Âu", lang: "VN" },
        { name: "Lobster Pasta", price: 350000, description: "Mì Ý sốt kem tôm hùm", category: "Món Âu", lang: "VN" },
        { name: "Chè trôi nước", price: 49000, description: "Bánh trôi nước nóng, gừng", category: "Tráng miệng", lang: "VN" },
        { name: "Bánh flan caramen", price: 39000, description: "Bánh flan mềm mịn", category: "Tráng miệng", lang: "VN" },
        { name: "Trà sen", price: 45000, description: "Trà ướp sen Tây Hồ", category: "Đồ uống", lang: "VN" },
        { name: "Wine Cabernet Sauvignon", price: 280000, description: "Rượu vang đỏ Chile", category: "Đồ uống", lang: "VN" }
      ];

      const eventsData = [
        { title: "Year End Party 2025", date: "Jan 25, 2025", description: "Year end party with live music and special gifts", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", lang: "EN" },
        { title: "Valentine's Day", date: "Feb 14, 2025", description: "Romantic menu for couples", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400", lang: "EN" },
        { title: "Live Music Night", date: "Every Saturday", description: "Acoustic music night with famous artists", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=400", lang: "EN" },
        { title: "Tất niên 2025", date: "25/01/2025", description: "Tiệc tất niên với âm nhạc trực tiếp và quà tặng đặc biệt", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", lang: "VN" },
        { title: "Valentine's Day", date: "14/02/2025", description: "Thực đơn lãng mạn dành cho các cặp đôi", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400", lang: "VN" },
        { title: "Live Music Night", date: "Mỗi thứ 7 hàng tuần", description: "Đêm nhạc acoustic với các nghệ sĩ nổi tiếng", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=400", lang: "VN" }
      ];

      const pressData = [
        { title: "Bờm Kitchen - Hanoi's New Culinary Destination", source: "Tuoi Tre News", link: "https://example.com/article1", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", lang: "EN" },
        { title: "Top 10 Most Romantic Restaurants in the Capital", source: "Dep Magazine", link: "https://example.com/article2", image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400", lang: "EN" },
        { title: "Bờm Kitchen Nominated for Michelin 2024", source: "VnExpress International", link: "https://example.com/article3", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400", lang: "EN" },
        { title: "Bờm Kitchen - Điểm đến ẩm thực mới của Hà Nội", source: "Báo Tuổi Trẻ", link: "https://example.com/article1", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", lang: "VN" },
        { title: "Top 10 nhà hàng lãng mạn nhất thủ đô", source: "Tạp chí Đẹp", link: "https://example.com/article2", image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400", lang: "VN" },
        { title: "Bờm Kitchen nhận đề cử Michelin 2024", source: "VnExpress", link: "https://example.com/article3", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400", lang: "VN" }
      ];

      await MenuItem.insertMany([...menuEN, ...menuVN]);
      await Event.insertMany(eventsData);
      await Press.insertMany(pressData);
      console.log('✅ Đã tạo dữ liệu mẫu thành công!');
    }
  } catch (err) {
    console.error('❌ Lỗi tạo dữ liệu mẫu:', err);
  }
};

mongoose.connection.once('open', () => {
  seedDatabase();
});

// --- AUTH APIs ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Thiếu username hoặc password' });
    
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();
    
    res.status(201).json({ success: true, message: 'Đăng ký thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ error: 'Tài khoản không tồn tại' });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Mật khẩu không đúng' });
    
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- PUBLIC APIs ---
app.get('/api/menu', async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const items = await MenuItem.find({ lang });
    
    // Nhóm theo category cho frontend
    const menuGrouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    
    res.json(menuGrouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const events = await Event.find({ lang });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/press', async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const press = await Press.find({ lang });
    res.json(press);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN CRUD APIs (PROTECTED) ---

// Quản lý Menu
app.post('/api/menu', verifyToken, async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.put('/api/menu/:id', verifyToken, async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/api/menu/:id', verifyToken, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quản lý Events
app.post('/api/events', verifyToken, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.put('/api/events/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/api/events/:id', verifyToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quản lý Press
app.post('/api/press', verifyToken, async (req, res) => {
  try {
    const newPress = new Press(req.body);
    await newPress.save();
    res.status(201).json(newPress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.put('/api/press/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Press.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/api/press/:id', verifyToken, async (req, res) => {
  try {
    await Press.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quản lý Reservations (Admin)
app.put('/api/reservations/:id', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/api/reservations/:id', verifyToken, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API: Đặt bàn (Public)
app.post('/api/reservations', async (req, res) => {
  try {
    const { name, phone, guests, date, time, note } = req.body;
    
    // Validation
    if (!name) return res.status(400).json({ error: 'Tên khách hàng là bắt buộc' });
    if (!phone) return res.status(400).json({ error: 'Số điện thoại là bắt buộc' });
    if (!/^\d{10,11}$/.test(phone)) {
      return res.status(400).json({ error: 'Số điện thoại không hợp lệ (10-11 số)' });
    }
    if (!guests || guests < 1) {
      return res.status(400).json({ error: 'Số khách phải lớn hơn 0' });
    }
    if (!date) return res.status(400).json({ error: 'Ngày đặt bàn là bắt buộc' });
    if (!time) return res.status(400).json({ error: 'Giờ đặt bàn là bắt buộc' });
    
    // Kiểm tra ngày không quá khứ
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ error: 'Không thể đặt bàn trong quá khứ' });
    }
    
    const reservation = new Reservation({
      customer_name: name,
      phone,
      guests: Number(guests),
      date,
      time,
      note: note || ''
    });
    
    await reservation.save();
    
    res.status(201).json({
      success: true,
      message: 'Đặt bàn thành công!',
      reservation: {
        id: reservation._id,
        name: reservation.customer_name,
        phone: reservation.phone,
        guests: reservation.guests,
        date: reservation.date,
        time: reservation.time,
        note: reservation.note
      }
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ error: 'Lỗi server: ' + error.message });
  }
});

// API: Lấy danh sách đặt bàn
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend đang chạy với MongoDB!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});