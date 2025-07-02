import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      comments: "",
      context: "",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTask) => {
    createTaskMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const nameValue = form.watch("name") || "";
  const descriptionValue = form.watch("description") || "";
  const commentsValue = form.watch("comments") || "";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="modal-content sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="modal-title">
            Create New Item
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    How do you name it? <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={50}
                        placeholder="Enter item name..."
                        className="modal-input pr-16"
                      />
                    </FormControl>
                    <div className="absolute right-3 top-2 text-xs text-gray-500">
                      {nameValue.length}/50
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    What should be done? <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        {...field}
                        maxLength={200}
                        rows={3}
                        placeholder="Describe what needs to be done..."
                        className="modal-input resize-none pr-16"
                      />
                    </FormControl>
                    <div className="absolute right-3 bottom-2 text-xs text-gray-500">
                      {descriptionValue.length}/200
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Any comments?
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        {...field}
                        maxLength={1000}
                        rows={3}
                        placeholder="Optional comments..."
                        className="modal-input resize-none pr-20"
                      />
                    </FormControl>
                    <div className="absolute right-3 bottom-2 text-xs text-gray-500">
                      {commentsValue.length}/1000
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Context
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Context or category..."
                      className="modal-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending ? "Creating..." : "Create Item"}
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
