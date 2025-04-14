
import React, { createContext, useContext, useEffect } from "react";
import { User, UserRole } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading, logout: authLogout, refreshUser } = useAuth();
  const { hasPermission, isOrganizer } = usePermissions(currentUser);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UserContext rendering, current user:", currentUser?.name, "role:", currentUser?.role);
  }, [currentUser]);

  // Wrap logout to add toast notifications
  const handleLogout = async (): Promise<void> => {
    try {
      // Clear any React Query caches
      queryClient.clear();
      
      await authLogout();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      // Redirect to home page after logout
      navigate("/auth");
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
      refreshUser
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
