
import React from 'react';
import { User, UserRole } from "@/models/types";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserHeaderProps {
  currentUser: User;
}

const UserHeader = ({ currentUser }: UserHeaderProps) => {
  const getUserInitials = () => {
    const nameParts = currentUser.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const getBadgeColor = () => {
    if (currentUser.role === UserRole.ADMIN) {
      return "bg-purple-500";
    }
    
    // Check if the user is an organizer either by role or by managing communities
    if (currentUser.role === UserRole.ORGANIZER || 
        (currentUser.managedCommunities && currentUser.managedCommunities.length > 0)) {
      return "bg-blue-500";
    }
    
    if (currentUser.role === UserRole.MEMBER) {
      return "bg-green-500";
    }
    
    return "bg-gray-500";
  };

  const getBadgeText = () => {
    if (currentUser.role === UserRole.ADMIN) {
      return "Admin";
    }
    
    // Check if the user is an organizer either by role or by managing communities
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
    <SheetHeader className="text-left mb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-1 ring-primary/20">
          <AvatarImage src={currentUser.imageUrl} alt={currentUser.name} />
          <AvatarFallback>{getUserInitials()}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <SheetTitle className="text-lg">{currentUser.name}</SheetTitle>
          <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          <Badge className={`${getBadgeColor()} text-white`}>
            {getBadgeText()}
          </Badge>
        </div>
      </div>
    </SheetHeader>
  );
};

export default UserHeader;
