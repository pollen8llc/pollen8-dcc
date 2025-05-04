
import React from 'react';
import { User } from "@/models/types";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePermissions } from "@/hooks/usePermissions";

interface UserHeaderProps {
  currentUser: User;
}

const UserHeader = ({ currentUser }: UserHeaderProps) => {
  const { getRoleBadge } = usePermissions(currentUser);
  const { text, color } = getRoleBadge();

  const getUserInitials = () => {
    const nameParts = currentUser.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
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
          <Badge className={`${color} text-white`}>
            {text}
          </Badge>
        </div>
      </div>
    </SheetHeader>
  );
};

export default UserHeader;
