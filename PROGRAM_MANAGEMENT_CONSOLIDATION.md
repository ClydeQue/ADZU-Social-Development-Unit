# Program Management Consolidation

## Overview

Consolidated program request functionality into the Manage Programs page, creating a single unified interface for all program management tasks.

## Changes Made

### 1. **Component Updates**

#### `frontend/src/pages/OfficeSettings/ManagePrograms.jsx`

**Status**: ✅ Complete

**New Features Added**:

- **Request Form Section**: Horizontal layout with program name and description inputs
- **Pending Requests Section**: Displays all pending program requests with delete capability
- **Approved Programs Section**: Shows approved programs (existing functionality preserved)
- **Scrollable Layout**: Entire page is scrollable with max-height constraint
- **Status Badges**: Visual indicators for request status (pending/approved/rejected)

**API Integrations**:

- `useQuery` for fetching approved programs
- `useQuery` for fetching program requests
- `useMutation` for submitting new program requests
- `useMutation` for deleting program requests

**Layout Structure**:

```
┌─────────────────────────────────────────┐
│ Header: Manage Programs                 │
├─────────────────────────────────────────┤
│ Request Form (compact, horizontal)      │
│ [Program Name] [Description] [Submit]   │
├─────────────────────────────────────────┤
│ Pending Requests (if any)               │
│ ├─ Request 1 [Delete]                   │
│ └─ Request 2 [Delete]                   │
│ (scrollable, max-height: 240px)         │
├─────────────────────────────────────────┤
│ Search Bar                              │
├─────────────────────────────────────────┤
│ Approved Programs                       │
│ ├─ Program 1                            │
│ ├─ Program 2                            │
│ └─ Program 3                            │
│ (scrollable grid, max-height: 384px)   │
└─────────────────────────────────────────┘
```

#### `frontend/src/components/OfficeSidebar.jsx`

**Status**: ✅ Complete

**Changes**:

- Removed "Program Requests" subcategory button
- Updated `isSettingsActive()` to only check `/settings` and `/settings/programs` paths
- Settings subcategories now only show "Manage Programs"

#### `frontend/src/pages/OfficeSettings/index.jsx`

**Status**: ✅ Complete

**Changes**:

- Removed `isProgramRequests` routing variable
- Removed conditional rendering for `OfficeProgramRequests` component
- Removed `OfficeProgramRequests` import
- Now only routes between Account Settings and Manage Programs

### 2. **Route Cleanup**

#### `frontend/src/App.jsx`

**Status**: ✅ Complete

**Removed Routes** (6 offices):

- `/office/cces/program-requests`
- `/office/acca/program-requests`
- `/office/aces/program-requests`
- `/office/altec/program-requests`
- `/office/apc/program-requests`
- `/office/aclg/program-requests`

**Removed Import**:

- `import OfficeProgramRequests from "@/pages/OfficeSettings/ProgramRequests";`

### 3. **Files to Deprecate** (Optional Cleanup)

The following file is now obsolete but kept for reference:

- `frontend/src/pages/OfficeSettings/ProgramRequests.jsx` (262 lines)

You may delete this file if you're certain the migration is successful.

## User Experience Improvements

### Before

- Program requests in separate subcategory and page
- Navigation required switching between pages
- Larger, full-page layouts
- Separate forms and lists

### After

- ✅ All program management in one place
- ✅ Compact, scrollable sections
- ✅ Request form always visible at top
- ✅ Pending requests clearly highlighted
- ✅ Approved programs searchable below
- ✅ Matches "real settings UI" pattern with contained scrollable content
- ✅ Can see pending requests while viewing approved programs

## Technical Details

### State Management

```jsx
const [searchQuery, setSearchQuery] = useState("");
const [programName, setProgramName] = useState("");
const [programDescription, setProgramDescription] = useState("");
const [showSuccessModal, setShowSuccessModal] = useState(false);
```

### Data Fetching

```jsx
// Approved programs
useQuery(["office-approved-programs", user?.office_id]);

// Program requests (all statuses)
useQuery(["program-requests", user?.office_id]);
```

### Mutations

```jsx
// Submit new request
useMutation(UserService.submitProgramRequest);

// Delete request
useMutation(UserService.deleteProgramRequest);
```

### Filtering

- Pending requests: `requests.filter(r => r.status === 'pending')`
- Approved programs: Filtered by search query

## Backend Endpoints Used

No changes to backend required. Existing endpoints are used:

### Office Endpoints

- `GET /api/office/programs` - Fetch approved programs
- `GET /api/office/program-requests` - Fetch all requests
- `POST /api/office/program-requests` - Submit new request
- `DELETE /api/office/program-requests/:requestId` - Delete request

### Unit Director Endpoints (unchanged)

- `GET /api/unit-director/program-requests`
- `PUT /api/unit-director/program-requests/:requestId/approve`
- `PUT /api/unit-director/program-requests/:requestId/reject`

## Testing Checklist

- [ ] Submit new program request
- [ ] View pending requests
- [ ] Delete pending request
- [ ] View approved programs
- [ ] Search approved programs
- [ ] Test scrolling behavior with many items
- [ ] Test responsive layout (mobile/tablet/desktop)
- [ ] Verify success modal appears after submission
- [ ] Test all 6 offices (CCES, ACCA, ACES, ALTEC, APC, ACLG)
- [ ] Verify navigation to Settings → Manage Programs works
- [ ] Verify old /program-requests routes return 404 or redirect

## Styling Consistency

All sections use consistent styling:

- **Font**: Inter, sans-serif
- **Primary Color**: #040195 (blue)
- **Border Color**: #7E7DC5 (purple-blue)
- **Border Width**: 2px
- **Border Radius**: Various (lg, 2xl)
- **Spacing**: Consistent padding and margins
- **Icons**: Lucide-react (Plus, Clock, Trash2, Search, Calendar, MapPin, Users)

## Files Modified Summary

| File                       | Lines Changed | Status      |
| -------------------------- | ------------- | ----------- |
| `ManagePrograms.jsx`       | ~180          | ✅ Complete |
| `OfficeSidebar.jsx`        | ~10           | ✅ Complete |
| `OfficeSettings/index.jsx` | ~5            | ✅ Complete |
| `App.jsx`                  | ~42           | ✅ Complete |

**Total**: ~237 lines changed across 4 files

## Migration Complete ✅

All functionality from the Program Requests page has been successfully integrated into Manage Programs. The interface is now compact, scrollable, and follows the "real settings UI" pattern as requested.
