-- Update database to use only 6 Ateneo offices as specified
-- First, clean up existing data in correct order to respect foreign key constraints
DELETE FROM programs;

DELETE FROM office_users;

DELETE FROM unit_directors;

DELETE FROM offices;

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

-- Insert unit directors
INSERT INTO
    unit_directors (id, name, email, password)
VALUES (
        '01111111-1111-1111-1111-111111111111',
        'Dr. Maria Santos',
        'director@adzu.edu.ph',
        '$2b$10$hashedpassword1'
    ),
    (
        '02222222-2222-2222-2222-222222222222',
        'Prof. Juan Dela Cruz',
        'asst.director@adzu.edu.ph',
        '$2b$10$hashedpassword2'
    );

-- Insert office users for each office
INSERT INTO
    office_users (
        id,
        office_id,
        name,
        email,
        password
    )
VALUES
    -- Social Development Office users
    (
        'u1111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'Ana Rodriguez',
        'sdo.staff1@adzu.edu.ph',
        '$2b$10$hashedpassword'
    ),
    (
        'u1111111-1111-1111-1111-111111111112',
        '11111111-1111-1111-1111-111111111111',
        'Carlos Mendoza',
        'sdo.staff2@adzu.edu.ph',
        '$2b$10$hashedpassword'
    ),

-- CCES users
(
    'u2222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    'Isabella Torres',
    'cces.staff1@adzu.edu.ph',
    '$2b$10$hashedpassword'
),
(
    'u2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Miguel Santos',
    'cces.staff2@adzu.edu.ph',
    '$2b$10$hashedpassword'
),

-- API users
(
    'u3333333-3333-3333-3333-333333333331',
    '33333333-3333-3333-3333-333333333333',
    'Fatima Abdullah',
    'api.staff1@adzu.edu.ph',
    '$2b$10$hashedpassword'
),
(
    'u3333333-3333-3333-3333-333333333332',
    '33333333-3333-3333-3333-333333333333',
    'Roberto Chavez',
    'api.staff2@adzu.edu.ph',
    '$2b$10$hashedpassword'
),

-- SACSI users
(
    'u4444444-4444-4444-4444-444444444441',
    '44444444-4444-4444-4444-444444444444',
    'Carmen Lopez',
    'sacsi.staff1@adzu.edu.ph',
    '$2b$10$hashedpassword'
),
(
    'u4444444-4444-4444-4444-444444444442',
    '44444444-4444-4444-4444-444444444444',
    'Antonio Reyes',
    'sacsi.staff2@adzu.edu.ph',
    '$2b$10$hashedpassword'
),

-- ACLG users
(
    'u5555555-5555-5555-5555-555555555551',
    '55555555-5555-5555-5555-555555555555',
    'Diana Fernandez',
    'aclg.staff1@adzu.edu.ph',
    '$2b$10$hashedpassword'
),
(
    'u5555555-5555-5555-5555-555555555552',
    '55555555-5555-5555-5555-555555555555',
    'Eduardo Martinez',
    'aclg.staff2@adzu.edu.ph',
    '$2b$10$hashedpassword'
),

-- ACCA users
(
    'u6666666-6666-6666-6666-666666666661',
    '66666666-6666-6666-6666-666666666666',
    'Lucia Herrera',
    'acca.staff1@adzu.edu.ph',
    '$2b$10$hashedpassword'
),
(
    'u6666666-6666-6666-6666-666666666662',
    '66666666-6666-6666-6666-666666666666',
    'Rafael Gonzalez',
    'acca.staff2@adzu.edu.ph',
    '$2b$10$hashedpassword'
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
        end_date
    )
VALUES
    -- Social Development Office programs
    (
        'p1111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'Community Health Program',
        'Improve healthcare access and awareness in local communities',
        'ongoing',
        '2024-01-15',
        '2024-12-15'
    ),
    (
        'p1111111-1111-1111-1111-111111111112',
        '11111111-1111-1111-1111-111111111111',
        'Educational Support Initiative',
        'Provide educational resources and support to underprivileged students',
        'completed',
        '2023-06-01',
        '2023-11-30'
    ),

-- CCES programs
(
    'p2222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    'Rural Development Project',
    'Support agricultural and rural development in remote areas',
    'ongoing',
    '2024-03-01',
    '2025-02-28'
),
(
    'p2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Community Skills Training',
    'Provide vocational skills training for community members',
    'upcoming',
    '2024-09-01',
    '2024-12-31'
),

-- API programs
(
    'p3333333-3333-3333-3333-333333333331',
    '33333333-3333-3333-3333-333333333333',
    'Peace Education Workshops',
    'Conduct peace education sessions in schools and communities',
    'ongoing',
    '2024-02-01',
    '2024-11-30'
),

-- SACSI programs
(
    'p4444444-4444-4444-4444-444444444441',
    '44444444-4444-4444-4444-444444444444',
    'Student Volunteer Program',
    'Organize student volunteer activities in local communities',
    'ongoing',
    '2024-01-08',
    '2024-12-20'
),

-- ACLG programs
(
    'p5555555-5555-5555-5555-555555555551',
    '55555555-5555-5555-5555-555555555555',
    'Leadership Training Seminars',
    'Develop leadership skills among students and community leaders',
    'completed',
    '2023-09-01',
    '2023-12-15'
),

-- ACCA programs
(
    'p6666666-6666-6666-6666-666666666661',
    '66666666-6666-6666-6666-666666666666',
    'Cultural Heritage Festival',
    'Celebrate and preserve local cultural heritage through arts and performances',
    'upcoming',
    '2024-10-15',
    '2024-10-17'
);