
import { UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/models/types";
import { usePermissions } from "@/hooks/usePermissions";

interface UserBadgeProps {
  currentUser: User;
}

const UserBadge = ({ currentUser }: UserBadgeProps) => {
  const { getRoleBadge } = usePermissions(currentUser);
  const { text, color } = getRoleBadge();

  return (
    <Badge variant="outline" className="hidden md:flex items-center gap-1 py-1 px-2 border-primary/30">
      <UserCircle className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs">{currentUser.name}</span>
      <Badge className={`ml-1 ${color} text-white text-xs`}>
        {text}
      </Badge>
    </Badge>
  );
};

export default UserBadge;
