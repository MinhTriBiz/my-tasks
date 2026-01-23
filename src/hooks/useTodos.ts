import { useState } from "react";
import { Todo, FilterType } from "@/types/todo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTodos = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const queryClient = useQueryClient();

  // Fetch todos from Supabase
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Không thể tải danh sách tasks");
        throw error;
      }

      return data.map((todo) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description || undefined,
        completed: todo.completed,
        createdAt: new Date(todo.created_at),
        completedAt: todo.completed_at ? new Date(todo.completed_at) : undefined,
        dueDate: todo.due_date ? new Date(todo.due_date) : undefined,
        location: todo.location || undefined,
        reminderAt: todo.reminder_at ? new Date(todo.reminder_at) : undefined,
        reminderEnabled: todo.reminder_enabled,
      })) as Todo[];
    },
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: async ({ 
      title, 
      description, 
      dueDate, 
      location, 
      reminderAt, 
      reminderEnabled 
    }: { 
      title: string; 
      description?: string;
      dueDate?: Date;
      location?: string;
      reminderAt?: Date;
      reminderEnabled?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Bạn chưa đăng nhập");
      }

      const { data, error } = await supabase
        .from("todos")
        .insert({
          title,
          description,
          user_id: user.id,
          due_date: dueDate?.toISOString(),
          location,
          reminder_at: reminderAt?.toISOString(),
          reminder_enabled: reminderEnabled || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Đã thêm task mới!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể thêm task");
    },
  });

  const addTodo = (
    title: string, 
    description?: string,
    dueDate?: Date,
    location?: string,
    reminderAt?: Date,
    reminderEnabled?: boolean
  ) => {
    addTodoMutation.mutate({ title, description, dueDate, location, reminderAt, reminderEnabled });
  };

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: async ({ 
      id,
      title, 
      description, 
      dueDate, 
      location, 
      reminderAt, 
      reminderEnabled 
    }: { 
      id: string;
      title: string; 
      description?: string;
      dueDate?: Date;
      location?: string;
      reminderAt?: Date;
      reminderEnabled?: boolean;
    }) => {
      const { error } = await supabase
        .from("todos")
        .update({
          title,
          description,
          due_date: dueDate?.toISOString() || null,
          location: location || null,
          reminder_at: reminderAt?.toISOString() || null,
          reminder_enabled: reminderEnabled || false,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Đã cập nhật task!");
    },
    onError: () => {
      toast.error("Không thể cập nhật task");
    },
  });

  const updateTodo = (
    id: string,
    title: string, 
    description?: string,
    dueDate?: Date,
    location?: string,
    reminderAt?: Date,
    reminderEnabled?: boolean
  ) => {
    updateTodoMutation.mutate({ id, title, description, dueDate, location, reminderAt, reminderEnabled });
  };

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) throw new Error("Không tìm thấy task");

      const { error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      toast.error("Không thể cập nhật task");
    },
  });

  const toggleTodo = (id: string) => {
    toggleTodoMutation.mutate(id);
  };

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Đã xóa task");
    },
    onError: () => {
      toast.error("Không thể xóa task");
    },
  });

  const deleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    counts,
    isLoading,
  };
};
