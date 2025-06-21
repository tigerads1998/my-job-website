# 🔧 HƯỚNG DẪN FIX DATABASE

## ❌ Vấn đề hiện tại:
- Lỗi: "Could not find the 'email' column"
- Lỗi: "User not authenticated"

## ✅ Giải pháp:

### CÁCH 1: Sử dụng Supabase Studio (KHUYẾN NGHỊ)

1. **Mở Supabase Studio**: http://localhost:54323
2. **Đăng nhập** (nếu cần)
3. **Click "SQL Editor"** ở sidebar bên trái
4. **Copy toàn bộ nội dung** từ file `database-fix.sql`
5. **Paste vào SQL Editor**
6. **Click "Run"** để thực thi
7. **Kiểm tra kết quả** - sẽ hiển thị danh sách các cột

### CÁCH 2: Sử dụng psql (nếu có cài)

```bash
psql postgresql://postgres:postgres@localhost:54322/postgres -f database-fix.sql
```

### CÁCH 3: Copy-paste từng lệnh

Nếu các cách trên không được, copy từng lệnh SQL này và chạy riêng:

```sql
-- Lệnh 1: Thêm cột
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;
```

```sql
-- Lệnh 2: Cho phép user_id null
ALTER TABLE public.applications 
ALTER COLUMN user_id DROP NOT NULL;
```

```sql
-- Lệnh 3: Xóa constraint cũ
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_job_id_user_id_key;
```

```sql
-- Lệnh 4: Tạo index mới
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_job_application 
ON public.applications (job_id, user_id) 
WHERE user_id IS NOT NULL;
```

```sql
-- Lệnh 5: Cập nhật policy
DROP POLICY IF EXISTS "Users can insert applications" ON public.applications;

CREATE POLICY "Anyone can insert applications" ON public.applications
    FOR INSERT WITH CHECK (
        (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
        OR 
        (auth.uid() IS NULL AND user_id IS NULL)
    );
```

## 🎯 Sau khi chạy xong:

1. **Restart React app**: Ctrl+C rồi `npm start`
2. **Test form ứng tuyển** - sẽ hoạt động bình thường
3. **Không cần đăng nhập** để ứng tuyển

## ✅ Dấu hiệu thành công:

- Form submit thành công
- Hiển thị "Application submitted successfully!"
- Không còn lỗi về email column
- Không còn lỗi authentication 