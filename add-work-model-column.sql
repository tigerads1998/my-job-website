-- Step 1: Create the new ENUM type for the work model if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_model_type') THEN
        CREATE TYPE work_model_type AS ENUM ('on-site', 'remote', 'hybrid');
    END IF;
END$$;

-- Step 2: Add the new 'work_model' column to the 'jobs' table if it doesn't exist
-- We add it as nullable so it doesn't break existing rows.
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS work_model work_model_type; 