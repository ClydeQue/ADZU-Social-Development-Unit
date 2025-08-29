# ⚠️ Backend Configuration Needed

## Missing Supabase Service Role Key

Your backend is missing the **Supabase Service Role Key**. Here's how to get it:

### 🔑 **Get Your Service Role Key:**

1. **Go to your Supabase Dashboard:**

   - Visit: https://supabase.com/dashboard
   - Select your project: `hanrnoqvzkqwvotcexva`

2. **Navigate to Settings → API:**
   - Click on "Settings" in the sidebar
   - Click on "API"
3. **Copy the Service Role Key:**
   - Look for "Project API keys"
   - Copy the **"service_role"** key (NOT the anon key)
   - ⚠️ **WARNING**: This key has full database access - keep it secret!

### 📝 **Update Your Backend .env File:**

Replace the placeholder in `/backend/.env`:

```bash
# Current (needs fixing):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJub3F2emtxd3ZvdGNleHZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MjMyMCwiZXhwIjoyMDcyMDQ4MzIwfQ.SERVICE_ROLE_KEY_HERE

# Replace with your actual service role key:
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJub3F2emtxd3ZvdGNleHZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ3MjMyMCwiZXhwIjoyMDcyMDQ4MzIwfQ.YOUR_ACTUAL_SERVICE_KEY_HERE
```

### 🚀 **After Adding the Key:**

```bash
cd backend
npm start
```

The server should then start successfully!

---

**Note:** The service role key is different from the anon key you're using in the frontend. The service role key bypasses Row Level Security and is used for server-side operations.
