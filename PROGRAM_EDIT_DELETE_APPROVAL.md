# Program Edit/Delete Approval System

## Overview

Office users can now request edits or deletions for approved programs. These changes require Unit Director approval before taking effect.

## What Changed

### Backend

1. **New Database Table**: `program_change_requests`

   - Stores edit/delete requests for programs
   - Tracks status: pending, approved, rejected
   - Location: `/backend/migrations/add_program_change_requests.sql`

2. **New API Routes** (in `/backend/src/routes/office.js`):
   - `GET /api/office/program-change-requests` - Get change requests for office
   - `POST /api/office/program-change-requests/update` - Submit edit request
   - `POST /api/office/program-change-requests/delete` - Submit delete request
   - `DELETE /api/office/program-change-requests/:requestId` - Cancel pending request

### Frontend

1. **Updated Component**: `/frontend/src/pages/OfficeSettings/ManagePrograms.jsx`

   - Added Edit and Delete buttons for approved programs
   - Shows warning when program has pending change request
   - Edit dialog to submit new title/description
   - Delete dialog to provide deletion reason
   - Can cancel pending change requests

2. **Updated Service**: `/frontend/src/services/userService.js`
   - Added methods for program change requests

## How It Works

### For Office Users:

1. **View Programs**: See all programs with their status

   - Approved programs (✓) - Can edit or delete
   - Pending requests (⏳) - Can delete
   - Rejected requests (✗) - Can delete

2. **Edit Program**:

   - Click Edit button on approved program
   - Modify title and/or description
   - Submit request
   - Changes apply only after Unit Director approval

3. **Delete Program**:

   - Click Delete button on approved program
   - Provide reason for deletion
   - Submit request
   - Program removed only after Unit Director approval

4. **Pending Changes**:
   - Programs with pending change requests show orange warning
   - Can cancel pending requests before approval
   - Cannot submit new change request if one is pending

### For Unit Directors:

- Will need to review and approve/reject change requests
- **TODO**: Create Unit Director interface for reviewing change requests

## Setup Instructions

### 1. Run Database Migration

```bash
# Connect to your Supabase database and run:
psql -h <your-host> -U <user> -d <database> -f backend/migrations/add_program_change_requests.sql
```

Or run in Supabase SQL Editor:

```sql
-- Copy and paste contents of backend/migrations/add_program_change_requests.sql
```

### 2. Restart Backend Server

```bash
cd backend
npm run dev
```

### 3. Test the Feature

1. Login as office user
2. Go to Settings → Manage Programs
3. Click Edit or Delete on an approved program
4. Submit request
5. See pending change request warning

## Database Schema

```sql
program_change_requests (
  id UUID PRIMARY KEY,
  program_id UUID REFERENCES programs(id),
  office_id UUID REFERENCES offices(id),
  request_type VARCHAR(20) -- 'update' or 'delete'
  new_title TEXT,
  new_description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reason TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

## Next Steps

### Unit Director Interface (TODO)

Create interface for Unit Directors to:

1. View all pending change requests
2. See before/after comparison for edits
3. Approve or reject requests
4. Provide feedback/reason for rejection
5. Apply changes when approving

### Suggested Location:

`/frontend/src/pages/UnitDirectorDashboard/ReviewProgramChanges.jsx`

### Backend Routes Needed:

```javascript
// Unit Director routes (to be added)
GET /api/unit-director/program-change-requests - Get all pending requests
PUT /api/unit-director/program-change-requests/:id/approve - Approve request
PUT /api/unit-director/program-change-requests/:id/reject - Reject request
```

## Benefits

- ✅ Controlled program management
- ✅ Audit trail of all changes
- ✅ Prevents accidental deletions
- ✅ Unit Director oversight
- ✅ Better governance and accountability
