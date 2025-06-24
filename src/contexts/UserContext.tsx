
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/models/types';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name: string; // Computed property
  avatar_url?: string;
  role: UserRole;
  bio: string; // Make required to match User type
  location?: string;
  interests?: string[];
  imageUrl: string; // Make this required to match User type
  communities: string[]; // Make required to match User type
  managedCommunities: string[]; // Make required to match User type
  profile_complete?: boolean;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email;
          
          // Get user role from user_roles table
          let userRole = UserRole.MEMBER; // Default role
          
          try {
            const { data: userRoles } = await supabase
              .from('user_roles')
              .select(`
                role_id,
                roles:role_id (
                  name
                )
              `)
              .eq('user_id', user.id);

            if (userRoles && userRoles.length > 0) {
              // Check for admin role first
              const hasAdminRole = userRoles.some(r => r.roles && r.roles.name === 'ADMIN');
              if (hasAdminRole) {
                userRole = UserRole.ADMIN;
              } else {
                // Check for service provider role
                const hasServiceProviderRole = userRoles.some(r => 
                  r.roles && r.roles.name === 'SERVICE_PROVIDER'
                );
                if (hasServiceProviderRole) {
                  userRole = UserRole.SERVICE_PROVIDER;
                } else {
                  // Check for organizer role
                  const hasOrganizerRole = userRoles.some(r => r.roles && r.roles.name === 'ORGANIZER');
                  if (hasOrganizerRole) {
                    userRole = UserRole.ORGANIZER;
                  }
                }
              }
            }
          } catch (roleErr) {
            console.error("Error fetching user roles:", roleErr);
          }
          
          const defaultImageUrl = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
          
          setCurrentUser({
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            name: fullName,
            avatar_url: profile.avatar_url,
            role: userRole,
            bio: profile.bio || '', // Ensure bio is always a string
            location: profile.location,
            interests: profile.interests || [],
            imageUrl: profile.avatar_url || defaultImageUrl,
            communities: [],
            managedCommunities: [],
            profile_complete: profile.profile_complete,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          });
        }
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
