
import { User } from "@/models/types";
import { UserRole } from "@/models/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserMenuDropdownProps {
  currentUser: User;
  isAdmin: boolean;
}

const UserMenuDropdown = ({ currentUser, isAdmin }: UserMenuDropdownProps) => {
  const getUserInitials = () => {
    if (!currentUser) return "?";
    
    const nameParts = currentUser.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
      <Avatar className="h-8 w-8 ring-1 ring-primary/20">
        <AvatarImage src={currentUser.imageUrl} alt={currentUser.name} />
        <AvatarFallback>{getUserInitials()}</AvatarFallback>
      </Avatar>
    </Button>
  );
};

export default UserMenuDropdown;
