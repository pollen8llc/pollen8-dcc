
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const useProfile = (session: Session | null) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      
      // Use let instead of const to allow reassignment
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        // Check if profile doesn't exist
        if (profileError.code === 'PGRST116') {
          console.log("Profile not found, creating new profile");
          // Attempt to create a profile
          const authUser = await supabase.auth.getUser();
          if (authUser.data?.user) {
            const { data: newProfile, error: createError } = await supabase.from('profiles').insert({
              id: userId,
              email: authUser.data.user.email,
              first_name: authUser.data.user.user_metadata?.first_name || '',
              last_name: authUser.data.user.user_metadata?.last_name || ''
            }).select('*').single();
            
            if (createError) {
              console.error("Error creating profile:", createError);
              throw createError;
            }
            
            // Reassign profile to newProfile
            profile = newProfile;
          } else {
            throw new Error("Cannot create profile: User data not available");
          }
        } else {
          throw profileError;
        }
      }

      console.log("Profile fetched:", profile);

      // Get user's highest role using our database function - ensure we're getting up-to-date role information
      const { data: highestRole, error: roleError } = await supabase
        .rpc('get_highest_role', { user_id: userId });
      
      if (roleError) {
        console.error("Error fetching highest role:", roleError);
        throw roleError;
      }

      console.log("Highest role from database:", highestRole);

      // Create user object with role from database
      const userData: User = {
        id: userId,
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User',
        role: UserRole[highestRole as keyof typeof UserRole] || UserRole.MEMBER,
        imageUrl: profile?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile?.email || "",
        bio: "", // Default empty string as bio is not in the profiles table
        communities: [],
        managedCommunities: [],
        createdAt: profile?.created_at || new Date().toISOString()
      };

      console.log("User data constructed:", userData);
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      throw error;
    }
  };

  // Effect to update user data when session changes
  useEffect(() => {
    const updateUserData = async () => {
      setIsLoading(true);
      
      try {
        if (session && session.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error updating user data:", error);
        setCurrentUser(null);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile data. Please try logging out and in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    updateUserData();
  }, [session]);

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    setIsLoading(true);
    console.log("Refreshing user data, session:", session);
    
    try {
      if (session && session.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({
        title: "Error refreshing profile",
        description: "There was a problem loading your profile data. Please try logging out and in again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { currentUser, isLoading, refreshUser, fetchUserProfile };
};
