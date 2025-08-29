-- Update Supabase database with actual Ateneo de Zamboanga University offices and data

-- Clear existing sample data first
DELETE FROM programs;

DELETE FROM office_users;

DELETE FROM unit_directors;

DELETE FROM offices;

-- Insert actual Ateneo offices with specific IDs for consistency
INSERT INTO
    offices (id, name, description)
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'Office of the President',
        'University executive office overseeing strategic leadership and institutional governance'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Office of the Vice President for Academic Affairs',
        'Manages academic programs, faculty development, and educational quality assurance'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Office of the Vice President for Student Affairs',
        'Coordinates student services, activities, and development programs'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Office of the Vice President for Administration',
        'Oversees administrative services, human resources, and institutional operations'
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'Office of the Vice President for Finance',
        'Manages financial planning, budgeting, and fiscal operations'
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        'Center for Community Extension Services (CCES)',
        'Facilitates community engagement and extension programs connecting university resources with local communities'
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        'Ateneo Peace Institute (API)',
        'Promotes peace education, conflict resolution, and peacebuilding initiatives in Mindanao'
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        'Social Awareness and Community Service Involvement (SACSI)',
        'Develops social awareness programs and coordinates student community service activities'
    ),
    (
        '99999999-9999-9999-9999-999999999999',
        'Ateneo Center for Leadership and Governance (ACLG)',
        'Provides leadership development and governance training programs for students and communities'
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0',
        'Ateneo Center for Culture and the Arts (ACCA)',
        'Preserves and promotes local culture and arts through various community programs and initiatives'
    );

-- Insert unit directors with proper Ateneo de Zamboanga University titles
INSERT INTO
    unit_directors (id, name, email, password)
VALUES (
        '01111111-1111-1111-1111-111111111111',
        'University President',
        'president@adzu.edu.ph',
        '$2b$10$hashedpassword1'
    ),
    (
        '02222222-2222-2222-2222-222222222222',
        'Vice President for Academic Affairs',
        'vpaa@adzu.edu.ph',
        '$2b$10$hashedpassword2'
    ),
    (
        '03333333-3333-3333-3333-333333333333',
        'Vice President for Student Affairs',
        'vpsa@adzu.edu.ph',
        '$2b$10$hashedpassword3'
    ),
    (
        '04444444-4444-4444-4444-444444444444',
        'Vice President for Administration',
        'vpadmin@adzu.edu.ph',
        '$2b$10$hashedpassword4'
    ),
    (
        '05555555-5555-5555-5555-555555555555',
        'Vice President for Finance',
        'vpfinance@adzu.edu.ph',
        '$2b$10$hashedpassword5'
    ),
    (
        '06666666-6666-6666-6666-666666666666',
        'CCES Director',
        'cces.director@adzu.edu.ph',
        '$2b$10$hashedpassword6'
    ),
    (
        '07777777-7777-7777-7777-777777777777',
        'API Director',
        'api.director@adzu.edu.ph',
        '$2b$10$hashedpassword7'
    ),
    (
        '08888888-8888-8888-8888-888888888888',
        'SACSI Coordinator',
        'sacsi.coordinator@adzu.edu.ph',
        '$2b$10$hashedpassword8'
    ),
    (
        '09999999-9999-9999-9999-999999999999',
        'ACLG Director',
        'aclg.director@adzu.edu.ph',
        '$2b$10$hashedpassword9'
    ),
    (
        '0aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0',
        'ACCA Director',
        'acca.director@adzu.edu.ph',
        '$2b$10$hashedpassword10'
    );

-- Insert office users for each office
INSERT INTO
    office_users (
        id,
        name,
        email,
        password,
        office_id
    )
VALUES
    -- Office of the President users
    (
        'f1111111-1111-1111-1111-111111111111',
        'Executive Secretary',
        'exec.secretary@adzu.edu.ph',
        '$2b$10$hashedpassword1',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        'f1111111-1111-1111-1111-111111111112',
        'Administrative Assistant',
        'admin.assistant.president@adzu.edu.ph',
        '$2b$10$hashedpassword2',
        '11111111-1111-1111-1111-111111111111'
    ),

-- Academic Affairs users
(
    'f2222222-2222-2222-2222-222222222221',
    'Dean of Arts and Sciences',
    'dean.artscience@adzu.edu.ph',
    '$2b$10$hashedpassword3',
    '22222222-2222-2222-2222-222222222222'
),
(
    'f2222222-2222-2222-2222-222222222222',
    'Registrar',
    'registrar@adzu.edu.ph',
    '$2b$10$hashedpassword4',
    '22222222-2222-2222-2222-222222222222'
),
(
    'f2222222-2222-2222-2222-222222222223',
    'Academic Coordinator',
    'academic.coordinator@adzu.edu.ph',
    '$2b$10$hashedpassword5',
    '22222222-2222-2222-2222-222222222222'
),

-- Student Affairs users
(
    'f3333333-3333-3333-3333-333333333331',
    'Student Activities Director',
    'student.activities@adzu.edu.ph',
    '$2b$10$hashedpassword6',
    '33333333-3333-3333-3333-333333333333'
),
(
    'f3333333-3333-3333-3333-333333333332',
    'Guidance Counselor',
    'guidance@adzu.edu.ph',
    '$2b$10$hashedpassword7',
    '33333333-3333-3333-3333-333333333333'
),
(
    'f3333333-3333-3333-3333-333333333333',
    'Admissions Officer',
    'admissions@adzu.edu.ph',
    '$2b$10$hashedpassword8',
    '33333333-3333-3333-3333-333333333333'
),

-- Administration users
(
    'f4444444-4444-4444-4444-444444444441',
    'Human Resources Manager',
    'hr.manager@adzu.edu.ph',
    '$2b$10$hashedpassword9',
    '44444444-4444-4444-4444-444444444444'
),
(
    'f4444444-4444-4444-4444-444444444442',
    'Facilities Manager',
    'facilities@adzu.edu.ph',
    '$2b$10$hashedpassword10',
    '44444444-4444-4444-4444-444444444444'
),
(
    'f4444444-4444-4444-4444-444444444443',
    'IT Administrator',
    'it.admin@adzu.edu.ph',
    '$2b$10$hashedpassword11',
    '44444444-4444-4444-4444-444444444444'
),

-- Finance users
(
    'f5555555-5555-5555-5555-555555555551',
    'Chief Financial Officer',
    'cfo@adzu.edu.ph',
    '$2b$10$hashedpassword12',
    '55555555-5555-5555-5555-555555555555'
),
(
    'f5555555-5555-5555-5555-555555555552',
    'Budget Officer',
    'budget@adzu.edu.ph',
    '$2b$10$hashedpassword13',
    '55555555-5555-5555-5555-555555555555'
),
(
    'f5555555-5555-5555-5555-555555555553',
    'Accounts Payable Clerk',
    'accounts.payable@adzu.edu.ph',
    '$2b$10$hashedpassword14',
    '55555555-5555-5555-5555-555555555555'
),

-- CCES users
(
    'f6666666-6666-6666-6666-666666666661',
    'Community Outreach Coordinator',
    'outreach@adzu.edu.ph',
    '$2b$10$hashedpassword15',
    '66666666-6666-6666-6666-666666666666'
),
(
    'f6666666-6666-6666-6666-666666666662',
    'Extension Program Manager',
    'extension@adzu.edu.ph',
    '$2b$10$hashedpassword16',
    '66666666-6666-6666-6666-666666666666'
),

-- API users
(
    'f7777777-7777-7777-7777-777777777771',
    'Peace Education Specialist',
    'peace.education@adzu.edu.ph',
    '$2b$10$hashedpassword17',
    '77777777-7777-7777-7777-777777777777'
),
(
    'f7777777-7777-7777-7777-777777777772',
    'Conflict Resolution Facilitator',
    'conflict.resolution@adzu.edu.ph',
    '$2b$10$hashedpassword18',
    '77777777-7777-7777-7777-777777777777'
),

-- SACSI users
(
    'f8888888-8888-8888-8888-888888888881',
    'Community Service Coordinator',
    'service.coordinator@adzu.edu.ph',
    '$2b$10$hashedpassword19',
    '88888888-8888-8888-8888-888888888888'
),
(
    'f8888888-8888-8888-8888-888888888882',
    'Social Awareness Officer',
    'awareness.officer@adzu.edu.ph',
    '$2b$10$hashedpassword20',
    '88888888-8888-8888-8888-888888888888'
),

-- ACLG users
(
    'f9999999-9999-9999-9999-999999999991',
    'Leadership Development Officer',
    'leadership@adzu.edu.ph',
    '$2b$10$hashedpassword21',
    '99999999-9999-9999-9999-999999999999'
),
(
    'f9999999-9999-9999-9999-999999999992',
    'Governance Training Facilitator',
    'governance@adzu.edu.ph',
    '$2b$10$hashedpassword22',
    '99999999-9999-9999-9999-999999999999'
),

-- ACCA users
(
    'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0',
    'Cultural Program Officer',
    'culture@adzu.edu.ph',
    '$2b$10$hashedpassword23',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0'
),
(
    'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'Arts Coordinator',
    'arts@adzu.edu.ph',
    '$2b$10$hashedpassword24',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0'
);

-- Add sample programs for demonstration
INSERT INTO
    programs (
        id,
        title,
        description,
        status,
        funding_source,
        participants_count,
        start_date,
        end_date,
        office_id,
        created_by
    )
VALUES
    -- Office of the President programs
    (
        'e1111111-1111-1111-1111-111111111111',
        'Strategic Leadership Initiative',
        'University-wide leadership development program for senior administrators',
        'ongoing',
        'University Budget',
        25,
        '2024-01-15',
        '2024-12-31',
        '11111111-1111-1111-1111-111111111111',
        'f1111111-1111-1111-1111-111111111111'
    ),

-- Academic Affairs programs
(
    'e2222222-2222-2222-2222-222222222221',
    'Faculty Excellence Program',
    'Professional development program for faculty members',
    'ongoing',
    'External Grant',
    50,
    '2024-02-01',
    '2024-11-30',
    '22222222-2222-2222-2222-222222222222',
    'f2222222-2222-2222-2222-222222222221'
),
(
    'e2222222-2222-2222-2222-222222222222',
    'Academic Quality Assurance Initiative',
    'Program to enhance academic standards and assessment',
    'upcoming',
    'University Budget',
    30,
    '2024-03-01',
    '2024-08-31',
    '22222222-2222-2222-2222-222222222222',
    'f2222222-2222-2222-2222-222222222222'
),

-- Student Affairs programs
(
    'e3333333-3333-3333-3333-333333333331',
    'Student Leadership Development',
    'Comprehensive leadership training for student leaders',
    'ongoing',
    'Student Activities Fund',
    75,
    '2024-01-20',
    '2024-12-15',
    '33333333-3333-3333-3333-333333333333',
    'f3333333-3333-3333-3333-333333333331'
),
(
    'e3333333-3333-3333-3333-333333333332',
    'Guidance and Counseling Outreach',
    'Mental health and wellness program for students',
    'ongoing',
    'University Budget',
    100,
    '2024-01-10',
    '2024-12-20',
    '33333333-3333-3333-3333-333333333333',
    'f3333333-3333-3333-3333-333333333332'
),

-- CCES programs
(
    'e6666666-6666-6666-6666-666666666661',
    'Community Health Outreach Program',
    'Health education and medical services for local communities',
    'ongoing',
    'External Grant',
    200,
    '2024-01-01',
    '2024-12-31',
    '66666666-6666-6666-6666-666666666666',
    'f6666666-6666-6666-6666-666666666661'
),
(
    'e6666666-6666-6666-6666-666666666662',
    'Sustainable Agriculture Training',
    'Training program for farmers on sustainable farming practices',
    'upcoming',
    'Government Grant',
    80,
    '2024-04-01',
    '2024-09-30',
    '66666666-6666-6666-6666-666666666666',
    'f6666666-6666-6666-6666-666666666662'
),

-- API programs
(
    'e7777777-7777-7777-7777-777777777771',
    'Peace Education Curriculum',
    'Development and implementation of peace education programs',
    'ongoing',
    'International Grant',
    150,
    '2024-01-05',
    '2024-12-25',
    '77777777-7777-7777-7777-777777777777',
    'f7777777-7777-7777-7777-777777777771'
),
(
    'e7777777-7777-7777-7777-777777777772',
    'Interfaith Dialogue Initiative',
    'Promoting understanding and cooperation between different faith communities',
    'ongoing',
    'University Budget',
    60,
    '2024-02-15',
    '2024-11-15',
    '77777777-7777-7777-7777-777777777777',
    'f7777777-7777-7777-7777-777777777772'
),

-- SACSI programs
(
    'e8888888-8888-8888-8888-888888888881',
    'Community Immersion Program',
    'Student community service and social awareness program',
    'ongoing',
    'Student Activities Fund',
    120,
    '2024-01-25',
    '2024-12-10',
    '88888888-8888-8888-8888-888888888888',
    'f8888888-8888-8888-8888-888888888881'
),
(
    'e8888888-8888-8888-8888-888888888882',
    'Social Justice Advocacy Workshop',
    'Training students in social justice principles and advocacy',
    'upcoming',
    'University Budget',
    40,
    '2024-03-15',
    '2024-07-31',
    '88888888-8888-8888-8888-888888888888',
    'f8888888-8888-8888-8888-888888888882'
),

-- ACLG programs
(
    'e9999999-9999-9999-9999-999999999991',
    'Community Leadership Training',
    'Leadership development program for community leaders',
    'ongoing',
    'External Grant',
    90,
    '2024-01-30',
    '2024-12-05',
    '99999999-9999-9999-9999-999999999999',
    'f9999999-9999-9999-9999-999999999991'
),
(
    'e9999999-9999-9999-9999-999999999992',
    'Local Governance Workshop',
    'Training program for local government officials',
    'upcoming',
    'Government Grant',
    35,
    '2024-05-01',
    '2024-10-31',
    '99999999-9999-9999-9999-999999999999',
    'f9999999-9999-9999-9999-999999999992'
),

-- ACCA programs
(
    'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0',
    'Cultural Heritage Preservation Project',
    'Documentation and preservation of local cultural practices',
    'ongoing',
    'Cultural Fund',
    70,
    '2024-02-01',
    '2024-12-31',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0',
    'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0'
),
(
    'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'Community Arts Festival',
    'Annual festival showcasing local artists and cultural groups',
    'upcoming',
    'External Grant',
    300,
    '2024-06-01',
    '2024-06-07',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa0',
    'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'
);