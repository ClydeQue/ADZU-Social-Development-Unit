# AdZU Social Development Unit System

A comprehensive web application for managing programs across multiple offices in the AdZU Social Development Unit.

## So ganito Yung System Nagwowork

Nagfofollow to siya ng **3-tier architecture**:

1. **Frontend (React)** - User interface running on port 5173
2. **Backend API (Express.js)** - Server logic running on port 3001
3. **Database (PostgreSQL)** - Data storage

### User Flow

1. **Welcome Page** → User chooses between Unit Director or Office login
2. **Office Selection** → If office chosen, select from 6 available offices
3. **Authentication** → Login with role-based credentials
4. **Dashboard** → Role-specific interface with program management
5. **CRUD Operations** → Create, read, update, delete programs
6. **Reports** → Generate filtered reports (Unit Director only)

### Mga Key Components

#### Authentication System

- **JWT Tokens** stored in HTTP-only cookies
- **Role-based Access Control** (Unit Director vs Office Users)
- **Protected Routes** prevent unauthorized access

#### Data Flow

```
Frontend (React) ↔ API Service ↔ Express Routes ↔ Database Queries ↔ PostgreSQL
```

## Database Structure

### Tables and Relationships

#### 1. `offices` Table

```sql
id (SERIAL PRIMARY KEY)          -- Auto-increment office ID
name (VARCHAR(255) NOT NULL)     -- Office name (unique)
description (TEXT)               -- Office description
created_at (TIMESTAMP)           -- Creation timestamp
updated_at (TIMESTAMP)           -- Last update timestamp
```

#### 2. `unit_directors` Table

```sql
id (SERIAL PRIMARY KEY)          -- Auto-increment director ID
name (VARCHAR(255) NOT NULL)     -- Director's full name
email (VARCHAR(255) UNIQUE)      -- Login email (unique)
password (VARCHAR(255) NOT NULL) -- Hashed password
created_at (TIMESTAMP)           -- Creation timestamp
updated_at (TIMESTAMP)           -- Last update timestamp
```

#### 3. `office_users` Table

```sql
id (SERIAL PRIMARY KEY)          -- Auto-increment user ID
name (VARCHAR(255) NOT NULL)     -- User's full name
email (VARCHAR(255) UNIQUE)      -- Login email (unique)
password (VARCHAR(255) NOT NULL) -- Hashed password
office_id (INTEGER)              -- Foreign key to offices.id
created_at (TIMESTAMP)           -- Creation timestamp
updated_at (TIMESTAMP)           -- Last update timestamp

FOREIGN KEY: office_id REFERENCES offices(id) ON DELETE CASCADE
```

#### 4. `programs` Table

```sql
id (SERIAL PRIMARY KEY)          -- Auto-increment program ID
title (VARCHAR(255) NOT NULL)    -- Program title
description (TEXT)               -- Program description
status (VARCHAR(50))             -- 'upcoming', 'ongoing', 'completed'
funding_source (VARCHAR(255))    -- Source of funding
participants_count (INTEGER)     -- Number of participants
start_date (DATE)                -- Program start date
end_date (DATE)                  -- Program end date
office_id (INTEGER)              -- Foreign key to offices.id
created_by (INTEGER)             -- User who created the program
created_at (TIMESTAMP)           -- Creation timestamp
updated_at (TIMESTAMP)           -- Last update timestamp

FOREIGN KEY: office_id REFERENCES offices(id) ON DELETE CASCADE
```

### Database Relationships

```
offices (1) ←→ (many) office_users
offices (1) ←→ (many) programs
office_users (1) ←→ (many) programs (via created_by)
```

## Here yung mga Features as of now

- **Unit Director Dashboard**: Super admin access to view all offices and their programs
- **Office-specific Dashboards**: Individual office management with CRUD operations for programs
- **Authentication System**: Role-based access control for unit directors and office users
- **Real-time Program Tracking**: Track funding sources, participants, dates, and statuses
- **Monthly Reports**: Generate and filter reports by month and year

## Technology Stack Ginagamit natin

### Frontend

- React 18+ with Vite
- Material-UI (MUI) for components
- Tailwind CSS v4 for styling
- React Router for navigation
- Context API for state management

### Backend

- Node.js with Express.js
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing
- CORS and security middleware

## Project Structure & What to Modify dito

### Frontend Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── Sidebar.jsx      # Side navigation menu
│   │   └── ProtectedRoute.jsx # Route protection component
│   ├── pages/               # Page components (Make muna kayo own folder ng own page then dun ung jsx ilagay)
│   │   ├── WelcomePage.jsx          # Main landing page
│   │   ├── OfficeSelectionPage.jsx  # Office selection grid
│   │   ├── UnitDirectorLoginPage.jsx # Unit director login
│   │   ├── OfficeLoginPage.jsx      # Office user login
│   │   ├── UnitDirectorDashboard.jsx # Admin dashboard
│   │   ├── UnitDirectorReports.jsx  # Reports page
│   │   └── OfficeDashboard.jsx      # Office dashboard
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state management
│   ├── services/
│   │   └── authService.js   # API calls and HTTP requests
│   └── utils/
│       └── hooks.js         # Custom React hooks
```

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # PostgreSQL connection setup
│   │   └── initDb.js        # Database initialization & sample data
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/              # API route handlers
│   │   ├── auth.js          # Login, logout, token verification
│   │   ├── unitDirector.js  # Unit director specific endpoints
│   │   ├── office.js        # Office-related endpoints
│   │   └── program.js       # Program CRUD operations
│   └── server.js            # Main Express server setup
├── .env                     # Environment variables
└── package.json             # Dependencies and scripts
```

## What to Modify for Your Needs

### 1. Adding New Office Types

**File to modify**: `backend/src/config/initDb.js`

```javascript
const offices = [
  ["Your New Office Name", "Description of the office"],
  // Add more offices here
];
```

### 2. Changing Program Fields

**Files to modify**:

- `backend/src/config/initDb.js` - Update programs table schema
- `backend/src/routes/program.js` - Update CRUD operations
- `frontend/src/pages/OfficeDashboard.jsx` - Update form fields

**Example**: Adding a new field `budget`

```sql
-- In initDb.js, add to programs table:
budget DECIMAL(10,2),
```

### 3. Customizing Authentication

**Files to modify**:

- `backend/src/routes/auth.js` - Login logic
- `backend/.env` - JWT secret and expiration
- `frontend/src/context/AuthContext.jsx` - Auth state management

### 4. Adding New User Roles

**Files to modify**:

- `backend/src/config/initDb.js` - Create new user table
- `backend/src/middleware/auth.js` - Add role checks
- `frontend/src/components/ProtectedRoute.jsx` - Update role validation

### 5. Customizing Dashboard Statistics

**File to modify**: `backend/src/routes/unitDirector.js`

```javascript
const statsQuery = `
  SELECT 
    COUNT(*) as total_programs,
    COUNT(CASE WHEN status = 'ongoing' THEN 1 END) as ongoing_programs,
    -- Add your custom statistics here
  FROM programs
`;
```

### 6. Changing Ports (Ako nalang maggawa)

**Files to modify**:

- `backend/.env` - Change PORT variable
- `frontend/src/services/authService.js` - Update API_BASE_URL

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login
  ```json
  {
    "email": "director@adzu.edu.ph",
    "password": "admin123",
    "role": "unit_director" // or "office"
  }
  ```
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Unit Director Endpoints (Admin Access)

- `GET /api/unit-director/dashboard` - Get all offices with program counts
- `GET /api/unit-director/reports?month=8&year=2025` - Get filtered reports

### Office Endpoints

- `GET /api/office/all` - Get all offices (public)
- `GET /api/office/:officeId/dashboard` - Get office-specific programs

### Program Endpoints

- `POST /api/program` - Create new program
- `PUT /api/program/:id` - Update existing program
- `DELETE /api/program/:id` - Delete program
- `GET /api/program` - Get all programs (Unit Director only)

### Health Check

- `GET /api/health` - Server status check

## How to Run the System

### Prerequisites (dl niyo to type niyo commands sa baba)

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### 1. Database Setup

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb adzu_sdu
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run init-db       # Initialize database with tables and sample data
npm run dev          # Start development server on port 3001
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Start development server on port 5173
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Default Login Credentials

### Unit Director (Super Admin)

- **Email**: director@adzu.edu.ph
- **Password**: admin123
- **Access**: All offices, reports, dashboard overview

### Office Users

| Office                 | Email                 | Password    |
| ---------------------- | --------------------- | ----------- |
| Community Extension    | community@adzu.edu.ph | password123 |
| Research & Development | research@adzu.edu.ph  | password123 |
| Student Affairs        | student@adzu.edu.ph   | password123 |
| Academic Affairs       | academic@adzu.edu.ph  | password123 |
| Financial Aid          | financial@adzu.edu.ph | password123 |
| Alumni Relations       | alumni@adzu.edu.ph    | password123 |

## Environment Variables

### Backend (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adzu_sdu
DB_USER=clyde
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_very_secure
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Common Issues & Solutions

### Port 5000 Conflict (macOS AirPlay)

- Backend now uses port **3001** instead of 5000
- Frontend API calls updated to use `localhost:3001`

### Database Connection Issues

1. Ensure PostgreSQL is running: `brew services start postgresql@15`
2. Check database exists: `psql -l | grep adzu_sdu`
3. Verify credentials in `.env` file

### CORS Issues

- Ensure `CORS_ORIGIN` in `.env` matches your frontend URL
- Frontend runs on port 5173 by default

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Test API**: Use curl or Postman to test endpoints
4. **Database Changes**: Modify `initDb.js` and re-run `npm run init-db`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License eme eme.
