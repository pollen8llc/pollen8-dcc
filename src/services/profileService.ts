import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";

export interface ExtendedProfile {
  id: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  social_links?: Record<string, string>;
  invited_by?: string;
  profile_complete?: boolean;
  rel8_complete?: boolean;
  eco8_complete?: boolean;
  modul8_complete?: boolean;
  labr8_complete?: boolean;
  privacy_settings?: {
    profile_visibility: "public" | "connections" | "connections2" | "connections3" | "private";
  };
  created_at?: string;
  updated_at?: string;
  role?: UserRole;
  phone?: string;
  website?: string;
}

/**
 * Get a profile by ID with privacy checks and role information
 */
export const getProfileById = async (profileId: string): Promise<ExtendedProfile | null> => {
  try {
    // This will use RLS to enforce privacy  
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', profileId)
      .single();
      
    if (error) {
      console.error("Error fetching profile:", error);
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
      role: role as UserRole,
      social_links: data.social_links ? JSON.parse(JSON.stringify(data.social_links)) : {},
      privacy_settings: data.privacy_settings ? JSON.parse(JSON.stringify(data.privacy_settings)) : {
        profile_visibility: "connections"
      }
    } as ExtendedProfile;
  } catch (error) {
    console.error("Exception in getProfileById:", error);
    return null;
  }
};

/**
 * Update a user's profile
 */
export const updateProfile = async (profileData: Partial<ExtendedProfile>): Promise<ExtendedProfile | null> => {
  try {
    const currentUser = (await supabase.auth.getUser()).data.user;
    
    if (!currentUser || !currentUser.id) {
      console.error("No authenticated user found");
      return null;
    }
    
    // Only allow updating your own profile
    if (profileData.id !== currentUser.id) {
      console.error("Cannot update another user's profile");
      return null;
    }

    // Ensure privacy_settings has the required property
    const privacy_settings = profileData.privacy_settings ? {
      profile_visibility: profileData.privacy_settings.profile_visibility || "connections"
    } : undefined;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        bio: profileData.bio,
        location: profileData.location,
        interests: profileData.interests,
        social_links: profileData.social_links,
        privacy_settings: privacy_settings,
        avatar_url: profileData.avatar_url,
        profile_complete: profileData.profile_complete,
        rel8_complete: profileData.rel8_complete,
        eco8_complete: profileData.eco8_complete,
        modul8_complete: profileData.modul8_complete,
        labr8_complete: profileData.labr8_complete,
        phone: profileData.phone,
        website: profileData.website,
      })
      .eq('user_id', currentUser.id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating profile:", error);
      return null;
    }
    
    // Parse JSON fields to ensure type compatibility
    return {
      ...data,
      role: data.role as UserRole,
      social_links: data.social_links ? JSON.parse(JSON.stringify(data.social_links)) : {},
      privacy_settings: data.privacy_settings ? JSON.parse(JSON.stringify(data.privacy_settings)) : {
        profile_visibility: "connections"
      }
    } as ExtendedProfile;
  } catch (error) {
    console.error("Exception in updateProfile:", error);
    return null;
  }
};

/**
 * Check if a user can view another user's profile
 */
export const canViewProfile = async (viewerId: string, profileId: string): Promise<boolean> => {
  try {
  const { data: canView, error } = await supabase.rpc('can_view_profile', {
    viewer_id: viewerId,
    profile_user_id: profileId
  });
      
    if (error) {
      console.error("Error checking profile visibility:", error);
      return false;
    }
    
    return canView;
  } catch (error) {
    console.error("Exception in canViewProfile:", error);
    return false;
  }
};

/**
 * Get connected profiles for a user
 */
export const getConnectedProfiles = async (
  userId: string, 
  maxDepth: number = 1,
  filters: { 
    communityId?: string;
    search?: string;
    interests?: string[];
    location?: string;
  } = {}
): Promise<ExtendedProfile[]> => {
  try {
    // First get connected profiles using the database function
  const { data, error } = await supabase.rpc('get_connected_profiles', {
    user_id: userId
  });
      
    if (error) {
      console.error("Error getting connected profiles:", error);
      return [];
    }
    
    let profiles = data || [];
    
    // Process the returned data to ensure types match
  const processedProfiles: any[] = profiles.map(profile => ({
    id: profile.profile_id,
    user_id: profile.user_id,
    avatar_url: profile.avatar_url,
    full_name: profile.full_name,
    social_links: {},
    privacy_settings: {}
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
  } catch (error) {
    console.error("Exception in getConnectedProfiles:", error);
    return [];
  }
};

/**
 * Get all profiles (admin only)
 */
export const getAllProfiles = async (): Promise<ExtendedProfile[]> => {
  try {
    const { data: userRole } = await supabase.rpc('get_highest_role', {
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
    
    if (userRole !== 'ADMIN') {
      console.error("Only admins can get all profiles");
      return [];
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching all profiles:", error);
      return [];
    }
    
    // Process the returned data to ensure types match
    return data.map(profile => ({
      ...profile,
      role: profile.role as UserRole,
      social_links: profile.social_links ? JSON.parse(JSON.stringify(profile.social_links)) : {},
      privacy_settings: profile.privacy_settings ? JSON.parse(JSON.stringify(profile.privacy_settings)) : {
        profile_visibility: "connections"
      }
    })) as ExtendedProfile[];
  } catch (error) {
    console.error("Exception in getAllProfiles:", error);
    return [];
  }
};
