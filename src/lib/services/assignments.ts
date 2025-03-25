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
  hasSubmission?: boolean;
}

export interface CreateAssignmentDTO {
  title: string;
  description: string;
  dueDate: string;
}

export interface GradeSubmissionRequest {
  grade: string;
  comments: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: string;
  submissionDate: string;
  content: string;
  grade: string;
  gradedDate: string | null;
  gradedBy: string;
  comments: string;
  assignment: Assignment;
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

export interface PaginatedSubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const assignmentsService = {
  // Get all assignments for the current student
  getStudentAssignments: async () => {
    try {
      const [assignmentsResponse, submissionsResponse] = await Promise.all([
        api.get<PaginatedResponse<Assignment>>('/Student/assignments'),
        api.get<PaginatedSubmissionsResponse>('/Student/my-submissions')
      ]);

      const submissions = submissionsResponse.data.submissions;
      const submittedAssignmentIds = new Set(submissions.map(s => s.assignmentId));

      // Mark assignments that have submissions
      const assignmentsWithSubmissionStatus = assignmentsResponse.data.assignments.map(assignment => ({
        ...assignment,
        hasSubmission: submittedAssignmentIds.has(assignment.id),
        status: submittedAssignmentIds.has(assignment.id) ? 'submitted' : (assignment.status || 'pending')
      }));

      return assignmentsWithSubmissionStatus;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  // Get student's submissions
  getMySubmissions: async () => {
    try {
      const { data } = await api.get<PaginatedSubmissionsResponse>('/Student/my-submissions');
      return data.submissions;
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  },

  // Get a specific assignment by ID
  getAssignment: async (id: string) => {
    try {
      const [assignmentResponse, submissionsResponse] = await Promise.all([
        api.get<Assignment>(`/Student/assignments/${id}`),
        api.get<PaginatedSubmissionsResponse>('/Student/my-submissions')
      ]);

      const submission = submissionsResponse.data.submissions.find(
        s => s.assignmentId === Number(id)
      );

      return {
        ...assignmentResponse.data,
        status: submission ? 'submitted' : (assignmentResponse.data.status || 'pending'),
        hasSubmission: !!submission
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error);
      throw error;
    }
  },

  // Get submission for a specific assignment
  getSubmission: async (assignmentId: string) => {
    try {
      const { data } = await api.get<PaginatedSubmissionsResponse>('/Student/my-submissions');
      const submission = data.submissions.find(
        s => s.assignmentId === Number(assignmentId)
      );
      if (!submission) {
        throw new Error('Submission not found');
      }
      return submission;
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

  // Get all assignments for the teacher
  getTeacherAssignments: async () => {
    try {
      const { data } = await api.get<PaginatedResponse<Assignment>>('/Teacher/my-assignments');
      return data.assignments || [];
    } catch (error) {
      console.error('Error fetching teacher assignments:', error);
      throw error;
    }
  },

  // Create a new assignment (teacher)
  createAssignment: async (assignment: CreateAssignmentDTO) => {
    try {
      const { data } = await api.post<Assignment>('/Teacher/create-assignment', assignment);
      return data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  // Update an assignment (teacher)
  updateAssignment: async (id: number, assignment: CreateAssignmentDTO) => {
    try {
      const { data } = await api.put<Assignment>(`/Teacher/assignments/${id}`, assignment);
      return data;
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error);
      throw error;
    }
  },

  // Delete an assignment (teacher)
  deleteAssignment: async (id: number) => {
    try {
      await api.delete(`/Teacher/assignments/${id}`);
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error);
      throw error;
    }
  },

  // Get all submissions for a specific assignment (teacher view)
  getAssignmentSubmissions: async (assignmentId: string) => {
    try {
      const { data } = await api.get<PaginatedSubmissionsResponse>(
        `/Teacher/assignments/${assignmentId}/submissions`
      );
      return {
        submissions: data.submissions,
        pagination: {
          total: data.total,
          page: data.page,
          pageSize: data.pageSize,
          totalPages: data.totalPages
        }
      };
    } catch (error) {
      console.error(`Error fetching submissions for assignment ${assignmentId}:`, error);
      throw error;
    }
  },

  // Grade a submission (teacher)
  gradeSubmission: async (submissionId: number, gradeRequest: GradeSubmissionRequest) => {
    try {
      const { data } = await api.put<Submission>(
        `/Teacher/submissions/${submissionId}/grade`,
        gradeRequest
      );
      return data;
    } catch (error) {
      console.error(`Error grading submission ${submissionId}:`, error);
      throw error;
    }
  }
}; 