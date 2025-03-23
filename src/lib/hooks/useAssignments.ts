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

interface EditAssignmentData {
  title: string;
  description: string;
  dueDate: string;
}

interface EditAssignmentResponse {
  message: string;
  assignment: Assignment;
}

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      try {
        console.log('Fetching assignments...');
        console.log('Current token:', localStorage.getItem('token'));
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

export function useEditAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EditAssignmentData }) => {
      try {
        // Format the date to match the API's expected format (MM/DD/YYYY)
        const formattedData = {
          ...data,
          dueDate: new Date(data.dueDate).toLocaleDateString('en-US')
        };
        
        console.log('Sending edit data:', {
          url: `/Teacher/assignments/${id}`,
          data: formattedData,
          token: localStorage.getItem('token')
        });

        const response = await api.put<EditAssignmentResponse>(`/Teacher/assignments/${id}`, formattedData);
        console.log('Edit response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Edit assignment error:', error);
        if (error.response?.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
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

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        console.log('Deleting assignment:', id);
        const response = await api.delete(`/Teacher/assignments/${id}`);
        console.log('Delete response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('Delete assignment error:', error);
        if (error.response?.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
} 