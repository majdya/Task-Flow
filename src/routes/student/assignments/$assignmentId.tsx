import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { toast } from "sonner";
import { assignmentsService, type Assignment, type Submission } from "@/lib/services/assignments";

interface RouteParams {
  assignmentId: string;
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/student/assignments/$assignmentId': {
      params: {
        assignmentId: string;
      }
    }
  }
}

export const Route = createFileRoute('/student/assignments/$assignmentId')({
  component: AssignmentDetail,
});

function AssignmentDetail() {
  const params = Route.useParams() as RouteParams;
  const assignmentId = params.assignmentId;
  const [submission, setSubmission] = useState('');

  const { data: assignment, isLoading: isLoadingAssignment } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: () => assignmentsService.getAssignment(assignmentId),
  });

  const { data: existingSubmission, isLoading: isLoadingSubmission } = useQuery({
    queryKey: ['submission', assignmentId],
    queryFn: () => assignmentsService.getSubmission(assignmentId),
    enabled: assignment?.status !== 'pending',
  });

  const submitMutation = useMutation({
    mutationFn: (content: string) => assignmentsService.submitAssignment(assignmentId, { content }),
    onSuccess: () => {
      toast.success('Assignment submitted successfully!');
      // Refresh the assignment data
      window.location.reload();
    },
    onError: () => {
      toast.error('Failed to submit assignment. Please try again.');
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitMutation.mutate(submission);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSubmission(e.target.value);
  };

  if (isLoadingAssignment) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading assignment...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Assignment not found</h1>
          <Button asChild className="mt-4">
            <a href="/student/assignments">Back to Assignments</a>
          </Button>
        </div>
      </div>
    );
  }

  const isSubmissionDeadlinePassed = new Date(assignment.dueDate) < new Date();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{assignment.title}</h1>
        <Button asChild variant="outline">
          <a href="/student/assignments">Back to Assignments</a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="mt-2 whitespace-pre-wrap">{assignment.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Due Date</h3>
                <p className="mt-2">
                  {new Date(assignment.dueDate).toLocaleDateString()} at{' '}
                  {new Date(assignment.dueDate).toLocaleTimeString()}
                </p>
              </div>

              {assignment.status === 'graded' && (
                <div>
                  <h3 className="font-semibold">Grade</h3>
                  <p className="mt-2">{assignment.grade}%</p>
                  {assignment.feedback && (
                    <>
                      <h3 className="mt-4 font-semibold">Feedback</h3>
                      <p className="mt-2 whitespace-pre-wrap">{assignment.feedback}</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {assignment.status === 'pending' && !isSubmissionDeadlinePassed && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Submit Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Textarea
                    value={submission}
                    onChange={handleTextChange}
                    placeholder="Enter your submission here..."
                    className="min-h-[200px] mb-4"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={submitMutation.isPending || !submission.trim()}
                  >
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Assignment'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {(assignment.status === 'submitted' || assignment.status === 'graded') && !isLoadingSubmission && existingSubmission && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Submission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Submitted At</h3>
                    <p className="mt-2">
                      {new Date(existingSubmission.submittedAt).toLocaleDateString()} at{' '}
                      {new Date(existingSubmission.submittedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Content</h3>
                    <p className="mt-2 whitespace-pre-wrap">{existingSubmission.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Current Status</h3>
                <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                  ${assignment.status === 'graded' ? 'bg-green-100 text-green-800' : ''}
                `}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </div>
              </div>

              {assignment.status === 'pending' && (
                <div>
                  <h3 className="font-semibold">Time Remaining</h3>
                  <p className="mt-2">
                    {isSubmissionDeadlinePassed 
                      ? 'Deadline has passed' 
                      : `Due in ${Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 