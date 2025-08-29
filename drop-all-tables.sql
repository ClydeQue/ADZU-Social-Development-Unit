-- Drop all tables and data completely
-- This will remove all existing data and reset the database

-- Drop triggers first (if tables exist)
DROP TRIGGER IF EXISTS update_programs_updated_at ON programs;

DROP TRIGGER IF EXISTS update_office_users_updated_at ON office_users;

DROP TRIGGER IF EXISTS update_unit_directors_updated_at ON unit_directors;

DROP TRIGGER IF EXISTS update_offices_updated_at ON offices;

-- Drop tables in correct order (child tables first)
DROP TABLE IF EXISTS programs CASCADE;

DROP TABLE IF EXISTS office_users CASCADE;

DROP TABLE IF EXISTS unit_directors CASCADE;

DROP TABLE IF EXISTS offices CASCADE;

-- Drop any custom functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column () CASCADE;