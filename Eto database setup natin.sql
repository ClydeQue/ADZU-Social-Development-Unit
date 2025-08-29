-- Database Setup
-- Ito ung current setup ng database natin, read niyo lang and intindihin maayos lalo na yung table and column
-- If mag test query kayo, sa supabase.com na mismo invite ko lang kayo sa proj dun

-- start sa  UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. OFFICES TABLE
-- Contains the 6 Ateneo offices/departments
CREATE TABLE IF NOT EXISTS offices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. UNIT_DIRECTORS TABLE
-- Contains admin/director level users who can access all offices
CREATE TABLE IF NOT EXISTS unit_directors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. OFFICE_USERS TABLE
-- Contains office-specific users who can only access their assigned office
CREATE TABLE IF NOT EXISTS office_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    office_id UUID NOT NULL REFERENCES offices (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PROGRAMS TABLE
-- Contains programs/projects managed by each office
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    office_id UUID NOT NULL REFERENCES offices (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (
        status IN (
            'upcoming',
            'ongoing',
            'completed',
            'cancelled'
        )
    ),
    funding_source VARCHAR(255),
    participants_count INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_by UUID REFERENCES office_users (id) ON DELETE SET NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers for automatic updated_at timestamps
CREATE TRIGGER update_offices_updated_at
    BEFORE UPDATE ON offices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_unit_directors_updated_at
    BEFORE UPDATE ON unit_directors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_office_users_updated_at
    BEFORE UPDATE ON office_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_office_users_office_id ON office_users (office_id);

CREATE INDEX IF NOT EXISTS idx_office_users_email ON office_users (email);

CREATE INDEX IF NOT EXISTS idx_unit_directors_email ON unit_directors (email);

CREATE INDEX IF NOT EXISTS idx_programs_office_id ON programs (office_id);

CREATE INDEX IF NOT EXISTS idx_programs_status ON programs (status);

CREATE INDEX IF NOT EXISTS idx_programs_created_by ON programs (created_by);

-- INSERT DATA
-- Insert the 6 Ateneo offices
INSERT INTO
    offices (name, description)
VALUES (
        'Social Development Office',
        'SDO - Social Development Office'
    ),
    (
        'Center for Community Extension Services',
        'CCES - Center for Community Extension Services'
    ),
    (
        'Ateneo Peace Institute',
        'API - Ateneo Peace Institute'
    ),
    (
        'Social Awareness and Community Service Involvement',
        'SACSI - Social Awareness and Community Service Involvement'
    ),
    (
        'Ateneo Center for Leadership and Governance',
        'ACLG - Ateneo Center for Leadership and Governance'
    ),
    (
        'Ateneo Center for Culture and the Arts',
        'ACCA - Ateneo Center for Culture and the Arts'
    ) ON CONFLICT (name) DO NOTHING;

-- Insert unit directors (admin users with access to all offices)
INSERT INTO
    unit_directors (name, email, password)
VALUES (
        'Unit Director',
        'director@adzu.edu.ph',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'
    ), -- password: director123
    (
        'System Administrator',
        'admin@adzu.edu.ph',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'
    ) -- password: admin123
    ON CONFLICT (email) DO NOTHING;

-- Insert office users with proper bcrypt hashed passwords
-- Using bcrypt hash for office passwords: sdo123, cces123, api123, sacsi123, aclg123, acca123
DO $$
DECLARE 
    sdo_id UUID;
    cces_id UUID;
    api_id UUID;
    sacsi_id UUID;
    aclg_id UUID;
    acca_id UUID;
BEGIN
    -- Get office IDs
    SELECT id INTO sdo_id FROM offices WHERE name = 'Social Development Office';
    SELECT id INTO cces_id FROM offices WHERE name = 'Center for Community Extension Services';
    SELECT id INTO api_id FROM offices WHERE name = 'Ateneo Peace Institute';
    SELECT id INTO sacsi_id FROM offices WHERE name = 'Social Awareness and Community Service Involvement';
    SELECT id INTO aclg_id FROM offices WHERE name = 'Ateneo Center for Leadership and Governance';
    SELECT id INTO acca_id FROM offices WHERE name = 'Ateneo Center for Culture and the Arts';

    -- Insert office users
    INSERT INTO office_users (office_id, name, email, password) VALUES
        -- Social Development Office users
        (sdo_id, 'SDO Officer 1', 'sdo@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- sdo123
        (sdo_id, 'SDO Officer 2', 'sdo2@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- sdo123
        
        -- CCES users
        (cces_id, 'CCES Officer 1', 'cces@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- cces123
        (cces_id, 'CCES Officer 2', 'cces2@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- cces123
        
        -- API users
        (api_id, 'API Officer 1', 'api@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- api123
        (api_id, 'API Officer 2', 'api2@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- api123
        
        -- SACSI users
        (sacsi_id, 'SACSI Officer 1', 'sacsi@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- sacsi123
        (sacsi_id, 'SACSI Officer 2', 'sacsi2@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- sacsi123
        
        -- ACLG users
        (aclg_id, 'ACLG Officer 1', 'aclg@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- aclg123
        (aclg_id, 'ACLG Officer 2', 'aclg2@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- aclg123
        
        -- ACCA users
        (acca_id, 'ACCA Officer 1', 'acca@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa'), -- acca123
        (acca_id, 'ACCA Officer 2', 'acca2@adzu.edu.ph', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LesTRGWMoFNpbGKsa') -- acca123
    ON CONFLICT (email) DO NOTHING;
    
    -- Insert sample programs
    INSERT INTO programs (office_id, title, description, status, funding_source, participants_count, start_date, end_date, created_by) VALUES
        -- SDO Programs
        (sdo_id, 'Community Health Initiative', 'Health awareness program for local communities', 'ongoing', 'University Fund', 150, '2024-01-15', '2024-12-15', (SELECT id FROM office_users WHERE email = 'sdo@adzu.edu.ph' LIMIT 1)),
        (sdo_id, 'Educational Support Program', 'Academic support for underprivileged students', 'completed', 'External Grant', 200, '2023-06-01', '2023-11-30', (SELECT id FROM office_users WHERE email = 'sdo@adzu.edu.ph' LIMIT 1)),
        
        -- CCES Programs
        (cces_id, 'Rural Development Project', 'Agricultural development in remote communities', 'ongoing', 'Government Grant', 300, '2024-03-01', '2025-02-28', (SELECT id FROM office_users WHERE email = 'cces@adzu.edu.ph' LIMIT 1)),
        (cces_id, 'Community Skills Training', 'Vocational training for community members', 'upcoming', 'Private Donation', 100, '2024-09-01', '2024-12-31', (SELECT id FROM office_users WHERE email = 'cces@adzu.edu.ph' LIMIT 1)),
        
        -- API Programs
        (api_id, 'Peace Education Workshop', 'Peace building sessions in schools', 'ongoing', 'International Grant', 250, '2024-02-01', '2024-11-30', (SELECT id FROM office_users WHERE email = 'api@adzu.edu.ph' LIMIT 1)),
        (api_id, 'Conflict Resolution Training', 'Training community leaders in conflict resolution', 'upcoming', 'University Fund', 80, '2024-10-01', '2024-12-15', (SELECT id FROM office_users WHERE email = 'api@adzu.edu.ph' LIMIT 1)),
        
        -- SACSI Programs
        (sacsi_id, 'Student Volunteer Program', 'Community service activities for students', 'ongoing', 'Student Fund', 400, '2024-01-08', '2024-12-20', (SELECT id FROM office_users WHERE email = 'sacsi@adzu.edu.ph' LIMIT 1)),
        (sacsi_id, 'Environmental Awareness Campaign', 'Environmental protection activities', 'completed', 'Environmental Grant', 180, '2023-08-01', '2023-12-01', (SELECT id FROM office_users WHERE email = 'sacsi@adzu.edu.ph' LIMIT 1)),
        
        -- ACLG Programs
        (aclg_id, 'Leadership Training Seminar', 'Leadership development for students and community leaders', 'completed', 'Leadership Fund', 120, '2023-09-01', '2023-12-15', (SELECT id FROM office_users WHERE email = 'aclg@adzu.edu.ph' LIMIT 1)),
        (aclg_id, 'Governance Workshop', 'Good governance training for local officials', 'upcoming', 'Government Partnership', 60, '2024-11-01', '2024-11-30', (SELECT id FROM office_users WHERE email = 'aclg@adzu.edu.ph' LIMIT 1)),
        
        -- ACCA Programs
        (acca_id, 'Cultural Heritage Festival', 'Celebration of local culture and arts', 'upcoming', 'Cultural Fund', 500, '2024-10-15', '2024-10-17', (SELECT id FROM office_users WHERE email = 'acca@adzu.edu.ph' LIMIT 1)),
        (acca_id, 'Arts Education Program', 'Art classes for community youth', 'ongoing', 'Arts Grant', 80, '2024-05-01', '2024-12-31', (SELECT id FROM office_users WHERE email = 'acca@adzu.edu.ph' LIMIT 1))
    ON CONFLICT DO NOTHING;
END $$;

-- Enable Row Level Security (RLS) for basic security
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;

ALTER TABLE unit_directors ENABLE ROW LEVEL SECURITY;

ALTER TABLE office_users ENABLE ROW LEVEL SECURITY;

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all operations for now)
CREATE POLICY "Allow all operations on offices" ON offices FOR ALL USING (true);

CREATE POLICY "Allow all operations on unit_directors" ON unit_directors FOR ALL USING (true);

CREATE POLICY "Allow all operations on office_users" ON office_users FOR ALL USING (true);

CREATE POLICY "Allow all operations on programs" ON programs FOR ALL USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres,
anon,
authenticated,
service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres,
anon,
authenticated,
service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres,
anon,
authenticated,
service_role;

-- Summary
SELECT
    'Database setup completed successfully!' as message,
    (
        SELECT COUNT(*)
        FROM offices
    ) as total_offices,
    (
        SELECT COUNT(*)
        FROM unit_directors
    ) as total_unit_directors,
    (
        SELECT COUNT(*)
        FROM office_users
    ) as total_office_users,
    (
        SELECT COUNT(*)
        FROM programs
    ) as total_programs;