
import { useState } from "react";
import { User, UserRole } from "@/models/types";

// Admin user ID
const ADMIN_USER_ID = "38a18dd6-4742-419b-b2c1-70dec5c51729";

export const useMockUsers = (setCurrentUser: (user: User | null) => void) => {
  
  // Create the mock user function for development purposes
  const setMockUser = () => {
    console.log("Setting mock user");
    setCurrentUser({
      id: "25",
      name: "Jane Smith",
      role: UserRole.ORGANIZER,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
      email: "jane@example.com",
      bio: "Community organizer and advocate for sustainable practices.",
      communities: ["7"],
      managedCommunities: ["7"]
    });
  };
  
  // Set specific admin user for testing
  const setAdminUser = () => {
    console.log("Setting admin user");
    setCurrentUser({
      id: ADMIN_USER_ID,
      name: "Admin User",
      role: UserRole.ADMIN,
      imageUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      email: "admin@example.com",
      bio: "System administrator",
      communities: [],
      managedCommunities: []
    });
    localStorage.setItem('shouldRedirectToAdmin', 'true');
  };

  return { setMockUser, setAdminUser };
};
