import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// API base URL - will use your Render backend
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Helper function for authenticated API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Network error" }));
    throw new Error(error.error || error.message || "API call failed");
  }

  return response.json();
};

// Query keys for consistent caching
export const QUERY_KEYS = {
  offices: ["offices"],
  officePrograms: (officeId) => ["office", officeId, "programs"],
  officeDashboard: (officeId) => ["office", officeId, "dashboard"],
  allPrograms: ["programs"],
  userProfile: ["user", "profile"],
  unitDirectorDashboard: ["unit-director", "dashboard"],
  unitDirectorReports: (filters) => ["unit-director", "reports", filters],
};

// ============= OFFICE HOOKS =============

export const useOffices = () => {
  return useQuery({
    queryKey: QUERY_KEYS.offices,
    queryFn: async () => {
      const data = await apiCall("/office/all");
      return data.offices;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useOfficePrograms = (officeId) => {
  return useQuery({
    queryKey: QUERY_KEYS.officePrograms(officeId),
    queryFn: async () => {
      const data = await apiCall(`/office/${officeId}/programs`);
      return data.programs;
    },
    enabled: !!officeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOfficeDashboard = (officeId) => {
  return useQuery({
    queryKey: QUERY_KEYS.officeDashboard(officeId),
    queryFn: async () => {
      return await apiCall(`/office/${officeId}/dashboard`);
    },
    enabled: !!officeId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// ============= PROGRAM HOOKS =============

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programData) => {
      const data = await apiCall("/program", {
        method: "POST",
        body: JSON.stringify(programData),
      });
      return data.program;
    },
    onSuccess: (newProgram) => {
      // Update office programs cache
      queryClient.setQueryData(
        QUERY_KEYS.officePrograms(newProgram.office_id),
        (oldData) => {
          if (!oldData) return [newProgram];
          return [...oldData, newProgram];
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.allPrograms,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.unitDirectorDashboard,
      });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }) => {
      const data = await apiCall(`/program/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      return data.program;
    },
    onSuccess: (updatedProgram) => {
      // Update specific program in all relevant caches
      queryClient.setQueryData(
        QUERY_KEYS.officePrograms(updatedProgram.office_id),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((program) =>
            program.id === updatedProgram.id ? updatedProgram : program
          );
        }
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.allPrograms,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.unitDirectorDashboard,
      });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiCall(`/program/${id}`, {
        method: "DELETE",
      });
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from all program caches
      queryClient.setQueriesData(
        { queryKey: ["office"], type: "active" },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((program) => program.id !== deletedId);
        }
      );

      // Invalidate all programs and dashboard
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.allPrograms,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.unitDirectorDashboard,
      });
    },
  });
};

// ============= UNIT DIRECTOR HOOKS =============

export const useUnitDirectorDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.unitDirectorDashboard,
    queryFn: async () => {
      return await apiCall("/unit-director/dashboard");
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUnitDirectorReports = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.unitDirectorReports(filters),
    queryFn: async () => {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `/unit-director/reports?${queryParams}`
        : "/unit-director/reports";
      return await apiCall(endpoint);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============= PROGRAM SUBSCRIPTIONS =============

export const useOfficePrograms_WithSubscription = (officeId) => {
  return useQuery({
    queryKey: QUERY_KEYS.officePrograms(officeId),
    queryFn: async () => {
      const data = await apiCall(`/office/${officeId}/programs`);
      return data.programs;
    },
    enabled: !!officeId,
    staleTime: 1 * 60 * 1000, // 1 minute

    // Note: Real-time subscriptions would need WebSocket implementation
    // For now, we'll use polling for real-time updates
    refetchInterval: 30000, // Poll every 30 seconds
  });
};

// ============= GENERAL QUERIES =============

export const useAllOfficesWithPrograms = () => {
  return useQuery({
    queryKey: ["all-offices-with-programs"],
    queryFn: async () => {
      return await apiCall("/office/all-with-programs");
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllPrograms = (filters = {}) => {
  return useQuery({
    queryKey: ["all-programs", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams
        ? `/program/all?${queryParams}`
        : "/program/all";
      const data = await apiCall(endpoint);
      return data.programs;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useOfficesForAdmin = () => {
  return useQuery({
    queryKey: ["offices-admin"],
    queryFn: async () => {
      const data = await apiCall("/office/all");
      return data.offices;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
