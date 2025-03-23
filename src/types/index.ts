export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  createdDate: string;
  createdBy: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}

export interface PaginatedResponse<T> {
  assignments: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 