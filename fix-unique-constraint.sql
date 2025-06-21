-- FIX UNIQUE CONSTRAINT FOR APPLICATIONS
-- This prevents duplicate applications while allowing guest users

-- Drop existing constraint if any
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_job_id_user_id_key;
DROP INDEX IF EXISTS unique_user_job_application;

-- For guest applications, we'll prevent duplicates based on job_id + email
-- For authenticated users, we'll prevent duplicates based on job_id + user_id

-- Create unique constraint for authenticated users
CREATE UNIQUE INDEX IF NOT EXISTS unique_authenticated_user_job_application 
ON public.applications (job_id, user_id) 
WHERE user_id IS NOT NULL;

-- Create unique constraint for guest users based on email
CREATE UNIQUE INDEX IF NOT EXISTS unique_guest_job_application 
ON public.applications (job_id, email) 
WHERE user_id IS NULL;

-- Verify constraints
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'applications' 
  AND indexname LIKE '%unique%'; 