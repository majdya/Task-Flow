import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

export const Route = createFileRoute('/student/assignments/')({
  component: AssignmentsList,
});

function AssignmentsList() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const { data: assignments, isLoading } = useQuery<Assignment[]>({
    queryKey: ['assignments', 'student'],
    queryFn: async () => {
      const { data } = await api.get('/assignments/student');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading assignments...</div>
      </div>
    );
  }

  const filteredAssignments = assignments?.filter(assignment => {
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesSearch = assignment.title.toLowerCase().includes(search.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[250px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="graded">Graded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments?.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{assignment.title}</TableCell>
                <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${assignment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' : ''}
                    ${assignment.status === 'graded' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell>
                  {assignment.grade !== undefined ? `${assignment.grade}%` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline">
                    <a href={`/student/assignments/${assignment.id}`}>
                      {assignment.status === 'pending' ? 'Submit' : 'View'}
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 