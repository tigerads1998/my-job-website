-- =====================================================
-- CHECK APPLICATIONS TABLE JSON COLUMNS
-- =====================================================

-- Check all columns and their data types
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position;

-- Check if there are any JSON columns
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'applications' 
AND data_type IN ('json', 'jsonb')
ORDER BY ordinal_position;

-- Check the actual table structure
\d applications;

-- Check if there are any constraints on JSON columns
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'applications'
AND kcu.column_name IN (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'applications' 
    AND data_type IN ('json', 'jsonb')
); 