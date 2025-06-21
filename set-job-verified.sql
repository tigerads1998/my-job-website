-- Script to set specific jobs as verified
-- Update job với title "Hiring" thành verified
UPDATE public.jobs 
SET is_verified = TRUE 
WHERE title ILIKE '%hiring%';

-- Hoặc nếu muốn set tất cả jobs từ một company cụ thể thành verified:
-- UPDATE public.jobs 
-- SET is_verified = TRUE 
-- WHERE company = 'Onlinejobs';

-- Kiểm tra kết quả
SELECT id, title, company, is_verified 
FROM public.jobs 
WHERE is_verified = TRUE; 