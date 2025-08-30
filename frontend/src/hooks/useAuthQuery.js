import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";

// Auth query keys
export const authKeys = {
  all: ["auth"],
  user: () => [...authKeys.all, "user"],
  session: () => [...authKeys.all, "session"],
};

// Hook to get current user session
export const useAuthSession = () => {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => {
      try {
        const result = authService.verifyToken();
        if (result.error || !result.user) {
          return null;
        }

        const userType =
          localStorage.getItem("userType") ||
          (result.user.role === "unit_director" ? "unit_director" : "office");
        const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("auth_token");

        return {
          token,
          userType,
          user: result.user,
        };
      } catch (error) {
        console.error("Session verification failed:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime is now gcTime)
    retry: false, // Don't retry failed auth checks
  });
};

// Hook for office login mutation
export const useOfficeLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ office, email, password }) => {
      return await authService.loginOffice(office, email, password);
    },
    onSuccess: (data) => {
      // Store in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userData", JSON.stringify(data.user));

      // Update React Query cache
      queryClient.setQueryData(authKeys.session(), data);
    },
    onError: (error) => {
      console.error("Office login failed:", error);
    },
  });
};

// Hook for unit director login mutation
export const useUnitDirectorLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      return await authService.loginUnitDirector(email, password);
    },
    onSuccess: (data) => {
      // Store in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userData", JSON.stringify(data.user));

      // Update React Query cache
      queryClient.setQueryData(authKeys.session(), data);
    },
    onError: (error) => {
      console.error("Unit director login failed:", error);
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userType");
      localStorage.removeItem("userData");

      // Clear React Query cache
      queryClient.clear();

      // Redirect to welcome page
      window.location.href = "/";
    },
  });
};

// Hook to get offices for selection
export const useOffices = () => {
  return useQuery({
    queryKey: ["offices"],
    queryFn: async () => {
      return await authService.getOffices();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - offices don't change often
    gcTime: 60 * 60 * 1000, // 1 hour (cacheTime is now gcTime in v5)
  });
};
