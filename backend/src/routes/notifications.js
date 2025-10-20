const express = require("express");
const supabase = require("../config/database");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

/**
 * Get all notifications
 */
router.get("/", authenticateToken, async (req, res) => {
  console.log("Fetching notifications for user:", req.user?.id);
  try {
    // Get notifications with activity and office details
    // Build the select query explicitly to avoid runtime type issues
    const selectFields = `
        id,
        type,
        activity_id,
        office_id,
        created_at,
        read_at
      `;

    let notificationsResult;
    if (req.user.userType !== "unit_director" && req.user.office_id) {
      // Office-limited query
      notificationsResult = await supabase
        .from("notifications")
        .select(selectFields)
        .eq("office_id", req.user.office_id)
        .order("created_at", { ascending: false });
    } else {
      // Unit director or no office filter
      notificationsResult = await supabase
        .from("notifications")
        .select(selectFields)
        .order("created_at", { ascending: false });
    }

    // First, check if the tables exist
    const { data: tableCheck, error: tablesError } = await supabase
      .from("notifications")
      .select("id")
      .limit(1);

    console.log("Table check result:", {
      hasData: !!tableCheck?.length,
      error: tablesError,
      userContext: {
        userId: req.user?.id,
        userType: req.user?.userType,
        officeId: req.user?.office_id,
      },
    });

    if (tablesError) {
      console.error("Error checking tables:", tablesError);
      throw new Error("Database tables not properly configured");
    }

    const { data: notifications, error } = notificationsResult;
    if (error) throw error;

    // Then fetch related data separately to avoid join issues
    const activityIds = notifications.map((n) => n.activity_id).filter(Boolean);
    const officeIds = notifications.map((n) => n.office_id).filter(Boolean);

    const [activitiesResult, officesResult] = await Promise.all([
      activityIds.length > 0
        ? supabase
            .from("activities")
            .select("id, activity_name, start_date, end_date, status")
            .in("id", activityIds)
        : { data: [] },
      officeIds.length > 0
        ? supabase.from("offices").select("id, name").in("id", officeIds)
        : { data: [] },
    ]);

    if (activitiesResult.error) throw activitiesResult.error;
    if (officesResult.error) throw officesResult.error;

    // Create lookup maps
    const activitiesMap = new Map(
      activitiesResult.data?.map((a) => [a.id, a]) || []
    );
    const officesMap = new Map(officesResult.data?.map((o) => [o.id, o]) || []);

    console.log("Notifications query result:", { notifications, error });

    if (error) throw error;

    // Format notifications
    const formattedNotifications = notifications
      .map((notification) => {
        const activity = activitiesMap.get(notification.activity_id);
        const office = officesMap.get(notification.office_id);

        // Log detailed info for debugging
        console.log("Processing notification:", {
          notificationId: notification.id,
          activityId: notification.activity_id,
          officeId: notification.office_id,
          activityFound: !!activity,
          officeFound: !!office,
        });

        if (!activity || !office) {
          console.log(
            "Skipping notification due to missing relations:",
            notification.id
          );
          return null;
        }

        return {
          id: notification.id,
          type: notification.type,
          office: office.name || "Unknown Office",
          activity: activity.activity_name || "Unknown Activity",
          dueDate: activity.end_date,
          submittedDate: activity.start_date,
          status: activity.status,
          time: getTimeAgo(notification.created_at),
          unread: !notification.read_at,
          logo: office.logo_url || "/logos/officeLogoTransparent/default.png",
        };
      })
      .filter(Boolean); // Remove null entries

    // Get unread count
    // Get unread count (apply office filter for non-unit director)
    let unreadCountResult;
    if (req.user.userType !== "unit_director" && req.user.office_id) {
      unreadCountResult = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .eq("office_id", req.user.office_id)
        .is("read_at", null);
    } else {
      unreadCountResult = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .is("read_at", null);
    }

    const { count: unreadCount, error: countError } = unreadCountResult;

    if (countError) throw countError;

    res.json({
      items: formattedNotifications,
      unread: unreadCount || 0,
    });
  } catch (error) {
    console.error("Error fetching notifications:", {
      error: error.message,
      stack: error.stack,
      details: error.details || "No additional details",
      code: error.code,
    });

    // Send a more detailed error response in development
    if (process.env.NODE_ENV !== "production") {
      res.status(500).json({
        error: "Error fetching notifications",
        details: error.message,
        code: error.code,
      });
    } else {
      res.status(500).json({ error: "Error fetching notifications" });
    }
  }
});

/**
 * Mark notification as read
 */
router.put("/:id/read", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Error marking notification as read" });
  }
});

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
  return new Date(date).toLocaleDateString();
}

// Development only - Create test notification
router.post("/test", authenticateToken, async (req, res) => {
  try {
    // Log complete request context
    console.log("Test endpoint called with context:", {
      user: {
        id: req.user?.id,
        userType: req.user?.userType,
        officeId: req.user?.office_id,
        name: req.user?.name,
      },
      headers: {
        authorization: req.headers.authorization
          ? "Bearer [present]"
          : "Bearer [missing]",
      },
      body: req.body,
      method: req.method,
    });

    // Validate user context
    if (!req.user) {
      throw new Error("No user context found in request");
    }

    // Resolve office id: prefer user's office_id, otherwise pick the first office in DB (dev convenience)
    let officeId = req.user.office_id;
    if (!officeId) {
      console.warn(
        "No office_id in JWT payload; attempting to pick first office from DB for test endpoint"
      );
      const { data: firstOffice, error: officeFetchError } = await supabase
        .from("offices")
        .select("id")
        .limit(1)
        .single();

      if (officeFetchError || !firstOffice) {
        console.error(
          "Could not resolve an office id for test endpoint:",
          officeFetchError
        );
        throw new Error(
          "User must have an office_id to create test notification"
        );
      }

      officeId = firstOffice.id;
    }

    // Check database connection first
    const { data: dbCheck, error: dbError } = await supabase
      .from("offices")
      .select("id")
      .limit(1);

    if (dbError) {
      console.error("Database connection test failed:", dbError);
      throw new Error(`Database connection error: ${dbError.message}`);
    }

    console.log("Database connection test successful");

    // Simpler dev-only flow: create a notification without creating program/activity.
    // This avoids FK and type issues during development/testing.
    const testNotification = {
      activity_id: null,
      office_id: officeId,
      type: "Reminder",
      created_at: new Date().toISOString(),
    };

    if (!["Reminder", "Report"].includes(testNotification.type)) {
      throw new Error(
        'Invalid notification type. Must be either "Reminder" or "Report"'
      );
    }

    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert(testNotification)
      .select(
        `
          id,
          type,
          created_at,
          read_at,
          activity_id,
          office_id
        `
      )
      .single();

    if (notificationError) {
      console.error("Error creating test notification:", notificationError);
      throw new Error(
        `Could not create test notification: ${notificationError.message}`
      );
    }

    console.log("Created test notification:", notification);

    res.json({
      message: "Test notification created successfully",
      data: {
        notification,
      },
    });
  } catch (error) {
    console.error("Error in test endpoint:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details || "No additional details",
    });

    // Send detailed error in development, sanitized error in production
    if (process.env.NODE_ENV !== "production") {
      res.status(500).json({
        error: "Error in test endpoint",
        details: error.message,
        code: error.code,
        stack: error.stack,
      });
    } else {
      res.status(500).json({
        error: "Error creating test notification",
        message:
          "An unexpected error occurred while creating the test notification",
      });
    }
  }
});

// Helper function to clean up created records in case of error
async function cleanupCreatedRecords(records) {
  console.log("Attempting to clean up created records:", records);

  // Process in reverse order to handle dependencies
  for (const record of records.reverse()) {
    try {
      const { error } = await supabase
        .from(record.type + "s") // Add 's' to match table names
        .delete()
        .eq("id", record.id);

      if (error) {
        console.error(`Error cleaning up ${record.type} ${record.id}:`, error);
      } else {
        console.log(`Successfully cleaned up ${record.type} ${record.id}`);
      }
    } catch (error) {
      console.error(`Failed to clean up ${record.type} ${record.id}:`, error);
    }
  }
}

module.exports = router;
