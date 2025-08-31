-- Database Update Script: Add SDG and ADZU Goals to Programs
-- Date: August 31, 2025
-- Purpose: Add Sustainable Development Goals and ADZU Goals tracking to programs

BEGIN;

-- Add new columns to programs table
ALTER TABLE programs 
ADD COLUMN IF NOT EXISTS sustainable_development_goals TEXT[],
ADD COLUMN IF NOT EXISTS adzu_goals TEXT[],
ADD COLUMN IF NOT EXISTS program_heads TEXT[],
ADD COLUMN IF NOT EXISTS proposed_date DATE,
ADD COLUMN IF NOT EXISTS actual_start_date DATE,
ADD COLUMN IF NOT EXISTS target_beneficiaries INTEGER,
ADD COLUMN IF NOT EXISTS actual_beneficiaries INTEGER;

-- Create enum types for better data validation (optional but recommended)
DO $$ BEGIN
    CREATE TYPE sdg_goals AS ENUM (
        '1. No Poverty',
        '2. Zero Hunger', 
        '3. Good Health and Well-being',
        '4. Quality Education',
        '5. Gender Equality',
        '6. Clean Water and Sanitation',
        '7. Affordable and Clean Energy',
        '8. Decent Work and Economic Growth',
        '9. Industry, Innovation and Infrastructure',
        '10. Reduced Inequality',
        '11. Sustainable Cities and Communities',
        '12. Responsible Consumption and Production',
        '13. Climate Action',
        '14. Life Below Water',
        '15. Life on Land',
        '16. Peace and Justice Strong Institutions',
        '17. Partnerships to achieve the Goal'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE adzu_goal_types AS ENUM (
        'Academic Excellence',
        'Community Engagement', 
        'Faith Formation',
        'Social Justice'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing data with sample values (optional)
UPDATE programs SET 
    sustainable_development_goals = ARRAY['4. Quality Education'],
    adzu_goals = ARRAY['Academic Excellence'],
    program_heads = ARRAY[
        (SELECT name FROM office_users WHERE office_id = programs.office_id LIMIT 1)
    ],
    proposed_date = start_date - INTERVAL '30 days',
    actual_start_date = start_date,
    target_beneficiaries = participants_count,
    actual_beneficiaries = participants_count
WHERE sustainable_development_goals IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programs_sdg_goals ON programs USING GIN (sustainable_development_goals);

CREATE INDEX IF NOT EXISTS idx_programs_adzu_goals ON programs USING GIN (adzu_goals);

CREATE INDEX IF NOT EXISTS idx_programs_heads ON programs USING GIN (program_heads);

-- Add constraints and comments
COMMENT ON COLUMN programs.sustainable_development_goals IS 'Array of selected UN Sustainable Development Goals (1-17)';

COMMENT ON COLUMN programs.adzu_goals IS 'Array of selected ADZU institutional goals (Academic Excellence, Community Engagement, Faith Formation, Social Justice)';

COMMENT ON COLUMN programs.program_heads IS 'Array of program leaders/heads responsible for implementation';

COMMENT ON COLUMN programs.proposed_date IS 'Initially proposed start date for the program';

COMMENT ON COLUMN programs.actual_start_date IS 'Actual date when program implementation started';

COMMENT ON COLUMN programs.target_beneficiaries IS 'Target number of beneficiaries/participants';

COMMENT ON COLUMN programs.actual_beneficiaries IS 'Actual number of beneficiaries/participants reached';

-- Verify the changes
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE
    table_name = 'programs'
    AND column_name IN (
        'sustainable_development_goals',
        'adzu_goals',
        'program_heads',
        'proposed_date',
        'actual_start_date',
        'target_beneficiaries',
        'actual_beneficiaries'
    )
ORDER BY ordinal_position;

COMMIT;

-- Summary of changes
SELECT
    'Database update completed!' as message,
    (
        SELECT COUNT(*)
        FROM programs
    ) as total_programs,
    (
        SELECT COUNT(*)
        FROM programs
        WHERE
            sustainable_development_goals IS NOT NULL
    ) as programs_with_sdg,
    (
        SELECT COUNT(*)
        FROM programs
        WHERE
            adzu_goals IS NOT NULL
    ) as programs_with_adzu_goals;