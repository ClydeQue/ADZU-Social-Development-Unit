# Quick Start Guide - Status, Phase & Report URL

## 🚀 5-Minute Setup

### Step 1: Run Database Migrations (2 minutes)

1. Go to **Supabase Dashboard** → Your Project → **SQL Editor**

2. **Copy and paste this** (Migration 1):

```sql
ALTER TABLE activities ADD COLUMN IF NOT EXISTS phase VARCHAR(50);
COMMENT ON COLUMN activities.phase IS 'Activity phase set by offices: Planning, Implementation, Evaluation, Completed, Cancelled';
```

Click **RUN** ✅

3. **Copy and paste this** (Migration 2):

```sql
ALTER TABLE activities ADD COLUMN IF NOT EXISTS report_url TEXT;
COMMENT ON COLUMN activities.report_url IS 'URL link to full report (Google Drive, etc.) - alternative to file upload';
```

Click **RUN** ✅

### Step 2: Test the System (3 minutes)

1. **Open your app** and navigate to **Add Activity**

2. **Fill out the form:**

   - Project Name: "Test Activity"
   - Select a Program
   - Select Classification
   - Fill initiation/implementation dates
   - Add participant numbers
   - **Select Phase:** Choose "Planning"
   - **Report URL:** Enter "https://drive.google.com/test"
   - Fill venue details
   - Add objectives

3. **Submit the form**

   - ✅ Should see success message
   - ✅ Check status shows "PENDING"

4. **Verify in Supabase:**
   - Go to **Table Editor** → **activities**
   - Find your new activity
   - Check `phase` column = "Planning"
   - Check `report_url` column = your URL
   - Check `status` column = "pending"

## ✅ What's New

| Field          | What It Does                                                      | Who Controls       |
| -------------- | ----------------------------------------------------------------- | ------------------ |
| **Status**     | Shows approval state (Pending, In-Progress, Completed, Cancelled) | Unit Director only |
| **Phase**      | Shows activity stage (Planning, Implementation, Evaluation, etc.) | Office users       |
| **Report URL** | Link to external report file                                      | Office users       |

## 📝 Form Behavior

- **Status Field:**

  - Shows "PENDING" for new activities
  - Gray background (read-only)
  - Updated by Unit Director only

- **Phase Dropdown:**

  - 5 options to choose from
  - Saves to database on submit
  - Can be edited later

- **Report URL Input:**
  - Accepts any URL
  - Alternative to file upload
  - Optional field

## 🎯 Testing Checklist

- [ ] Database migrations completed (2 SQL commands)
- [ ] Can create new activity
- [ ] Phase dropdown works
- [ ] Report URL saves
- [ ] Status shows "PENDING"
- [ ] Data appears in Supabase

## ❓ Troubleshooting

**Problem:** "Column does not exist" error  
**Fix:** Run the two SQL migrations above

**Problem:** Form submits but nothing saved  
**Fix:** Check browser console for API errors

**Problem:** 401 Unauthorized  
**Fix:** Make sure you're logged in

**Problem:** Cannot see status/phase  
**Fix:** Refresh the page after migrations

## 📚 Full Documentation

- **MIGRATION_GUIDE.md** - Detailed migration steps
- **STATUS_PHASE_INTEGRATION.md** - Technical details
- **IMPLEMENTATION_SUMMARY.md** - Complete overview

---

**Ready?** Run those 2 SQL commands and you're done! 🎉
