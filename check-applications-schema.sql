-- =====================================================
-- CHECK AND FIX APPLICATIONS TABLE SCHEMA
-- =====================================================

-- Check current schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'name'
    ) THEN
        ALTER TABLE applications ADD COLUMN name TEXT;
    END IF;

    -- Add email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'email'
    ) THEN
        ALTER TABLE applications ADD COLUMN email TEXT;
    END IF;

    -- Add linkedin_profile column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'linkedin_profile'
    ) THEN
        ALTER TABLE applications ADD COLUMN linkedin_profile TEXT;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'status'
    ) THEN
        ALTER TABLE applications ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Show final schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position; 