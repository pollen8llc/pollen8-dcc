
import React from "react";
import { User, UserRole } from "@/models/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface UserDetailsDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onViewCommunities: () => void;
}

const UserDetailsDialog = ({
  user,
  isOpen,
  onOpenChange,
  onViewCommunities,
}: UserDetailsDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about {user.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="details">
            <TabsList className="w-full">
              <TabsTrigger value="details">User Details</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={user.imageUrl} 
                  alt={user.name}
                  className="h-20 w-20 rounded-full" 
                />
                <div>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === UserRole.ADMIN 
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : user.role === UserRole.ORGANIZER
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    }`}>
                      {UserRole[user.role]}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
                  <p className="text-sm font-mono break-all">{user.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                  <p className="text-sm">
                    {user.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="communities" className="pt-4">
              <Button 
                variant="outline" 
                onClick={onViewCommunities}
                className="mb-4"
              >
                View All Communities
              </Button>
              
              <h3 className="text-lg font-medium mb-2">Community Memberships</h3>
              {user.communities && user.communities.length > 0 ? (
                <ul className="space-y-2">
                  {user.communities.map(communityId => (
                    <li key={communityId} className="p-2 border rounded">
                      <div className="flex justify-between items-center">
                        <span>{communityId}</span>
                        {user.managedCommunities?.includes(communityId) && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">
                            Organizer
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">User is not a member of any communities.</p>
              )}
            </TabsContent>
            
            <TabsContent value="activity" className="pt-4">
              <p className="text-muted-foreground">User activity history will be available in a future update.</p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
