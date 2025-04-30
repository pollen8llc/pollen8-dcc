
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Shield, Library, User as UserIcon } from "lucide-react";
import { UserRole } from "@/models/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ErrorBoundary from "@/components/ErrorBoundary";

const Profile = () => {
  const { currentUser, refreshUser, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Update form values when user data is loaded
  useEffect(() => {
    if (currentUser) {
      // Set the name from the user object
      setProfileName(currentUser.name || "");
      
      // Set the image URL from the user object
      setProfileImage(currentUser.imageUrl || "");
    }
  }, [currentUser]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser) return "?";
    
    if (currentUser.name) {
      const nameParts = currentUser.name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return nameParts[0][0].toUpperCase();
    }
    
    return "?";
  };

  const getUserRoleBadge = () => {
    if (!currentUser) return null;
    
    switch (currentUser.role) {
      case UserRole.ADMIN:
        return <Badge className="bg-red-500">Admin</Badge>;
      case UserRole.ORGANIZER:
        return <Badge className="bg-blue-500">Organizer</Badge>;
      case UserRole.MEMBER:
        return <Badge className="bg-green-500">Member</Badge>;
      default:
        return null;
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      // This is a placeholder for actual profile update logic
      // In a real implementation, you would call a service method
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      await refreshUser();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Profile not available</CardTitle>
              <CardDescription>Please log in to view your profile</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <a href="/auth">Login</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Determine the email to display
  const displayEmail = currentUser.email;
  
  // Get user name for display
  const displayName = currentUser.name || 'User';

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={currentUser.imageUrl} alt={displayName} />
                        <AvatarFallback className="text-xl">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      {getUserRoleBadge()}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      {isEditing ? (
                        <>
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                              Name
                            </label>
                            <Input
                              id="name"
                              value={profileName}
                              onChange={e => setProfileName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="image" className="text-sm font-medium">
                              Profile Image URL
                            </label>
                            <Input
                              id="image"
                              value={profileImage}
                              onChange={e => setProfileImage(e.target.value)}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{displayName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{displayEmail}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>Your community participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Communities</span>
                      <p className="text-2xl font-bold">{currentUser.communities?.length || 0}</p>
                    </div>
                    <Separator />
                    <div>
                      <span className="text-sm text-muted-foreground">Managing</span>
                      <p className="text-2xl font-bold">{currentUser.managedCommunities?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ErrorBoundary>
      </div>
      
      {/* Help Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Information</DialogTitle>
            <DialogDescription>
              Your profile displays your personal information and community activity.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm">
            You can edit your profile information by clicking the "Edit Profile" button.
            Your role in the community determines what features you have access to.
          </p>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
