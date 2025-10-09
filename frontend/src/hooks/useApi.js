/**
 * React Query Hooks
 * Uses services for data fetching
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OfficeService from "../services/officeService.js";
import ProgramService from "../services/programService.js";
import UnitDirectorService from "../services/unitDirectorService.js";

// Query keys for consistent caching
export const QUERY_KEYS = {
  offices: ["offices"],
  officePrograms: (officeId) => ["office", officeId, "programs"],
  officeDashboard: (officeId) => ["office", officeId, "dashboard"],
  allPrograms: (filters) => ["programs", filters],
  myPrograms: ["my-programs"],
  programActivities: (programId) => ["program", programId, "activities"],
  unitDirectorDashboard: ["unit-director", "dashboard"],
  unitDirectorReports: (filters) => ["unit-director", "reports", filters],
};

// ============= OFFICE HOOKS =============

export const useOffices = () => {
  return useQuery({
    queryKey: QUERY_KEYS.offices,
    queryFn: () => OfficeService.getAllOffices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOfficePrograms = (officeId) => {
  return useQuery({
    queryKey: QUERY_KEYS.officePrograms(officeId),
    queryFn: () => OfficeService.getOfficePrograms(officeId),
    enabled: !!officeId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useOfficeDashboard = (officeId) => {
  return useQuery({
    queryKey: QUERY_KEYS.officeDashboard(officeId),
    queryFn: () => OfficeService.getOfficeDashboard(officeId),
    enabled: !!officeId,
    staleTime: 1 * 60 * 1000,
  });
};

// ============= PROGRAM HOOKS =============

export const useAllPrograms = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.allPrograms(filters),
    queryFn: () => ProgramService.getAllPrograms(filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programData) => ProgramService.createProgram(programData),
    onSuccess: (newProgram) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.offices });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.officePrograms(newProgram.office_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.unitDirectorDashboard 
      });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updateData }) => 
      ProgramService.updateProgram(id, updateData),
    onSuccess: (updatedProgram) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.officePrograms(updatedProgram.office_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.unitDirectorDashboard 
      });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => ProgramService.deleteProgram(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.unitDirectorDashboard 
      });
    },
  });
};

// ============= PROGRAM ACTIVITY HOOKS =============

export const useMyPrograms = () => {
  return useQuery({
    queryKey: QUERY_KEYS.myPrograms,
    queryFn: () => ProgramService.getMyPrograms(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useProgramActivities = (programId) => {
  return useQuery({
    queryKey: QUERY_KEYS.programActivities(programId),
    queryFn: () => ProgramService.getProgramActivities(programId),
    enabled: !!programId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, activityData }) => 
      ProgramService.createActivity(programId, activityData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.programActivities(variables.programId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.myPrograms 
      });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, activityId, activityData }) => 
      ProgramService.updateActivity(programId, activityId, activityData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.programActivities(variables.programId) 
      });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, activityId }) => 
      ProgramService.deleteActivity(programId, activityId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.programActivities(variables.programId) 
      });
    },
  });
};

// ============= UNIT DIRECTOR HOOKS =============

export const useUnitDirectorDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.unitDirectorDashboard,
    queryFn: () => UnitDirectorService.getDashboard(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useUnitDirectorReports = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.unitDirectorReports(filters),
    queryFn: () => UnitDirectorService.getReports(filters),
    staleTime: 5 * 60 * 1000,
  });
};
