# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites

- Vercel account
- GitHub repository (push your code)
- Supabase database already set up

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `Social-Development-Unit` repository

### Step 2: Configure Environment Variables

In Vercel dashboard, add these environment variables:

#### Backend Environment Variables:

```
SUPABASE_URL=https://hanrnoqvzkqwvotcexva.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJub3F2emtxd3ZvdGNleHZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MjMyMCwiZXhwIjoyMDcyMDQ4MzIwfQ.6298-5zPyttCejiqll8tGjvll8lMo7NQvLoQhMdQfsU
JWT_SECRET=your_jwt_secret_key_here_make_it_very_secure_for_production
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.vercel.app
```

#### Frontend Environment Variables:

```
VITE_SUPABASE_URL=https://hanrnoqvzkqwvotcexva.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJub3F2emtxd3ZvdGNleHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzIzMjAsImV4cCI6MjA3MjA0ODMyMH0.WaX7r0SfqmOwQAtrDcG1UBc_Pdyb_wqJgilkOmmEp38
```

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will automatically:
   - Install dependencies
   - Build the frontend
   - Deploy both frontend and API routes

### Step 4: Update CORS Origin

After deployment:

1. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Update the `CORS_ORIGIN` environment variable in Vercel dashboard
3. Redeploy

## 📁 Project Structure

```
/
├── vercel.json          # Vercel configuration
├── package.json         # Root package.json
├── backend/             # API routes (/api/*)
│   ├── src/server.js    # Express server
│   └── package.json     # Backend dependencies
├── frontend/            # Static site (/)
│   ├── dist/           # Build output
│   ├── src/            # React source
│   └── package.json    # Frontend dependencies
└── database/           # SQL scripts (not deployed)
```

## 🔧 How It Works

- **Frontend**: Built as static files, served from `/`
- **Backend**: Runs as serverless functions under `/api/*`
- **Database**: Connects to Supabase (already hosted)

## 🧪 Test Endpoints

After deployment, test:

- `https://your-app.vercel.app/` (Frontend)
- `https://your-app.vercel.app/api/health` (Backend)
- `https://your-app.vercel.app/api/auth/verify` (Auth endpoint)

## 📝 Login Credentials

Use the same simple credentials:

- `sdo@adzu.edu.ph` / `sdo123`
- `cces@adzu.edu.ph` / `cces123`
- etc.

## 🐛 Troubleshooting

- Check Vercel Function Logs for backend errors
- Ensure environment variables are set correctly
- Verify CORS_ORIGIN matches your domain
