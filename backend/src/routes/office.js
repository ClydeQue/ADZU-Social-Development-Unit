const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const supabase = require("../config/database");

const router = express.Router();

// ============ THUMBNAIL UPLOAD ROUTE ============

// Upload thumbnail to Supabase storage
router.post("/upload-thumbnail", authenticateToken, async (req, res) => {
  try {
    const { fileData, fileName, contentType } = req.body;
    
    if (!fileData || !fileName) {
      return res.status(400).json({ error: "File data and file name are required" });
    }

    // Decode base64 file data
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `thumbnails/${uniqueFileName}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('activity-thumbnails')
      .upload(filePath, buffer, {
        contentType: contentType || 'image/jpeg',
        upsert: false
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('activity-thumbnails')
      .getPublicUrl(filePath);
    
    res.json({
      message: "Thumbnail uploaded successfully",
      url: urlData.publicUrl,
      path: filePath
    });
    
  } catch (error) {
    console.error("Upload thumbnail error:", error);
    res.status(500).json({ error: "Failed to upload thumbnail" });
  }
});

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

    // Get all activities for this office's programs
    const programIds = programs.map((p) => p.id);
    let activities = [];

    if (programIds.length > 0) {
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select("id, program_id, status, phase")
        .in("program_id", programIds);

      if (activitiesError) throw activitiesError;
      activities = activitiesData || [];
    }

    // Calculate statistics based on activities (similar to Unit Director dashboard)
    // Cards use STATUS field for completed/pending, and PHASE field for in_progress
    const statistics = {
      total_programs: programs.length,
      completed: activities.filter((a) => a.status === "completed").length,
      in_progress: activities.filter(
        (a) =>
          a.phase &&
          (a.phase.toLowerCase() === "in progress" ||
            a.phase.toLowerCase() === "implementation" ||
            a.phase.toLowerCase() === "execution")
      ).length,
      pending: activities.filter((a) => a.status === "pending").length,
      // Keep old program-based stats for backward compatibility
      ongoing_programs: programs.filter((p) => p.status === "ongoing").length,
      completed_programs: programs.filter((p) => p.status === "completed")
        .length,
      upcoming_programs: programs.filter((p) => p.status === "upcoming").length,
    };

    // Calculate phase distribution for bar chart
    // Uses the PHASE field from the activity form dropdown:
    // "Planning", "Implementation", "In Progress", "Completed", "Cancelled"
    const phaseDistribution = {
      planning: activities.filter((a) => a.phase && a.phase.toLowerCase() === "planning").length,
      implementation: activities.filter((a) => a.phase && a.phase.toLowerCase() === "implementation").length,
      in_progress: activities.filter((a) => a.phase && a.phase.toLowerCase() === "in progress").length,
      completed: activities.filter((a) => a.phase && a.phase.toLowerCase() === "completed").length,
      cancelled: activities.filter((a) => a.phase && a.phase.toLowerCase() === "cancelled").length,
    };

    // Get all upcoming activities (where end_date >= today) sorted in ascending order
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDate = today.toISOString();

    let upcomingActivities = [];
    if (programIds.length > 0) {
      const { data: upcomingData, error: upcomingError } = await supabase
        .from("activities")
        .select(
          `
          id,
          activity_name,
          start_date,
          end_date,
          status,
          program_id,
          programs(
            id,
            title
          )
        `
        )
        .in("program_id", programIds)
        .gte("end_date", currentDate)
        .order("end_date", { ascending: true });

      if (!upcomingError && upcomingData) {
        upcomingActivities = upcomingData.map((activity) => ({
          id: activity.id,
          activity: activity.activity_name || "Untitled Activity",
          due: activity.end_date,
          start_date: activity.start_date,
          status: activity.status || "pending",
          program: activity.programs?.title || "Unknown Program",
        }));
      }
    }

    res.json({
      office,
      programs,
      statistics,
      phaseDistribution,
      upcomingPrograms: upcomingActivities,
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
          budget_amount,
          budget_type,
          sdg_number,
          strategic_goals,
          thumbnail_url,
          status,
          phase,
          notes,
          created_at,
          updated_at,
          programs(id, title, office_id)
        `
        )
        .in("program_id", programIds)
        .order("start_date", { ascending: false });

      if (activitiesError) throw activitiesError;
      activities = (activitiesData || []).map(a => ({ ...a, is_partner_activity: false }));
    }

    // Also fetch activities where this office is listed as an Internal partner
    if (office.acronym) {
      const { data: partnerActivities, error: partnerError } = await supabase
        .from("activities")
        .select(
          `
          id,
          program_id,
          activity_name,
          start_date,
          end_date,
          implementing_partners,
          partner_type,
          partner_name,
          objectives,
          participants_count,
          venue,
          budget_amount,
          budget_type,
          sdg_number,
          strategic_goals,
          thumbnail_url,
          status,
          phase,
          notes,
          created_at,
          updated_at,
          programs(id, title, office_id, offices(id, name, acronym))
        `
        )
        .ilike("partner_type", `%Internal%`)
        .ilike("partner_name", `%${office.acronym}%`)
        .order("start_date", { ascending: false });

      if (partnerError) {
        console.error("Error fetching partner activities:", partnerError);
      } else if (partnerActivities && partnerActivities.length > 0) {
        // Filter out activities that already belong to this office's programs
        // and mark them as partner activities
        const existingIds = new Set(activities.map(a => a.id));
        const newPartnerActivities = partnerActivities
          .filter(a => !existingIds.has(a.id) && !programIds.includes(a.program_id))
          .map(a => ({ 
            ...a, 
            is_partner_activity: true,
            partner_office: a.programs?.offices || null
          }));
        
        activities = [...activities, ...newPartnerActivities];
      }
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

    // Budget statistics - parse from budget_amount JSON array
    const totalBudget = activities.reduce((sum, a) => {
      try {
        if (a.budget_amount) {
          const amounts =
            typeof a.budget_amount === "string"
              ? JSON.parse(a.budget_amount)
              : [a.budget_amount];
          const activityTotal = amounts.reduce(
            (total, amount) => total + (parseFloat(amount) || 0),
            0
          );
          return sum + activityTotal;
        }
      } catch (e) {
        // If parsing fails, try single value
        return sum + (parseFloat(a.budget_amount) || 0);
      }
      return sum;
    }, 0);
    const avgBudget =
      activities.length > 0 ? totalBudget / activities.length : 0;

    // SDG distribution - parse from sdg_number JSON array
    const sdgDistribution = {};
    activities.forEach((a) => {
      if (a.sdg_number) {
        try {
          const sdgNumbers =
            typeof a.sdg_number === "string"
              ? JSON.parse(a.sdg_number)
              : Array.isArray(a.sdg_number)
              ? a.sdg_number
              : [a.sdg_number];
          sdgNumbers.forEach((sdgNum) => {
            const sdg = parseInt(sdgNum);
            if (!isNaN(sdg)) {
              sdgDistribution[sdg] = (sdgDistribution[sdg] || 0) + 1;
            }
          });
        } catch (e) {
          // Fallback for single numeric value
          const sdg = parseInt(a.sdg_number);
          if (!isNaN(sdg)) {
            sdgDistribution[sdg] = (sdgDistribution[sdg] || 0) + 1;
          }
        }
      }
    });

    // Recent programs (last 5)
    const recentPrograms = programs.slice(0, 5);

    // All activities (was limited to 10, now includes all activities including partner activities)
    const recentActivities = activities;

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

    // Validate required fields
    if (!activityData.activity_name || !activityData.program_id) {
      return res.status(400).json({
        error: "activity_name and program_id are required",
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
    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != program.office_id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Parse budgets array if provided
    let budgetsArray = [];
    if (activityData.budgets) {
      try {
        budgetsArray =
          typeof activityData.budgets === "string"
            ? JSON.parse(activityData.budgets)
            : activityData.budgets;
      } catch (e) {
        console.error("Error parsing budgets:", e);
      }
    }

    // Parse SDG numbers array if provided
    let sdgNumbersArray = [];
    if (activityData.sdg_numbers) {
      sdgNumbersArray = Array.isArray(activityData.sdg_numbers)
        ? activityData.sdg_numbers
        : [activityData.sdg_numbers];
    }

    // Parse Strategic Goals array if provided
    let strategicGoalsArray = [];
    if (activityData.strategic_goals) {
      strategicGoalsArray = Array.isArray(activityData.strategic_goals)
        ? activityData.strategic_goals
        : [activityData.strategic_goals];
    }

    // Prepare activity data with proper types
    const newActivity = {
      program_id: activityData.program_id,
      activity_name: activityData.activity_name,
      start_date: activityData.start_date || null,
      end_date: activityData.end_date || null,
      participants_count: activityData.participants_count
        ? parseInt(activityData.participants_count)
        : 0,
      male_participants: activityData.male_participants
        ? parseInt(activityData.male_participants)
        : 0,
      female_participants: activityData.female_participants
        ? parseInt(activityData.female_participants)
        : 0,
      venue:
        activityData.venue ||
        JSON.stringify({
          street: "",
          barangay: "",
          city: "",
          province: "",
        }),
      description: activityData.description || null,
      objectives: activityData.objectives || null,
      classification: activityData.classification || null,
      implementing_partners: activityData.implementing_partners || null,
      partner_name: activityData.partner_name || null,
      partner_type: activityData.partner_type || null,
      partner_nature: activityData.partner_nature || null,
      // Store budget amounts and types as JSON arrays in existing columns
      budget_amount:
        budgetsArray.length > 0
          ? JSON.stringify(budgetsArray.map((b) => b.amount))
          : null,
      budget_type:
        budgetsArray.length > 0
          ? JSON.stringify(budgetsArray.map((b) => b.type))
          : null,
      // Store SDG numbers as JSON array in existing sdg_number column
      sdg_number:
        sdgNumbersArray.length > 0 ? JSON.stringify(sdgNumbersArray) : null,
      // Store AdZU Strategic Goals as JSON array
      strategic_goals:
        strategicGoalsArray.length > 0 ? JSON.stringify(strategicGoalsArray) : null,
      phase: activityData.phase || null,
      status: "pending", // Status is always pending on creation, controlled by Unit Director
      report_url: activityData.report_url || null, // URL link to report
      thumbnail_url: activityData.thumbnail_url || null, // Thumbnail image URL from storage
      notes: activityData.notes || null,
      created_by: userId,
    };

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

    // Create notification for unit director about new activity
    try {
      await supabase.from("notifications").insert({
        activity_id: createdActivity.id,
        office_id: program.office_id,
        type: "Report",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.status(201).json({
      message: "Activity created successfully",
      activity: createdActivity,
    });
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
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
      .select(
        `
        *,
        programs(
          id, 
          title, 
          office_id,
          offices(id, name, acronym)
        )
      `
      )
      .eq("id", activityId)
      .single();

    if (error) {
      console.error("Get activity query error:", error);
      throw error;
    }

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Check if user has access to this office
    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != activity.programs.office_id
    ) {
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
    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != existingActivity.programs.office_id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Parse budgets array if provided
    let budgetsArray = [];
    if (updateData.budgets) {
      try {
        budgetsArray =
          typeof updateData.budgets === "string"
            ? JSON.parse(updateData.budgets)
            : updateData.budgets;
      } catch (e) {
        console.error("Error parsing budgets:", e);
      }
    }

    // Parse SDG numbers array if provided
    let sdgNumbersArray = [];
    if (updateData.sdg_numbers) {
      sdgNumbersArray = Array.isArray(updateData.sdg_numbers)
        ? updateData.sdg_numbers
        : [updateData.sdg_numbers];
    }

    // Parse Strategic Goals array if provided
    let strategicGoalsArray = [];
    if (updateData.strategic_goals) {
      strategicGoalsArray = Array.isArray(updateData.strategic_goals)
        ? updateData.strategic_goals
        : [updateData.strategic_goals];
    }

    // Prepare update data - simplified sanitization
    const sanitizedData = {};

    // Simple mapping - just pass through the allowed fields
    if (updateData.activity_name !== undefined)
      sanitizedData.activity_name = updateData.activity_name;
    if (updateData.program_id !== undefined)
      sanitizedData.program_id = updateData.program_id;
    if (updateData.start_date !== undefined)
      sanitizedData.start_date = updateData.start_date;
    if (updateData.end_date !== undefined)
      sanitizedData.end_date = updateData.end_date;

    // Numeric fields
    if (updateData.participants_count !== undefined) {
      sanitizedData.participants_count = updateData.participants_count
        ? parseInt(updateData.participants_count)
        : null;
    }
    if (updateData.male_participants !== undefined) {
      sanitizedData.male_participants = updateData.male_participants
        ? parseInt(updateData.male_participants)
        : null;
    }
    if (updateData.female_participants !== undefined) {
      sanitizedData.female_participants = updateData.female_participants
        ? parseInt(updateData.female_participants)
        : null;
    }

    // Venue as JSON string
    if (updateData.venue !== undefined) {
      sanitizedData.venue =
        typeof updateData.venue === "string"
          ? updateData.venue
          : JSON.stringify(updateData.venue);
    }

    // Text fields - THE KEY FIX: Just pass them through as-is
    if (updateData.description !== undefined)
      sanitizedData.description = updateData.description;
    if (updateData.objectives !== undefined)
      sanitizedData.objectives = updateData.objectives;
    if (updateData.classification !== undefined)
      sanitizedData.classification = updateData.classification;
    if (updateData.phase !== undefined) sanitizedData.phase = updateData.phase;
    if (updateData.notes !== undefined) sanitizedData.notes = updateData.notes;

    // Partners
    if (updateData.partner_name !== undefined)
      sanitizedData.partner_name = updateData.partner_name;
    if (updateData.partner_type !== undefined)
      sanitizedData.partner_type = updateData.partner_type;
    if (updateData.partner_nature !== undefined)
      sanitizedData.partner_nature = updateData.partner_nature;

    // Budget amounts and types as JSON arrays
    if (updateData.budgets !== undefined && budgetsArray.length > 0) {
      sanitizedData.budget_amount = JSON.stringify(
        budgetsArray.map((b) => b.amount)
      );
      sanitizedData.budget_type = JSON.stringify(
        budgetsArray.map((b) => b.type)
      );
    } else {
      // Handle direct budget_amount and budget_type updates
      if (updateData.budget_amount !== undefined) {
        sanitizedData.budget_amount = updateData.budget_amount;
      }
      if (updateData.budget_type !== undefined) {
        sanitizedData.budget_type = updateData.budget_type;
      }
    }

    // SDG numbers array stored in sdg_number column
    if (updateData.sdg_numbers !== undefined && sdgNumbersArray.length > 0) {
      sanitizedData.sdg_number = JSON.stringify(sdgNumbersArray);
    } else if (updateData.sdg_number !== undefined) {
      // Handle direct sdg_number updates
      sanitizedData.sdg_number = updateData.sdg_number;
    }

    // Strategic Goals array stored in strategic_goals column
    if (updateData.strategic_goals !== undefined && strategicGoalsArray.length > 0) {
      sanitizedData.strategic_goals = JSON.stringify(strategicGoalsArray);
    } else if (updateData.strategic_goals !== undefined) {
      // Handle empty array or explicit clear
      sanitizedData.strategic_goals = JSON.stringify(strategicGoalsArray);
    }

    // Other fields
    if (updateData.report_url !== undefined)
      sanitizedData.report_url = updateData.report_url;
    if (updateData.thumbnail_url !== undefined)
      sanitizedData.thumbnail_url = updateData.thumbnail_url;
    if (updateData.implementing_partners !== undefined)
      sanitizedData.implementing_partners = updateData.implementing_partners;

    // Update the activity
    const updatePayload = {
      ...sanitizedData,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedActivity, error: updateError } = await supabase
      .from("activities")
      .update(updatePayload)
      .eq("id", activityId)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    // Create notification for unit director about activity update
    try {
      await supabase.from("notifications").insert({
        activity_id: updatedActivity.id,
        office_id: existingActivity.programs.office_id,
        type: "Updated",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
      // Don't fail the request if notification fails
    }

    res.json({
      message: "Activity updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// ============ OFFICE-SPECIFIC ROUTES ============

// ============ PROGRAM REQUEST ROUTES ============

// Get program requests for an office
router.get("/program-requests", authenticateToken, requireRole(["office_user"]), async (req, res) => {
  try {
    const officeId = req.user.office_id;

    const { data: requests, error } = await supabase
      .from("program_requests")
      .select("id, office_id, title, description, status, created_at, updated_at")
      .eq("office_id", officeId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ requests });
  } catch (error) {
    console.error("Get program requests error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Submit a program request
router.post("/program-requests", authenticateToken, requireRole(["office_user"]), async (req, res) => {
  try {
    const { title, description } = req.body;
    const officeId = req.user.office_id;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Program title is required" });
    }

    const { data: request, error } = await supabase
      .from("program_requests")
      .insert({
        office_id: officeId,
        title: title.trim(),
        description: description?.trim() || null,
        status: "pending",
        request_type: "create", // Set request type for new program requests
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Program request submitted successfully",
      request,
    });
  } catch (error) {
    console.error("Submit program request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a program request (office can delete their own pending requests)
router.delete("/program-requests/:requestId", authenticateToken, requireRole(["office_user"]), async (req, res) => {
  try {
    const { requestId } = req.params;
    const officeId = req.user.office_id;

    // Check if request exists and belongs to this office
    const { data: request, error: fetchError } = await supabase
      .from("program_requests")
      .select("id, office_id, status")
      .eq("id", requestId)
      .single();

    if (fetchError || !request) {
      return res.status(404).json({ error: "Program request not found" });
    }

    if (request.office_id !== officeId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { error: deleteError } = await supabase
      .from("program_requests")
      .delete()
      .eq("id", requestId);

    if (deleteError) throw deleteError;

    res.json({ message: "Program request deleted successfully" });
  } catch (error) {
    console.error("Delete program request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ PROGRAM CHANGE REQUEST ROUTES (Edit/Delete approval system) ============
// Uses the unified program_requests table with request_type column

// Get program change requests for an office (update/delete only)
router.get("/program-change-requests", authenticateToken, requireRole(["office_user"]), async (req, res) => {
  try {
    const officeId = req.user.office_id;

    const { data: requests, error } = await supabase
      .from("program_requests")
      .select(`
        id,
        program_id,
        office_id,
        request_type,
        title,
        description,
        new_title,
        new_description,
        status,
        reason,
        created_at,
        updated_at,
        programs(id, title, description)
      `)
      .eq("office_id", officeId)
      .in("request_type", ["update", "delete"])
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ changeRequests: requests });
  } catch (error) {
    console.error("Get program change requests error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Submit a program update request
router.post("/program-change-requests/update", authenticateToken, requireRole(["office_user"]), async (req, res) => {
  try {
    const { program_id, new_title, new_description, reason } = req.body;
    const officeId = req.user.office_id;

    if (!program_id) {
      return res.status(400).json({ error: "Program ID is required" });
    }

    // Verify the program belongs to this office
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("id, office_id, title, description")
      .eq("id", program_id)
      .single();

    if (programError || !program) {
      return res.status(404).json({ error: "Program not found" });
    }

    if (program.office_id !== officeId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if there's already a pending request for this program
    const { data: existingRequest } = await supabase
      .from("program_requests")
      .select("id")
      .eq("program_id", program_id)
      .eq("status", "pending")
      .in("request_type", ["update", "delete"])
      .single();

    if (existingRequest) {
      return res.status(400).json({ 
        error: "There is already a pending change request for this program" 
      });
    }

    const { data: request, error } = await supabase
      .from("program_requests")
      .insert({
        program_id,
        office_id: officeId,
        request_type: "update",
        title: program.title, // Keep original title
        description: program.description, // Keep original description
        new_title,
        new_description,
        reason,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Program update request submitted successfully",
      request,
    });
  } catch (error) {
    console.error("Submit program update request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Submit a program delete request
router.post("/program-change-requests/delete", authenticateToken, requireRole(["office_user"]), async (req, res) => {
  try {
    const { program_id, reason } = req.body;
    const officeId = req.user.office_id;

    if (!program_id) {
      return res.status(400).json({ error: "Program ID is required" });
    }

    // Verify the program belongs to this office
    const { data: program, error: programError } = await supabase
      .from("programs")
      .select("id, office_id, title, description")
      .eq("id", program_id)
      .single();

    if (programError || !program) {
      return res.status(404).json({ error: "Program not found" });
    }

    if (program.office_id !== officeId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Check if there's already a pending request for this program
    const { data: existingRequest } = await supabase
      .from("program_requests")
      .select("id")
      .eq("program_id", program_id)
      .eq("status", "pending")
      .in("request_type", ["update", "delete"])
      .single();

    if (existingRequest) {
      return res.status(400).json({ 
        error: "There is already a pending change request for this program" 
      });
    }

    const { data: request, error } = await supabase
      .from("program_requests")
      .insert({
        program_id,
        office_id: officeId,
        request_type: "delete",
        title: program.title, // Store program title for reference
        description: program.description,
        reason,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Program delete request submitted successfully",
      request,
    });
  } catch (error) {
    console.error("Submit program delete request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Cancel/delete a program change request (office can delete their own pending requests)
router.delete("/program-change-requests/:requestId", authenticateToken, requireRole(["office_user"]), async (req, res) => {
  try {
    const { requestId } = req.params;
    const officeId = req.user.office_id;

    // Check if request exists and belongs to this office
    const { data: request, error: fetchError } = await supabase
      .from("program_requests")
      .select("id, office_id, status, request_type")
      .eq("id", requestId)
      .single();

    if (fetchError || !request) {
      return res.status(404).json({ error: "Change request not found" });
    }

    if (request.office_id !== officeId) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ 
        error: "Can only cancel pending requests" 
      });
    }

    const { error: deleteError } = await supabase
      .from("program_requests")
      .delete()
      .eq("id", requestId);

    if (deleteError) throw deleteError;

    res.json({ message: "Change request cancelled successfully" });
  } catch (error) {
    console.error("Cancel change request error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get office activities for calendar
router.get("/:officeId/activities", authenticateToken, async (req, res) => {
  try {
    const { officeId } = req.params;

    // Check if user has access to this office
    if (
      req.user.userType !== "unit_director" &&
      req.user.office_id != officeId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get all programs for this office
    const { data: programs, error: programsError } = await supabase
      .from("programs")
      .select("id")
      .eq("office_id", officeId);

    if (programsError) throw programsError;

    const programIds = programs.map((p) => p.id);
    let activities = [];

    if (programIds.length > 0) {
      const { data: activitiesData, error: activitiesError } = await supabase
        .from("activities")
        .select(
          `
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
        `
        )
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
