const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  console.log('Đang kiểm tra kết nối...');
  console.log('URI:', MONGODB_URI ? 'Có URI' : 'Không có URI');

  if (!MONGODB_URI) {
    console.error('Lỗi: Không tìm thấy MONGODB_URI trong file .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Đã kết nối MongoDB Atlas thành công!');
    console.log('Database:', mongoose.connection.db.databaseName);
  } catch (err) {
    console.error(' Lỗi kết nối MongoDB:', err.message);
    console.log('\n Kiểm tra lại:');
    console.log('   1. Mật khẩu trong file .env có đúng không?');
    console.log('   2. IP đã được thêm vào Network Access chưa?');
    console.log('   3. User có quyền đọc/ghi không?');
    process.exit(1);
  }
};

module.exports = connectDB;
