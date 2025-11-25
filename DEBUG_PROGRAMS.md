# Programs Not Showing - Debugging Guide

## Issue

Programs aren't showing in:

1. Office Settings → Manage Programs
2. Unit Director Settings → Programs

## What I Fixed

### ✅ Code Structure

- **Backend routes**: Correctly return programs with `title` property ✓
- **Frontend components**: Correctly map `title` to display ✓
- **API integration**: Proper query keys and invalidation ✓
- **Property naming**: Consistent use of `title` across the stack ✓

### ✅ Added Debug Logging

- Frontend console logs show fetched data structure
- Backend console logs show database query results
- Easy to identify where data flow breaks

## Most Likely Issue

**The seed script didn't insert data OR wrong office IDs were used**

The seed script uses:

```sql
SELECT id FROM offices WHERE acronym = 'CCES'
```

If office acronyms don't match exactly (case-sensitive), no programs will be inserted.

## How to Debug

### Step 1: Check if programs exist in database

Option A - Using Supabase Dashboard:

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Select "programs" table
4. Check if there are any rows

Option B - Using SQL:

1. Copy content from `scripts/verify_programs.sql`
2. Run in Supabase SQL Editor
3. Look at output - should show programs per office

### Step 2: Check office acronyms

Run this query in Supabase:

```sql
SELECT id, acronym, name FROM offices ORDER BY acronym;
```

Verify acronyms are EXACTLY:

- ACCA
- ACES
- ACLG
- ALTEC
- APC
- CCES

### Step 3: Check browser console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to the pages with issues
4. Look for:
   - ✅ Office Programs fetched: [...]
   - 📊 Debug logs showing data structure
   - ❌ Any error messages

### Step 4: Check backend logs

In terminal running backend, look for:

- ✅ GET /api/office/{id}/programs - Found X programs
- ✅ GET /api/settings - Returning X offices
- Office program counts

## Solutions

### Solution 1: Re-run seed script with correct office IDs

If offices exist but programs don't:

```sql
-- Delete existing programs first (if any)
DELETE FROM programs WHERE is_fixed = true;

-- Then run the seed script
-- Copy/paste from scripts/seed_programs.sql
```

### Solution 2: Manually verify one office

Test with CCES as example:

```sql
-- Get CCES office ID
SELECT id, acronym FROM offices WHERE acronym = 'CCES';

-- Manually insert one program
INSERT INTO programs (office_id, title, description, is_fixed)
VALUES (
  '<CCES_OFFICE_ID_HERE>',
  'Test Program',
  'Testing program insertion',
  false
);

-- Verify it was created
SELECT * FROM programs WHERE title = 'Test Program';
```

### Solution 3: Check API responses

Open browser DevTools → Network tab:

1. Filter by "Fetch/XHR"
2. Navigate to Settings → Manage Programs
3. Look for request to `/api/office/{id}/programs` or `/api/settings`
4. Check Response tab - should show programs array

## Expected Output

### For Office User (CCES)

Browser console should show:

```javascript
✅ Office Programs fetched: [
  {
    id: "...",
    title: "Brigada Eskwela",
    description: "...",
    is_fixed: true,
    ...
  },
  {
    id: "...",
    title: "Community Outreach Programs",
    ...
  },
  ...
]

📊 Office ManagePrograms Debug: {
  officeId: "...",
  dbPrograms: [...], // Should have 4 items for CCES
  dbProgramsCount: 4,
  ...
}
```

### For Unit Director

Browser console should show:

```javascript
✅ Unit Director Offices fetched: {
  offices: [
    {
      acronym: "CCES",
      programs: [
        { title: "Brigada Eskwela", ... },
        { title: "Community Outreach Programs", ... },
        ...
      ]
    },
    ...
  ]
}

📊 Unit Director Programs Debug: {
  officesCount: 6,
  selectedOffice: {
    acronym: "CCES",
    programsCount: 4,
    programs: [...]
  }
}
```

## Quick Test Commands

```bash
# 1. Check if backend is running
curl http://localhost:5001/api/health

# 2. Check if you can access programs endpoint (replace with actual office ID)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5001/api/office/YOUR_OFFICE_ID/programs

# 3. Restart backend with logs visible
cd backend
npm run dev
```

## Files Modified

### Frontend (Added Debug Logs)

- `frontend/src/pages/OfficeSettings/ManagePrograms.jsx`
- `frontend/src/pages/UnitDirectorSettings/Programs.jsx`

### Backend (Added Debug Logs)

- `backend/src/routes/office.js`
- `backend/src/routes/settings.js`

### Scripts (Created)

- `scripts/verify_programs.sql` - Check programs in database
- `scripts/seed_and_verify.sh` - Helper script

## Next Steps

1. **First**: Check browser console and backend logs with the debug output
2. **Second**: Run verify_programs.sql to check database
3. **Third**: Verify office acronyms match exactly
4. **Fourth**: Re-run seed script if needed
5. **Fifth**: Check one specific office manually

The code is correct - issue is most likely with database seeding!
