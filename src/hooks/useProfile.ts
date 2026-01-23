import { useState, useEffect } from "react";
import { Profile } from "@/types/todo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Fetch profile from Supabase
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Không thể tải thông tin profile");
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        userId: data.user_id,
        username: data.username,
        avatarUrl: data.avatar_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      } as Profile;
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({ username }: { username: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Username đã được sử dụng");
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Đã cập nhật profile!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể cập nhật profile");
    },
  });

  const updateProfile = (username: string) => {
    updateProfileMutation.mutate({ username });
  };

  return {
    profile,
    isLoading,
    updateProfile,
    isUpdating: updateProfileMutation.isPending,
  };
};
