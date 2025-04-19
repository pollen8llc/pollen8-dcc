
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CommunityFormData } from "@/schemas/communitySchema";

export const useCreateCommunity = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createCommunity = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to create a community");
      }

      const { data: community, error } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          location: data.location,
          website: data.website || "",
          founder_name: data.founder_name,
          role_title: data.role_title || "",
          community_structure: data.community_structure || "",
          personal_background: data.personal_background || "",
          vision: data.vision || "",
          community_values: data.community_values || "",
          is_public: true,
          logo_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3"
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      navigate(`/community/${community.id}`);
    } catch (error) {
      console.error("Error creating community:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create community",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createCommunity, isSubmitting };
};
