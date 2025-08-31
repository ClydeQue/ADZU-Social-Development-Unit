import { supabase } from "../lib/supabase.js";
import bcryptjs from "bcryptjs";

/**
 * 🔒 SIMPLE SECURE AUTHENTICATION
 * - Direct Supabase database access
 * - Proper bcrypt password verification
 * - Secure session management
 * - No complex React Query nonsense
 */

const SecureAuth = {
  // 🏢 Office User Login
  async loginOffice(email, password) {
    try {
      console.log("🔐 Secure Office Login:", email);

      // Get user from office_users table
      const { data: users, error } = await supabase
        .from("office_users")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .limit(1);

      if (error) throw new Error("Database error");
      if (!users || users.length === 0) throw new Error("Invalid credentials");

      const user = users[0];

      // Verify password with bcrypt
      const isValid = await bcryptjs.compare(password, user.password);
      if (!isValid) throw new Error("Invalid credentials");

      // Create secure session
      const session = {
        token: `office_${user.id}_${Date.now()}_${Math.random().toString(36)}`,
        userType: "office_user",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          office_id: user.office_id,
        },
      };

      // Store in localStorage (browser session only)
      localStorage.setItem("auth_token", session.token);
      localStorage.setItem("auth_user_type", session.userType);
      localStorage.setItem("auth_user_data", JSON.stringify(session.user));

      console.log("✅ Office login successful");
      return session;
    } catch (error) {
      console.error("❌ Office login failed:", error.message);
      throw error;
    }
  },

  // 👔 Unit Director Login
  async loginUnitDirector(email, password) {
    try {
      console.log("🔐 Secure Unit Director Login:", email);

      // Get director from unit_directors table
      const { data: directors, error } = await supabase
        .from("unit_directors")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .limit(1);

      if (error) throw new Error("Database error");
      if (!directors || directors.length === 0)
        throw new Error("Invalid credentials");

      const director = directors[0];

      // Verify password with bcrypt
      const isValid = await bcryptjs.compare(password, director.password);
      if (!isValid) throw new Error("Invalid credentials");

      // Create secure session
      const session = {
        token: `director_${director.id}_${Date.now()}_${Math.random().toString(
          36
        )}`,
        userType: "unit_director",
        user: {
          id: director.id,
          email: director.email,
          name: director.name,
          role: "unit_director",
        },
      };

      // Store in localStorage (browser session only)
      localStorage.setItem("auth_token", session.token);
      localStorage.setItem("auth_user_type", session.userType);
      localStorage.setItem("auth_user_data", JSON.stringify(session.user));

      console.log("✅ Unit Director login successful");
      return session;
    } catch (error) {
      console.error("❌ Unit Director login failed:", error.message);
      throw error;
    }
  },

  // 🔍 Get Current Session
  getSession() {
    try {
      const token = localStorage.getItem("auth_token");
      const userType = localStorage.getItem("auth_user_type");
      const userData = localStorage.getItem("auth_user_data");

      if (!token || !userType || !userData) {
        return null;
      }

      return {
        token,
        userType,
        user: JSON.parse(userData),
        isAuthenticated: true,
      };
    } catch (error) {
      console.error("❌ Session error:", error);
      return null;
    }
  },

  // 🚪 Logout
  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user_type");
    localStorage.removeItem("auth_user_data");
    console.log("✅ Logged out successfully");
  },

  // 🛡️ Check if user is authenticated
  isAuthenticated() {
    return this.getSession() !== null;
  },

  // 🏢 Get all offices
  async getOffices() {
    try {
      const { data: offices, error } = await supabase
        .from("offices")
        .select("id, name, description")
        .order("name");

      if (error) throw new Error("Failed to fetch offices");
      return offices;
    } catch (error) {
      console.error("❌ Failed to fetch offices:", error);
      throw error;
    }
  },

  // 👤 Create new user (office or unit director)
  async createUser({
    name,
    email,
    password,
    officeId,
    userType = "office_user",
  }) {
    try {
      console.log("🔐 Creating new user:", { email, userType });

      // Hash password
      const hashedPassword = await bcryptjs.hash(password, 12);

      let userData, error;

      if (userType === "office_user") {
        // Create office user
        ({ data: userData, error } = await supabase
          .from("office_users")
          .insert([
            {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password: hashedPassword,
              office_id: officeId,
            },
          ])
          .select()
          .single());
      } else if (userType === "unit_director") {
        // Create unit director
        ({ data: userData, error } = await supabase
          .from("unit_directors")
          .insert([
            {
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password: hashedPassword,
            },
          ])
          .select()
          .single());
      } else {
        throw new Error("Invalid user type");
      }

      if (error) throw new Error("Failed to create user");

      console.log("✅ User created successfully:", userData.email);
      return userData;
    } catch (error) {
      console.error("❌ User creation failed:", error);
      throw error;
    }
  },

  // 🔒 Change user password
  async changePassword({ currentPassword, newPassword, userType }) {
    try {
      const session = this.getSession();
      if (!session) throw new Error("Not authenticated");

      console.log("🔐 Changing password for user:", session.user.email);

      // First verify current password
      const tableName =
        userType === "unit_director" ? "unit_directors" : "office_users";

      const { data: users, error: fetchError } = await supabase
        .from(tableName)
        .select("password")
        .eq("id", session.user.id)
        .limit(1);

      if (fetchError || !users || users.length === 0) {
        throw new Error("User not found");
      }

      // Verify current password
      const isCurrentValid = await bcryptjs.compare(
        currentPassword,
        users[0].password
      );
      if (!isCurrentValid) throw new Error("Current password is incorrect");

      // Hash new password
      const hashedNewPassword = await bcryptjs.hash(newPassword, 12);

      // Update password
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ password: hashedNewPassword })
        .eq("id", session.user.id);

      if (updateError) throw new Error("Failed to update password");

      console.log("✅ Password changed successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Password change failed:", error);
      throw error;
    }
  },
};

export default SecureAuth;
