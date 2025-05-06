
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExtendedProfile } from "@/services/profileService";

export const useProfiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get a profile by ID
  const getProfileById = async (profileId: string): Promise<ExtendedProfile | null> => {
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
      
      return data as ExtendedProfile;
    } catch (err: any) {
      console.error("Exception in getProfileById:", err);
      setError(err.message || "An unexpected error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a profile
  const updateProfile = async (profileData: Partial<ExtendedProfile>): Promise<ExtendedProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to log the action but don't fail if it errors
      try {
        // Use a client-side wrapper of the audit function
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
        // Don't block profile update for audit log failure
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
      
      return data[0] as ExtendedProfile;
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
  const searchProfiles = async (params: {
    query?: string;
    interests?: string[];
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<{ profiles: ExtendedProfile[]; count: number }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { query, interests, location, page = 0, limit = 10 } = params;
      
      let queryBuilder = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      // Apply filters if provided
      if (query) {
        queryBuilder = queryBuilder.or(
          `first_name.ilike.%${query}%,last_name.ilike.%${query}%,bio.ilike.%${query}%`
        );
      }
      
      if (location) {
        queryBuilder = queryBuilder.ilike('location', `%${location}%`);
      }
      
      if (interests && interests.length > 0) {
        // Filter profiles that have at least one matching interest
        queryBuilder = queryBuilder.contains('interests', interests);
      }
      
      // Apply pagination
      queryBuilder = queryBuilder
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);
      
      const { data, error, count } = await queryBuilder;
      
      if (error) {
        console.error("Error searching profiles:", error);
        setError(error.message);
        return { profiles: [], count: 0 };
      }
      
      return { profiles: data as ExtendedProfile[], count: count || 0 };
    } catch (err: any) {
      console.error("Exception in searchProfiles:", err);
      setError(err.message || "An unexpected error occurred");
      return { profiles: [], count: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getProfileById,
    updateProfile,
    searchProfiles,
    isLoading,
    error,
  };
};
