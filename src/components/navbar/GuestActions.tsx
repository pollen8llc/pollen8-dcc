
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const GuestActions = () => {
  return (
    <Button variant="default" className="flex items-center gap-2" asChild>
      <Link to="/auth">
        <UserCircle className="h-4 w-4" />
        <span>Login</span>
      </Link>
    </Button>
  );
};

export default GuestActions;
