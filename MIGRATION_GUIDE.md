# Database Migration Guide

## Overview

This guide will help you add the `phase` and `report_url` columns to your activities table in Supabase.

## Steps to Run Migrations

### 1. Access Supabase SQL Editor

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Click on "SQL Editor" in the left sidebar

### 2. Run Phase Column Migration

Copy and paste this SQL into the SQL Editor and click "Run":

```sql
-- Add phase column to activities table
-- Phase is set by offices during activity creation/edit
-- Status is controlled by Unit Director only

ALTER TABLE activities
ADD COLUMN IF NOT EXISTS phase VARCHAR(50);

-- Add a comment to clarify the difference
COMMENT ON COLUMN activities.phase IS 'Activity phase set by offices: Planning, Implementation, Evaluation, Completed, Cancelled';
COMMENT ON COLUMN activities.status IS 'Activity status controlled by Unit Director: pending, in-progress, completed, cancelled';
```

**Expected Result:**

- ✅ Success message: "Successfully executed query"
- The `phase` column is now available in your activities table

### 3. Run Report URL Column Migration

Copy and paste this SQL into the SQL Editor and click "Run":

```sql
-- Add report_url column to activities table
-- This allows users to paste links to reports instead of only uploading files

ALTER TABLE activities
ADD COLUMN IF NOT EXISTS report_url TEXT;

-- Add a comment to clarify the purpose
COMMENT ON COLUMN activities.report_url IS 'URL link to full report (Google Drive, etc.) - alternative to file upload';
```

**Expected Result:**

- ✅ Success message: "Successfully executed query"
- The `report_url` column is now available in your activities table

### 4. Verify Migrations

Run this query to verify both columns were added:

```sql
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'activities'
AND column_name IN ('phase', 'report_url');
```

**Expected Output:**

```
column_name  | data_type        | character_maximum_length
-------------|------------------|-------------------------
phase        | character varying| 50
report_url   | text             | NULL
```

## What These Columns Do

### `phase` Column

- **Type:** VARCHAR(50)
- **Purpose:** Tracks the current phase of an activity
- **Controlled by:** Office users (not Unit Director)
- **Allowed values:**
  - Planning
  - Implementation
  - Evaluation
  - Completed
  - Cancelled
- **Example:** "Implementation"

### `report_url` Column

- **Type:** TEXT
- **Purpose:** Stores URL links to reports (e.g., Google Drive, OneDrive)
- **Alternative to:** File uploads
- **Example:** "https://drive.google.com/file/d/abc123/view"

## Troubleshooting

### Error: "column already exists"

If you see this error, the column was already added. This is safe and you can proceed.

### Error: "permission denied"

Make sure you're logged in as a Supabase admin with permission to modify the database schema.

### Error: "relation 'activities' does not exist"

Double-check that you're running the SQL in the correct project/database.

## Next Steps

After running these migrations:

1. ✅ The backend is already updated to handle these fields
2. ✅ The frontend form is ready to collect this data
3. 🎉 Test creating a new activity with:
   - Phase selection (Planning, Implementation, etc.)
   - Report URL input (paste a link to your report)

## Status Field Note

The `status` field should already exist in your activities table. It's controlled by the Unit Director and shows:

- **pending** - Activity awaiting approval
- **in-progress** - Activity currently running
- **completed** - Activity finished
- **cancelled** - Activity cancelled

When creating a new activity, status is automatically set to "pending".
