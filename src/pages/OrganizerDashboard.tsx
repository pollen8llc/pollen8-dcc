
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import OverviewTab from "@/components/organizer/OverviewTab";
import CommunitiesList from "@/components/organizer/CommunitiesList";
import DirectoryTab from "@/components/organizer/DirectoryTab";
import { useOrganizerDashboard } from "@/hooks/useOrganizerDashboard";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
    managedCommunities,
    isLoading,
    communityToDelete,
    setCommunityToDelete,
    toggleCommunityVisibility,
    handleDeleteCommunity,
    confirmDeleteCommunity,
  } = useOrganizerDashboard();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Community Management</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your communities
            </p>
          </div>
          <Button 
            onClick={() => navigate("/create-community")} 
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Community
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8 glass dark:glass-dark">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communities">My Communities</TabsTrigger>
            <TabsTrigger value="directory">Directory Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              isLoading={isLoading} 
              managedCommunities={managedCommunities} 
            />
          </TabsContent>
          
          <TabsContent value="communities">
            <CommunitiesList 
              isLoading={isLoading}
              managedCommunities={managedCommunities}
              onDeleteCommunity={handleDeleteCommunity}
            />
          </TabsContent>

          <TabsContent value="directory">
            <DirectoryTab 
              isLoading={isLoading}
              managedCommunities={managedCommunities}
              onToggleVisibility={toggleCommunityVisibility}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!communityToDelete} onOpenChange={() => setCommunityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              community and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCommunity} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizerDashboard;
