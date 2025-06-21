-- FIX DATABASE SCHEMA FOR APPLICATIONS
-- Run this in Supabase SQL Editor or psql command line

-- Step 1: Add missing columns for applicant information
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;

-- Step 2: Allow guest applications (make user_id nullable)
ALTER TABLE public.applications 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Remove old unique constraint that requires user_id
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_job_id_user_id_key;

-- Step 4: Create new unique constraint for authenticated users only
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_job_application 
ON public.applications (job_id, user_id) 
WHERE user_id IS NOT NULL;

-- Step 5: Update RLS policy to allow guest applications
DROP POLICY IF EXISTS "Users can insert applications" ON public.applications;

CREATE POLICY "Anyone can insert applications" ON public.applications
    FOR INSERT WITH CHECK (
        -- Allow authenticated users to insert their own applications
        (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
        OR 
        -- Allow guest applications (no authentication required)
        (auth.uid() IS NULL AND user_id IS NULL)
    );

-- Step 6: Verification - Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
  AND table_schema = 'public'
ORDER BY ordinal_position; 