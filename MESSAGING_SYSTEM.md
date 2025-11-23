# Messaging System Documentation

## Overview

The messaging system enables bidirectional communication between Office users and the Unit Director with automatic message retention management.

## Features

### Core Functionality

- ✅ **Bidirectional Messaging**: Offices can send messages to Unit Director and vice versa
- ✅ **Office Isolation**: Offices can only see their own conversations with the Unit Director
- ✅ **Real-time Unread Count**: Badge shows number of unread messages
- ✅ **Message Threading**: View full conversation history with any contact
- ✅ **Compose Messages**: Create and send new messages
- ✅ **Mark as Read**: Automatically mark messages as read when opened

### Message Retention (1-3 Years)

- ✅ **Automatic Cleanup**: Messages older than 3 years are automatically deleted
- ✅ **Startup Cleanup**: Server performs cleanup check on startup
- ✅ **Manual Cleanup**: Unit Director can manually trigger cleanup
- ✅ **Statistics Dashboard**: View message statistics including old messages count

## Database Schema

### Messages Table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(50) NOT NULL,  -- 'unit_director' or 'office_user'
  receiver_id UUID NOT NULL,
  receiver_type VARCHAR(50) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Indexes

- `idx_messages_sender_id` - Fast sender lookups
- `idx_messages_receiver_id` - Fast receiver lookups
- `idx_messages_created_at` - Fast date-based queries
- `idx_messages_unread` - Fast unread message queries

## API Endpoints

### Get Messages

```http
GET /api/messages
Authorization: Bearer <token>
```

Returns latest message per conversation.

**Response:**

```json
{
  "messages": [
    {
      "id": "uuid",
      "sender": "Office Name",
      "subject": "Message subject",
      "preview": "First 100 characters...",
      "time": "2h",
      "unread": true,
      "otherPartyId": "uuid"
    }
  ],
  "unread": 3
}
```

### Get Full Message History

```http
GET /api/messages/all
Authorization: Bearer <token>
```

Returns complete message history for current user.

### Send Message

```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "uuid",
  "receiverType": "unit_director",
  "subject": "Message subject",
  "message": "Message content"
}
```

### Mark as Read

```http
PUT /api/messages/:messageId/read
Authorization: Bearer <token>
```

### Delete Message

```http
DELETE /api/messages/:messageId
Authorization: Bearer <token>
```

### Get Message Statistics (Unit Director Only)

```http
GET /api/messages/stats
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "total": 1523,
    "oldMessages": 45,
    "unread": 12,
    "retentionPeriod": "3 years",
    "cutoffDate": "2022-11-23T00:00:00.000Z"
  }
}
```

### Cleanup Old Messages (Unit Director Only)

```http
DELETE /api/messages/cleanup
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully cleaned up 45 old messages",
  "deletedCount": 45,
  "cutoffDate": "2022-11-23T00:00:00.000Z"
}
```

## Security Features

### Access Control

1. **Office Users**:

   - Can ONLY message Unit Director
   - Can ONLY see their own conversations
   - Cannot see messages from other offices

2. **Unit Director**:
   - Can message any office
   - Can see all messages sent to/from them
   - Can access cleanup and statistics endpoints

### Double-Layer Security

Messages are filtered at two levels:

1. Database query level (SQL WHERE clause)
2. Application level (JavaScript filter)

This ensures office isolation even if one layer fails.

## Frontend Components

### InboxDropdown

Location: `frontend/src/components/InboxDropdown.jsx`

- Displays inbox with message list
- Shows unread count badge
- Filters: All / Unread
- Opens message threads

### ComposeMessageDialog

Location: `frontend/src/components/ComposeMessageDialog.jsx`

- Create new messages
- Select recipient (offices for Unit Director)
- Subject and message fields
- Send functionality

### MessageThreadDialog

Location: `frontend/src/components/MessageThreadDialog.jsx`

- Full conversation view
- Reply functionality
- Scrollable history
- Sender/receiver differentiation

### ViewMessageDialog

Location: `frontend/src/components/ViewMessageDialog.jsx`

- View single message details
- Reply option
- Delete option

## Message Service

Location: `frontend/src/services/messageService.js`

### Methods

```javascript
// Get messages
getMessages();

// Get full history
getAllMessages();

// Send message
sendMessage(receiverId, receiverType, subject, message);

// Mark as read
markAsRead(messageId);

// Delete message
deleteMessage(messageId);

// Get offices (Unit Director)
getOffices();

// Get statistics (Unit Director)
getMessageStats();

// Cleanup old messages (Unit Director)
cleanupOldMessages();
```

## Automatic Cleanup

### On Server Startup

The server automatically performs cleanup when it starts:

```javascript
// Runs once when messages route loads
performStartupCleanup();
```

### Manual Cleanup

Unit Director can manually trigger cleanup from Settings:

```javascript
const { data } = await MessageService.cleanupOldMessages();
console.log(`Deleted ${data.deletedCount} old messages`);
```

### Scheduled Cleanup (Optional)

For Supabase plans with pg_cron extension, you can schedule weekly cleanup:

```sql
SELECT cron.schedule('cleanup-old-messages', '0 2 * * 0', 'SELECT cleanup_old_messages();');
```

This runs every Sunday at 2 AM.

## Usage Examples

### Office User Sending Message

```javascript
import MessageService from "@/services/messageService";

// Send to Unit Director
await MessageService.sendMessage(
  null, // receiverId auto-resolved
  "unit_director",
  "Budget Approval Request",
  "Please review our budget proposal..."
);
```

### Unit Director Sending Message

```javascript
// Get list of offices
const { offices } = await MessageService.getOffices();

// Send to specific office
await MessageService.sendMessage(
  offices[0].id,
  "office_user",
  "Budget Approved",
  "Your budget has been approved..."
);
```

### View Message Statistics

```javascript
const { stats } = await MessageService.getMessageStats();
console.log(`Total: ${stats.total}`);
console.log(`Old messages: ${stats.oldMessages}`);
console.log(`Unread: ${stats.unread}`);
```

## Maintenance

### Regular Tasks

1. **Monitor message count** - Check statistics periodically
2. **Review retention policy** - Ensure 3-year retention meets requirements
3. **Manual cleanup** - Trigger cleanup if needed
4. **Check logs** - Review startup cleanup logs

### Database Maintenance

```sql
-- Check messages count
SELECT COUNT(*) FROM messages;

-- Check old messages (>3 years)
SELECT COUNT(*) FROM messages
WHERE created_at < NOW() - INTERVAL '3 years';

-- Manual cleanup
SELECT cleanup_old_messages();

-- Check message age distribution
SELECT
  CASE
    WHEN created_at > NOW() - INTERVAL '1 year' THEN '< 1 year'
    WHEN created_at > NOW() - INTERVAL '2 years' THEN '1-2 years'
    WHEN created_at > NOW() - INTERVAL '3 years' THEN '2-3 years'
    ELSE '> 3 years'
  END as age_range,
  COUNT(*) as count
FROM messages
GROUP BY age_range
ORDER BY age_range;
```

## Best Practices

1. **Subject Lines**: Keep subject lines concise but descriptive
2. **Message Content**: Use clear, professional language
3. **Response Time**: Aim to respond within 24-48 hours
4. **Archive Important Messages**: Save critical information outside the system before cleanup
5. **Regular Checks**: Review inbox daily
6. **Cleanup Before Major Events**: Manually cleanup before academic year start

## Troubleshooting

### Messages Not Showing

- Check network connectivity
- Verify authentication token
- Check browser console for errors
- Verify user permissions

### Unread Count Incorrect

- Refresh the page
- Check if messages were opened in another session
- Verify is_read status in database

### Cannot Send Message

- Check receiver ID is valid
- Verify receiver type is correct
- Ensure office users only message unit_director
- Check network connectivity

### Cleanup Not Working

- Verify Unit Director permissions
- Check server logs for errors
- Verify database connection
- Ensure messages table has created_at column

## Future Enhancements

Potential improvements:

- [ ] Attachments support
- [ ] Message search functionality
- [ ] Message labels/categories
- [ ] Email notifications
- [ ] Message templates
- [ ] Bulk operations
- [ ] Export message history
- [ ] Archive feature (alternative to deletion)
- [ ] Message encryption
- [ ] Read receipts

## Support

For issues or questions:

1. Check this documentation
2. Review server logs
3. Check database integrity
4. Verify API endpoints are working
5. Test with different user roles
