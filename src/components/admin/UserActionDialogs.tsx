
import React from "react";
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
import { User } from "@/models/types";
import { Loader2 } from "lucide-react";

interface UserActionDialogsProps {
  userToDeactivate: User | null;
  userToResetPassword: User | null;
  onDeactivateConfirm: () => void;
  onResetPasswordConfirm: () => void;
  setUserToDeactivate: React.Dispatch<React.SetStateAction<User | null>>;
  setUserToResetPassword: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading?: boolean;
}

const UserActionDialogs = ({
  userToDeactivate,
  userToResetPassword,
  onDeactivateConfirm,
  onResetPasswordConfirm,
  setUserToDeactivate,
  setUserToResetPassword,
  isLoading = false,
}: UserActionDialogsProps) => {
  return (
    <>
      {/* Deactivate User Dialog */}
      <AlertDialog
        open={!!userToDeactivate}
        onOpenChange={(open) => !open && setUserToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {userToDeactivate?.name}'s account? 
              This will prevent them from logging in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDeactivateConfirm();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deactivating...
                </>
              ) : (
                "Deactivate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <AlertDialog
        open={!!userToResetPassword}
        onOpenChange={(open) => !open && setUserToResetPassword(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Password</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a password reset link to {userToResetPassword?.email}.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onResetPasswordConfirm();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActionDialogs;
