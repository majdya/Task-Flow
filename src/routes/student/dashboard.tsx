import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, GraduationCap } from "lucide-react";
import { assignmentsService, type Assignment } from "@/lib/services/assignments";
import { useCheckAuth } from "@/lib/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute('/student/dashboard')({
  component: StudentDashboard,
});

function StudentDashboard() {
  const { data: auth } = useCheckAuth();

  const { data: assignments = [], isLoading } = useQuery<Assignment[]>({
    queryKey: ['student', 'assignments'],
    queryFn: async () => {
      const response = await assignmentsService.getStudentAssignments();
      console.log('Processed assignments:', response);
      return response;
    },
    enabled: !!auth,
  });

  // Show loading state while either auth or assignments are loading
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading assignments...</div>
      </div>
    );
  }

  // Debug log
  console.log('Auth state:', auth);
  console.log('Assignments:', assignments);

  const pendingAssignments = assignments.filter((a: Assignment) => !a.status || a.status === 'pending');
  const submittedAssignments = assignments.filter((a: Assignment) => a.status === 'submitted');
  const gradedAssignments = assignments.filter((a: Assignment) => a.status === 'graded');

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length}</div>
            <Button variant="link" className="px-0" asChild>
              <a href="/student/assignments">View all pending</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedAssignments.length}</div>
            <Button variant="link" className="px-0" asChild>
              <a href="/student/assignments">View submissions</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Graded</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradedAssignments.length}</div>
            <Button variant="link" className="px-0" asChild>
              <a href="/student/assignments">View grades</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Assignments</h2>
        <div className="space-y-4">
          {pendingAssignments.slice(0, 5).map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <Button asChild>
                  <a href={`/student/assignments/${assignment.id}`}>
                    View Assignment
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}

          {pendingAssignments.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No pending assignments
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 