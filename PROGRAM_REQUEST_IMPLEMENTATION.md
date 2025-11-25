# Program Request System Implementation

## Overview
Implemented a program request/approval system where offices can request new programs and the Unit Director can approve or reject them.

## Database Migration
**File:** `backend/migrations/create_program_requests_table.sql`
- Run this SQL file in your Supabase database to create the `program_requests` table
- Includes Row Level Security (RLS) policies for office users and unit director

## Backend API Endpoints

### Office Routes (`backend/src/routes/office.js`)
- `GET /api/office/program-requests` - Get office's requests
- `POST /api/office/program-requests` - Submit new request
- `DELETE /api/office/program-requests/:requestId` - Delete pending request

### Unit Director Routes (`backend/src/routes/unitDirector.js`)
- `GET /api/unit-director/program-requests` - View all requests
- `PUT /api/unit-director/program-requests/:requestId/approve` - Approve & create program
- `PUT /api/unit-director/program-requests/:requestId/reject` - Reject request

## Frontend Implementation

### Office Side
**Page:** `frontend/src/pages/OfficeSettings/ProgramRequests.jsx`
- Request submission form (title + description)
- View pending/approved/rejected requests
- Delete pending requests
- Color-coded status display

**Navigation:** Added "Program Requests" menu item in `OfficeSidebar.jsx`

**Routes:** Added for all 6 offices in `App.jsx`:
- `/office/cces/program-requests`
- `/office/acca/program-requests`
- `/office/aces/program-requests`
- `/office/altec/program-requests`
- `/office/apc/program-requests`
- `/office/aclg/program-requests`

### Unit Director Side
**Page:** `frontend/src/pages/UnitDirectorSettings/Programs.jsx`
- Added "Pending Requests" tab with badge counter
- Table showing all requests with office, title, description, status
- Approve button (green) - creates program and marks as approved
- Reject button (red) - marks request as rejected
- Color-coded rows: yellow (pending), green (approved), red (rejected)

## Services Updated
- `frontend/src/services/userService.js` - Office program request methods
- `frontend/src/services/unitDirectorService.js` - Unit Director approval methods

## Testing Steps
1. **Run the database migration** in Supabase
2. **As an office user:**
   - Navigate to Settings > Program Requests
   - Submit a program request
   - View status of requests
3. **As unit director:**
   - Go to Settings > Programs
   - Click "Pending Requests" tab
   - Approve or reject requests
   - Check "Manage Programs" tab to see approved programs

## Workflow
1. Office submits program request → Status: Pending
2. Unit Director sees request in "Pending Requests" tab
3. Unit Director approves → Program created in office's program list, Status: Approved
4. Unit Director rejects → Status: Rejected (no program created)
