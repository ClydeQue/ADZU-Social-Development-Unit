# Unit Director Program Request Tabs Implementation

## Overview

Implemented a comprehensive tabbed interface for Unit Directors to review and manage program change requests (create, edit, delete) submitted by offices.

## Implementation Summary

### 1. Backend Routes (Already Existed)

**File:** `backend/src/routes/unitDirector.js`

The backend already had unified routes for handling all request types:

- `GET /api/unit-director/program-requests?type={create|update|delete}` - Fetch requests by type
- `PUT /api/unit-director/program-requests/:requestId/approve` - Approve any request type
- `PUT /api/unit-director/program-requests/:requestId/reject` - Reject any request type

The backend intelligently handles each request type:

- **Create**: Inserts new program into `programs` table
- **Update**: Updates existing program with new title/description
- **Delete**: Removes program from `programs` table (checks for activities first)

### 2. Service Layer Extensions

**File:** `frontend/src/services/unitDirectorService.js`

Added three new methods to fetch requests by type:

```javascript
async getProgramCreateRequests() {
  return await api.get("api/unit-director/program-requests?type=create");
}

async getProgramEditRequests() {
  return await api.get("api/unit-director/program-requests?type=update");
}

async getProgramDeleteRequests() {
  return await api.get("api/unit-director/program-requests?type=delete");
}
```

### 3. Unit Director Interface Updates

**File:** `frontend/src/pages/UnitDirectorSettings/Programs.jsx`

#### Tab Structure

Changed from 2 tabs to 4 tabs:

1. **Manage Programs** - Direct program management by office
2. **Create Requests** (red badge) - New program creation requests
3. **Edit Requests** (orange badge) - Program modification requests
4. **Delete Requests** (purple badge) - Program deletion requests

Each tab shows a count badge for pending requests.

#### Tab-Specific Queries

```javascript
const { data: createRequestsData, isLoading: createRequestsLoading } = useQuery(
  {
    queryKey: ["program-create-requests"],
    queryFn: () => UnitDirectorService.getProgramCreateRequests(),
    staleTime: 30000,
  }
);

const { data: editRequestsData, isLoading: editRequestsLoading } = useQuery({
  queryKey: ["program-edit-requests"],
  queryFn: () => UnitDirectorService.getProgramEditRequests(),
  staleTime: 30000,
});

const { data: deleteRequestsData, isLoading: deleteRequestsLoading } = useQuery(
  {
    queryKey: ["program-delete-requests"],
    queryFn: () => UnitDirectorService.getProgramDeleteRequests(),
    staleTime: 30000,
  }
);
```

### 4. UI Layouts by Request Type

#### Create Requests Tab

**Columns:** Office | Program Title | Description | Status | Actions

Standard layout showing:

- Office acronym with logo
- Proposed program title
- Proposed description
- Status badge (pending/approved/rejected)
- Approve/Reject buttons for pending requests

#### Edit Requests Tab

**Columns:** Office | Current | Proposed | Status | Actions

Comparison layout showing:

- Office acronym with logo
- **Current Values:**
  - Current Title (gray text)
  - Current Description (gray text)
- **Proposed Values:**
  - New Title (orange label, bold text)
  - New Description (orange label)
- Status badge
- Approve/Reject buttons for pending requests

This allows Unit Director to see exactly what will change.

#### Delete Requests Tab

**Columns:** Office | Program Title | Reason | Requested By | Status | Actions

Deletion-focused layout showing:

- Office acronym with logo
- Program title to be deleted
- **Reason for deletion** (provided by office)
- Requesting office
- Status badge (red for pending)
- Approve/Reject buttons for pending requests

Background color is light red (`bg-[#FFEBEE]`) to indicate destructive action.

### 5. Status Indicators

All tabs use color-coded status badges:

- **Pending:** Yellow badge (amber-500) - "⏳ PENDING"
- **Approved:** Green badge (green-500) - "✓ APPROVED" / "✓ Deleted"
- **Rejected:** Red badge (red-500) - "✗ REJECTED"

### 6. Mutation Updates

Updated mutations to invalidate all request query caches:

```javascript
onSuccess: () => {
  queryClient.invalidateQueries(["program-create-requests"]);
  queryClient.invalidateQueries(["program-edit-requests"]);
  queryClient.invalidateQueries(["program-delete-requests"]);
  queryClient.invalidateQueries(["unit-director-offices"]);
  setSuccessMessage("Program request approved successfully!");
  setShowSuccessModal(true);
};
```

## Data Flow

### Office User Workflow

1. Office navigates to Settings → Manage Programs
2. Sees list of approved programs
3. Clicks **Edit** or **Delete** on existing program
4. Fills out form with changes/reason
5. Submits request → Stored in `program_requests` table with `request_type='update'` or `'delete'`
6. Program shows "⏳ Pending Change" badge

### Unit Director Workflow

1. Unit Director navigates to Settings → Programs
2. Sees 4 tabs with badge counts for pending requests
3. Clicks on tab (Create/Edit/Delete Requests)
4. Reviews request details:
   - **Create:** New program info
   - **Edit:** Side-by-side comparison of current vs proposed
   - **Delete:** Program info + deletion reason
5. Clicks **Approve** or **Reject**
6. Backend applies changes to `programs` table
7. Request status updated in `program_requests` table
8. Office user sees updated program list

## Database Schema

### program_requests Table Fields

- `id` - Request ID
- `office_id` - Requesting office
- `program_id` - ID of program (for edit/delete)
- `request_type` - 'create', 'update', or 'delete'
- `title` - New program title (for create)
- `description` - New program description (for create)
- `new_title` - Updated title (for update)
- `new_description` - Updated description (for update)
- `reason` - Deletion reason (for delete)
- `status` - 'pending', 'approved', or 'rejected'
- `created_at` - Request timestamp
- `reviewed_by` - Unit Director ID
- `reviewed_at` - Review timestamp

## Features

### Visual Design

- ✅ Consistent Inter font family
- ✅ Color-coded tabs and badges
- ✅ Smooth hover effects on buttons
- ✅ Custom scrollbar styling (thin, blue)
- ✅ Responsive grid layouts
- ✅ Status-based row background colors

### User Experience

- ✅ Real-time badge counts for pending requests
- ✅ Loading skeletons while fetching data
- ✅ Empty state messages for each tab
- ✅ Disabled buttons during mutations
- ✅ Success modal on approve/reject
- ✅ Clear visual distinction between request types

### Data Management

- ✅ Automatic query invalidation on approve/reject
- ✅ Optimistic UI updates
- ✅ Error handling with alerts
- ✅ Prevents duplicate mutations with isPending checks

## Testing Checklist

- [ ] Create request shows in Create Requests tab with correct info
- [ ] Edit request shows current vs proposed values correctly
- [ ] Delete request shows deletion reason
- [ ] Badge counts update when new requests are submitted
- [ ] Approve button creates/updates/deletes program in programs table
- [ ] Reject button updates request status without touching programs table
- [ ] Office user sees updated program list after approval
- [ ] Multiple pending requests can be reviewed independently
- [ ] Loading states display correctly
- [ ] Empty states display when no requests exist
- [ ] Tab switching is smooth and maintains scroll position

## Future Enhancements

1. **Rejection Reason Modal** - Allow Unit Director to provide feedback when rejecting
2. **Request History** - Show all historical requests, not just pending
3. **Bulk Actions** - Approve/reject multiple requests at once
4. **Email Notifications** - Notify offices when requests are approved/rejected
5. **Request Comments** - Allow discussion thread on each request
6. **Audit Log** - Track all approve/reject actions by Unit Director

## Related Files

### Frontend

- `frontend/src/pages/UnitDirectorSettings/Programs.jsx` - Main component
- `frontend/src/services/unitDirectorService.js` - API service
- `frontend/src/pages/OfficeSettings/ManagePrograms.jsx` - Office side submission

### Backend

- `backend/src/routes/unitDirector.js` - Unit Director routes
- `backend/src/routes/office.js` - Office program change request routes

### Documentation

- `PROGRAM_EDIT_DELETE_APPROVAL.md` - Office side implementation guide
- `UNIT_DIRECTOR_PROGRAM_TABS.md` - This document
