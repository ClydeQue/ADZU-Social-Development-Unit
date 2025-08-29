# Follow niyo lang to Setup to Guys

# 1. PostgreSQL Setup (SQL DB to)

```bash
# Install PostgreSQL
brew install postgresql
brew services start postgresql

# Create database
psql postgres
CREATE DATABASE adzu_sdu;
CREATE USER adzu_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE adzu_sdu TO adzu_user;
\q
```

# 2. Backend Configuration

Update `backend/.env` with your db creds:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adzu_sdu
DB_USER=adzu_user
DB_PASSWORD=your_password
JWT_SECRET=your_very_secure_jwt_secret_key_here
```

### 3. Backend Setup

```bash
cd backend
npm install
npm run init-db  # Initialize database with tables and sample data
npm run dev
```

## Application Flow

1. **Welcome Page** → Choose Unit Director or Office login
2. **Office Selection** → Select from 6 offices (if Office chosen)
3. **Login** → Enter credentials for selected role/office
4. **Dashboard** → View programs, statistics, and manage data
5. **CRUD Operations** → Create, read, update, delete programs
6. **Reports** → Filter and view monthly reports (Unit Director)

## Default Login Credentials

**Unit Director:**

- Email: director@adzu.edu.ph
- Password: admin123

**Office Users:**

- community@adzu.edu.ph / password123
- research@adzu.edu.ph / password123
- student@adzu.edu.ph / password123
- academic@adzu.edu.ph / password123
- financial@adzu.edu.ph / password123
- alumni@adzu.edu.ph / password123

## Next Steps

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database initialization
4. Start both frontend and backend servers
5. Test the complete application flow
