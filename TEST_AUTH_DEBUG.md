# Auth Debug Test Instructions

## Quick Test Steps

### 1. Open Browser Console (F12)

### 2. Check LocalStorage

Paste this in console:

```javascript
console.log("=== AUTH DEBUG ===");
console.log("Access Token:", localStorage.getItem("sdu_access_token"));
console.log(
  "Stored User:",
  JSON.parse(localStorage.getItem("sdu_user") || "{}")
);
console.log(
  "User office_id:",
  JSON.parse(localStorage.getItem("sdu_user") || "{}").office_id
);
```

### 3. Expected Output (for Office User)

```javascript
{
  id: "...",
  username: "cces",
  name: "CCES Office",
  userType: "office_user",
  office_id: "actual-uuid-here",  // ← THIS MUST BE PRESENT
  office: {
    id: "actual-uuid-here",
    name: "Center for Community Engagement and Service",
    acronym: "CCES",
    description: "..."
  }
}
```

### 4. If office_id is missing:

**Option A - Force Logout and Re-Login:**

```javascript
// Clear everything
localStorage.clear();
// Then refresh page and login again
location.reload();
```

**Option B - Check Backend Response:**
Look at Network tab → Filter "login" or "refresh"
Check the response body - it should include `office_id`

### 5. Verify Programs API Call

After login, check Network tab for:

- Request: `GET /api/office/{office-id}/programs`
- If office_id is undefined, the URL will be: `/api/office/undefined/programs`
- This will fail!

### 6. Expected Console Logs

With the debug code added, you should see:

```
🔐 Login Result: {
  hasAccessToken: true,
  hasUser: true,
  user: { ... with office_id ... },
  officeId: "actual-uuid-here"
}

✅ Session set: { ... with office_id ... }

🔍 ManagePrograms - User Object: {
  user: { ... with office_id ... },
  officeId: "actual-uuid-here",  // ← Must NOT be undefined
  officeIdPresent: true,
  userKeys: ["id", "username", "name", "userType", "office_id", "office"],
  fullUser: "{ ... }"
}

🔄 Fetching programs for office_id: "actual-uuid-here"

✅ Office Programs fetched: [...]
```

## Common Issues

### Issue 1: office_id is undefined

**Cause:** Old cached session without office_id
**Fix:** Logout and login again (or clear localStorage)

### Issue 2: office_id present but no programs

**Cause:** Programs not seeded in database
**Fix:** Run seed script (see DEBUG_PROGRAMS.md)

### Issue 3: Token refresh loses office_id

**Cause:** Backend refresh endpoint not including office_id (JUST FIXED!)
**Fix:** Restart backend server to get the fix

## Quick Fix Script

Run this in console to force re-login:

```javascript
// Clear auth
localStorage.removeItem("sdu_access_token");
localStorage.removeItem("sdu_user");
// Refresh page (will redirect to login)
location.reload();
```
