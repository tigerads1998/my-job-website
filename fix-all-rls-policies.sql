-- =====================================================
-- FIX ALL RLS POLICIES FOR JOBS AND APPLICATIONS
-- =====================================================

-- First, drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public to view active jobs" ON jobs;
DROP POLICY IF EXISTS "Allow public to create jobs" ON jobs;
DROP POLICY IF EXISTS "Allow job owners to update jobs" ON jobs;
DROP POLICY IF EXISTS "Allow job owners to delete jobs" ON jobs;
DROP POLICY IF EXISTS "Allow job owners to view own jobs" ON jobs;

DROP POLICY IF EXISTS "Allow public to create applications" ON applications;
DROP POLICY IF EXISTS "Allow users to view own applications" ON applications;
DROP POLICY IF EXISTS "Allow job owners to view applications" ON applications;
DROP POLICY IF EXISTS "Allow users to update own applications" ON applications;
DROP POLICY IF EXISTS "Allow job owners to update applications" ON applications;

-- =====================================================
-- JOBS TABLE POLICIES
-- =====================================================

-- Enable RLS on jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to view active jobs
CREATE POLICY "Allow public to view active jobs" ON jobs
FOR SELECT USING (is_active = true);

-- Policy to allow anyone to create jobs (for guest job posting)
CREATE POLICY "Allow public to create jobs" ON jobs
FOR INSERT WITH CHECK (true);

-- Policy to allow job owners to update their own jobs
CREATE POLICY "Allow job owners to update jobs" ON jobs
FOR UPDATE USING (auth.uid() = employer_id);

-- Policy to allow job owners to delete their own jobs
CREATE POLICY "Allow job owners to delete jobs" ON jobs
FOR DELETE USING (auth.uid() = employer_id);

-- Policy to allow job owners to view their own jobs (including inactive ones)
CREATE POLICY "Allow job owners to view own jobs" ON jobs
FOR SELECT USING (auth.uid() = employer_id);

-- =====================================================
-- APPLICATIONS TABLE POLICIES
-- =====================================================

-- Enable RLS on applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to create applications (for guest applications)
CREATE POLICY "Allow public to create applications" ON applications
FOR INSERT WITH CHECK (true);

-- Policy to allow users to view their own applications
CREATE POLICY "Allow users to view own applications" ON applications
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy to allow job owners to view applications for their jobs
CREATE POLICY "Allow job owners to view applications" ON applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  )
);

-- Policy to allow users to update their own applications
CREATE POLICY "Allow users to update own applications" ON applications
FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow job owners to update applications for their jobs
CREATE POLICY "Allow job owners to update applications" ON applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  )
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if policies were created successfully
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('jobs', 'applications')
ORDER BY tablename, policyname; 