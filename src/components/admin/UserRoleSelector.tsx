
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/models/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserRoleSelectorProps {
  userId: string;
  currentRole: UserRole;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
}

const UserRoleSelector = ({ userId, currentRole, onUpdateRole }: UserRoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = (value: string) => {
    const newRole = UserRole[value as keyof typeof UserRole];
    setSelectedRole(newRole);
    
    // Only show confirmation if role is actually changing
    if (newRole !== currentRole) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmChange = async () => {
    setIsUpdating(true);
    try {
      await onUpdateRole(userId, selectedRole);
      toast({
        title: "Role updated",
        description: `User role has been updated to ${UserRole[selectedRole]}`,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        description: "There was a problem updating the user role",
        variant: "destructive",
      });
      // Reset to current role on error
      setSelectedRole(currentRole);
    } finally {
      setIsUpdating(false);
      setShowConfirmation(false);
    }
  };

  const handleCancelChange = () => {
    setSelectedRole(currentRole);
    setShowConfirmation(false);
  };

  return (
    <>
      <Select
        value={UserRole[selectedRole].toString()}
        onValueChange={handleRoleChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ADMIN">Administrator</SelectItem>
          <SelectItem value="ORGANIZER">Organizer</SelectItem>
          <SelectItem value="MEMBER">Member</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user's role from {UserRole[currentRole]} to {UserRole[selectedRole]}?
              {selectedRole === UserRole.ADMIN && (
                <p className="mt-2 text-amber-500 font-semibold">
                  Warning: Assigning ADMIN role grants complete access to all system functions!
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmChange}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Change"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserRoleSelector;
