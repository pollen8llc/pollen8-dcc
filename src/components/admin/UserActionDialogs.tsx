
import React from "react";
import { User } from "@/models/types";
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

interface UserActionDialogsProps {
  userToDeactivate: User | null;
  userToResetPassword: User | null;
  onDeactivateConfirm: () => void;
  onResetPasswordConfirm: () => void;
  setUserToDeactivate: (user: User | null) => void;
  setUserToResetPassword: (user: User | null) => void;
}

const UserActionDialogs = ({
  userToDeactivate,
  userToResetPassword,
  onDeactivateConfirm,
  onResetPasswordConfirm,
  setUserToDeactivate,
  setUserToResetPassword
}: UserActionDialogsProps) => {
  return (
    <>
      <AlertDialog
        open={!!userToDeactivate}
        onOpenChange={(open) => !open && setUserToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate {userToDeactivate?.name}'s account? They will no longer be able to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeactivateConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!userToResetPassword}
        onOpenChange={(open) => !open && setUserToResetPassword(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Password</AlertDialogTitle>
            <AlertDialogDescription>
              Send a password reset email to {userToResetPassword?.email}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onResetPasswordConfirm}>
              Send Reset Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActionDialogs;
