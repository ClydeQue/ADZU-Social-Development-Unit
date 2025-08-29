-- Drop existing database tables and related objects
-- This will completely reset the database

-- Drop triggers first
DROP TRIGGER IF EXISTS update_programs_updated_at ON public.programs;

DROP TRIGGER IF EXISTS update_office_users_updated_at ON public.office_users;

DROP TRIGGER IF EXISTS update_unit_directors_updated_at ON public.unit_directors;

DROP TRIGGER IF EXISTS update_offices_updated_at ON public.offices;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.programs CASCADE;

DROP TABLE IF EXISTS public.office_users CASCADE;

DROP TABLE IF EXISTS public.unit_directors CASCADE;

DROP TABLE IF EXISTS public.offices CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS public.update_updated_at_column ();

-- Drop extension if needed (optional - usually keep it)
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- Clean up any remaining policies (they should be dropped with tables, but just in case)
-- Note: Policies are automatically dropped when tables are dropped