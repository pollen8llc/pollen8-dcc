
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";

interface RoleChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRole: UserRole;
}

const RoleChangeDialog = ({ open, onOpenChange, currentRole }: RoleChangeDialogProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(UserRole[currentRole]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { refreshUser } = useUser();

  const allowedRoles = [
    { value: "MEMBER", label: "Member", description: "Basic community member" },
    { value: "ORGANIZER", label: "Organizer", description: "Community organizer with additional privileges" },
    { value: "SERVICE_PROVIDER", label: "Service Provider", description: "Service provider offering specialized services" },
  ];

  const handleRoleUpdate = async () => {
    if (selectedRole === UserRole[currentRole]) {
      onOpenChange(false);
      return;
    }

    setIsUpdating(true);
    try {
      const { data, error } = await supabase.rpc('update_user_role_self' as any, {
        p_role_name: selectedRole
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Role updated successfully",
          description: `Your role has been changed to ${selectedRole}`,
        });
        
        // Refresh user data to reflect the change
        await refreshUser();
        onOpenChange(false);
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        description: error.message || "There was a problem updating your role",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Your Role</DialogTitle>
          <DialogDescription>
            Select your role in the community. This affects your permissions and available features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {allowedRoles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div>
                    <div className="font-medium">{role.label}</div>
                    <div className="text-xs text-muted-foreground">{role.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRoleUpdate} 
            disabled={isUpdating || selectedRole === UserRole[currentRole]}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleChangeDialog;
