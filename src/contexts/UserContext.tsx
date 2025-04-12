
import React, { createContext, useContext } from "react";
import { User } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setMockUser?: () => void; // Add this function to allow manual mock user setting
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading, logout, refreshUser, setMockUser } = useAuth();
  const { hasPermission, isOrganizer } = usePermissions(currentUser);
  const { toast } = useToast();

  // Wrap logout to add toast notifications
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isLoading, 
      hasPermission, 
      isOrganizer,
      logout: handleLogout,
      refreshUser,
      setMockUser // Add this to the provider
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
