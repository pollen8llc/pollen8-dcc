
import { UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User, UserRole } from "@/models/types";

interface UserBadgeProps {
  currentUser: User;
  isAdmin: boolean;
}

const UserBadge = ({ currentUser, isAdmin }: UserBadgeProps) => {
  const getBadgeColor = () => {
    // Handle different role types
    if (currentUser.role === UserRole.ADMIN) {
      return "bg-purple-500 hover:bg-purple-600";
    }
    
    // Check if the user is an organizer
    if (currentUser.role === UserRole.ORGANIZER || 
        (currentUser.managedCommunities && currentUser.managedCommunities.length > 0)) {
      return "bg-blue-500 hover:bg-blue-600";
    }
    
    if (currentUser.role === UserRole.MEMBER) {
      return "bg-green-500 hover:bg-green-600";
    }
    
    return "bg-gray-500 hover:bg-gray-600";
  };

  const getBadgeText = () => {
    // Handle different role types
    if (currentUser.role === UserRole.ADMIN) {
      return "Admin";
    }
    
    // Check if the user is an organizer
    if (currentUser.role === UserRole.ORGANIZER || 
        (currentUser.managedCommunities && currentUser.managedCommunities.length > 0)) {
      return "Organizer";
    }
    
    if (currentUser.role === UserRole.MEMBER) {
      return "Member";
    }
    
    return "Guest";
  };

  return (
    <Badge variant="outline" className="hidden md:flex items-center gap-1 py-1 px-2 border-primary/30">
      <UserCircle className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs">{currentUser.name}</span>
      <Badge className={`ml-1 ${getBadgeColor()} text-white text-xs`}>
        {getBadgeText()}
      </Badge>
    </Badge>
  );
};

export default UserBadge;
