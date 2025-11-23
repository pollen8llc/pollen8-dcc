
import { User } from "@/models/types";
import { UserRole } from "@/models/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UserMenuDropdownProps {
  currentUser: User;
  isAdmin: boolean;
}

const UserMenuDropdown = ({ currentUser, isAdmin }: UserMenuDropdownProps) => {
  const navigate = useNavigate();
  

  const handleAvatarClick = () => {
    navigate("/rel8/notifications");
  };

  return (
    <Button 
      variant="ghost" 
      className="relative h-8 w-8 rounded-full"
      onClick={handleAvatarClick}
    >
      <Avatar 
        userId={currentUser.id} 
        size={32}
        className="ring-1 ring-primary/20"
        isAdmin={isAdmin}
      />
    </Button>
  );
};

export default UserMenuDropdown;
