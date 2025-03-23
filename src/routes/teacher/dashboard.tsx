import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus } from "lucide-react";
import { assignmentsService, type Assignment } from "@/lib/services/assignments";
import { useCheckAuth } from "@/lib/hooks/useAuth";
import { AssignmentModal } from "@/components/AssignmentModal";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute('/teacher/dashboard')({
  component: TeacherDashboard,
});

function AssignmentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeacherDashboard() {
  const { data: auth, isLoading: isAuthLoading } = useCheckAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | undefined>();

  const { 
    data: assignments = [], 
    isLoading,
    error,
    isError
  } = useQuery<Assignment[]>({
    queryKey: ['teacher', 'assignments'],
    queryFn: async () => {
      const response = await assignmentsService.getTeacherAssignments();
      return response;
    },
    enabled: !!auth,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
  });

  const handleCreateClick = () => {
    setSelectedAssignment(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignment(undefined);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <AssignmentSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Assignments</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const sortedAssignments = [...assignments].sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedAssignments.map((assignment) => (
          <AssignmentCard 
            key={assignment.id} 
            assignment={assignment}
            onEdit={() => handleEditClick(assignment)}
          />
        ))}

        {sortedAssignments.length === 0 && (
          <div className="text-center text-muted-foreground py-8 md:col-span-2 lg:col-span-3">
            No assignments created yet. Click the "Create Assignment" button to get started.
          </div>
        )}
      </div>

      <AssignmentModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        assignment={selectedAssignment}
      />
    </div>
  );
}

interface AssignmentCardProps {
  assignment: Assignment;
  onEdit: () => void;
}

function AssignmentCard({ assignment, onEdit }: AssignmentCardProps) {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(dueDate);

  return (
    <Card className={isOverdue ? 'border-red-200' : undefined}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{assignment.title}</CardTitle>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
              Due: {formattedDate}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 line-clamp-2">
            {assignment.description}
          </p>
          
          <div className="flex gap-2">
            <Button className="flex-1" onClick={onEdit} variant="outline">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button className="flex-1" asChild>
              <Link to="/teacher/assignments/$assignmentId/submissions" params={{ assignmentId: assignment.id.toString() }}>
                <Eye className="w-4 h-4 mr-2" />
                View Submissions
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 