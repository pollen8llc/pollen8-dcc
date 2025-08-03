
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExtendedProfile } from "@/services/profileService";
import { UnifiedProfile } from "@/types/unifiedProfile";

export const useProfiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get a profile by ID - returns UnifiedProfile format
  const getProfileById = async (profileId: string): Promise<UnifiedProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
        return null;
      }
      
      // Convert to UnifiedProfile format
      const unifiedProfile: UnifiedProfile = {
        id: data.id,
        user_id: data.user_id || data.id,
        email: data.email || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        bio: data.bio,
        location: data.location,
        avatar_url: data.avatar_url,
        interests: data.interests,
        social_links: data.social_links,
        privacy_settings: data.privacy_settings,
        role: data.role,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        phone: data.phone,
        website: data.website,
      };
      
      return unifiedProfile;
    } catch (err: any) {
      console.error("Exception in getProfileById:", err);
      setError(err.message || "An unexpected error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a profile
  const updateProfile = async (profileData: Partial<UnifiedProfile>): Promise<UnifiedProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to log the action but don't fail if it errors
      try {
        await supabase.functions.invoke("log-action", {
          body: {
            action: "profile_updated",
            details: { 
              profile_id: profileData.id,
              updated_fields: Object.keys(profileData)
            }
          }
        });
      } catch (auditError) {
        console.warn("Audit log failed but continuing with profile update:", auditError);
      }
      
      // Ensure we have valid values for JSON fields to prevent database errors
      const cleanedData = {
        ...profileData,
        social_links: profileData.social_links || {},
        privacy_settings: profileData.privacy_settings || { profile_visibility: "public" },
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .update(cleanedData)
        .eq('id', profileData.id || '')
        .select();
      
      if (error) {
        console.error("Error updating profile:", error);
        setError(error.message);
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      // Convert to UnifiedProfile format
      const updatedProfile: UnifiedProfile = {
        id: data[0].id,
        user_id: data[0].user_id || data[0].id,
        email: data[0].email || '',
        first_name: data[0].first_name || '',
        last_name: data[0].last_name || '',
        bio: data[0].bio,
        location: data[0].location,
        avatar_url: data[0].avatar_url,
        interests: data[0].interests,
        social_links: data[0].social_links,
        privacy_settings: data[0].privacy_settings,
        role: data[0].role,
        created_at: data[0].created_at || new Date().toISOString(),
        updated_at: data[0].updated_at || new Date().toISOString(),
        phone: data[0].phone,
        website: data[0].website,
      };
      
      return updatedProfile;
    } catch (err: any) {
      console.error("Exception in updateProfile:", err);
      setError(err.message || "An unexpected error occurred");
      toast({
        title: "Profile update failed",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Search for profiles

  return {
    getProfileById,
    updateProfile,
    isLoading,
    error
  };
};
