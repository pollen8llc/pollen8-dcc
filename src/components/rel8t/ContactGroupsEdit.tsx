
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ContactGroup, updateContactGroup } from "@/services/rel8t/contactService";
import { useQueryClient } from "@tanstack/react-query";

interface ContactGroupsEditProps {
  group: ContactGroup;
  isOpen: boolean;
  onClose: () => void;
}

const ContactGroupsEdit = ({ group, isOpen, onClose }: ContactGroupsEditProps) => {
  const [editingGroup, setEditingGroup] = useState({
    name: group.name,
    description: group.description || "",
    color: group.color || "#6366f1"
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateGroup = async () => {
    if (!editingGroup.name.trim()) {
      toast({
        title: "Error",
        description: "Group name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateContactGroup(group.id, {
        name: editingGroup.name.trim(),
        description: editingGroup.description.trim() || undefined,
        color: editingGroup.color,
      });
      
      // Refresh groups
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
      
      onClose();
      
      toast({
        title: "Success",
        description: `Group "${editingGroup.name}" updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating group:", error);
      toast({
        title: "Error",
        description: "Failed to update contact group.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contact Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="editGroupName">Group Name*</Label>
            <Input
              id="editGroupName"
              value={editingGroup.name}
              onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
              placeholder="Enter group name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editGroupDescription">Description</Label>
            <Input
              id="editGroupDescription"
              value={editingGroup.description}
              onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
              placeholder="Enter group description (optional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="editGroupColor">Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="editGroupColor"
                value={editingGroup.color}
                onChange={(e) => setEditingGroup({ ...editingGroup, color: e.target.value })}
                className="h-9 w-9 cursor-pointer rounded-md border border-input"
              />
              <Input
                value={editingGroup.color}
                onChange={(e) => setEditingGroup({ ...editingGroup, color: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateGroup}
            disabled={isUpdating || !editingGroup.name.trim()}
          >
            {isUpdating ? "Updating..." : "Update Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactGroupsEdit;
