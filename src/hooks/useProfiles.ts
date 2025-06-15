
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  getProfileById,
  updateProfile,
  getConnectedProfiles,
  canViewProfile,
  ExtendedProfile
} from "@/services/profileService";

export const useProfiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [connectedProfiles, setConnectedProfiles] = useState<ExtendedProfile[]>([]);
  const { currentUser, refreshUser } = useUser();
  const { toast } = useToast();

  /**
   * Get a user's profile by ID with role information
   */
  const fetchProfile = async (profileId: string): Promise<ExtendedProfile | null> => {
    setIsLoading(true);
    try {
      console.log('Fetching profile with role info for:', profileId);
      const fetchedProfile = await getProfileById(profileId);
      console.log('Fetched profile with role:', fetchedProfile?.role);
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

  return {
    isLoading,
    profile,
    connectedProfiles,
    getProfileById: fetchProfile,
    updateProfile: handleUpdateProfile,
    isProfileComplete,
    canViewProfile: checkCanViewProfile,
    getConnectedProfiles: fetchConnectedProfiles,
  };
};
