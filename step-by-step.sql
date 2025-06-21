-- STEP 1: Add missing columns (run this first)
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;

-- STEP 2: Allow null user_id (run this second)
ALTER TABLE public.applications ALTER COLUMN user_id DROP NOT NULL;

-- STEP 3: Drop old constraint (run this third)
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_job_id_user_id_key;

-- STEP 4: Check existing policies (run this to see current policies)
SELECT policyname FROM pg_policies WHERE tablename = 'applications';

-- STEP 5A: If policy exists, drop it first (only run if needed)
-- DROP POLICY IF EXISTS "Allow guest and user applications" ON public.applications;

-- STEP 5B: Create new policy (run this last)
-- Only run this if the policy doesn't exist or after dropping it
CREATE POLICY "Allow guest and user applications" ON public.applications
    FOR INSERT WITH CHECK (
        (auth.uid() IS NULL AND user_id IS NULL) OR
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    ); 