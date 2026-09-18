# 📚 ZeraBooks - Website Bán Sách & Văn Phòng Phẩm Trực Tuyến

![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Backend-Node.js_Express-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/UI-React_Bootstrap_5-7952B3?logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

**ZeraBooks** là hệ thống thương mại điện tử chuyên nghiệp cung cấp sách (tiếng Việt, ngoại văn), dụng cụ học tập, văn phòng phẩm, đồ thủ công và quà lưu niệm. Dự án được phát triển theo mô hình Full-stack với **React** ở Frontend và **Node.js (Express) + MongoDB** ở Backend.

---

## 🌟 Tính Năng Nổi Bật

### 🛒 Dành cho Khách Hàng (Client)
* **Trang chủ & Danh mục:** Hiển thị banner khuyến mãi, sản phẩm mới, sách bán chạy và phân loại danh mục sản phẩm đa dạng.
* **Chi tiết sản phẩm:** Xem thông tin chi tiết, giá bán, mô tả, hình ảnh và đánh giá từ khách hàng.
* **Giỏ hàng & Đặt hàng:** Quản lý giỏ hàng linh hoạt, áp dụng mã giảm giá, hỗ trợ các hình thức thanh toán (COD, Chuyển khoản QR).
* **Theo dõi đơn hàng (Order Tracking):** Tra cứu tiến độ xử lý và lịch sử đơn hàng trực quan.
* **Đánh giá & Đổi trả:** Gửi đánh giá sản phẩm và yêu cầu đổi trả hàng dễ dàng.
* **Đa ngôn ngữ (i18n):** Hỗ trợ chuyển đổi giữa Tiếng Việt 🇻🇳 và Tiếng Anh 🇬🇧.

### 🛡️ Dành cho Quản Trị Viên (Admin Dashboard)
* **Thống kê tổng quan:** Biểu đồ doanh thu, số lượng đơn hàng, sản phẩm và khách hàng.
* **Quản lý sản phẩm:** Thêm, sửa, xóa các danh mục sách, văn phòng phẩm, quà tặng cùng hình ảnh minh họa.
* **Quản lý đơn hàng:** Tiếp nhận, cập nhật trạng thái đơn hàng (Đang xử lý, Đang giao, Đã hoàn thành, Hủy) và xử lý yêu cầu đổi trả.
* **Quản lý Banner:** Tùy chỉnh danh sách banner hiển thị trên trang chủ.
* **Quản lý khách hàng:** Xem danh sách và trạng thái tài khoản người dùng.

---

## 🏗️ Công Nghệ Sử Dụng

### Frontend
- **Framework:** React 19, React Router DOM v6
- **UI & Styling:** React-Bootstrap 5, Custom CSS
- **State & API Management:** Axios, React Context API (`AuthContext`, `CartContext`)
- **Đa ngôn ngữ:** `i18next`, `react-i18next`

### Backend
- **Core:** Node.js, Express.js
- **Database:** MongoDB, Mongoose ORM
- **Authentication:** JSON Web Token (JWT), `bcryptjs`
- **File Upload:** `multer` (Lưu trữ hình ảnh sản phẩm & banner)
- **Middleware & Utils:** `express-validator`, `morgan`, `cors`, `dotenv`

---

## 📁 Cấu Trúc Dự Án

```text
zera_books/
├── public/                  # Static assets & HTML template
│   └── images/              # Hình ảnh sản phẩm, banner mặc định
├── server/                  # Node.js / Express Backend API
│   ├── config/              # Kết nối Database (MongoDB)
│   ├── controllers/         # Xử lý logic nghiệp vụ (Auth, Book, Order,...)
│   ├── middleware/          # JWT Auth, Upload, Validation, Error Handler
│   ├── models/              # Mongoose Schema Models
│   ├── routes/              # Express RESTful API Routes
│   ├── utils/               # Helper functions & response formats
│   ├── .env.example         # File cấu hình biến môi trường mẫu cho Server
│   └── server.js            # Entry point của Backend
├── src/                     # React Frontend Source Code
│   ├── components/          # Reusable Components (Navbar, Footer, Modals,...)
│   ├── config/              # Cấu hình ứng dụng
│   ├── context/             # AuthContext, CartContext
│   ├── features/            # Các tính năng phức tạp (Admin, Books, Checkout)
│   ├── i18n/                # Cấu hình đa ngôn ngữ (vi, en)
│   ├── pages/               # Trang ứng dụng (Home, Books, Cart, Admin,...)
│   ├── services/            # API Services (Axios instances & API calls)
│   ├── styles/              # Global CSS & CSS Variables
│   ├── utils/               # Utilities & Helpers
│   ├── App.js               # Main Component & Routing
│   └── index.js             # Client Entry point
├── .env.example             # Biến môi trường mẫu cho Frontend
├── .gitignore               # Cấu hình Git ignore
├── package.json             # Frontend Dependencies & Scripts
└── README.md                # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Tiên Quyết
- **Node.js**: `>= 18.x`
- **npm**: `>= 9.x`
- **MongoDB**: Đã cài đặt trên máy local hoặc sử dụng **MongoDB Atlas** URL.

---

### 1️⃣ Cấu Hình Backend (Server)

1. Di chuyển vào thư mục `server`:
   ```bash
   cd server
   ```

2. Cài đặt các gói phụ thuộc (dependencies):
   ```bash
   npm install
   ```

3. Tạo file cấu hình môi trường `.env` từ file mẫu `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Cấu hình các biến trong `.env`:*
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/zera_books
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

4. Chạy Backend Server:
   - **Chế độ phát triển (Development mode với Nodemon):**
     ```bash
     npm run dev
     ```
   - **Chế độ chạy thường (Production mode):**
     ```bash
     npm start
     ```
   *(Server sẽ chạy tại: `http://localhost:5000`)*

---

### 2️⃣ Cấu Hình Frontend (Client)

1. Mở một Terminal mới và quay lại thư mục gốc dự án:
   ```bash
   cd zera_books
   ```

2. Cài đặt các gói phụ thuộc (dependencies):
   ```bash
   npm install
   ```

3. Tạo file cấu hình môi trường `.env` (nếu cần đổi URL API):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Khởi chạy Ứng dụng React:
   ```bash
   npm start
   ```
   *(Ứng dụng sẽ tự động mở tại trình duyệt: `http://localhost:3000`)*

---

## 🛠️ Scripts Khả Dụng

### Frontend (`/`)
- `npm start`: Khởi chạy ứng dụng React ở chế độ Development.
- `npm run build`: Đóng gói ứng dụng vào thư mục `build/` cho Production.
- `npm test`: Chạy các bài test tự động.

### Backend (`/server`)
- `npm run dev`: Chạy server Node.js với `nodemon` (tự động reload khi sửa code).
- `npm start`: Khởi chạy server Node.js thông thường.

---

## 📄 Giấy Phép (License)

Dự án được phân phối dưới giấy phép **MIT License**.
