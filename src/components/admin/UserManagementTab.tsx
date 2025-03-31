
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, UserMinus, Shield } from "lucide-react";
import { User, UserRole } from "@/models/types";
import * as adminService from "@/services/adminService";

interface UserManagementTabProps {
  // No props needed for now
}

const UserManagementTab = ({}: UserManagementTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>(UserRole.MEMBER);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers,
  });

  // Filtered users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  // Mutation for creating admin user
  const createAdminMutation = useMutation({
    mutationFn: adminService.createAdminAccount,
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

  // Mutation for updating user role
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

  // Reset form fields
  const resetForm = () => {
    setNewUserEmail("");
    setNewUserFirstName("");
    setNewUserLastName("");
    setNewUserPassword("");
    setSelectedRole(UserRole.MEMBER);
  };

  // Handle form submission
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

  // Handle role change
  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({
      userId,
      role: newRole as UserRole
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.ORGANIZER}>Organizer</SelectItem>
                    <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
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

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
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
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Select 
                            value={user.role} 
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                            disabled={updateRoleMutation.isPending}
                          >
                            <SelectTrigger className="w-[130px]">
                              <Shield className="h-4 w-4 mr-2" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                              <SelectItem value={UserRole.ORGANIZER}>Organizer</SelectItem>
                              <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
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
