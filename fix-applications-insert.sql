-- =====================================================
-- FIX APPLICATIONS TABLE STRUCTURE
-- =====================================================

-- First, let's see what columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position;

-- Drop the table and recreate it with the correct structure
DROP TABLE IF EXISTS applications CASCADE;

CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    cover_letter TEXT DEFAULT '',
    linkedin_profile TEXT,
    resume_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to create applications" ON applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view own applications" ON applications
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow job owners to view applications" ON applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  )
);

CREATE POLICY "Allow users to update own applications" ON applications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow job owners to update applications" ON applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM jobs 
    WHERE jobs.id = applications.job_id 
    AND jobs.employer_id = auth.uid()
  )
);

-- Show the final structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position; 