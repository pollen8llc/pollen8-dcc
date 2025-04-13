
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Users, Shield, Globe } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/models/types";
import { useUser } from "@/contexts/UserContext";

const OnboardingSelector = () => {
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(UserRole.MEMBER);
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();

  const handleContinue = async () => {
    // In a real application, you would update the user's role in the database here
    // For now, we'll just navigate to the appropriate dashboard
    switch (selectedRole) {
      case UserRole.ORGANIZER:
        navigate("/create-community");
        break;
      case UserRole.MEMBER:
        navigate("/communities/join");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>How would you like to use ECO8?</CardTitle>
        <CardDescription>
          Choose your primary role in the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedRole} 
          onValueChange={(value) => setSelectedRole(value as UserRole)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 border p-4 rounded-md hover:bg-accent/50 cursor-pointer">
            <RadioGroupItem value={UserRole.MEMBER} id="member" />
            <Label htmlFor="member" className="flex items-center gap-2 cursor-pointer">
              <UserCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Community Member</p>
                <p className="text-xs text-muted-foreground">
                  Join existing communities and interact with content
                </p>
              </div>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 border p-4 rounded-md hover:bg-accent/50 cursor-pointer">
            <RadioGroupItem value={UserRole.ORGANIZER} id="organizer" />
            <Label htmlFor="organizer" className="flex items-center gap-2 cursor-pointer">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Community Organizer</p>
                <p className="text-xs text-muted-foreground">
                  Create and manage your own communities
                </p>
              </div>
            </Label>
          </div>
          
          {currentUser?.role === UserRole.ADMIN && (
            <div className="flex items-center space-x-3 border p-4 rounded-md hover:bg-accent/50 cursor-pointer">
              <RadioGroupItem value={UserRole.ADMIN} id="admin" />
              <Label htmlFor="admin" className="flex items-center gap-2 cursor-pointer">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Platform Admin</p>
                  <p className="text-xs text-muted-foreground">
                    Manage all aspects of the platform
                  </p>
                </div>
              </Label>
            </div>
          )}
          
          <div className="flex items-center space-x-3 border p-4 rounded-md hover:bg-accent/50 cursor-pointer">
            <RadioGroupItem value={UserRole.GUEST} id="guest" />
            <Label htmlFor="guest" className="flex items-center gap-2 cursor-pointer">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Just Browsing</p>
                <p className="text-xs text-muted-foreground">
                  Explore public communities without joining
                </p>
              </div>
            </Label>
          </div>
        </RadioGroup>
        
        <Button 
          onClick={handleContinue} 
          className="w-full mt-6"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnboardingSelector;
