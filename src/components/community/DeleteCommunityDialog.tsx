
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { deleteCommunity } from "@/services/community/communityMutationService";

interface DeleteCommunityDialogProps {
  communityId: string;
  communityName: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteCommunityDialog({
  communityId,
  communityName,
  isOpen,
  setIsOpen,
  onDeleted,
}: DeleteCommunityDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCommunity(communityId);
      
      toast({
        title: "Community deleted",
        description: `${communityName} has been successfully deleted.`,
      });
      
      setIsOpen(false);
      onDeleted();
    } catch (error: any) {
      console.error("Error deleting community:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete community",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Community
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-medium">{communityName}</span>? 
            This action cannot be undone and all associated data will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Community"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
