import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from 'sonner';
import { useCreateAssignment, useAssignments } from '@/lib/hooks/useAssignments';
import { toast } from 'sonner';

export default function TeacherDashboard() {
  const [newAssignment, setNewAssignment] = useState({
    id: 1,
    title: '',
    description: '',
    dueDate: '',
    createdBy: '1', // TODO: Replace with actual teacher ID
  });

  const { data: assignments, isLoading, error } = useAssignments();
  const createAssignment = useCreateAssignment();

  // Debug logging
  console.log('TeacherDashboard - Assignments:', assignments);
  console.log('TeacherDashboard - Is Loading:', isLoading);
  console.log('TeacherDashboard - Error:', error);

  // Ensure assignments is always an array
  const assignmentsList = Array.isArray(assignments) ? assignments : [];
  console.log('TeacherDashboard - AssignmentsList:', assignmentsList);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAssignment.mutateAsync(newAssignment);
      toast.success('Assignment created successfully');
      setNewAssignment({
        id: 1,
        title: '',
        description: '',
        dueDate: '',
        createdBy: '1',
      });
    } catch (error) {
      toast.error('Failed to create assignment');
      console.error('Create assignment error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading assignments: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={createAssignment.isPending}>
              {createAssignment.isPending ? 'Creating...' : 'Create Assignment'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold">Current Assignments</h2>
        {assignmentsList.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <CardTitle>{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{assignment.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Due: {new Date(assignment.dueDate).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(assignment.createdDate).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Toaster />
    </div>
  );
} 