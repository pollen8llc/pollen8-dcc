
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  getProfileById,
  updateProfile,
  getConnectedProfiles,
  canViewProfile,
  ExtendedProfile,
  getUserRoleFromProfile
} from "@/services/profileService";

export const useProfiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [connectedProfiles, setConnectedProfiles] = useState<ExtendedProfile[]>([]);
  const { currentUser, refreshUser } = useUser();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  /**
   * Get a user's profile by ID
   */
  const fetchProfile = async (profileId: string): Promise<ExtendedProfile | null> => {
    setIsLoading(true);
    try {
      const fetchedProfile = await getProfileById(profileId);
      setProfile(fetchedProfile);
      return fetchedProfile;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update the current user's profile
   */
  const handleUpdateProfile = async (profileData: Partial<ExtendedProfile>): Promise<ExtendedProfile | null> => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      // Ensure we're updating the current user's profile
      const dataToUpdate = {
        ...profileData,
        id: currentUser.id,
      };

      const updatedProfile = await updateProfile(dataToUpdate);
      
      if (updatedProfile) {
        setProfile(updatedProfile);
        // Refresh user context
        await refreshUser();
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
      }
      
      return updatedProfile;
    } catch (error) {
      console.error("Error in handleUpdateProfile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if profile setup is complete
   */
  const isProfileComplete = async (): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_complete')
        .eq('id', currentUser.id)
        .single();
        
      if (error || !data) {
        console.error("Error checking profile completion:", error);
        return false;
      }
      
      return !!data.profile_complete;
    } catch (error) {
      console.error("Error in isProfileComplete:", error);
      return false;
    }
  };

  /**
   * Check if current user can view another user's profile
   */
  const checkCanViewProfile = async (profileId: string): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      return await canViewProfile(currentUser.id, profileId);
    } catch (error) {
      console.error("Error in checkCanViewProfile:", error);
      return false;
    }
  };

  /**
   * Get profiles connected to the current user
   */
  const fetchConnectedProfiles = async (
    maxDepth: number = 1,
    filters: {
      communityId?: string;
      search?: string;
      interests?: string[];
      location?: string;
    } = {}
  ): Promise<ExtendedProfile[]> => {
    if (!currentUser) {
      return [];
    }

    setIsLoading(true);
    try {
      const profiles = await getConnectedProfiles(currentUser.id, maxDepth, filters);
      setConnectedProfiles(profiles);
      return profiles;
    } catch (error) {
      console.error("Error in fetchConnectedProfiles:", error);
      toast({
        title: "Error",
        description: "Failed to load connected profiles",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Search for profiles with role information
   */
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
      
      // Query profiles with a join to user_roles and roles to get role information
      let queryBuilder = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!user_id(
            role_id,
            roles!role_id(name)
          )
        `, { count: 'exact' });
      
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
      
      // Process the profiles to include role information
      const processedProfiles = data.map(profile => {
        // Extract role from the joined data
        const userRole = getUserRoleFromProfile(profile);
        
        return {
          ...profile,
          // Ensure JSON fields are parsed properly
          social_links: profile.social_links ? JSON.parse(JSON.stringify(profile.social_links)) : {},
          privacy_settings: profile.privacy_settings ? JSON.parse(JSON.stringify(profile.privacy_settings)) : {
            profile_visibility: "connections"
          },
          // Add role information
          role: userRole
        };
      });
      
      return { profiles: processedProfiles as ExtendedProfile[], count: count || 0 };
    } catch (err: any) {
      console.error("Exception in searchProfiles:", err);
      setError(err.message || "An unexpected error occurred");
      return { profiles: [], count: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    profile,
    connectedProfiles,
    error,
    getProfileById: fetchProfile,
    updateProfile: handleUpdateProfile,
    isProfileComplete,
    canViewProfile: checkCanViewProfile,
    getConnectedProfiles: fetchConnectedProfiles,
    searchProfiles,
  };
};
