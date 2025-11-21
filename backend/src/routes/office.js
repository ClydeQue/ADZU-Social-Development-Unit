const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const supabase = require("../config/database");

const router = express.Router();

// Get all offices (public route for office selection)
router.get("/all", async (req, res) => {
  try {
    const { data: offices, error } = await supabase
      .from("offices")
      .select("id, name, acronym, description")
      .order("name");

    if (error) throw error;

    res.json({ offices });
  } catch (error) {
    console.error("Get offices error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all offices with program counts (for admin)
router.get(
  "/all-with-programs",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { data: offices, error } = await supabase
        .from("offices")
        .select(
          `
        id,
        name,
        description,
        programs(count)
      `
        )
        .order("name");

      if (error) throw error;

      const officesWithCounts = offices.map((office) => ({
        ...office,
        program_count: office.programs?.[0]?.count || 0,
      }));

      res.json({ offices: officesWithCounts });
    } catch (error) {
      console.error("Get offices with programs error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get specific office dashboard data
router.get("/:officeId/dashboard", authenticateToken, async (req, res) => {
  try {
    const { officeId } = req.params;

    // Check if user has access to this office
    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != officeId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get office details
    const { data: office, error: officeError } = await supabase
      .from("offices")
      .select("id, name, description")
      .eq("id", officeId)
      .single();

    if (officeError) throw officeError;

    // Get office programs with statistics
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select(
        "id, title, description, is_fixed, office_id, created_at, updated_at"
      )
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (programsError) throw programsError;

    // Calculate statistics
    const statistics = {
      total_programs: programs.length,
      ongoing_programs: programs.filter((p) => p.status === "ongoing").length,
      completed_programs: programs.filter((p) => p.status === "completed")
        .length,
      upcoming_programs: programs.filter((p) => p.status === "upcoming").length,
    };

    res.json({
      office,
      programs,
      statistics,
    });
  } catch (error) {
    console.error("Get office dashboard error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get office programs
router.get("/:officeId/programs", authenticateToken, async (req, res) => {
  try {
    const { officeId } = req.params;

    // Check if user has access to this office
    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != officeId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { data: programs, error } = await supabase
      .from("programs")
      .select(
        "id, title, description, is_fixed, office_id, created_at, updated_at"
      )
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ programs });
  } catch (error) {
    console.error("Get office programs error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get office reports data
router.get("/:officeId/reports", authenticateToken, async (req, res) => {
  try {
    const { officeId } = req.params;

    // Check if user has access to this office
    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != officeId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get office details
    const { data: office, error: officeError } = await supabase
      .from("offices")
      .select("id, name, acronym, description")
      .eq("id", officeId)
      .single();

    if (officeError) throw officeError;

    // Get all programs for this office
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select(
        "id, title, description, is_fixed, office_id, created_at, updated_at"
      )
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (programsError) throw programsError;

    // Get all activities for this office's programs with program info
    const programIds = programs.map((p) => p.id);
    let activities = [];

    if (programIds.length > 0) {
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select(
          `
          id,
          program_id,
          activity_name,
          start_date,
          end_date,
          implementing_partners,
          objectives,
          participants_count,
          venue,
          budget,
          sdg_number,
          status,
          notes,
          created_at,
          updated_at,
          programs(id, title)
        `
        )
        .in("program_id", programIds)
        .order("start_date", { ascending: false });

      if (activitiesError) throw activitiesError;
      activities = activitiesData || [];
    }

    // Calculate comprehensive statistics
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Program statistics
    const programStats = {
      total: programs.length,
      by_status: {
        ongoing: programs.filter((p) => p.status === "ongoing").length,
        completed: programs.filter((p) => p.status === "completed").length,
        upcoming: programs.filter((p) => p.status === "upcoming").length,
        planned: programs.filter((p) => p.status === "planned").length,
      },
      this_year: programs.filter((p) => {
        const createdDate = new Date(p.created_at);
        return createdDate.getFullYear() === currentYear;
      }).length,
    };

    // Activity statistics
    const activityStats = {
      total: activities.length,
      by_status: {
        completed: activities.filter((a) => a.status === "completed").length,
        ongoing: activities.filter((a) => a.status === "ongoing").length,
        planned: activities.filter((a) => a.status === "planned").length,
        cancelled: activities.filter((a) => a.status === "cancelled").length,
      },
      this_year: activities.filter((a) => {
        const startDate = new Date(a.start_date);
        return startDate.getFullYear() === currentYear;
      }).length,
      this_month: activities.filter((a) => {
        const startDate = new Date(a.start_date);
        return (
          startDate.getFullYear() === currentYear &&
          startDate.getMonth() === currentMonth
        );
      }).length,
    };

    // Participant statistics
    const totalParticipants = activities.reduce(
      (sum, a) => sum + (a.participants_count || 0),
      0
    );
    const avgParticipants =
      activities.length > 0
        ? Math.round(totalParticipants / activities.length)
        : 0;

    // Budget statistics
    const totalBudget = activities.reduce(
      (sum, a) => sum + (parseFloat(a.budget) || 0),
      0
    );
    const avgBudget =
      activities.length > 0 ? totalBudget / activities.length : 0;

    // SDG distribution
    const sdgDistribution = {};
    activities.forEach((a) => {
      if (a.sdg_number) {
        sdgDistribution[a.sdg_number] =
          (sdgDistribution[a.sdg_number] || 0) + 1;
      }
    });

    // Recent programs (last 5)
    const recentPrograms = programs.slice(0, 5);

    // Recent activities (last 10)
    const recentActivities = activities.slice(0, 10);

    // Monthly activity trend (last 6 months)
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const month = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const count = activities.filter((a) => {
        const startDate = new Date(a.start_date);
        return (
          startDate.getFullYear() === date.getFullYear() &&
          startDate.getMonth() === date.getMonth()
        );
      }).length;
      monthlyTrend.push({ month, count });
    }

    res.json({
      office,
      summary: {
        programs: programStats,
        activities: activityStats,
        participants: {
          total: totalParticipants,
          average: avgParticipants,
        },
        budget: {
          total: totalBudget,
          average: avgBudget,
          currency: "PHP",
        },
        sdg_distribution: sdgDistribution,
      },
      recent_programs: recentPrograms,
      recent_activities: recentActivities,
      trends: {
        monthly_activities: monthlyTrend,
      },
    });
  } catch (error) {
    console.error("Get office reports error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ ACTIVITY ROUTES (must come before /:officeId/activities) ============

// Create new activity
router.post("/activities", authenticateToken, async (req, res) => {
  try {
    const activityData = req.body;
    const userId = req.user.id;

    console.log("Create activity request:", { activityData, userId });

    // Validate required fields
    if (!activityData.activity_name || !activityData.program_id) {
      return res.status(400).json({ 
        error: "activity_name and program_id are required" 
      });
    }

    // Verify the program belongs to the user's office
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("id, office_id")
      .eq("id", activityData.program_id)
      .single();

    if (programError || !program) {
      return res.status(404).json({ error: "Program not found" });
    }

    // Check if user has access to this office
    if (req.user.userType !== "unit_director" && req.user.office_id != program.office_id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Prepare activity data with proper types
    const newActivity = {
      program_id: activityData.program_id,
      activity_name: activityData.activity_name,
      start_date: activityData.start_date || null,
      end_date: activityData.end_date || null,
      participants_count: activityData.participants_count ? parseInt(activityData.participants_count) : 0,
      male_participants: activityData.male_participants ? parseInt(activityData.male_participants) : 0,
      female_participants: activityData.female_participants ? parseInt(activityData.female_participants) : 0,
      venue: activityData.venue || JSON.stringify({
        street: '',
        barangay: '',
        city: '',
        province: ''
      }),
      description: activityData.description || null,
      objectives: activityData.objectives || null,
      classification: activityData.classification || null,
      implementing_partners: activityData.implementing_partners || null,
      partner_name: activityData.partner_name || null,
      partner_type: activityData.partner_type || null,
      partner_nature: activityData.partner_nature || null,
      budget: activityData.budget ? parseFloat(activityData.budget) : null,
      allocated_budget: activityData.allocated_budget ? parseFloat(activityData.allocated_budget) : 0,
      liquidated_budget: activityData.liquidated_budget ? parseFloat(activityData.liquidated_budget) : 0,
      budget_amount: activityData.budget_amount ? parseFloat(activityData.budget_amount) : null,
      budget_type: activityData.budget_type || null,
      sdg_number: activityData.sdg_number ? parseInt(activityData.sdg_number) : null,
      phase: activityData.phase || null,
      status: 'pending', // Status is always pending on creation, controlled by Unit Director
      report_url: activityData.report_url || null, // URL link to report
      notes: activityData.notes || null,
      created_by: userId,
    };

    console.log("Prepared activity data:", newActivity);

    // Create the activity
    const { data: createdActivity, error: createError } = await supabase
      .from("activities")
      .insert(newActivity)
      .select()
      .single();

    if (createError) {
      console.error("Create error:", createError);
      throw createError;
    }

    console.log("Activity created successfully:", createdActivity);

    res.status(201).json({ 
      message: "Activity created successfully",
      activity: createdActivity 
    });
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
});

// Delete multiple activities
router.delete(
  "/activities",
  authenticateToken,
  requireRole(["office_user"]),
  async (req, res) => {
    try {
      const { activity_ids } = req.body;
      const userOfficeId = req.user.office_id;

      if (
        !activity_ids ||
        !Array.isArray(activity_ids) ||
        activity_ids.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "activity_ids array is required" });
      }

      // First verify all activities belong to the user's office through programs
      const { data: activities, error: fetchError } = await supabase
        .from("activities")
        .select(
          `
        id,
        program_id,
        programs!inner(office_id)
      `
        )
        .in("id", activity_ids);

      if (fetchError) throw fetchError;

      // Check if all activities belong to user's office
      const unauthorizedActivity = activities.find(
        (activity) => activity.programs?.office_id !== userOfficeId
      );

      if (unauthorizedActivity) {
        return res.status(403).json({
          error: "You can only delete activities from your own office",
        });
      }

      // First, delete related notifications
      const { error: notificationDeleteError } = await supabase
        .from("notifications")
        .delete()
        .in("activity_id", activity_ids);

      if (notificationDeleteError) {
        console.error(
          "Error deleting related notifications:",
          notificationDeleteError
        );
        throw notificationDeleteError;
      }

      // Now delete the activities
      const { error: deleteError } = await supabase
        .from("activities")
        .delete()
        .in("id", activity_ids);

      if (deleteError) throw deleteError;

      res.json({
        message: "Activities deleted successfully",
        deleted_count: activity_ids.length,
      });
    } catch (error) {
      console.error("Delete activities error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Add a new program to an office
router.post(
  "/:officeId/programs",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { officeId } = req.params;
      const { title, description, is_fixed } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Program title is required" });
      }

      const { data: program, error } = await supabase
        .from("programs")
        .insert({
          office_id: officeId,
          title,
          description: description || null,
          is_fixed: is_fixed || false,
        })
        .select()
        .single();

      if (error) throw error;

      res.json({ program });
    } catch (error) {
      console.error("Add program error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Update a program
router.put(
  "/programs/:programId",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { programId } = req.params;
      const { title, description, is_fixed } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (is_fixed !== undefined) updateData.is_fixed = is_fixed;

      const { data: program, error } = await supabase
        .from("programs")
        .update(updateData)
        .eq("id", programId)
        .select()
        .single();

      if (error) throw error;

      res.json({ program });
    } catch (error) {
      console.error("Update program error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete a program
router.delete(
  "/programs/:programId",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { programId } = req.params;

      // First check if program has activities
      const { data: activities, error: activitiesError } = await supabase
        .from("activities")
        .select("id")
        .eq("program_id", programId);

      if (activitiesError) throw activitiesError;

      if (activities && activities.length > 0) {
        return res.status(400).json({
          error: "Cannot delete program with existing activities",
          activityCount: activities.length,
        });
      }

      const { error } = await supabase
        .from("programs")
        .delete()
        .eq("id", programId);

      if (error) throw error;

      res.json({ message: "Program deleted successfully" });
    } catch (error) {
      console.error("Delete program error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get single activity by ID
router.get("/activities/:activityId", authenticateToken, async (req, res) => {
  try {
    const { activityId } = req.params;

    const { data: activity, error } = await supabase
      .from("activities")
      .select(`
        *,
        programs(
          id, 
          title, 
          office_id,
          offices(id, name, acronym)
        )
      `)
      .eq("id", activityId)
      .single();

    if (error) {
      console.error("Get activity query error:", error);
      throw error;
    }

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    console.log("Activity data:", JSON.stringify(activity, null, 2));

    // Check if user has access to this office
    if (req.user.userType !== "unit_director" && req.user.office_id != activity.programs.office_id) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ activity });
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update activity
router.put("/activities/:activityId", authenticateToken, async (req, res) => {
  try {
    const { activityId } = req.params;
    const updateData = req.body;

    console.log("\n=== UPDATE ACTIVITY REQUEST ===");
    console.log("Activity ID:", activityId);
    console.log("Request body keys:", Object.keys(updateData));
    console.log("Description received:", updateData.description);
    console.log("Description type:", typeof updateData.description);
    console.log("Description is undefined?", updateData.description === undefined);
    console.log("Description is null?", updateData.description === null);
    console.log("Description is empty string?", updateData.description === '');
    console.log("================================\n");

    // First, get the activity to check permissions
    const { data: existingActivity, error: fetchError } = await supabase
      .from("activities")
      .select("id, programs(office_id)")
      .eq("id", activityId)
      .single();

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      throw fetchError;
    }

    if (!existingActivity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Check if user has access to this office
    if (req.user.userType !== "unit_director" && req.user.office_id != existingActivity.programs.office_id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Prepare update data - simplified sanitization
    const sanitizedData = {};
    
    // Simple mapping - just pass through the allowed fields
    if (updateData.activity_name !== undefined) sanitizedData.activity_name = updateData.activity_name;
    if (updateData.program_id !== undefined) sanitizedData.program_id = updateData.program_id;
    if (updateData.start_date !== undefined) sanitizedData.start_date = updateData.start_date;
    if (updateData.end_date !== undefined) sanitizedData.end_date = updateData.end_date;
    
    // Numeric fields
    if (updateData.participants_count !== undefined) {
      sanitizedData.participants_count = updateData.participants_count ? parseInt(updateData.participants_count) : null;
    }
    if (updateData.male_participants !== undefined) {
      sanitizedData.male_participants = updateData.male_participants ? parseInt(updateData.male_participants) : null;
    }
    if (updateData.female_participants !== undefined) {
      sanitizedData.female_participants = updateData.female_participants ? parseInt(updateData.female_participants) : null;
    }
    
    // Venue as JSON string
    if (updateData.venue !== undefined) {
      sanitizedData.venue = typeof updateData.venue === 'string' ? updateData.venue : JSON.stringify(updateData.venue);
    }
    
    // Text fields - THE KEY FIX: Just pass them through as-is
    if (updateData.description !== undefined) sanitizedData.description = updateData.description;
    if (updateData.objectives !== undefined) sanitizedData.objectives = updateData.objectives;
    if (updateData.classification !== undefined) sanitizedData.classification = updateData.classification;
    if (updateData.phase !== undefined) sanitizedData.phase = updateData.phase;
    if (updateData.notes !== undefined) sanitizedData.notes = updateData.notes;
    
    // Partners
    if (updateData.partner_name !== undefined) sanitizedData.partner_name = updateData.partner_name;
    if (updateData.partner_type !== undefined) sanitizedData.partner_type = updateData.partner_type;
    if (updateData.partner_nature !== undefined) sanitizedData.partner_nature = updateData.partner_nature;
    
    // Budget
    if (updateData.budget_amount !== undefined) {
      sanitizedData.budget_amount = updateData.budget_amount ? parseFloat(updateData.budget_amount) : null;
    }
    if (updateData.budget_type !== undefined) sanitizedData.budget_type = updateData.budget_type;
    
    // Other fields
    if (updateData.report_url !== undefined) sanitizedData.report_url = updateData.report_url;
    if (updateData.implementing_partners !== undefined) sanitizedData.implementing_partners = updateData.implementing_partners;
    
    console.log("\n=== SANITIZED DATA ===");
    console.log("Description:", sanitizedData.description);
    console.log("All fields:", Object.keys(sanitizedData));
    console.log("======================\n");

    console.log("Description in sanitizedData:", sanitizedData.description);
    console.log("======================\n");

    // Update the activity
    console.log("\n=== UPDATING DATABASE ===");
    console.log("Fields being updated:", Object.keys(sanitizedData));
    console.log("Description field included?", 'description' in sanitizedData);
    console.log("Description value:", sanitizedData.description);
    console.log("Full sanitizedData:", JSON.stringify(sanitizedData, null, 2));
    
    const updatePayload = {
      ...sanitizedData,
      updated_at: new Date().toISOString(),
    };
    
    console.log("Full update payload:", JSON.stringify(updatePayload, null, 2));
    
    const { data: updatedActivity, error: updateError } = await supabase
      .from("activities")
      .update(updatePayload)
      .eq("id", activityId)
      .select()
      .single();

    console.log("Update complete.");
    console.log("Update error?", updateError);
    console.log("Updated activity description:", updatedActivity?.description);
    console.log("Full updated activity:", JSON.stringify(updatedActivity, null, 2));
    console.log("=========================\n");

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    console.log("Activity updated successfully:", updatedActivity);

    res.json({ 
      message: "Activity updated successfully",
      activity: updatedActivity 
    });
  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
});

// ============ OFFICE-SPECIFIC ROUTES ============

// Get office activities for calendar
router.get("/:officeId/activities", authenticateToken, async (req, res) => {
  try {
    const { officeId } = req.params;

    // Check if user has access to this office
    if (req.user.userType !== "unit_director" && req.user.office_id != officeId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get all programs for this office
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select("id")
      .eq("office_id", officeId);

    if (programsError) throw programsError;

    const programIds = programs.map(p => p.id);
    let activities = [];
    
    if (programIds.length > 0) {
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select(`
          id,
          activity_name,
          start_date,
          end_date,
          status,
          venue,
          participants_count,
          objectives,
          notes,
          programs(id, title)
        `)
        .in("program_id", programIds)
        .order("start_date", { ascending: true });

      if (activitiesError) throw activitiesError;
      activities = activitiesData || [];
    }

    // Transform to calendar format
    const transformedActivities = activities.map((activity) => ({
      id: activity.id,
      title: activity.activity_name,
      start: activity.start_date,
      end: activity.end_date,
      status: activity.status || "pending",
      venue: activity.venue,
      participants_count: activity.participants_count,
      objectives: activity.objectives,
      notes: activity.notes,
      program_id: activity.programs?.id,
      program_title: activity.programs?.title || "Untitled Program",
    }));

    res.json({ activities: transformedActivities });
  } catch (error) {
    console.error("Get office activities error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
