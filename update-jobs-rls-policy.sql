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