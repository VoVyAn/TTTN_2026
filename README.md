# Hệ Thống Đặt Bàn Nhà Hàng (Restaurant Booking System)

Một ứng dụng Web Fullstack (MERN Stack) cho phép khách hàng xem thực đơn, tin tức, sự kiện và thực hiện đặt bàn trực tuyến. Đồng thời cung cấp một trang quản trị (Admin Dashboard) mạnh mẽ giúp nhà hàng quản lý dữ liệu và nhận thông báo đặt bàn theo thời gian thực.

## Tính năng nổi bật

### Dành cho Khách Hàng (User)
- **Xem thực đơn đa dạng:** Menu Alacarte, Set Menu, Đồ uống.
- **Đặt bàn trực tuyến:** Chọn ngày, giờ, số người và gửi yêu cầu nhanh chóng. Hệ thống tích hợp kiểm tra dữ liệu chặt chẽ (không cho phép đặt ngày trong quá khứ).
- **Email tự động:** Nhận email thông báo xác nhận ngay sau khi đặt bàn thành công.
- **Xem tin tức & sự kiện:** Cập nhật thông tin và sự kiện mới nhất từ nhà hàng.

### Dành cho Quản Trị Viên (Admin)
- **Đăng nhập an toàn:** Hệ thống xác thực bằng JWT (JSON Web Token) và mã hóa mật khẩu với Bcrypt.
- **Phân quyền (RBAC):** Hỗ trợ quyền `admin` (toàn quyền) và `user` (quyền hạn chế, không được sửa đổi thông tin quan trọng của khách hàng).
- **Quản lý Đặt bàn Real-time:** Nhận thông báo đơn đặt bàn mới ngay lập tức qua Socket.io mà không cần tải lại trang (F5).
- **Quản lý nội dung:** Giao diện trực quan để Thêm, Sửa, Xóa Thực đơn, Sự kiện, Bài viết (Press) và Danh mục.
- **Upload & Tối ưu hình ảnh:** Hỗ trợ upload ảnh và tự động nén, chuyển đổi định dạng ảnh (WebP) bằng thư viện Multer & Sharp để tăng tốc độ tải trang.

## Công nghệ sử dụng

- **Frontend:** React.js, React Router Dom, Axios, Socket.io-client.
- **Backend:** Node.js, Express.js, Socket.io, Nodemailer, Multer, Sharp.
- **Database:** MongoDB & Mongoose.
- **Bảo mật:** JWT, Bcryptjs, Cors.

## Hướng dẫn cài đặt & Chạy dự án (Local)

### 1. Yêu cầu hệ thống
- **Node.js** (Phiên bản v16 trở lên)
- **MongoDB** (Cài đặt trên máy hoặc dùng MongoDB Atlas)

### 2. Cài đặt Backend
Mở Terminal / Command Prompt và chạy các lệnh sau:
```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend` và điền các thông tin sau (bạn có thể thay đổi tùy cấu hình máy bạn):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0...
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
JWT_SECRET=your_jwt_secret_key
```

Khởi chạy Backend:
```bash
npm run dev
# Server backend sẽ chạy tại: http://localhost:5000
```

### 3. Cài đặt Frontend
Mở một Terminal mới (để terminal backend tiếp tục chạy):
```bash
cd frontend
npm install
```

Khởi chạy Frontend:
```bash
npm start
# Ứng dụng web sẽ chạy tại: http://localhost:3000
```

## Cấu trúc thư mục (Folder Structure)
- `backend/`: Chứa mã nguồn Server (Node.js/Express), Models (Mongoose), Controllers xử lý logic, Routes và cấu hình MongoDB.
- `frontend/`: Chứa mã nguồn giao diện (React.js), Components, Pages, CSS, và các hàm gọi API (Axios).

## Tài liệu API
Xem chi tiết các phương thức giao tiếp giữa Frontend và Backend tại file: [API_DOCS.md](./API_DOCS.md)
