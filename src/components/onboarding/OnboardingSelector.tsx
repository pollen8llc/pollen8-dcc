
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { recordInviteUse } from "@/services/inviteService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog, Users, User } from "lucide-react";

const OnboardingSelector = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState("");
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check for pending invite code from session storage (if user came from invite link)
    const storedCode = sessionStorage.getItem("pendingInviteCode");
    if (storedCode) {
      setPendingCode(storedCode);
      setInviteCode(storedCode);
      sessionStorage.removeItem("pendingInviteCode");
    }
  }, []);

  const handleRoleSelected = async (role: UserRole) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to continue",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (role === UserRole.ORGANIZER) {
      navigate("/create-community");
    } else if (role === UserRole.MEMBER) {
      // If there's an invite code, process it first
      if (inviteCode) {
        setIsSubmitting(true);
        try {
          const inviteId = await recordInviteUse(inviteCode, currentUser.id);
          
          if (inviteId) {
            toast({
              title: "Success",
              description: "Invite accepted successfully!",
            });
            
            // Refresh user data after connection is created
            await refreshUser();
            
            navigate("/communities/join");
          } else {
            toast({
              title: "Error",
              description: "Invalid or expired invite code",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error accepting invite:", error);
          toast({
            title: "Error",
            description: "There was a problem accepting the invite",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      } else {
        // No invite code, just continue to joining communities
        navigate("/communities/join");
      }
    } else {
      // For service provider or other roles, go to main page
      navigate("/");
    }
  };

  return (
    <div className="space-y-6">
      {pendingCode && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">You've Been Invited!</CardTitle>
            <CardDescription>
              You have an invite code ready to be used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Someone has invited you to join their network. Select "Join Communities" 
              below to accept this invitation and connect with them.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Create & Manage
            </CardTitle>
            <CardDescription>
              Create and manage your own communities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              As an organizer, you can create new communities, manage members,
              and connect people across the ecosystem.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleRoleSelected(UserRole.ORGANIZER)}
              className="w-full"
            >
              Become an Organizer
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-200">
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
            Recommended
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Join Communities
            </CardTitle>
            <CardDescription>
              Join existing communities and connect with others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Join communities that match your interests and connect with other
              members in the ecosystem.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="invite-code">Invite Code (Optional)</Label>
              <Input
                id="invite-code"
                placeholder="Enter invite code if you have one"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleRoleSelected(UserRole.MEMBER)}
              className="w-full"
              variant="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Join Communities"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Service Provider
            </CardTitle>
            <CardDescription>
              Provide services to the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Offer your services to community members and access specialized
              features for service providers.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleRoleSelected(UserRole.SERVICE_PROVIDER)}
              className="w-full"
              variant="outline"
            >
              Become Service Provider
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingSelector;
