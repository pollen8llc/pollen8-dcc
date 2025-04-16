
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface UserRoleSelectorProps {
  userId: string;
  currentRole: UserRole;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
}

interface RoleOption {
  id: string;
  name: string;
  description: string | null;
}

const UserRoleSelector = ({ userId, currentRole, onUpdateRole }: UserRoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<RoleOption[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const { toast } = useToast();

  // Fetch available roles from the database
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const { data, error } = await supabase
          .from('roles')
          .select('id, name, description')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        setAvailableRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast({
          title: "Could not load roles",
          description: "There was a problem loading available roles",
          variant: "destructive",
        });
      } finally {
        setIsLoadingRoles(false);
      }
    };
    
    fetchRoles();
  }, [toast]);

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
        disabled={isUpdating || isLoadingRoles}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={isLoadingRoles ? "Loading..." : "Select role"} />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map(role => (
            <SelectItem 
              key={role.id} 
              value={role.name}
              title={role.description || undefined}
            >
              {role.name}
            </SelectItem>
          ))}
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
