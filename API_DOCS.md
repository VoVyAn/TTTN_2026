# Tài Liệu API (API Documentation)

**Base URL:** `http://localhost:5000/api`

Tài liệu này liệt kê các endpoint API cốt lõi được sử dụng trong hệ thống Restaurant Booking để giúp Frontend giao tiếp với Backend.

> **Lưu ý Quan trọng:** 
 Các API yêu cầu xác thực (Thêm, Sửa, Xóa nội dung hoặc Xem đơn đặt bàn) đều bắt buộc phải có Header:  
> `Authorization: Bearer <JWT_TOKEN_CỦA_BẠN>`

---

## 1. Xác thực & Phân quyền (Auth)

### 1.1. Đăng nhập hệ thống (Admin Login)
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Mô tả:** Đăng nhập vào hệ thống quản trị để nhận token xác thực.
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "your_password"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "role": "admin"
  }
  ```

---

## 2. Quản lý Đặt bàn (Reservations)

### 2.1. Lấy danh sách đặt bàn
- **Method:** `GET`
- **Endpoint:** `/reservations`
- **Mô tả:** Lấy toàn bộ danh sách khách đặt bàn (Dành cho Admin). Yêu cầu Token.

### 2.2. Khách hàng đặt bàn mới
- **Method:** `POST`
- **Endpoint:** `/reservations`
- **Mô tả:** API gọi khi khách hàng gửi form đặt bàn. Hệ thống tự động: Lưu DB -> Gửi Email xác nhận qua Nodemailer -> Gửi sự kiện Socket.io đến Admin.
- **Request Body:**
  ```json
  {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "nva@gmail.com",
    "date": "2026-06-20",
    "time": "19:00",
    "guests": 2,
    "notes": "Bàn riêng tư cạnh cửa sổ"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Reservation created successfully",
    "reservation": { ... }
  }
  ```

### 2.3. Cập nhật thông tin đặt bàn
- **Method:** `PUT`
- **Endpoint:** `/reservations/:id`
- **Mô tả:** Cập nhật trạng thái hoặc thông tin đơn đặt bàn (Yêu cầu Token).

---

## 3. Quản lý Thực đơn (Menus & Menu Sets)

### 3.1. Lấy danh sách thực đơn Alacarte
- **Method:** `GET`
- **Endpoint:** `/menus`
- **Mô tả:** Trả về danh sách các món ăn lẻ hiển thị cho khách hàng.

### 3.2. Lấy danh sách Set Menu
- **Method:** `GET`
- **Endpoint:** `/menu-sets`
- **Mô tả:** Trả về danh sách các Set ăn đặc biệt đã cấu hình.

### 3.3. Thêm món ăn mới (Admin)
- **Method:** `POST`
- **Endpoint:** `/menus`
- **Mô tả:** Thêm một món ăn mới vào cơ sở dữ liệu (Yêu cầu Token).
- **Request Body:**
  ```json
  {
    "name": "Steak Bò Mỹ",
    "description": "Thịt bò Mỹ nướng sốt tiêu xanh",
    "price": 500000,
    "category": "60d5ecb54b3...",
    "image": "/uploads/steak.webp"
  }
  ```

---

## 4. Quản lý Sự kiện & Tin tức (Events & Press)

### 4.1. Lấy danh sách Sự kiện
- **Method:** `GET`
- **Endpoint:** `/events`
- **Mô tả:** Lấy danh sách các sự kiện đang diễn ra tại nhà hàng.

### 4.2. Lấy danh sách Báo chí (Press)
- **Method:** `GET`
- **Endpoint:** `/press`
- **Mô tả:** Lấy danh sách các bài báo hoặc thông tin báo chí về nhà hàng.

---

## 5. Xử lý Upload Hình ảnh (Upload)

### 5.1. Upload ảnh lên Server
- **Method:** `POST`
- **Endpoint:** `/upload`
- **Headers:** `Content-Type: multipart/form-data` (Bắt buộc kèm Token)
- **Mô tả:** Dùng để upload ảnh món ăn, sự kiện... Ảnh sẽ được xử lý qua thư viện Sharp, nén và tự động đổi đuôi thành WebP để tối ưu cho Web.
- **Request Body:** Gửi bằng `FormData` với key là `image`.
- **Response (200 OK):**
  ```json
  {
    "imageUrl": "/uploads/1623456789-image-name.webp"
  }
  ```
