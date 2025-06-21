-- Add the new 'is_verified' column to the 'jobs' table
-- We add it as nullable with a default value of FALSE so it doesn't break existing rows.
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE; 