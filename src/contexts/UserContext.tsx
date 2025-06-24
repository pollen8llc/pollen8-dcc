
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as AuthUser } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_complete: boolean;
  imageUrl?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  communities?: string[];
  managedCommunities?: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

interface UserContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (user: AuthUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      // Get user roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:role_id (
            name
          )
        `)
        .eq('user_id', user.id);

      let role = 'USER';
      let managedCommunities: string[] = [];

      if (userRoles && userRoles.length > 0) {
        const hasAdminRole = userRoles.some(r => r.roles && r.roles.name === 'ADMIN');
        if (hasAdminRole) {
          role = 'ADMIN';
        } else {
          const hasServiceProviderRole = userRoles.some(r => 
            r.roles && r.roles.name === 'SERVICE_PROVIDER'
          );
          if (hasServiceProviderRole) {
            role = 'SERVICE_PROVIDER';
          } else {
            const hasOrganizerRole = userRoles.some(r => r.roles && r.roles.name === 'ORGANIZER');
            if (hasOrganizerRole) {
              role = 'ORGANIZER';
            }
          }
        }
      }

      // Get managed communities if user is an organizer or admin
      if (role === 'ORGANIZER' || role === 'ADMIN') {
        try {
          const { data: ownedCommunities } = await supabase
            .rpc('get_user_owned_communities', { user_id: user.id });
          managedCommunities = ownedCommunities?.map(m => m.community_id) || [];
        } catch (err) {
          console.error('Error fetching managed communities:', err);
        }
      }

      return {
        id: user.id,
        name: profile?.first_name && profile?.last_name 
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : profile?.email || user.email || '',
        email: profile?.email || user.email || '',
        role: role,
        profile_complete: profile?.profile_complete || false,
        imageUrl: profile?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        bio: profile?.bio || '',
        location: profile?.location || '',
        interests: profile?.interests || [],
        communities: managedCommunities,
        managedCommunities: managedCommunities,
        createdAt: profile?.created_at || new Date().toISOString(),
        lastLoginAt: user.last_sign_in_at || undefined
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const userProfile = await fetchUserProfile(user);
        setCurrentUser(userProfile);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setCurrentUser(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        refreshUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
