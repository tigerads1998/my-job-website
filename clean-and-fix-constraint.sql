-- CLEAN DUPLICATE DATA AND FIX CONSTRAINTS
-- Step by step to handle existing duplicates

-- Step 1: Clear all existing applications (fresh start)
DELETE FROM public.applications;

-- Step 2: Drop any existing constraints/indexes
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_job_id_user_id_key;
DROP INDEX IF EXISTS unique_user_job_application;
DROP INDEX IF EXISTS unique_authenticated_user_job_application;
DROP INDEX IF EXISTS unique_guest_job_application;

-- Step 3: Create new unique constraints
-- For authenticated users: prevent duplicate job_id + user_id
CREATE UNIQUE INDEX unique_authenticated_user_job_application 
ON public.applications (job_id, user_id) 
WHERE user_id IS NOT NULL;

-- For guest users: prevent duplicate job_id + email  
CREATE UNIQUE INDEX unique_guest_job_application 
ON public.applications (job_id, email) 
WHERE user_id IS NULL;

-- Step 4: Verify the constraints are created
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'applications' 
  AND indexname LIKE '%unique%';

-- Step 5: Test with sample data
INSERT INTO public.applications (job_id, name, email, cover_letter, user_id) 
VALUES 
    ((SELECT id FROM public.jobs LIMIT 1), 'Test User 1', 'test1@example.com', 'Test application 1', NULL),
    ((SELECT id FROM public.jobs LIMIT 1), 'Test User 2', 'test2@example.com', 'Test application 2', NULL);

-- Step 6: Verify data inserted correctly
SELECT id, job_id, name, email, user_id FROM public.applications; 