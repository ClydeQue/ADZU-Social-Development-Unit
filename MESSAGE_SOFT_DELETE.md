# Message Soft Delete Feature

## Overview

When a user deletes a message, the message is not permanently removed from the database. Instead, it's marked as deleted and shows "Message deleted" to the other user in the conversation.

## How It Works

### Database Changes

Added three new columns to the `messages` table:

- `is_deleted` (BOOLEAN): Whether the message has been deleted
- `deleted_by` (UUID): ID of the user who deleted the message
- `deleted_at` (TIMESTAMP): When the message was deleted

### Backend Logic

When a user deletes a message (`DELETE /api/messages/:messageId`):

1. Verifies the user is sender or receiver
2. Updates the message with:
   - `is_deleted = true`
   - `deleted_by = userId`
   - `deleted_at = current timestamp`
3. Message remains in database

When fetching messages:

- If `is_deleted = true` AND `deleted_by != current_user`:
  - Shows `subject: "Message deleted"`
  - Shows `message: "This message has been deleted"`
- If user deleted their own message, they see the original content

### Frontend Display

Deleted messages appear with:

- Italic text style
- Reduced opacity (60%)
- Text: "This message has been deleted"

## Migration

### For New Installations

Use the updated `messages_table.sql` script which includes soft delete columns.

### For Existing Installations

Run the migration script:

```sql
-- Run in Supabase SQL Editor
-- File: backend/database/messages_soft_delete_migration.sql
```

## Benefits

1. **Transparency**: Both parties know a message was deleted
2. **Audit Trail**: Can track who deleted what and when
3. **Data Integrity**: Messages aren't permanently lost
4. **User Privacy**: Users can still remove their messages from view

## Example Scenarios

### Scenario 1: Office User Deletes Message

1. Office user sends message to Unit Director
2. Unit Director reads message
3. Office user deletes message
4. Unit Director now sees: "Message deleted" / "This message has been deleted"
5. Office user no longer sees the message in their view

### Scenario 2: Unit Director Deletes Message

1. Unit Director sends message to Office user
2. Office user reads message
3. Unit Director deletes message
4. Office user sees: "Message deleted" / "This message has been deleted"
5. Unit Director no longer sees the message in their view

## Technical Details

### API Response Format

```javascript
{
  id: "uuid",
  subject: "Message deleted",  // if deleted by other user
  message: "This message has been deleted",  // if deleted by other user
  isDeleted: true,
  deletedBy: "uuid",
  // ... other fields
}
```

### Database Query

```javascript
// Backend automatically handles the logic:
const isDeletedByOther = msg.is_deleted && msg.deleted_by !== userId;
```

## Future Enhancements

- [ ] Add "restore" functionality for accidentally deleted messages
- [ ] Add admin view to see all deleted messages
- [ ] Add permanent delete option (after X days)
- [ ] Add delete notifications
