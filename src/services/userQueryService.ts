
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { useToast } from "@/hooks/use-toast";

/**
 * Fetches all users with their roles and community information
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log('Fetching all users from database...');
    
    // Get all profiles - now works with our fixed RLS policies
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw new Error(profilesError.message);
    }
    
    // Get all user roles using the new roles system
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role_id,
        roles:role_id (
          name
        )
      `);
      
    if (rolesError) {
      console.error("Error fetching user roles:", rolesError);
      throw new Error(rolesError.message);
    }
    
    // Get community memberships safely without causing recursion
    // This uses the new policy we created
    const { data: memberships, error: membershipError } = await supabase
      .from('community_members')
      .select('user_id, community_id, role');
      
    if (membershipError) {
      console.error("Error fetching community memberships:", membershipError);
      throw new Error(membershipError.message);
    }
    
    console.log('Raw profiles data:', profiles?.length || 0, 'profiles found');
    console.log('Raw user roles data:', userRoles?.length || 0, 'role records found');
    console.log('Raw memberships data:', memberships?.length || 0, 'membership records found');
    
    // Map profiles to User objects
    const users: User[] = profiles.map(profile => {
      // Find roles for this user
      const userRolesForUser = userRoles?.filter(r => r.user_id === profile.id) || [];
      
      // Check if user has admin role
      const isAdmin = userRolesForUser.some(r => r.roles && r.roles.name === 'ADMIN');
      
      // Check if user has organizer role
      const isOrganizer = userRolesForUser.some(r => r.roles && r.roles.name === 'ORGANIZER');
      
      // Find user's community memberships
      const userMemberships = memberships?.filter(m => m.user_id === profile.id) || [];
      
      // Get communities user is a member of
      const communities = userMemberships.map(m => m.community_id);
      
      // Get communities user manages
      const managedCommunities = userMemberships
        .filter(m => m.role === 'admin')
        .map(m => m.community_id);
      
      // Determine user's role based on the new role system
      let role = UserRole.MEMBER;
      
      if (isAdmin) {
        role = UserRole.ADMIN;
      } else if (isOrganizer || managedCommunities.length > 0) {
        role = UserRole.ORGANIZER;
      } else if (communities.length > 0) {
        role = UserRole.MEMBER;
      } else {
        role = UserRole.GUEST;
      }
      
      const user = {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        role: role,
        imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile.email || "",
        bio: "",
        communities,
        managedCommunities,
        createdAt: profile.created_at
      };
      
      console.log(`Transformed user ${profile.id}:`, user.name, user.role, 
        `Communities: ${communities.length}`, 
        `Managed: ${managedCommunities.length}`);
      
      return user;
    });
    
    console.log('Transformed user data:', users.length, 'users processed');
    return users;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Gets user role counts for dashboard metrics
 */
export const getUserCounts = async () => {
  try {
    console.log("Getting user counts");
    const users = await getAllUsers();
    
    const counts = {
      total: users.length,
      admins: users.filter(user => user.role === UserRole.ADMIN).length,
      organizers: users.filter(user => user.role === UserRole.ORGANIZER).length,
      members: users.filter(user => user.role === UserRole.MEMBER).length,
    };
    
    console.log("User counts:", counts);
    return counts;
  } catch (error) {
    console.error("Error getting user counts:", error);
    throw error;
  }
};
