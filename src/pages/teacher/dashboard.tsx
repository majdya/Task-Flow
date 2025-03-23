import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from 'sonner';
import { useCreateAssignment, useAssignments, useEditAssignment } from '@/lib/hooks/useAssignments';
import { toast } from 'sonner';
import type { Assignment } from '@/types';

export default function TeacherDashboard() {
  const [newAssignment, setNewAssignment] = useState({
    id: 1,
    title: '',
    description: '',
    dueDate: '',
    createdBy: '1', // TODO: Replace with actual teacher ID
  });

  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const { data: assignments, isLoading, error } = useAssignments();
  const createAssignment = useCreateAssignment();
  const editAssignment = useEditAssignment();

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

  const handleEditAssignment = async (e: React.FormEvent, assignment: Assignment) => {
    e.preventDefault();
    if (!editingAssignment) return;
    
    try {
      console.log('Editing assignment:', editingAssignment); // Debug log
      await editAssignment.mutateAsync({
        id: assignment.id,
        data: {
          title: editingAssignment.title,
          description: editingAssignment.description,
          dueDate: editingAssignment.dueDate,
        },
      });
      toast.success('Assignment updated successfully');
      setEditingAssignment(null);
    } catch (error) {
      console.error('Update assignment error:', error);
      toast.error('Failed to update assignment');
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
              <div className="flex justify-between items-center">
                {editingAssignment?.id === assignment.id ? (
                  <form 
                    className="flex-1 space-y-4"
                    onSubmit={(e) => handleEditAssignment(e, assignment)}
                  >
                    <div>
                      <Input
                        value={editingAssignment.title}
                        onChange={(e) => setEditingAssignment({
                          ...editingAssignment,
                          title: e.target.value,
                        })}
                        placeholder="Title"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        value={editingAssignment.description}
                        onChange={(e) => setEditingAssignment({
                          ...editingAssignment,
                          description: e.target.value,
                        })}
                        placeholder="Description"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="date"
                        value={editingAssignment.dueDate.split('T')[0]}
                        onChange={(e) => setEditingAssignment({
                          ...editingAssignment,
                          dueDate: e.target.value,
                        })}
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={editAssignment.isPending}>
                        {editAssignment.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setEditingAssignment(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <CardTitle>{assignment.title}</CardTitle>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingAssignment(assignment)}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            {editingAssignment?.id !== assignment.id && (
              <CardContent>
                <p className="text-gray-600">{assignment.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(assignment.createdDate).toLocaleString()}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Toaster />
    </div>
  );
} 