
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'organizer' | 'service_provider' | 'member';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name: string; // Computed property
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  location?: string;
  interests?: string[];
  imageUrl?: string;
  communities?: string[];
  managedCommunities?: string[];
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
          
          setCurrentUser({
            id: profile.id,
            email: profile.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            name: fullName,
            avatar_url: profile.avatar_url,
            role: (profile.role || 'member') as UserRole,
            bio: profile.bio,
            location: profile.location,
            interests: profile.interests || [],
            imageUrl: profile.avatar_url,
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
