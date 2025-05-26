// Only updating the necessary parts to fix routing paths
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Trash2, Edit } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { getContactGroups, createContactGroup, ContactGroup, deleteContactGroup } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const Groups = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newGroup, setNewGroup] = useState({ name: "", description: "", color: "blue" });
  const [isOpen, setIsOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<ContactGroup | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleCloseDialog = () => {
    setIsOpen(false);
  };
  
  const handleSubmit = async () => {
    if (!newGroup.name) {
      toast({
        title: "Group name required",
        description: "Please enter a name for the group",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createContactGroup({
        name: newGroup.name,
        description: newGroup.description,
        color: newGroup.color,
      });
      
      toast({
        title: "Group created",
        description: "Contact group has been successfully created",
      });
      
      setNewGroup({ name: "", description: "", color: "blue" });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
    } catch (error) {
      toast({
        title: "Error creating group",
        description: "There was a problem creating the contact group",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;
    
    try {
      await deleteContactGroup(groupToDelete.id);
      setGroupToDelete(null);
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["contact-groups"] });
      
      toast({
        title: "Group deleted",
        description: "Contact group has been successfully deleted",
      });
    } catch (error) {
      toast({
        title: "Error deleting group",
        description: "There was a problem deleting the contact group",
        variant: "destructive"
      });
    }
  };
  
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["contact-groups"],
    queryFn: getContactGroups
  });
  
  const getColorClass = (color: string | undefined) => {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'red': 'bg-red-500',
      'yellow': 'bg-yellow-500',
      'purple': 'bg-purple-500',
      'pink': 'bg-pink-500',
      'indigo': 'bg-indigo-500',
      'gray': 'bg-gray-500'
    };
    
    return colorMap[color || 'blue'] || 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Contact Groups</h1>
            <p className="text-muted-foreground">Organize your contacts into groups</p>
          </div>
          
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Group
              </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create New Group</AlertDialogTitle>
                <AlertDialogDescription>
                  Add a new group to organize your contacts.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="Friends, Colleagues, Family, etc."
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="group-description">Description (Optional)</Label>
                  <Input
                    id="group-description"
                    placeholder="A brief description of this group"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="group-color">Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo', 'gray'].map(color => (
                      <div
                        key={color}
                        onClick={() => setNewGroup({ ...newGroup, color })}
                        className={`w-8 h-8 rounded-full cursor-pointer ${getColorClass(color)} ${
                          newGroup.color === color ? 'ring-2 ring-offset-2' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCloseDialog}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Create Group</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Group</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the group "{groupToDelete?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setGroupToDelete(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteGroup}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Groups Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first contact group to start organizing your network
            </p>
            <Button onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <Card key={group.id} className="overflow-hidden">
                <div className={`h-2 ${getColorClass(group.color)}`} />
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between">
                    <span>{group.name}</span>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          // Handle edit - not implementing full edit functionality yet
                          toast({
                            title: "Edit coming soon",
                            description: "Edit functionality will be available in a future update."
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setGroupToDelete(group);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {group.description || "No description provided"}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/rel8t/groups/${group.id}`)}
                  >
                    View Contacts
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Powered by Footer */}
      <footer className="w-full text-center py-4 text-muted-foreground text-sm">
        <p>Powered by POLLEN8 LABS</p>
      </footer>
    </div>
  );
};

export default Groups;
