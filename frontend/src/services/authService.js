import { supabase } from "../lib/supabase";

export const authService = {
  // Office login method - uses Supabase Auth or database lookup
  loginOffice: async (officeId, email, password) => {
    try {
      console.log("Attempting office login:", { officeId, email }); // Debug log

      if (!officeId || !email || !password) {
        throw new Error("All fields are required");
      }

      // First test if we can connect to Supabase at all
      const { data: testOffices, error: testError } = await supabase
        .from("offices")
        .select("id, name")
        .limit(1);

      if (testError) {
        console.error("Supabase connection test failed:", testError);
        throw new Error(
          "Database connection failed. Check your Supabase configuration."
        );
      }

      console.log("Supabase connection OK, found offices:", testOffices);

      // Query office_users table using simple integer office_id
      const { data: users, error } = await supabase
        .from("office_users")
        .select("id, email, office_id, created_at")
        .eq("office_id", officeId)
        .eq("email", email)
        .eq("password", password) // Direct password comparison in database
        .single();

      if (error) {
        console.error("Database error:", error);
        if (error.code === "PGRST116") {
          throw new Error("Invalid credentials");
        }
        throw new Error("Login failed. Please try again.");
      }

      if (!users) {
        throw new Error("Invalid credentials");
      }

      console.log("Office login successful:", users); // Debug log

      // Store user data in localStorage (never store passwords)
      const userData = {
        id: users.id,
        email: users.email,
        role: "office",
        office_id: users.office_id,
        created_at: users.created_at,
      };

      localStorage.setItem("authToken", "authenticated");
      localStorage.setItem("userType", "office");
      localStorage.setItem("userData", JSON.stringify(userData));

      return {
        token: "authenticated",
        userType: "office",
        user: userData,
      };
    } catch (error) {
      console.error("Office login error:", error);
      throw error;
    }
  },

  // Unit director login method
  loginUnitDirector: async (email, password) => {
    try {
      console.log("Attempting unit director login:", { email }); // Debug log

      if (!email || !password) {
        throw new Error("All fields are required");
      }

      // Query unit_directors table
      const { data: users, error } = await supabase
        .from("unit_directors")
        .select("*")
        .eq("email", email)
        .limit(1);

      console.log("Database query result:", { users, error }); // Debug log

      if (error) {
        console.error("Database error:", error);
        throw new Error("Database error occurred");
      }

      if (!users || users.length === 0) {
        throw new Error("Invalid credentials - user not found");
      }

      const user = users[0];
      console.log("Found unit director:", user.email); // Debug log

      // Simple password comparison since you have email/password in database
      const isValidPassword = password === user.password;
      console.log("Password validation result:", isValidPassword); // Debug log

      if (!isValidPassword) {
        throw new Error("Invalid credentials - wrong password");
      }

      // Create session data
      const sessionData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: "unit_director",
      };

      console.log("Creating session for:", sessionData); // Debug log

      // Store in localStorage with consistent keys
      localStorage.setItem("authToken", "authenticated");
      localStorage.setItem("userType", "unit_director");
      localStorage.setItem("userData", JSON.stringify(sessionData));

      return {
        token: "authenticated",
        userType: "unit_director",
        user: sessionData,
      };
    } catch (error) {
      console.error("Unit director login error:", error);
      throw error;
    }
  },

  // Generic login method (kept for backwards compatibility)
  login: async ({ email, password, role }) => {
    try {
      if (!email || !password || !role) {
        throw new Error("All fields are required");
      }

      // Determine which table to query based on role
      const tableName =
        role === "unit_director" ? "unit_directors" : "office_users";

      // Query the appropriate table
      const { data: users, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("email", email)
        .limit(1);

      if (error) {
        console.error("Database error:", error);
        throw new Error("Database error occurred");
      }

      if (!users || users.length === 0) {
        throw new Error("Invalid credentials");
      }

      const user = users[0];

      // Direct password comparison since credentials are stored in database
      const isValidPassword = password === user.password;

      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      // Create session data
      const sessionData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role,
        office_id: user.office_id || null,
      };

      // Store in localStorage for session management
      localStorage.setItem("auth_user", JSON.stringify(sessionData));
      localStorage.setItem("auth_token", "authenticated");

      return {
        message: "Login successful",
        user: sessionData,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: () => {
    // Clear both old and new localStorage keys for complete cleanup
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    return { message: "Logout successful" };
  },

  verifyToken: () => {
    try {
      // Check new format first, then fallback to old format
      let token = localStorage.getItem("authToken");
      let userStr = localStorage.getItem("userData");

      if (!token || !userStr) {
        // Try old format
        token = localStorage.getItem("auth_token");
        userStr = localStorage.getItem("auth_user");
      }

      if (!token || !userStr) {
        return { user: null, error: "No authentication found" };
      }

      const user = JSON.parse(userStr);
      return { user, error: null };
    } catch (error) {
      console.error("Auth verification error:", error);
      // Clear all possible localStorage keys
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("userData");
      return { user: null, error: "Invalid authentication data" };
    }
  },

  getCurrentUser: () => {
    try {
      // Check new format first, then fallback to old format
      let userStr = localStorage.getItem("userData");
      if (!userStr) {
        userStr = localStorage.getItem("auth_user");
      }
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  isAuthenticated: () => {
    // Check both new and old formats
    const newFormat =
      !!localStorage.getItem("authToken") && !!localStorage.getItem("userData");
    const oldFormat =
      !!localStorage.getItem("auth_token") &&
      !!localStorage.getItem("auth_user");
    return newFormat || oldFormat;
  },

  // Get all offices for selection
  getOffices: async () => {
    try {
      const { data, error } = await supabase
        .from("offices")
        .select("*")
        .order("name");

      if (error) throw error;

      // If no offices in database, return hardcoded list for development
      if (!data || data.length === 0) {
        return [
          {
            id: "sdo",
            name: "Social Development Office",
            description: "Community development and social welfare programs",
          },
          {
            id: "cces",
            name: "Center for Community Extension Services (CCES)",
            description: "Community outreach and extension programs",
          },
          {
            id: "api",
            name: "Ateneo Peace Institute (API)",
            description: "Peace building and conflict resolution initiatives",
          },
          {
            id: "sacsi",
            name: "Social Awareness and Community Service Involvement (SACSI)",
            description:
              "Student community service and social awareness programs",
          },
          {
            id: "aclg",
            name: "Ateneo Center for Leadership and Governance (ACLG)",
            description: "Leadership development and governance training",
          },
          {
            id: "acca",
            name: "Ateneo Center for Culture and the Arts (ACCA)",
            description: "Cultural and arts programs for community development",
          },
        ];
      }

      return data;
    } catch (error) {
      console.error("Get offices error:", error);
      throw new Error("Failed to fetch offices");
    }
  },
};

export const officeService = {
  getAllOffices: async () => {
    try {
      const { data: offices, error } = await supabase
        .from("offices")
        .select("id, name, description")
        .order("name");

      if (error) throw error;

      return { offices };
    } catch (error) {
      console.error("Get offices error:", error);
      throw new Error("Server error");
    }
  },

  getOfficeDashboard: async (officeId) => {
    try {
      const user = authService.getCurrentUser();

      // Check if user has access to this office
      if (user.role !== "unit_director" && user.office_id !== officeId) {
        throw new Error("Access denied to this office");
      }

      const { data: programs, error } = await supabase
        .from("programs")
        .select("*")
        .eq("office_id", officeId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { programs };
    } catch (error) {
      console.error("Office dashboard error:", error);
      throw error;
    }
  },
};

export const unitDirectorService = {
  getDashboard: async () => {
    try {
      // Get all programs across all offices
      const { data: programs, error } = await supabase
        .from("programs")
        .select(
          `
          *,
          offices(name),
          office_users(name)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { programs };
    } catch (error) {
      console.error("Unit director dashboard error:", error);
      throw error;
    }
  },

  getReports: async (month, year) => {
    try {
      let query = supabase.from("programs").select(`
          *,
          offices(name),
          office_users(name)
        `);

      // Add date filters if provided
      if (month && year) {
        const startDate = `${year}-${month.padStart(2, "0")}-01`;
        const endDate = `${year}-${month.padStart(2, "0")}-31`;
        query = query.gte("created_at", startDate).lte("created_at", endDate);
      } else if (year) {
        query = query
          .gte("created_at", `${year}-01-01`)
          .lte("created_at", `${year}-12-31`);
      }

      const { data: programs, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      return { programs };
    } catch (error) {
      console.error("Unit director reports error:", error);
      throw error;
    }
  },
};

export const programService = {
  create: async (programData) => {
    try {
      const user = authService.getCurrentUser();

      // Check if user has access to this office
      if (
        user.role !== "unit_director" &&
        user.office_id !== programData.office_id
      ) {
        throw new Error("Access denied to this office");
      }

      const { data: program, error } = await supabase
        .from("programs")
        .insert({
          ...programData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return { program };
    } catch (error) {
      console.error("Create program error:", error);
      throw error;
    }
  },

  update: async (id, programData) => {
    try {
      const user = authService.getCurrentUser();

      // Check if program exists and user has access
      const { data: programs, error: checkError } = await supabase
        .from("programs")
        .select("office_id")
        .eq("id", id)
        .limit(1);

      if (checkError) throw checkError;

      if (!programs || programs.length === 0) {
        throw new Error("Program not found");
      }

      const programOfficeId = programs[0].office_id;

      if (user.role !== "unit_director" && user.office_id !== programOfficeId) {
        throw new Error("Access denied");
      }

      const { data: program, error } = await supabase
        .from("programs")
        .update(programData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { program };
    } catch (error) {
      console.error("Update program error:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const user = authService.getCurrentUser();

      // Check if program exists and user has access
      const { data: programs, error: checkError } = await supabase
        .from("programs")
        .select("office_id")
        .eq("id", id)
        .limit(1);

      if (checkError) throw checkError;

      if (!programs || programs.length === 0) {
        throw new Error("Program not found");
      }

      const programOfficeId = programs[0].office_id;

      if (user.role !== "unit_director" && user.office_id !== programOfficeId) {
        throw new Error("Access denied");
      }

      const { error } = await supabase.from("programs").delete().eq("id", id);

      if (error) throw error;

      return { message: "Program deleted successfully" };
    } catch (error) {
      console.error("Delete program error:", error);
      throw error;
    }
  },
};
