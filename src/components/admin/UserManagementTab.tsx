import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, UserMinus, Shield, RefreshCw } from "lucide-react";
import { User, UserRole } from "@/models/types";
import * as adminService from "@/services/adminService";

interface CreateAdminParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const UserManagementTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.MEMBER);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers,
  });

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (typeof user.role === 'string' 
        ? user.role.toLowerCase().includes(searchLower)
        : UserRole[user.role]?.toLowerCase().includes(searchLower) || '')
    );
  });

  const createAdminMutation = useMutation({
    mutationFn: (params: CreateAdminParams) => adminService.createAdminAccount(
      params.email,
      params.password,
      params.firstName,
      params.lastName
    ),
    onSuccess: (result) => {
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      
      if (result.success) {
        setIsAddUserDialogOpen(false);
        resetForm();
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create user: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: adminService.updateUserRole,
    onSuccess: (result) => {
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
      
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update role: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setNewUserEmail("");
    setNewUserFirstName("");
    setNewUserLastName("");
    setNewUserPassword("");
    setSelectedRole(UserRole.MEMBER);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === UserRole.ADMIN) {
      createAdminMutation.mutate({
        email: newUserEmail,
        password: newUserPassword,
        firstName: newUserFirstName,
        lastName: newUserLastName
      });
    } else {
      toast({
        title: "Not implemented",
        description: "Creating regular users is not implemented yet.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = (userId: string, newRoleValue: string) => {
    const newRole = Number(newRoleValue) as UserRole;
    
    updateRoleMutation.mutate({
      userId,
      role: newRole
    });
  };

  const getRoleDisplay = (role: UserRole | string) => {
    if (typeof role === 'string') {
      return role;
    }
    return UserRole[role] || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Role Management</CardTitle>
          <CardDescription>
            Manage user accounts and assign different roles. Admins have full system access, Organizers can manage communities, and Members have basic access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()} title="Refresh user list">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user and assign them a role in the system.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="firstName">First Name</label>
                        <Input
                          id="firstName"
                          value={newUserFirstName}
                          onChange={(e) => setNewUserFirstName(e.target.value)}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="lastName">Last Name</label>
                        <Input
                          id="lastName"
                          value={newUserLastName}
                          onChange={(e) => setNewUserLastName(e.target.value)}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="email">Email</label>
                      <Input
                        id="email"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="password">Password</label>
                      <Input
                        id="password"
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="******"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="role">Role</label>
                      <Select
                        value={selectedRole.toString()}
                        onValueChange={(value) => setSelectedRole(Number(value) as UserRole)}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN.toString()}>Admin</SelectItem>
                          <SelectItem value={UserRole.ORGANIZER.toString()}>Organizer</SelectItem>
                          <SelectItem value={UserRole.MEMBER.toString()}>Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={() => setIsAddUserDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createAdminMutation.isPending}
                      >
                        {createAdminMutation.isPending ? "Creating..." : "Create User"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="border rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium mb-2">Role Descriptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-md">
                <Badge className="bg-blue-500 mb-1">Admin</Badge>
                <p className="text-xs text-muted-foreground">Full system access, can manage all users and communities</p>
              </div>
              <div className="p-3 bg-aquamarine/10 rounded-md">
                <Badge className="bg-aquamarine mb-1">Organizer</Badge>
                <p className="text-xs text-muted-foreground">Can create and manage specific communities</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-md">
                <Badge className="bg-muted mb-1">Member</Badge>
                <p className="text-xs text-muted-foreground">Basic access to join communities and participate</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading users: {(error as Error).message}
            </div>
          ) : (
            <Table>
              <TableCaption>List of all users in the system</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-full overflow-hidden">
                            <img
                              src={user.imageUrl || "/placeholder.svg"}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>{user.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.role === UserRole.ADMIN
                              ? "bg-blue-500"
                              : user.role === UserRole.ORGANIZER
                              ? "bg-aquamarine"
                              : "bg-muted"
                          }
                        >
                          {getRoleDisplay(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Select 
                            value={typeof user.role === 'number' ? user.role.toString() : '2'} 
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                            disabled={updateRoleMutation.isPending}
                          >
                            <SelectTrigger className="w-[130px]">
                              <Shield className="h-4 w-4 mr-2" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UserRole.ADMIN.toString()}>Admin</SelectItem>
                              <SelectItem value={UserRole.ORGANIZER.toString()}>Organizer</SelectItem>
                              <SelectItem value={UserRole.MEMBER.toString()}>Member</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon">
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
