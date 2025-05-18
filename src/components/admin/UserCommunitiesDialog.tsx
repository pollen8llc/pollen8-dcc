
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/models/types";
import { AlertTriangle } from "lucide-react";

interface UserCommunitiesDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Added these props to match the usage in UserManagementTab
  communities?: any[];
  isLoading?: boolean;
}

// This is a stub component to maintain compatibility
// Community functionality has been removed
const UserCommunitiesDialog: React.FC<UserCommunitiesDialogProps> = ({
  user,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Communities</DialogTitle>
          <DialogDescription>
            Communities the user {user?.name} belongs to
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="mb-2">Community functionality has been deprecated</p>
          <p className="text-sm text-muted-foreground mb-4">
            Community features have been removed from the platform
          </p>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserCommunitiesDialog;
