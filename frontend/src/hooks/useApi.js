import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

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
      const { data, error } = await supabase
        .from("offices")
        .select("id, name, description")
        .order("name");

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
  });
};

export const useOfficePrograms = (officeId) => {
  return useQuery({
    queryKey: QUERY_KEYS.officePrograms(officeId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("office_id", officeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!officeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ============= PROGRAM HOOKS =============

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (programData) => {
      const { data, error } = await supabase
        .from("programs")
        .insert(programData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch office programs
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.officePrograms(variables.office_id),
      });
      // Invalidate all programs query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.allPrograms,
      });
      // Invalidate unit director dashboard
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.unitDirectorDashboard,
      });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...programData }) => {
      const { data, error } = await supabase
        .from("programs")
        .update(programData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Update specific program in all relevant caches
      queryClient.setQueryData(
        QUERY_KEYS.officePrograms(data.office_id),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((program) =>
            program.id === data.id ? data : program
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
      const { error } = await supabase.from("programs").delete().eq("id", id);

      if (error) throw error;
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
      // Get all offices with their program counts
      const { data: offices, error: officesError } = await supabase.from(
        "offices"
      ).select(`
          id,
          name,
          description,
          programs(count)
        `);

      if (officesError) throw officesError;

      // Transform the data to match expected format
      const officesWithCounts = offices.map((office) => ({
        ...office,
        program_count: office.programs?.[0]?.count || 0,
      }));

      // Get total program statistics
      const { data: programs, error: statsError } = await supabase
        .from("programs")
        .select("status");

      if (statsError) throw statsError;

      const statistics = {
        total_programs: programs.length,
        ongoing_programs: programs.filter((p) => p.status === "ongoing").length,
        completed_programs: programs.filter((p) => p.status === "completed")
          .length,
        upcoming_programs: programs.filter((p) => p.status === "upcoming")
          .length,
      };

      return {
        offices: officesWithCounts,
        statistics,
      };
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useUnitDirectorReports = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.unitDirectorReports(filters),
    queryFn: async () => {
      let query = supabase
        .from("programs")
        .select(
          `
          *,
          offices(name)
        `
        )
        .order("created_at", { ascending: false });

      if (filters.month && filters.year) {
        const startDate = new Date(
          filters.year,
          filters.month - 1,
          1
        ).toISOString();
        const endDate = new Date(
          filters.year,
          filters.month,
          0,
          23,
          59,
          59
        ).toISOString();
        query = query.gte("created_at", startDate).lte("created_at", endDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((program) => ({
        ...program,
        office_name: program.offices?.name,
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============= REAL-TIME SUBSCRIPTIONS =============

export const useRealtimePrograms = (officeId) => {
  const queryClient = useQueryClient();

  // Set up real-time subscription for programs
  useQuery({
    queryKey: ["realtime", "programs", officeId],
    queryFn: () => null, // This doesn't fetch data, just sets up subscription
    enabled: !!officeId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onMount: () => {
      const subscription = supabase
        .channel(`programs:${officeId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "programs",
            filter: `office_id=eq.${officeId}`,
          },
          (payload) => {
            console.log("Real-time update:", payload);

            // Invalidate relevant queries on any change
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.officePrograms(officeId),
            });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.unitDirectorDashboard,
            });
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    },
  });
};

// ============= OFFICE DASHBOARD HOOK =============

export const useOfficeDashboard = (officeId) => {
  return useQuery({
    queryKey: QUERY_KEYS.officeDashboard(officeId),
    queryFn: async () => {
      // Get office information with program counts
      const { data: office, error: officeError } = await supabase
        .from("offices")
        .select(
          `
          id,
          name,
          description,
          programs(id, name, status, start_date, end_date, objective)
        `
        )
        .eq("id", officeId)
        .single();

      if (officeError) throw officeError;

      // Calculate statistics from programs
      const programs = office.programs || [];
      const statistics = {
        total_programs: programs.length,
        ongoing_programs: programs.filter((p) => p.status === "ongoing").length,
        completed_programs: programs.filter((p) => p.status === "completed")
          .length,
        upcoming_programs: programs.filter((p) => p.status === "upcoming")
          .length,
      };

      return {
        office: {
          id: office.id,
          name: office.name,
          description: office.description,
        },
        programs,
        statistics,
      };
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: !!officeId,
  });
};

// ============= DATA PREFETCHING UTILITIES =============

export const prefetchOfficeData = async (queryClient, officeId) => {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.officePrograms(officeId),
    queryFn: async () => {
      const { data: programs, error } = await supabase
        .from("programs")
        .select("*")
        .eq("office_id", officeId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return programs;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const prefetchOffices = async (queryClient) => {
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.offices,
    queryFn: async () => {
      const { data: offices, error } = await supabase
        .from("offices")
        .select("id, name, description")
        .order("name");

      if (error) throw error;
      return offices;
    },
    staleTime: 5 * 60 * 1000,
  });
};
