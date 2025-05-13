
import { useState, useEffect } from "react";
import { 
  getContactGroups, 
  createContactGroup, 
  ContactGroup 
} from "@/services/rel8t/contactService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Folder, FolderPlus, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ContactGroupsManagerProps {
  onSelectGroup?: (groupId: string) => void;
}

const ContactGroupsManager = ({ onSelectGroup }: ContactGroupsManagerProps) => {
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", color: "#6366f1" });
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const fetchedGroups = await getContactGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error("Error loading groups:", error);
      toast({
        title: "Error",
        description: "Failed to load contact groups.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      toast({
        title: "Error",
        description: "Group name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await createContactGroup({
        name: newGroup.name.trim(),
        description: newGroup.description.trim() || undefined,
        color: newGroup.color,
      });
      
      // Refresh groups
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
      await loadGroups();
      
      // Reset form and close dialog
      setNewGroup({ name: "", description: "", color: "#6366f1" });
      setCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Group "${newGroup.name}" created successfully.`,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create contact group.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5" /> Contact Groups
        </h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <FolderPlus className="h-4 w-4" /> New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Contact Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name*</Label>
                <Input
                  id="groupName"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="Enter group name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupDescription">Description</Label>
                <Input
                  id="groupDescription"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Enter group description (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupColor">Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="groupColor"
                    value={newGroup.color}
                    onChange={(e) => setNewGroup({ ...newGroup, color: e.target.value })}
                    className="h-9 w-9 cursor-pointer rounded-md border border-input"
                  />
                  <Input
                    value={newGroup.color}
                    onChange={(e) => setNewGroup({ ...newGroup, color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={isCreating || !newGroup.name.trim()}
              >
                {isCreating ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center border border-dashed rounded-lg p-6">
          <Folder className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-2">No contact groups yet</p>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2"
            onClick={() => setCreateDialogOpen(true)}
          >
            Create your first group
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {groups.map((group) => (
              <div 
                key={group.id}
                className="flex items-center border rounded-md p-3 hover:bg-secondary/20 cursor-pointer transition-colors"
                onClick={() => onSelectGroup && onSelectGroup(group.id)}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: group.color || '#6366f1' }} 
                  />
                  <div>
                    <div className="font-medium">{group.name}</div>
                    {group.description && (
                      <div className="text-xs text-muted-foreground">{group.description}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ContactGroupsManager;
