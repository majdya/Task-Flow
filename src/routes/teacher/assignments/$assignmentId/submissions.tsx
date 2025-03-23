import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentsService, type Submission, type GradeSubmissionRequest } from "@/lib/services/assignments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RouteParams {
  assignmentId: string;
}

interface GradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission;
  onSubmit: (data: GradeSubmissionRequest) => void;
  isSubmitting: boolean;
}

function GradeDialog({ isOpen, onClose, submission, onSubmit, isSubmitting }: GradeDialogProps) {
  const [grade, setGrade] = useState(submission.grade || '');
  const [comments, setComments] = useState(submission.comments || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ grade, comments });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="grade" className="text-sm font-medium">
              Grade
            </label>
            <Input
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Enter grade"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="comments" className="text-sm font-medium">
              Comments
            </label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter feedback comments"
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Grade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute('/teacher/assignments/$assignmentId/submissions')({
  component: AssignmentSubmissions,
});

function AssignmentSubmissions() {
  const { assignmentId } = Route.useParams() as RouteParams;
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['assignment', assignmentId, 'submissions'],
    queryFn: () => assignmentsService.getAssignmentSubmissions(assignmentId),
  });

  const gradeMutation = useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: number; data: GradeSubmissionRequest }) =>
      assignmentsService.gradeSubmission(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId, 'submissions'] });
      toast.success('Grade updated successfully');
      setSelectedSubmission(null);
    },
    onError: (error) => {
      toast.error('Failed to update grade');
      console.error('Grade submission error:', error);
    },
  });

  const handleGradeSubmit = (data: GradeSubmissionRequest) => {
    if (!selectedSubmission) return;
    gradeMutation.mutate({
      submissionId: selectedSubmission.id,
      data,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-[200px]" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Submissions</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) return null;

  const { submissions } = data;

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Assignment Submissions</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submissions ({submissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No submissions yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission: Submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.studentId}</TableCell>
                      <TableCell>
                        {new Date(submission.submissionDate).toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {submission.content}
                      </TableCell>
                      <TableCell>{submission.grade || 'Not graded'}</TableCell>
                      <TableCell>{submission.comments || '-'}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          {submission.grade ? 'Update Grade' : 'Grade'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedSubmission && (
        <GradeDialog
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          submission={selectedSubmission}
          onSubmit={handleGradeSubmit}
          isSubmitting={gradeMutation.isPending}
        />
      )}
    </div>
  );
} 