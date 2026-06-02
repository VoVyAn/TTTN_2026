const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'bom_kitchen_secret_key_2025';

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure static folder for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

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
  email: { type: String, default: '' },
  guests: { type: Number, required: true, min: 1 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  note: { type: String, default: '' },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

// --- Cấu hình gửi Mail thông báo đặt bàn ---
const createTransporter = async () => {
  // If SMTP configurations are present in .env, use them
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // If Gmail configurations are present in .env, use them
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Fallback: create a test SMTP service on Ethereal.email
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('✉️ Đã tạo tài khoản test email Ethereal thành công!');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (error) {
    console.error('❌ Không thể tạo tài khoản test email Ethereal:', error);
    return null;
  }
};

const sendConfirmationEmail = async (reservation) => {
  if (!reservation.email) return;

  try {
    const transporter = await createTransporter();
    if (!transporter) {
      console.log('⚠️ Transporter không khả dụng, không gửi email.');
      return;
    }

    const formattedDate = new Date(reservation.date).toLocaleDateString('vi-VN');
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"BỜM - Kitchen & Wine Bar" <booking@bomhospitality.vn>',
      to: reservation.email,
      subject: 'Xác Nhận Đặt Bàn Thành Công - BỜM Kitchen & Wine Bar',
      html: `
        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f7f5f2; padding: 2rem; color: #352e27;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="text-align: center; border-bottom: 2px solid #e5e0d9; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
              <h1 style="color: #2b2724; font-size: 24px; margin: 0; font-family: 'Playfair Display', serif; letter-spacing: 1px;">BỜM KITCHEN & WINE BAR</h1>
              <p style="color: #6e655c; margin: 5px 0 0 0;">Cảm ơn bạn đã lựa chọn nhà hàng chúng tôi</p>
            </div>
            
            <h2 style="color: #27ae60; text-align: center; margin-bottom: 1.5rem;">ĐẶT BÀN THÀNH CÔNG!</h2>
            
            <p>Xin chào <strong>${reservation.customer_name}</strong>,</p>
            <p>Yêu cầu đặt bàn của bạn tại BỜM Kitchen & Wine Bar đã được ghi nhận. Dưới đây là thông tin chi tiết:</p>
            
            <div style="background: #f7f5f2; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Mã đặt bàn:</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #352e27;">#${String(reservation._id).slice(-6).toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Khách hàng:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.customer_name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Số điện thoại:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Email:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Số lượng khách:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.guests} người</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Ngày đặt bàn:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c;">Giờ đặt bàn:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.time}</td>
                </tr>
                ${reservation.note ? `
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; color: #6e655c; vertical-align: top;">Ghi chú:</td>
                  <td style="padding: 6px 0; text-align: right; color: #352e27;">${reservation.note}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="border-top: 1px solid #e5e0d9; padding-top: 1.5rem; margin-top: 1.5rem; font-size: 14px; color: #6e655c; text-align: center;">
              <p style="margin: 0 0 5px 0;"><strong>Địa chỉ:</strong> 24 Nguyễn Thị Nghĩa, Phường Bến Thành, TP. Hồ Chí Minh</p>
              <p style="margin: 0 0 5px 0;"><strong>Hotline:</strong> (+84) 82 399 9980</p>
              <p style="margin: 0;">Rất hân hạnh được phục vụ quý khách!</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Email đã được gửi thành công. Message ID:', info.messageId);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('🔗 Link xem trước email (Ethereal):', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Lỗi khi gửi email xác nhận đặt bàn:', error);
  }
};

// --- Các Models Mới (Menu, Event, Press) ---
const menuCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lang: { type: String, required: true, enum: ['EN', 'VN'] },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });
menuCategorySchema.index({ name: 1, lang: 1 }, { unique: true });
const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  category: { type: String, required: true, trim: true },
  lang: { type: String, required: true, enum: ['EN', 'VN'] },
  image: { type: String, default: '' }
});
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

const courseItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, default: '' }
}, { _id: false });

const courseBlockSchema = new mongoose.Schema({
  label: { type: String, required: true },
  items: [courseItemSchema]
}, { _id: false });

const menuSetSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  theme: { type: String, enum: ['green', 'rose', 'cream', 'gold'], default: 'green' },
  image: { type: String, default: '' },
  pricing: [{ type: String }],
  courses: [courseBlockSchema],
  footer: { type: String, default: '' },
  lang: { type: String, required: true, enum: ['EN', 'VN'] },
  sortOrder: { type: Number, default: 0 },
  isImageOnly: { type: Boolean, default: false },
  menuType: { type: String, enum: ['set', 'alacarte', 'wine', 'khung'], default: 'set' }
}, { timestamps: true });
const MenuSet = mongoose.model('MenuSet', menuSetSchema);

const menuPanelSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  theme: { type: String, enum: ['navy', 'photo', 'wine', 'info'], default: 'photo' },
  isInfo: { type: Boolean, default: false },
  scrollTarget: { type: String, default: '' },
  lang: { type: String, required: true, enum: ['EN', 'VN'] },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });
const MenuPanel = mongoose.model('MenuPanel', menuPanelSchema);

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
  description: { type: String },
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
  const authHeader = req.headers.authorization || req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: 'Không có quyền truy cập' });
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(403).json({ error: 'Không có quyền truy cập' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const parseMenuBody = (body) => {
  const price = Number(body.price);
  if (Number.isNaN(price) || price < 0) {
    return { error: 'Giá không hợp lệ' };
  }
  if (!body.name?.trim()) return { error: 'Tên món là bắt buộc' };
  if (!body.category?.trim()) return { error: 'Danh mục là bắt buộc' };
  if (!['EN', 'VN'].includes(body.lang)) return { error: 'Ngôn ngữ không hợp lệ' };
  return {
    data: {
      name: body.name.trim(),
      price,
      description: body.description?.trim() || '',
      category: body.category.trim(),
      lang: body.lang,
      image: body.image?.trim() || ''
    }
  };
};

const { menuSets: seedMenuSets, menuPanels: seedMenuPanels } = require('./data/menuShowcaseSeed');

const parseMenuSetBody = (body) => {
  if (!body.title?.trim()) return { error: 'Tiêu đề là bắt buộc' };
  if (!['EN', 'VN'].includes(body.lang)) return { error: 'Ngôn ngữ không hợp lệ' };
  const themes = ['green', 'rose', 'cream', 'gold'];
  const theme = themes.includes(body.theme) ? body.theme : 'green';
  const menuTypes = ['set', 'alacarte', 'wine', 'khung'];
  const menuType = menuTypes.includes(body.menuType) ? body.menuType : 'set';
  const pricing = Array.isArray(body.pricing)
    ? body.pricing.filter((p) => p && String(p).trim())
    : String(body.pricing || '').split('\n').map((p) => p.trim()).filter(Boolean);
  const courses = Array.isArray(body.courses) ? body.courses.map((c) => ({
    label: String(c.label || '').trim(),
    items: (c.items || []).map((i) => ({
      name: String(i.name || '').trim(),
      desc: String(i.desc || '').trim()
    })).filter((i) => i.name)
  })).filter((c) => c.label && c.items.length) : [];
  return {
    data: {
      title: body.title.trim(),
      theme,
      image: body.image?.trim() || '',
      pricing,
      courses,
      footer: body.footer?.trim() || '',
      lang: body.lang,
      sortOrder: Number(body.sortOrder) || 0,
      isImageOnly: Boolean(body.isImageOnly),
      menuType
    }
  };
};

const parseMenuPanelBody = (body) => {
  if (!body.title?.trim()) return { error: 'Tiêu đề là bắt buộc' };
  if (!['EN', 'VN'].includes(body.lang)) return { error: 'Ngôn ngữ không hợp lệ' };
  const themes = ['navy', 'photo', 'wine', 'info'];
  return {
    data: {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || '',
      image: body.image?.trim() || '',
      theme: themes.includes(body.theme) ? body.theme : 'photo',
      isInfo: Boolean(body.isInfo),
      scrollTarget: body.scrollTarget?.trim() || '',
      lang: body.lang,
      sortOrder: Number(body.sortOrder) || 0
    }
  };
};

// --- Hàm Tự Động Thêm Dữ Liệu Mẫu (Seed Data) ---
const seedDatabase = async () => {
  try {
    const menuCount = await MenuItem.countDocuments();
    const hasImageField = await MenuItem.exists({ image: { $ne: '' } });
    if (menuCount === 0 || !hasImageField) {
      await MenuItem.deleteMany({});
      console.log('🌱 Đang tạo dữ liệu mẫu cho Database...');
      
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

      const eventsData = [
        {
          title: "TALES & TASTES OF VIET NAM",
          date: "Special Event",
          description: "Tales & Tastes of Vietnam with the mission of bringing modern Vietnamese dishes, conveying culture and values that Bờm always appreciates and preserves through fairy tales such as independence, self-reliance and kindness of the Vietnamese nation.\nTaking Vietnamese folk tales as inspiration for dishes, fresh ingredients for each dish are key elements leading guests into the heroic history and culture treasury of Vietnamese people.",
          image: "http://localhost:5000/uploads/tales_vietnam.jpg",
          lang: "EN"
        },
        {
          title: "TALES & TASTES OF VIET NAM",
          date: "Sự kiện đặc biệt",
          description: "Tales & Tastes of Vietnam với sứ mệnh mang đến những món ăn Việt Nam hiện đại, truyền tải văn hóa và những giá trị mà Bờm luôn trân trọng và giữ gìn thông qua những truyện cổ tích như độc lập, tự cường và nhân ái của dân tộc Việt.\nLấy các câu chuyện dân gian Việt Nam làm cảm hứng cho món ăn, các nguyên liệu tươi ngon cho mỗi món là yếu tố quan trọng dẫn dắt khách vào kho tàng lịch sử và văn hoá hào hùng của người Việt.",
          image: "http://localhost:5000/uploads/tales_vietnam.jpg",
          lang: "VN"
        },
        {
          title: "Culture Night: Japan",
          date: "15/09/2023",
          description: "To bring interesting culinary combinations between Vietnam and the world, the meaningful event series Culture Night was launched for the first time on September 15, 2023.\n\nIn this first Culture Night, BỜM brought a special menu that fans of the land of cherry blossoms cannot miss! A harmonious symphony between Vietnamese and Japanese cuisine.\n\nThis collaboration of two head chefs from BỜM, MAGURO STUDIO / SHOKU created a unique playground for chefs to combine their most unique recipes and create an Asian fusion menu.",
          image: "http://localhost:5000/uploads/culture_japan.jpg",
          lang: "EN"
        },
        {
          title: "Culture Night Japan",
          date: "15/09/2023",
          description: "Nhằm mang lại những màn kết hợp ẩm thực thú vị giữa Việt Nam và thế giới, chuỗi sự kiện ý nghĩa Culture Night (Đêm Hội Văn Hoá) được ra mắt lần đầu tiên vào ngày 15/9/2023.\n\nTrong đêm Culture Night đầu tiên này, nhà BỜM đã mang đến thực đơn đặc biệt mà các tín đồ của ẩm thực xứ hoa anh đào không thể bỏ qua! Một bản giao hưởng hòa hòa giữ ẩm thực Việt và Nhật.\n\nSự hợp tác lần này của hai bếp trưởng từ nhà BỜM, MAGURO STUDIO / SHOKU đã tạo nên sân chơi độc nhất để các đầu bếp có thể kết hợp những công thức độc đáo nhất của mình và tạo nên một thực đơn mang đậm chất Asian fusion.",
          image: "http://localhost:5000/uploads/culture_japan.jpg",
          lang: "VN"
        },
        {
          title: "Culture Night: Malaysia",
          date: "Chapter II",
          description: "In Chapter II of the Culture Night event series, diners got to enjoy a unique menu combining the culinary essence of Malaysia and Vietnam. With the participation of the talented team from Wildflowers KL, Malaysia, this cultural night brought fresh and inspiring experiences to local and international guests.",
          image: "http://localhost:5000/uploads/culture_malaysia.jpg",
          lang: "EN"
        },
        {
          title: "Culture Night Malaysia",
          date: "Chương II",
          description: "Vào chương II của chuỗi sự kiện Culture Night (Đêm Hội Văn Hoá), thực khách được thưởng thức thực đơn độc đáo kết hợp tinh hoa ẩm thực Malaysia và Việt Nam. Với sự góp mặt của đội ngũ tài năng từ Wildflowers KL, Malaysia, đêm văn hóa này đã mang đến những trải nghiệm mới mẻ và đầy cảm hứng cho những vị khách trong và ngoài nước.",
          image: "http://localhost:5000/uploads/culture_malaysia.jpg",
          lang: "VN"
        },
        {
          title: "Culture Night: USA",
          date: "Chapter III",
          description: "Continuing the Culture Night event series to honor the diverse beauty of culture around the world, Bờm presented the Culture Night USA event featuring Eddie's.\n\nComing to this event of Bờm & Eddie's, diners experienced a unique harmony from two different culinary worlds of Asia and the West.\n\nThrough this special menu, both restaurants wanted to convey the diversity and flexibility of Vietnamese cuisine when combined with other cuisines of the world. Enjoy traditional Vietnamese dishes with a unique twist to bring the signature flavors of magnificent New York City.",
          image: "http://localhost:5000/uploads/culture_american.jpg",
          lang: "EN"
        },
        {
          title: "Culture Night american",
          date: "Chương III",
          description: "Tiếp nối chuỗi sự kiện Culture Night (Đêm Hội Văn Hoá) nhằm tôn vinh vẻ đẹp đa dạng của văn hoá trên khắp thế giới, Bờm và sự kiện Culture Night USA với sự góp mặt của Eddie’s.\n\nĐến với sự kiện này của Bờm & Eddie’s, thực khách được trải nghiệm sự hòa hợp độc đáo từ hai thế giới ẩm thực Á và Âu khác biệt.\n\nQua thực đơn đặc biệt lần này, hai nhà hàng mong muốn truyền tải sự đa dạng và tính uyển chuyển của ẩm thực Việt khi có thể kết hợp với các nền ẩm thực thế giới. Tận hưởng những món ăn truyền thống Việt với sự phá cách khác biệt để mang hương vị đặc trưng của thành phố New York tráng lệ.",
          image: "http://localhost:5000/uploads/culture_american.jpg",
          lang: "VN"
        }
      ];

      await MenuItem.insertMany([...menuEN, ...menuVN]);
      await Event.insertMany(eventsData);

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
      await MenuCategory.insertMany(categorySeed);

      console.log('✅ Đã tạo dữ liệu mẫu thành công!');
    }

    const pressCount = await Press.countDocuments();
    const hasPressDescription = await Press.exists({ description: { $ne: null } });
    if (pressCount === 0 || !hasPressDescription) {
      await Press.deleteMany({});
      const pressData = [
        { title: "Bờm Kitchen - Hanoi's New Culinary Destination", source: "Tuoi Tre News", description: "Bờm Kitchen & Wine Bar has been a shining beacon on Vietnam's F&B landscape since 2022. Read about our journey and culinary philosophy.", link: "https://example.com/article1", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", lang: "EN" },
        { title: "Top 10 Most Romantic Restaurants in the Capital", source: "Dep Magazine", description: "Discover the most romantic dining experiences in the capital. Bờm Kitchen is proud to be featured as a top romantic spot.", link: "https://example.com/article2", image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400", lang: "EN" },
        { title: "Bờm Kitchen Nominated for Michelin 2024", source: "VnExpress International", description: "A milestone journey as Bờm Kitchen receives its official nomination for the prestigious Michelin Guide 2024.", link: "https://example.com/article3", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400", lang: "EN" },
        { title: "Bờm Kitchen - Điểm đến ẩm thực mới của Hà Nội", source: "Báo Tuổi Trẻ", description: "Bờm Kitchen & Wine Bar đã trở thành một điểm sáng đầy tự hào trên bản đồ ẩm thực Việt Nam kể từ năm 2022. Cùng khám phá hành trình đầy cảm hứng của chúng tôi.", link: "https://example.com/article1", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", lang: "VN" },
        { title: "Top 10 nhà hàng lãng mạn nhất thủ đô", source: "Tạp chí Đẹp", description: "Khám phá những không gian ẩm thực lãng mạn và tinh tế nhất tại thủ đô. Bờm Kitchen vinh dự là một trong mười lựa chọn hàng đầu cho các cặp đôi.", link: "https://example.com/article2", image: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400", lang: "VN" },
        { title: "Bờm Kitchen nhận đề cử Michelin 2024", source: "VnExpress", description: "Dấu mốc tự hào khi Bờm Kitchen chính thức được vinh danh và đề cử trong cẩm nang ẩm thực danh giá Michelin Guide 2024.", link: "https://example.com/article3", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400", lang: "VN" }
      ];
      await Press.insertMany(pressData);
      console.log('✅ Đã nạp lại dữ liệu Press mẫu với đầy đủ mô tả!');
    }

    const hasNewTypes = await MenuSet.exists({ menuType: { $in: ['alacarte', 'wine', 'khung'] } });
    if (!hasNewTypes) {
      await MenuSet.deleteMany({});
      await MenuSet.insertMany(seedMenuSets);
      console.log('✅ Đã nạp lại dữ liệu mẫu MenuSet với đầy đủ các loại (Set, Alacarte, Wine, Khung)');
    }

    const panelCount = await MenuPanel.countDocuments();
    if (panelCount === 0) {
      await MenuPanel.insertMany(seedMenuPanels);
      console.log('✅ Đã tạo panel A La Carte mẫu');
    }

    const categoryCount = await MenuCategory.countDocuments();
    if (categoryCount === 0 && menuCount > 0) {
      const items = await MenuItem.find();
      const seen = new Set();
      const categories = [];
      items.forEach((item, index) => {
        const key = `${item.lang}:${item.category}`;
        if (!seen.has(key)) {
          seen.add(key);
          categories.push({ name: item.category, lang: item.lang, sortOrder: index });
        }
      });
      if (categories.length > 0) {
        await MenuCategory.insertMany(categories);
        console.log('✅ Đã đồng bộ danh mục từ thực đơn hiện có');
      }
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

// --- UPLOAD API (PROTECTED) ---
app.post('/api/upload', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được tải lên' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
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

app.get('/api/menu-sets', async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const sets = await MenuSet.find({ lang }).sort({ sortOrder: 1, title: 1 });
    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/menu-panels', async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const panels = await MenuPanel.find({ lang }).sort({ sortOrder: 1, title: 1 });
    res.json(panels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN CRUD APIs (PROTECTED) ---

// Danh sách thực đơn phẳng (Admin)
app.get('/api/menu/admin', verifyToken, async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ lang: 1, category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quản lý Menu
app.post('/api/menu', verifyToken, async (req, res) => {
  try {
    const parsed = parseMenuBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const categoryExists = await MenuCategory.findOne({
      name: parsed.data.category,
      lang: parsed.data.lang
    });
    if (!categoryExists) {
      return res.status(400).json({ error: 'Danh mục không tồn tại. Vui lòng tạo danh mục trước.' });
    }

    const newItem = new MenuItem(parsed.data);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.put('/api/menu/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const parsed = parseMenuBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const categoryExists = await MenuCategory.findOne({
      name: parsed.data.category,
      lang: parsed.data.lang
    });
    if (!categoryExists) {
      return res.status(400).json({ error: 'Danh mục không tồn tại. Vui lòng tạo danh mục trước.' });
    }

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, parsed.data, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy món ăn' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/api/menu/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy món ăn' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quản lý Danh mục thực đơn
app.get('/api/categories', async (req, res) => {
  try {
    const lang = req.query.lang || 'EN';
    const categories = await MenuCategory.find({ lang }).sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/categories/admin', verifyToken, async (req, res) => {
  try {
    const categories = await MenuCategory.find().sort({ lang: 1, sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', verifyToken, async (req, res) => {
  try {
    const { name, lang, sortOrder } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
    if (!['EN', 'VN'].includes(lang)) return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ' });

    const category = new MenuCategory({
      name: name.trim(),
      lang,
      sortOrder: Number(sortOrder) || 0
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Danh mục đã tồn tại cho ngôn ngữ này' });
    }
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/categories/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    const existing = await MenuCategory.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy danh mục' });

    const { name, lang, sortOrder } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
    if (!['EN', 'VN'].includes(lang)) return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ' });

    const newName = name.trim();
    const oldName = existing.name;
    const oldLang = existing.lang;

    const updated = await MenuCategory.findByIdAndUpdate(
      req.params.id,
      { name: newName, lang, sortOrder: Number(sortOrder) || 0 },
      { new: true, runValidators: true }
    );

    if (oldName !== newName || oldLang !== lang) {
      await MenuItem.updateMany(
        { category: oldName, lang: oldLang },
        { $set: { category: newName, lang } }
      );
    }

    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Danh mục đã tồn tại cho ngôn ngữ này' });
    }
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/categories/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }

    const category = await MenuCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Không tìm thấy danh mục' });

    const itemCount = await MenuItem.countDocuments({
      category: category.name,
      lang: category.lang
    });
    if (itemCount > 0) {
      return res.status(400).json({
        error: `Không thể xóa: còn ${itemCount} món trong danh mục này`
      });
    }

    await MenuCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quản lý SET MENU (carousel)
app.get('/api/menu-sets/admin', verifyToken, async (req, res) => {
  try {
    const sets = await MenuSet.find().sort({ lang: 1, sortOrder: 1, title: 1 });
    res.json(sets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu-sets', verifyToken, async (req, res) => {
  try {
    const parsed = parseMenuSetBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const doc = new MenuSet(parsed.data);
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/menu-sets/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID không hợp lệ' });
    const parsed = parseMenuSetBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const updated = await MenuSet.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy SET MENU' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/menu-sets/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID không hợp lệ' });
    const deleted = await MenuSet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy SET MENU' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quản lý panel A La Carte (carousel)
app.get('/api/menu-panels/admin', verifyToken, async (req, res) => {
  try {
    const panels = await MenuPanel.find().sort({ lang: 1, sortOrder: 1, title: 1 });
    res.json(panels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu-panels', verifyToken, async (req, res) => {
  try {
    const parsed = parseMenuPanelBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const doc = new MenuPanel(parsed.data);
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/menu-panels/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID không hợp lệ' });
    const parsed = parseMenuPanelBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const updated = await MenuPanel.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy panel' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/menu-panels/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ error: 'ID không hợp lệ' });
    const deleted = await MenuPanel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy panel' });
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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const { title, date, description, image, lang } = req.body;
    if (!title?.trim() || !date?.trim()) {
      return res.status(400).json({ error: 'Tiêu đề và thời gian là bắt buộc' });
    }
    if (!['EN', 'VN'].includes(lang)) {
      return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ' });
    }
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        date: date.trim(),
        description: description?.trim() || '',
        image: image?.trim() || '',
        lang
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/api/events/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy sự kiện' });
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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const { title, source, description, link, image, lang } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Tiêu đề là bắt buộc' });
    if (!['EN', 'VN'].includes(lang)) {
      return res.status(400).json({ error: 'Ngôn ngữ không hợp lệ' });
    }
    const updated = await Press.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        source: source?.trim() || '',
        description: description?.trim() || '',
        link: link?.trim() || '',
        image: image?.trim() || '',
        lang
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy bài báo' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/api/press/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const deleted = await Press.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy bài báo' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Quản lý Reservations (Admin)
app.put('/api/reservations/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy đơn đặt bàn' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.delete('/api/reservations/:id', verifyToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Không tìm thấy đơn đặt bàn' });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API: Đặt bàn (Public)
app.post('/api/reservations', async (req, res) => {
  try {
    const { name, phone, email, guests, date, time, note } = req.body;
    
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
      email: email || '',
      guests: Number(guests),
      date,
      time,
      note: note || ''
    });
    
    await reservation.save();

    // Gửi email xác nhận đặt bàn chạy không đồng bộ (background)
    if (reservation.email) {
      sendConfirmationEmail(reservation).catch(err => {
        console.error('Lỗi khi gửi email xác nhận đặt bàn:', err);
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Đặt bàn thành công!',
      reservation: {
        id: reservation._id,
        name: reservation.customer_name,
        phone: reservation.phone,
        email: reservation.email,
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