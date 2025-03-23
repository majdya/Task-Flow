import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { Assignment, Submission, PaginatedResponse } from '@/types';

interface CreateAssignmentData {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdBy: string;
}

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      try {
        console.log('Fetching assignments...');
        const response = await api.get<PaginatedResponse<Assignment>>('/Teacher/my-assignments');
        console.log('Raw API Response:', response);
        
        // Return just the assignments array from the paginated response
        return response.data.assignments;
      } catch (error) {
        console.error('Error fetching assignments:', error);
        throw error;
      }
    },
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assignment: CreateAssignmentData) => {
      const { data } = await api.post<Assignment>('/Teacher/create-assignment', assignment);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

export function useSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ['submissions', assignmentId],
    queryFn: async () => {
      const { data } = await api.get<Submission[]>(`/assignments/${assignmentId}/submissions`);
      return data;
    },
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assignmentId, content }: { assignmentId: string; content: string }) => {
      const { data } = await api.post<Submission>(`/assignments/${assignmentId}/submissions`, {
        content,
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.assignmentId] });
    },
  });
} 