import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentsService, type CreateAssignmentDTO } from "@/lib/services/assignments";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  dueDate: z.string().min(1, "Due date is required").refine((date) => {
    const selectedDate = new Date(date);
    const now = new Date();
    return selectedDate > now;
  }, "Due date must be in the future"),
});

type FormData = z.infer<typeof assignmentSchema>;

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: {
    id: number;
    title: string;
    description: string;
    dueDate: string;
  };
}

export function AssignmentModal({ isOpen, onClose, assignment }: AssignmentModalProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (assignment) {
      form.reset({
        title: assignment.title,
        description: assignment.description,
        dueDate: new Date(assignment.dueDate).toISOString().split('T')[0],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [assignment, form]);

  const createMutation = useMutation({
    mutationFn: assignmentsService.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'assignments'] });
      toast.success('Assignment created successfully');
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to create assignment');
      console.error('Create assignment error:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateAssignmentDTO) => 
      assignmentsService.updateAssignment(assignment!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher', 'assignments'] });
      toast.success('Assignment updated successfully');
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to update assignment');
      console.error('Update assignment error:', error);
    }
  });

  const onSubmit = (data: FormData) => {
    if (assignment) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Assignment title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Assignment description"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="datetime-local"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  onClose();
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending 
                  ? 'Saving...' 
                  : assignment ? 'Update' : 'Create'
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 