-- Add new columns to applications table for storing applicant information
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;

-- Allow user_id to be null for guest applications
ALTER TABLE public.applications 
ALTER COLUMN user_id DROP NOT NULL;

-- Remove the unique constraint that requires user_id
ALTER TABLE public.applications 
DROP CONSTRAINT IF EXISTS applications_job_id_user_id_key;

-- Add new unique constraint that allows multiple applications per job from guests
-- but still prevents duplicate applications from the same authenticated user
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_job_application 
ON public.applications (job_id, user_id) 
WHERE user_id IS NOT NULL;

-- Update RLS policies to allow guest applications
DROP POLICY IF EXISTS "Users can insert applications" ON public.applications;

-- New policy that allows both authenticated users and guests to insert applications
CREATE POLICY "Anyone can insert applications" ON public.applications
    FOR INSERT WITH CHECK (
        -- Either authenticated user inserting their own application
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR 
        -- Or guest application (user_id is null and auth.uid() is null)
        (auth.uid() IS NULL AND user_id IS NULL)
    );

-- Update existing schema file
-- Note: This migration should be run on both local and production databases 