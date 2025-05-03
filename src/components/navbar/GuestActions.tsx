
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserCircle } from "lucide-react";

const GuestActions = () => {
  return (
    <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3" asChild>
      <Link to="/auth">
        <UserCircle className="h-4 w-4" />
        <span className="text-sm">Sign In</span>
      </Link>
    </Button>
  );
};

export default GuestActions;
