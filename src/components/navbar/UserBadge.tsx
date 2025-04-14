
import { UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/models/types";

interface UserBadgeProps {
  currentUser: User;
  isAdmin: boolean;
}

const UserBadge = ({ currentUser, isAdmin }: UserBadgeProps) => {
  return (
    <Badge variant="outline" className="hidden md:flex items-center gap-1 py-1 px-2 border-primary/30">
      <UserCircle className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs">{currentUser.name}</span>
      {isAdmin && (
        <Badge className="ml-1 bg-blue-500 text-white text-xs">Admin</Badge>
      )}
    </Badge>
  );
};

export default UserBadge;
