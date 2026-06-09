const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("No MONGODB_URI found in env");
  process.exit(1);
}

// 1. Copy images
const mediaStorageDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\54f263dc-9a85-49bb-b745-c4e149656ac8\\.tempmediaStorage';
const uploadsDir = path.join(__dirname, 'uploads');

const filesToCopy = [
  { src: 'media_54f263dc-9a85-49bb-b745-c4e149656ac8_1780113946880.jpg', dest: 'tales_vietnam.jpg' },
  { src: 'media_54f263dc-9a85-49bb-b745-c4e149656ac8_1780113960502.jpg', dest: 'culture_japan.jpg' },
  { src: 'media_54f263dc-9a85-49bb-b745-c4e149656ac8_1780113974709.jpg', dest: 'culture_malaysia.jpg' },
  { src: 'media_54f263dc-9a85-49bb-b745-c4e149656ac8_1780113993056.jpg', dest: 'culture_american.jpg' }
];

console.log("📂 Copying image assets to uploads directory...");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

filesToCopy.forEach(item => {
  const srcPath = path.join(mediaStorageDir, item.src);
  const destPath = path.join(uploadsDir, item.dest);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${item.src} -> ${item.dest}`);
  } else {
    console.warn(`⚠️ Source file not found: ${srcPath}`);
  }
});

// 2. Seed Database
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  lang: { type: String, required: true }
});
const Event = mongoose.model('Event', eventSchema);

const newEventsData = [
  {
    title: "TALES & TASTES OF VIET NAM",
    date: "Sự kiện đặc biệt",
    description: `Tales & Tastes of Vietnam với sứ mệnh mang đến những món ăn Việt Nam hiện đại, truyền tải văn hóa và những giá trị mà Bờm luôn trân trọng và giữ gìn thông qua những truyện cổ tích như độc lập, tự cường và nhân ái của dân tộc Việt.
Lấy các câu chuyện dân gian Việt Nam làm cảm hứng cho món ăn, các nguyên liệu tươi ngon cho mỗi món là yếu tố quan trọng dẫn dắt khách vào kho tàng lịch sử và văn hoá hào hùng của người Việt.`,
    image: "http://localhost:5000/uploads/tales_vietnam.jpg",
    lang: "VN"
  },
  {
    title: "TALES & TASTES OF VIET NAM",
    date: "Special Event",
    description: `Tales & Tastes of Vietnam with the mission of bringing modern Vietnamese dishes, conveying culture and values that Bờm always appreciates and preserves through fairy tales such as independence, self-reliance and kindness of the Vietnamese nation.
Taking Vietnamese folk tales as inspiration for dishes, fresh ingredients for each dish are key elements leading guests into the heroic history and culture treasury of Vietnamese people.`,
    image: "http://localhost:5000/uploads/tales_vietnam.jpg",
    lang: "EN"
  },
  {
    title: "Culture Night Japan",
    date: "15/09/2023",
    description: `Nhằm mang lại những màn kết hợp ẩm thực thú vị giữa Việt Nam và thế giới, chuỗi sự kiện ý nghĩa Culture Night (Đêm Hội Văn Hoá) được ra mắt lần đầu tiên vào ngày 15/9/2023.

Trong đêm Culture Night đầu tiên này, nhà BỜM đã mang đến thực đơn đặc biệt mà các tín đồ của ẩm thực xứ hoa anh đào không thể bỏ qua! Một bản giao hưởng hòa hòa giữ ẩm thực Việt và Nhật.

Sự hợp tác lần này của hai bếp trưởng từ nhà BỜM, MAGURO STUDIO / SHOKU đã tạo nên sân chơi độc nhất để các đầu bếp có thể kết hợp những công thức độc đáo nhất của mình và tạo nên một thực đơn mang đậm chất Asian fusion.`,
    image: "http://localhost:5000/uploads/culture_japan.jpg",
    lang: "VN"
  },
  {
    title: "Culture Night: Japan",
    date: "15/09/2023",
    description: `To bring interesting culinary combinations between Vietnam and the world, the meaningful event series Culture Night was launched for the first time on September 15, 2023.

In this first Culture Night, BỜM brought a special menu that fans of the land of cherry blossoms cannot miss! A harmonious symphony between Vietnamese and Japanese cuisine.

This collaboration of two head chefs from BỜM, MAGURO STUDIO / SHOKU created a unique playground for chefs to combine their most unique recipes and create an Asian fusion menu.`,
    image: "http://localhost:5000/uploads/culture_japan.jpg",
    lang: "EN"
  },
  {
    title: "Culture Night Malaysia",
    date: "Chương II",
    description: `Vao chương II của chuỗi sự kiện Culture Night (Đêm Hội Văn Hoá), thực khách được thưởng thức thực đơn độc đáo kết hợp tinh hoa ẩm thực Malaysia và Việt Nam. Với sự góp mặt của đội ngũ tài năng từ Wildflowers KL, Malaysia, đêm văn hóa này đã mang đến những trải nghiệm mới mẻ và đầy cảm hứng cho những vị khách trong và ngoài nước.`,
    image: "http://localhost:5000/uploads/culture_malaysia.jpg",
    lang: "VN"
  },
  {
    title: "Culture Night: Malaysia",
    date: "Chapter II",
    description: `In Chapter II of the Culture Night event series, diners got to enjoy a unique menu combining the culinary essence of Malaysia and Vietnam. With the participation of the talented team from Wildflowers KL, Malaysia, this cultural night brought fresh and inspiring experiences to local and international guests.`,
    image: "http://localhost:5000/uploads/culture_malaysia.jpg",
    lang: "EN"
  },
  {
    title: "Culture Night american",
    date: "Chương III",
    description: `Tiếp nối chuỗi sự kiện Culture Night (Đêm Hội Văn Hoá) nhằm tôn vinh vẻ đẹp đa dạng của văn hoá trên khắp thế giới, Bờm và sự kiện Culture Night USA với sự góp mặt của Eddie’s.

Đến với sự kiện này của Bờm & Eddie’s, thực khách được trải nghiệm sự hòa hợp độc đáo từ hai thế giới ẩm thực Á và Âu khác biệt.

Qua thực đơn đặc biệt lần này, hai nhà hàng mong muốn truyền tải sự đa dạng và tính uyển chuyển của ẩm thực Việt khi có thể kết hợp với các nền ẩm thực thế giới. Tận hưởng những món ăn truyền thống Việt với sự phá cách khác biệt để mang hương vị đặc trưng của thành phố New York tráng lệ.`,
    image: "http://localhost:5000/uploads/culture_american.jpg",
    lang: "VN"
  },
  {
    title: "Culture Night: USA",
    date: "Chapter III",
    description: `Continuing the Culture Night event series to honor the diverse beauty of culture around the world, Bờm presented the Culture Night USA event featuring Eddie's.

Coming to this event of Bờm & Eddie's, diners experienced a unique harmony from two different culinary worlds of Asia and the West.

Through this special menu, both restaurants wanted to convey the diversity and flexibility of Vietnamese cuisine when combined with other cuisines of the world. Enjoy traditional Vietnamese dishes with a unique twist to bring the signature flavors of magnificent New York City.`,
    image: "http://localhost:5000/uploads/culture_american.jpg",
    lang: "EN"
  }
];

console.log("📡 Connecting to MongoDB Atlas...");
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    
    console.log("Clearing old events...");
    await Event.deleteMany({});
    
    console.log("Inserting new events...");
    await Event.insertMany(newEventsData);
    
    console.log("Database seeded successfully with new events!");
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
