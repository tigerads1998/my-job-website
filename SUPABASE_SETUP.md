# Supabase Setup Guide

## 1. Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng ký/đăng nhập tài khoản
3. Click "New Project"
4. Chọn organization và đặt tên project
5. Chọn database password (lưu lại để sử dụng sau)
6. Chọn region gần nhất
7. Click "Create new project"

## 2. Lấy Project Credentials

1. Vào project dashboard
2. Vào Settings > API
3. Copy các thông tin sau:
   - Project URL
   - anon/public key

## 3. Cấu hình Environment Variables

1. Tạo file `.env` trong thư mục gốc của project
2. Thêm các biến môi trường:

```env
REACT_APP_SUPABASE_URL=your_project_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

## 4. Setup Database Schema

1. Vào SQL Editor trong Supabase dashboard
2. Copy toàn bộ nội dung từ file `supabase-schema.sql`
3. Paste và chạy SQL script
4. Kiểm tra các bảng đã được tạo trong Table Editor

## 5. Cấu hình Authentication

1. Vào Authentication > Settings
2. Cấu hình Site URL: `http://localhost:3000` (development)
3. Thêm redirect URLs:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/callback`

## 6. Cấu hình Storage (Optional)

Nếu cần upload files (resume, etc.):

1. Vào Storage trong dashboard
2. Tạo bucket mới tên "resumes"
3. Cấu hình RLS policies cho bucket

## 7. Test Setup

1. Chạy `npm start`
2. Thử đăng ký tài khoản mới
3. Kiểm tra user được tạo trong database

## 8. Production Deployment

Khi deploy lên production:

1. Cập nhật Site URL trong Authentication settings
2. Thêm production domain vào redirect URLs
3. Cấu hình environment variables trên hosting platform

## Troubleshooting

### Lỗi "Invalid API key"
- Kiểm tra lại anon key trong .env file
- Đảm bảo đã restart development server sau khi thêm .env

### Lỗi "RLS policy violation"
- Kiểm tra RLS policies trong database
- Đảm bảo user đã được authenticate

### Lỗi "Table not found"
- Chạy lại SQL schema script
- Kiểm tra tên bảng trong code có đúng không

## Database Schema Overview

### Tables:
- `users`: Thông tin user profile
- `jobs`: Thông tin công việc
- `applications`: Đơn ứng tuyển

### Key Features:
- Row Level Security (RLS) enabled
- Automatic user profile creation on signup
- Role-based access control
- Real-time subscriptions support 