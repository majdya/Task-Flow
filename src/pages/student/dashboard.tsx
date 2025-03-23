import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from 'sonner';
import type { Assignment, Submission } from '@/types';

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState('');

  const handleSubmitAssignment = (assignmentId: string) => {
    const submission: Submission = {
      id: Date.now().toString(),
      assignmentId,
      studentId: '1', // TODO: Replace with actual student ID
      content: currentSubmission,
      submittedAt: new Date(),
    };
    setSubmissions([...submissions, submission]);
    setCurrentSubmission('');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

      <div className="grid gap-6">
        <h2 className="text-2xl font-semibold">Available Assignments</h2>
        {assignments.map((assignment) => {
          const submission = submissions.find(s => s.assignmentId === assignment.id);
          return (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{assignment.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </p>
                
                {!submission ? (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor={`submission-${assignment.id}`} className="text-sm font-medium">
                        Your Submission
                      </label>
                      <Input
                        id={`submission-${assignment.id}`}
                        value={currentSubmission}
                        onChange={(e) => setCurrentSubmission(e.target.value)}
                        placeholder="Enter your submission"
                      />
                    </div>
                    <Button onClick={() => handleSubmitAssignment(assignment.id)}>
                      Submit Assignment
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Submitted on: {new Date(submission.submittedAt).toLocaleString()}</p>
                    {submission.grade && (
                      <p className="text-sm font-medium mt-2">Grade: {submission.grade}</p>
                    )}
                    {submission.feedback && (
                      <p className="text-sm text-gray-600 mt-2">Feedback: {submission.feedback}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Toaster />
    </div>
  );
} 