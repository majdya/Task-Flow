import { createFileRoute } from '@tanstack/react-router';
import TeacherDashboard from '../pages/teacher/dashboard';

export const Route = createFileRoute('/teacher/dashboard')({
  component: TeacherDashboard,
  beforeLoad: () => {
    console.log('Loading teacher dashboard');
  },
}); 