-- FIX RLS POLICY FOR GUEST APPLICATIONS
-- This fixes the "new row violates row-level security policy" error

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Users can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON public.applications;

-- Step 2: Create new policy that allows guest applications
CREATE POLICY "Allow guest and user applications" ON public.applications
    FOR INSERT WITH CHECK (
        -- Case 1: Guest application (no authentication)
        (auth.uid() IS NULL AND user_id IS NULL)
        OR
        -- Case 2: Authenticated user application
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );

-- Step 3: Also allow reading applications for guests (optional)
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;

CREATE POLICY "Users can view applications" ON public.applications
    FOR SELECT USING (
        -- Users can see their own applications
        auth.uid() = user_id
        OR
        -- Employers can see applications for their jobs
        EXISTS (
            SELECT 1 FROM public.jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id = auth.uid()
        )
    );

-- Step 4: Verify policy exists
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'applications';

-- Step 5: Test query (should work without error)
-- This is just for verification - you don't need to run this manually
-- INSERT INTO public.applications (job_id, name, email, cover_letter, user_id) 
-- VALUES ('test-job-id', 'Test User', 'test@example.com', 'Test application', NULL); 