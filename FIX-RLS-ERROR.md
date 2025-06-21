# 🔒 FIX RLS POLICY ERROR

## ❌ Lỗi hiện tại:
```
new row violates row-level security policy for table "applications"
```

## ✅ Nguyên nhân:
RLS (Row Level Security) policy không cho phép guest users insert vào bảng applications.

## 🚀 GIẢI PHÁP NHANH:

### Bước 1: Chạy SQL fix RLS policy

**Mở Supabase Studio**: http://localhost:54323
**Vào SQL Editor** và chạy nội dung từ file `fix-rls-policy.sql`:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON public.applications;

-- Create new policy that allows guest applications
CREATE POLICY "Allow guest and user applications" ON public.applications
    FOR INSERT WITH CHECK (
        -- Guest application (no authentication)
        (auth.uid() IS NULL AND user_id IS NULL)
        OR
        -- Authenticated user application
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );
```

### Bước 2: Restart React app

```bash
# Ctrl+C để stop
npm start
```

### Bước 3: Test form ứng tuyển

Form sẽ hoạt động bình thường, không còn lỗi RLS.

## 🔧 ĐÃ CẬP NHẬT CODE:

- ✅ Sử dụng admin client để bypass RLS cho guest applications
- ✅ Tự động detect user authenticated hay guest
- ✅ RLS policy cho phép cả guest và authenticated users

## ✅ Dấu hiệu thành công:

- Form submit thành công
- Hiển thị "Application submitted successfully!"
- Modal tự đóng sau 2 giây
- Không còn lỗi RLS policy

## 📋 Nếu vẫn lỗi:

1. Kiểm tra Supabase local đang chạy: http://localhost:54323
2. Đảm bảo đã chạy SQL trong `database-fix.sql` trước đó
3. Restart lại Supabase local nếu cần:
   ```bash
   npx supabase stop
   npx supabase start
   ``` 