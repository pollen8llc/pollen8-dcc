
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/models/types";
import { ExtendedProfile } from "@/types/profiles";

export const useProfiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get a profile by ID with role information
  const getProfileById = async (profileId: string): Promise<ExtendedProfile | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This will use RLS to enforce privacy
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
      
      // Get user role from user_roles table
      let role = UserRole.MEMBER; // Default role
      
      try {
        const { data: userRoles, error: userRolesError } = await supabase
          .from('user_roles')
          .select(`
            role_id,
            roles:role_id (
              name
            )
          `)
          .eq('user_id', profileId);

        if (userRolesError) {
          console.error("Error fetching user roles for profile:", userRolesError);
        } else if (userRoles && userRoles.length > 0) {
          console.log("Profile user roles fetched:", userRoles);
          
          // Check for admin role first
          const hasAdminRole = userRoles.some(r => r.roles && r.roles.name === 'ADMIN');
          if (hasAdminRole) {
            role = UserRole.ADMIN;
          } else {
            // Check for service provider role
            const hasServiceProviderRole = userRoles.some(r => 
              r.roles && r.roles.name === 'SERVICE_PROVIDER'
            );
            if (hasServiceProviderRole) {
              role = UserRole.SERVICE_PROVIDER;
            } else {
              // Check for organizer role
              const hasOrganizerRole = userRoles.some(r => r.roles && r.roles.name === 'ORGANIZER');
              if (hasOrganizerRole) {
                role = UserRole.ORGANIZER;
              }
            }
          }
        }
      } catch (roleErr) {
        console.error("Exception fetching roles for profile:", roleErr);
      }
      
      // Parse JSON fields to ensure type compatibility
      return {
        ...data,
        role: role,
        social_links: data.social_links ? JSON.parse(JSON.stringify(data.social_links)) : {},
        privacy_settings: data.privacy_settings ? JSON.parse(JSON.stringify(data.privacy_settings)) : {
          profile_visibility: "connections"
        }
      };
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
      
      return {
        ...data[0],
        social_links: data[0].social_links as Record<string, string> || {},
        privacy_settings: data[0].privacy_settings as any || { profile_visibility: "public" }
      } as ExtendedProfile;
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
      
        return { 
          profiles: data.map(profile => ({
            ...profile,
            social_links: profile.social_links as Record<string, string> || {},
            privacy_settings: profile.privacy_settings as any || { profile_visibility: "connections" }
          })) as ExtendedProfile[], 
          count: count || 0 
        };
    } catch (err: any) {
      console.error("Exception in searchProfiles:", err);
      setError(err.message || "An unexpected error occurred");
      return { profiles: [], count: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a user can view another user's profile
  const canViewProfile = async (viewerId: string, profileId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('can_view_profile', {
          viewer_id: viewerId,
          profile_id: profileId
        });
        
      if (error) {
        console.error("Error checking profile visibility:", error);
        return false;
      }
      
      return data;
    } catch (error) {
      console.error("Exception in canViewProfile:", error);
      return false;
    }
  };

  // Get connected profiles for a user
  const getConnectedProfiles = async (
    userId: string, 
    maxDepth: number = 1,
    filters: { 
      communityId?: string;
      search?: string;
      interests?: string[];
      location?: string;
    } = {}
  ): Promise<ExtendedProfile[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First get connected profiles using the database function
      const { data, error } = await supabase
        .rpc('get_connected_profiles', {
          user_id: userId,
          max_depth: maxDepth
        });
        
      if (error) {
        console.error("Error getting connected profiles:", error);
        setError(error.message);
        return [];
      }
      
      let profiles = data || [];
      
      // Process the returned data to ensure types match
      const processedProfiles: ExtendedProfile[] = profiles.map(profile => ({
        ...profile,
        social_links: profile.social_links ? JSON.parse(JSON.stringify(profile.social_links)) : {},
        privacy_settings: profile.privacy_settings ? JSON.parse(JSON.stringify(profile.privacy_settings)) : {
          profile_visibility: "connections"
        }
      }));
      
      // Apply filters
      let filteredProfiles = [...processedProfiles];
      
      if (filters.communityId) {
        // Filter by community - this would need to be enhanced with a more complex query
        filteredProfiles = filteredProfiles.filter(profile => {
          // This is a simplified check - in reality you would need to check connections
          return true; // Placeholder
        });
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProfiles = filteredProfiles.filter(profile => {
          return (
            (profile.first_name && profile.first_name.toLowerCase().includes(searchLower)) ||
            (profile.last_name && profile.last_name.toLowerCase().includes(searchLower)) ||
            (profile.bio && profile.bio.toLowerCase().includes(searchLower))
          );
        });
      }
      
      if (filters.interests && filters.interests.length > 0) {
        filteredProfiles = filteredProfiles.filter(profile => {
          if (!profile.interests || profile.interests.length === 0) return false;
          return filters.interests?.some(interest => 
            profile.interests?.includes(interest)
          );
        });
      }
      
      if (filters.location) {
        filteredProfiles = filteredProfiles.filter(profile => 
          profile.location && profile.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      return filteredProfiles;
    } catch (err: any) {
      console.error("Exception in getConnectedProfiles:", err);
      setError(err.message || "An unexpected error occurred");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Get all profiles (admin only)
  const getAllProfiles = async (): Promise<ExtendedProfile[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: userRole } = await supabase.rpc('get_highest_role', {
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
      
      if (userRole !== 'ADMIN') {
        console.error("Only admins can get all profiles");
        setError("Insufficient permissions");
        return [];
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching all profiles:", error);
        setError(error.message);
        return [];
      }
      
      // Process the returned data to ensure types match
      return data.map(profile => ({
        ...profile,
        social_links: profile.social_links ? JSON.parse(JSON.stringify(profile.social_links)) : {},
        privacy_settings: profile.privacy_settings ? JSON.parse(JSON.stringify(profile.privacy_settings)) : {
          profile_visibility: "connections"
        }
      }));
    } catch (err: any) {
      console.error("Exception in getAllProfiles:", err);
      setError(err.message || "An unexpected error occurred");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getProfileById,
    updateProfile,
    searchProfiles,
    canViewProfile,
    getConnectedProfiles,
    getAllProfiles,
    isLoading,
    error,
  };
};
