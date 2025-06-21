-- Bật Row Level Security (RLS) cho bảng 'jobs' nếu chưa bật.
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Xóa chính sách cũ có tên "Employers can insert jobs" nếu nó tồn tại.
-- Lệnh 'IF EXISTS' đảm bảo không bị lỗi nếu chính sách không có.
DROP POLICY IF EXISTS "Employers can insert jobs" ON public.jobs;

-- Xóa chính sách cũ có tên "Allow job insertion" nếu nó tồn tại.
DROP POLICY IF EXISTS "Allow job insertion" ON public.jobs;

-- Tạo một chính sách (policy) mới cho phép BẤT KỲ ai cũng có thể thêm (INSERT) công việc mới.
-- 'USING (true)' và 'WITH CHECK (true)' có nghĩa là không có điều kiện nào bị kiểm tra, cho phép mọi thao tác INSERT.
CREATE POLICY "Public can insert jobs" ON public.jobs
    FOR INSERT
    WITH CHECK (true);

-- Chính sách này cho phép bất kỳ ai (kể cả người dùng chưa đăng nhập) có thể xem các công việc đang hoạt động (is_active = true).
DROP POLICY IF EXISTS "Anyone can view active jobs" ON public.jobs;
CREATE POLICY "Public can view active jobs" ON public.jobs
    FOR SELECT
    USING (is_active = true); 