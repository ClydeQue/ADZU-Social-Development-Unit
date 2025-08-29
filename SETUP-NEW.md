# ADZU Social Development Unit - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## Database Setup (Supabase)

1. **Create a new Supabase project**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up the database schema**

   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the SQL script from `supabase-setup.sql` in the root directory
   - This will create all necessary tables, RLS policies, and sample data

3. **Configure authentication** (optional for enhanced security)
   - In Supabase dashboard, go to Authentication > Settings
   - Configure your preferred authentication providers
   - Set up RLS policies as needed

## Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your Supabase credentials:

   ```env
   SUPABASE_URL=your_supabase_project_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   JWT_SECRET=your_strong_jwt_secret_here
   JWT_EXPIRES_IN=24h
   PORT=3001
   NODE_ENV=development
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The backend will be available at `http://localhost:3001`

## Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Data Management Architecture

### Optimized Data Flow

The application now uses an optimized data management strategy:

1. **React Query for State Management**:

   - Intelligent caching and background updates
   - Optimistic updates for better UX
   - Automatic retry logic and error handling

2. **Centralized API Hooks** (`/frontend/src/hooks/useApi.js`):

   - `useOffices()` - Get all offices with smart caching
   - `useOfficePrograms(officeId)` - Get programs for specific office
   - `useCreateProgram()`, `useUpdateProgram()`, `useDeleteProgram()` - CRUD operations
   - `useUnitDirectorDashboard()` - Dashboard data for unit directors
   - `useRealtimePrograms(officeId)` - Real-time updates via Supabase

3. **Real-time Updates**:
   - Automatic data synchronization across components
   - No need for manual refresh or prop drilling
   - Efficient cache invalidation

### Benefits of This Architecture

- **Performance**: Data is cached and shared across components
- **Real-time**: Automatic updates when data changes
- **Scalability**: Easy to add new data endpoints
- **Developer Experience**: Clean, reusable hooks
- **User Experience**: Loading states, optimistic updates, error handling

## Sample Login Credentials

After running the database setup, you can use these credentials:

### Unit Director

- Email: `director@adzu.edu.ph`
- Password: `admin123`

### Office Users

- Email: `community@adzu.edu.ph` (Social Development Office)
- Email: `research@adzu.edu.ph` (CCES)
- Email: `student@adzu.edu.ph` (API)
- Email: `academic@adzu.edu.ph` (SACSI)
- Email: `financial@adzu.edu.ph` (ACLG)
- Email: `alumni@adzu.edu.ph` (ACCA)
- Password: `password123` (for all office users)

## Development Notes

### Migration from Local PostgreSQL

The application has been migrated from local PostgreSQL to Supabase:

- ✅ Database schema converted to Supabase-compatible SQL
- ✅ All API endpoints updated to use Supabase client
- ✅ Row Level Security (RLS) policies implemented
- ✅ Real-time subscriptions enabled
- ✅ Optimized frontend data management with React Query

### Key Changes Made

1. **Backend Changes**:

   - Replaced `pg` with `@supabase/supabase-js`
   - Updated all database queries to use Supabase syntax
   - Removed local database initialization scripts
   - Added proper error handling for Supabase operations

2. **Frontend Changes**:

   - Added React Query for state management
   - Created centralized API hooks
   - Implemented real-time data synchronization
   - Added loading states and error handling
   - Optimized component re-renders

3. **Database Changes**:
   - Converted to UUID primary keys for better scalability
   - Added Row Level Security policies
   - Set up real-time subscriptions
   - Added proper indexes and constraints

## Troubleshooting

### Common Issues

1. **Connection Issues**:

   - Verify your Supabase URL and keys are correct
   - Check if your Supabase project is active
   - Ensure environment variables are properly set

2. **Authentication Errors**:

   - Make sure JWT_SECRET is set in backend
   - Verify your Supabase service role key has proper permissions

3. **Real-time Not Working**:

   - Check if real-time is enabled in your Supabase project
   - Verify RLS policies allow the subscriptions

4. **CORS Errors**:
   - Ensure your backend CORS settings include your frontend URL
   - Check Supabase CORS configuration if using direct client calls

## Production Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure SUPABASE_SERVICE_ROLE_KEY is kept secure
3. Set NODE_ENV=production

### Frontend Deployment

1. Set VITE\_\* environment variables for production
2. Update VITE_API_BASE_URL to your production backend URL
3. Run `npm run build` to create production build

### Database

1. Your Supabase database is already production-ready
2. Monitor usage and scale as needed
3. Set up proper backup strategies in Supabase

## Support

For issues or questions, please refer to:

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- Project repository issues
