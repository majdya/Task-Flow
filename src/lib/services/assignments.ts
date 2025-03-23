import api from '../api';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdDate: string;
  createdBy: string;
  status?: 'pending' | 'submitted' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  content: string;
  submittedAt: string;
}

export interface CreateSubmissionDto {
  content: string;
}

export interface PaginatedResponse<T> {
  assignments: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const assignmentsService = {
  // Get all assignments for the current student
  getStudentAssignments: async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Assignment>>('/Student/assignments');
      console.log('Assignments response:', data);
      return data.assignments || [];
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  // Get a specific assignment by ID
  getAssignment: async (id: string) => {
    try {
      const { data } = await api.get<Assignment>(`/Student/assignments/${id}`);
      return {
        ...data,
        status: data.status || 'pending' // Default status if not provided
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  },

  // Get submission for a specific assignment
  getSubmission: async (assignmentId: string) => {
    try {
      const { data } = await api.get<Submission>(`/Student/assignments/${assignmentId}/submission`);
      return data;
    } catch (error) {
      console.error(`Error fetching submission for assignment ${assignmentId}:`, error);
      throw error;
    }
  },

  // Submit an assignment
  submitAssignment: async (assignmentId: string, submission: CreateSubmissionDto) => {
    try {
      const { data } = await api.post<Submission>(`/Student/assignments/${assignmentId}/submit`, submission);
      return data;
    } catch (error) {
      console.error(`Error submitting assignment ${assignmentId}:`, error);
      throw error;
    }
  },
}; 