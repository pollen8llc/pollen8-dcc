
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserManagementTable from "./UserManagementTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import { RefreshCw, UserPlus } from "lucide-react";
import AddUserForm from "./AddUserForm";
import UserCommunitiesDialog from "./UserCommunitiesDialog";
import { useUserManagement } from "@/hooks/useUserManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { UserRole } from "@/models/types";

const UserManagementTab = () => {
  const { currentUser } = useUser();
  const { hasPermission } = usePermissions(currentUser);
  
  const {
    users,
    isLoading,
    userStats,
    selectedUser,
    isUserDetailsOpen,
    setIsUserDetailsOpen,
    isAddUserOpen,
    setIsAddUserOpen,
    isCommunityListOpen,
    setIsCommunityListOpen,
    userCommunities,
    loadingCommunities,
    refetch,
    handleUpdateRole,
    handleViewUserDetails,
    handleAddUser,
    handleViewCommunities,
  } = useUserManagement();

  // Use the synchronous checkPermission instead of the asynchronous hasPermission
  const canManageUsers = currentUser?.role === UserRole.ADMIN;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            disabled={isLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsAddUserOpen(true)}
            disabled={!canManageUsers}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All active accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.admins}</div>
            <p className="text-xs text-muted-foreground mt-1">With full system access</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Organizers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats.organizers}</div>
            <p className="text-xs text-muted-foreground mt-1">Community managers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            View and manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable
            users={users}
            isLoading={isLoading}
            onUpdateRole={handleUpdateRole}
            onViewUserDetails={handleViewUserDetails}
            onViewCommunities={handleViewCommunities}
            canManageUsers={canManageUsers}
          />
        </CardContent>
      </Card>

      {/* User details dialog */}
      {selectedUser && (
        <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedUser.name}
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
                      src={selectedUser.imageUrl} 
                      alt={selectedUser.name}
                      className="h-20 w-20 rounded-full" 
                    />
                    <div>
                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                      <p className="text-muted-foreground">{selectedUser.email}</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedUser.role === UserRole.ADMIN 
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                            : selectedUser.role === UserRole.ORGANIZER
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        }`}>
                          {UserRole[selectedUser.role]}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">User ID</h4>
                      <p className="text-sm font-mono break-all">{selectedUser.id}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Joined</h4>
                      <p className="text-sm">{selectedUser.createdAt 
                        ? new Date(selectedUser.createdAt).toLocaleDateString() 
                        : "Unknown"}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="communities" className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCommunityListOpen(true)}
                    className="mb-4"
                  >
                    View All Communities
                  </Button>
                  
                  <h3 className="text-lg font-medium mb-2">Community Memberships</h3>
                  {selectedUser.communities && selectedUser.communities.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedUser.communities.map(communityId => (
                        <li key={communityId} className="p-2 border rounded">
                          <div className="flex justify-between items-center">
                            <span>{communityId}</span>
                            {selectedUser.managedCommunities?.includes(communityId) && (
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
      )}

      {/* Add User Dialog */}
      <AddUserForm
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSubmit={async (values) => {
          await handleAddUser({
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            role: UserRole[values.role as keyof typeof UserRole]
          });
        }}
      />

      {/* User Communities Dialog */}
      <UserCommunitiesDialog
        user={selectedUser}
        communities={userCommunities}
        isLoading={loadingCommunities}
        open={isCommunityListOpen}
        onOpenChange={setIsCommunityListOpen}
      />
    </div>
  );
};

export default UserManagementTab;
