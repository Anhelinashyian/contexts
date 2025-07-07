import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { insertTaskSchema, type InsertTask, type Context } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ isOpen, onClose }: TaskModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCustomContext, setIsCustomContext] = useState(false);
  const [customContextName, setCustomContextName] = useState("");
  
  const { data: contexts = [] } = useQuery<Context[]>({
    queryKey: ["/api/contexts"],
  });
  
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      comments: "",
      contextId: undefined,
    },
  });

  const createContextMutation = useMutation({
    mutationFn: async (data: { name: string; color: string }) => {
      const response = await apiRequest("POST", "/api/contexts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contexts"] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      const response = await apiRequest("POST", "/api/tasks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contexts"] });
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      form.reset();
      setIsCustomContext(false);
      setCustomContextName("");
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

  const onSubmit = async (data: InsertTask) => {
    let contextId = data.contextId;

    if (isCustomContext && customContextName.trim()) {
      try {
        // Generate a random color for new context
        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newContext = await createContextMutation.mutateAsync({
          name: customContextName.trim(),
          color: randomColor
        });
        contextId = newContext.id;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create new context",
          variant: "destructive",
        });
        return;
      }
    }
    
    createTaskMutation.mutate({ ...data, contextId });
  };

  const handleClose = () => {
    form.reset();
    setIsCustomContext(false);
    setCustomContextName("");
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
              name="contextId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Context
                  </FormLabel>
                  <div className="space-y-2">
                    {!isCustomContext ? (
                      <FormControl>
                        <Select 
                          value={field.value?.toString() || ""} 
                          onValueChange={(value) => {
                            if (value === "custom") {
                              setIsCustomContext(true);
                              field.onChange(undefined);
                            } else {
                              field.onChange(value ? parseInt(value) : undefined);
                            }
                          }}
                        >
                          <SelectTrigger className="modal-input">
                            <SelectValue placeholder="Select a context or create new..." />
                          </SelectTrigger>
                          <SelectContent>
                            {contexts.map((context) => (
                              <SelectItem key={context.id} value={context.id.toString()}>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: context.color }}
                                  />
                                  {context.name}
                                </div>
                              </SelectItem>
                            ))}
                            <SelectItem value="custom">
                              <div className="flex items-center gap-2 text-blue-600">
                                <span>+ Create new context</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={customContextName}
                          onChange={(e) => setCustomContextName(e.target.value)}
                          placeholder="Enter new context name..."
                          className="modal-input flex-1"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setIsCustomContext(false);
                            setCustomContextName("");
                          }}
                          className="px-3"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
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
