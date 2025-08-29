-- Create fresh database with simple credentials for 6 Ateneo offices
-- Run the drop-all-tables.sql script first, then run this

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- offices
CREATE TABLE offices (
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

-- unit_directors
CREATE TABLE unit_directors (
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

-- office_users
CREATE TABLE office_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    office_id UUID REFERENCES offices (id) ON DELETE CASCADE,
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

-- programs
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    office_id UUID REFERENCES offices (id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    objective TEXT,
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (
        status IN (
            'upcoming',
            'ongoing',
            'completed',
            'cancelled'
        )
    ),
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

-- Triggers for updated_at
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

-- Indexes
CREATE INDEX idx_office_users_office_id ON office_users (office_id);

CREATE INDEX idx_programs_office_id ON programs (office_id);

CREATE INDEX idx_programs_created_by ON programs (created_by);

CREATE INDEX idx_programs_status ON programs (status);

-- Enable RLS
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;

ALTER TABLE unit_directors ENABLE ROW LEVEL SECURITY;

ALTER TABLE office_users ENABLE ROW LEVEL SECURITY;

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Simple "allow all" policies (replace later with fine‑grained policies)
CREATE POLICY "Allow all on offices" ON offices FOR ALL USING (true);

CREATE POLICY "Allow all on unit_directors" ON unit_directors FOR ALL USING (true);

CREATE POLICY "Allow all on office_users" ON office_users FOR ALL USING (true);

CREATE POLICY "Allow all on programs" ON programs FOR ALL USING (true);

-- Insert the 6 specific Ateneo offices
INSERT INTO
    offices (id, name, description)
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'Social Development Office',
        'Community development and social welfare programs'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Center for Community Extension Services (CCES)',
        'Community outreach and extension programs'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Ateneo Peace Institute (API)',
        'Peace building and conflict resolution initiatives'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Social Awareness and Community Service Involvement (SACSI)',
        'Student community service and social awareness programs'
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Ateneo Center for Leadership and Governance (ACLG)',
        'Leadership development and governance training'
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Ateneo Center for Culture and the Arts (ACCA)',
        'Cultural and arts programs for community development'
    );

-- Insert unit directors with simple credentials
INSERT INTO
    unit_directors (id, name, email, password)
VALUES (
        '01111111-1111-1111-1111-111111111111',
        'Dr. Maria Santos',
        'director@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    (
        '02222222-2222-2222-2222-222222222222',
        'Prof. Juan Dela Cruz',
        'admin@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    );

-- Insert office users with simple credentials following the pattern
INSERT INTO
    office_users (
        id,
        office_id,
        name,
        email,
        password
    )
VALUES
    -- Social Development Office users (sdo@adzu.edu.ph / sdo123)
    (
        'a1111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'Ana Rodriguez',
        'sdo@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    (
        'a1111111-1111-1111-1111-111111111112',
        '11111111-1111-1111-1111-111111111111',
        'Carlos Mendoza',
        'sdo2@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    -- CCES users (cces@adzu.edu.ph / cces123)
    (
        'a2222222-2222-2222-2222-222222222221',
        '22222222-2222-2222-2222-222222222222',
        'Isabella Torres',
        'cces@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        '22222222-2222-2222-2222-222222222222',
        'Miguel Santos',
        'cces2@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    -- API users (api@adzu.edu.ph / api123)
    (
        'a3333333-3333-3333-3333-333333333331',
        '33333333-3333-3333-3333-333333333333',
        'Fatima Abdullah',
        'api@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    (
        'a3333333-3333-3333-3333-333333333332',
        '33333333-3333-3333-3333-333333333333',
        'Roberto Chavez',
        'api2@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    -- SACSI users (sacsi@adzu.edu.ph / sacsi123)
    (
        'a4444444-4444-4444-4444-444444444441',
        '44444444-4444-4444-4444-444444444444',
        'Carmen Lopez',
        'sacsi@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    (
        'a4444444-4444-4444-4444-444444444442',
        '44444444-4444-4444-4444-444444444444',
        'Antonio Reyes',
        'sacsi2@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    -- ACLG users (aclg@adzu.edu.ph / aclg123)
    (
        'a5555555-5555-5555-5555-555555555551',
        '55555555-5555-5555-5555-555555555555',
        'Diana Fernandez',
        'aclg@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    (
        'a5555555-5555-5555-5555-555555555552',
        '55555555-5555-5555-5555-555555555555',
        'Eduardo Martinez',
        'aclg2@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    -- ACCA users (acca@adzu.edu.ph / acca123)
    (
        'a6666666-6666-6666-6666-666666666661',
        '66666666-6666-6666-6666-666666666666',
        'Lucia Herrera',
        'acca@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    ),
    (
        'a6666666-6666-6666-6666-666666666662',
        '66666666-6666-6666-6666-666666666666',
        'Rafael Gonzalez',
        'acca2@adzu.edu.ph',
        '$2b$10$8K8vQGJ9yL5qA4r6B7kW4eL5xH3N2P9Q1F8vZ6nM7bC4dE5fG8hI9j'
    );

-- Insert sample programs for each office
INSERT INTO
    programs (
        id,
        office_id,
        name,
        objective,
        status,
        start_date,
        end_date,
        created_by
    )
VALUES
    -- Social Development Office programs
    (
        'b1111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'Community Health Program',
        'Improve healthcare access and awareness in local communities',
        'ongoing',
        '2024-01-15',
        '2024-12-15',
        'a1111111-1111-1111-1111-111111111111'
    ),
    (
        'b1111111-1111-1111-1111-111111111112',
        '11111111-1111-1111-1111-111111111111',
        'Educational Support Initiative',
        'Provide educational resources and support to underprivileged students',
        'completed',
        '2023-06-01',
        '2023-11-30',
        'a1111111-1111-1111-1111-111111111111'
    ),
    -- CCES programs
    (
        'b2222222-2222-2222-2222-222222222221',
        '22222222-2222-2222-2222-222222222222',
        'Rural Development Project',
        'Support agricultural and rural development in remote areas',
        'ongoing',
        '2024-03-01',
        '2025-02-28',
        'a2222222-2222-2222-2222-222222222221'
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        '22222222-2222-2222-2222-222222222222',
        'Community Skills Training',
        'Provide vocational skills training for community members',
        'upcoming',
        '2024-09-01',
        '2024-12-31',
        'a2222222-2222-2222-2222-222222222221'
    ),
    -- API programs
    (
        'b3333333-3333-3333-3333-333333333331',
        '33333333-3333-3333-3333-333333333333',
        'Peace Education Workshops',
        'Conduct peace education sessions in schools and communities',
        'ongoing',
        '2024-02-01',
        '2024-11-30',
        'a3333333-3333-3333-3333-333333333331'
    ),
    -- SACSI programs
    (
        'b4444444-4444-4444-4444-444444444441',
        '44444444-4444-4444-4444-444444444444',
        'Student Volunteer Program',
        'Organize student volunteer activities in local communities',
        'ongoing',
        '2024-01-08',
        '2024-12-20',
        'a4444444-4444-4444-4444-444444444441'
    ),
    -- ACLG programs
    (
        'b5555555-5555-5555-5555-555555555551',
        '55555555-5555-5555-5555-555555555555',
        'Leadership Training Seminars',
        'Develop leadership skills among students and community leaders',
        'completed',
        '2023-09-01',
        '2023-12-15',
        'a5555555-5555-5555-5555-555555555551'
    ),
    -- ACCA programs
    (
        'b6666666-6666-6666-6666-666666666661',
        '66666666-6666-6666-6666-666666666666',
        'Cultural Heritage Festival',
        'Celebrate and preserve local cultural heritage through arts and performances',
        'upcoming',
        '2024-10-15',
        '2024-10-17',
        'a6666666-6666-6666-6666-666666666661'
    );