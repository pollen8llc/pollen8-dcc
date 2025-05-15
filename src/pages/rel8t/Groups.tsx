
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { 
  getContactGroups, 
  createContactGroup, 
  getContactsInGroup, 
  ContactGroup 
} from "@/services/rel8t/contactService";
import { ChevronLeft, Plus, Users, Trash2, Edit, Circle } from "lucide-react";
import { Rel8TNavigation } from "@/components/rel8t/Rel8TNavigation";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Groups = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [groupToEdit, setGroupToEdit] = useState<ContactGroup | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#6366f1" // Default color
  });

  // Get all groups
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["contact-groups"],
    queryFn: getContactGroups,
  });

  // Create group mutation
  const createMutation = useMutation({
    mutationFn: createContactGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Group created",
        description: "The contact group has been successfully created."
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create group",
        variant: "destructive"
      });
    }
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#6366f1"
    });
  };

  // Handle create group
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Validation error",
        description: "Group name is required",
        variant: "destructive"
      });
      return;
    }
    createMutation.mutate(formData);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // View contacts in group
  const handleViewContacts = (groupId: string) => {
    navigate(`/rel8t/contacts?group=${groupId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate("/rel8t")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>

        <Rel8TNavigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Contact Groups</h1>
            <p className="text-muted-foreground">Organize your contacts into groups</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-2 font-semibold">No contact groups</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first contact group to organize your contacts.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: group.color || '#6366f1' }} 
                      />
                      <CardTitle>{group.name}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setGroupToEdit(group)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive" 
                        onClick={() => setGroupToDelete(group.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {group.description && (
                    <CardDescription className="mt-1">{group.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleViewContacts(group.id)}
                    className="gap-2 w-full"
                  >
                    <Users className="h-4 w-4" />
                    View Contacts
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Contact Group</DialogTitle>
            <DialogDescription>
              Create a new group to organize your contacts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateGroup}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Group name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of this group"
                />
              </div>
              <div className="grid gap-2">
                <Label>Group Color</Label>
                <div className="flex items-center gap-3">
                  <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-12 h-8 p-0 flex items-center justify-center"
                        type="button"
                      >
                        <div 
                          className="w-8 h-5 rounded" 
                          style={{ backgroundColor: formData.color }} 
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                      <HexColorPicker
                        color={formData.color}
                        onChange={(color) => setFormData({ ...formData, color })}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    value={formData.color}
                    onChange={handleInputChange}
                    name="color"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!groupToDelete} onOpenChange={() => setGroupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group
              and remove all contact associations to this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Group Dialog */}
      <Dialog open={!!groupToEdit} onOpenChange={() => setGroupToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Contact Group</DialogTitle>
            <DialogDescription>
              Update the details of this contact group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                placeholder="Group name"
                defaultValue={groupToEdit?.name}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Input
                id="edit-description"
                placeholder="Brief description of this group"
                defaultValue={groupToEdit?.description || ''}
              />
            </div>
            <div className="grid gap-2">
              <Label>Group Color</Label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-6 h-6 rounded border" 
                  style={{ backgroundColor: groupToEdit?.color || '#6366f1' }} 
                />
                <Input
                  defaultValue={groupToEdit?.color || '#6366f1'}
                  className="font-mono"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setGroupToEdit(null)}
            >
              Cancel
            </Button>
            <Button>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
