-- Update RLS policy to allow internal job posting with temporary user ID
-- Drop existing policy
DROP POLICY IF EXISTS "Employers can insert jobs" ON public.jobs;

-- Create new policy that allows both authenticated users and internal posting
CREATE POLICY "Allow job insertion" ON public.jobs
    FOR INSERT WITH CHECK (
        auth.uid() = employer_id 
        OR 
        employer_id = '00000000-0000-0000-0000-000000000000'
    );

-- Also allow viewing jobs with temporary employer_id
DROP POLICY IF EXISTS "Employers can view their own jobs" ON public.jobs;

CREATE POLICY "Allow job viewing" ON public.jobs
    FOR SELECT USING (
        is_active = true 
        OR 
        auth.uid() = employer_id 
        OR 
        employer_id = '00000000-0000-0000-0000-000000000000'
    ); 