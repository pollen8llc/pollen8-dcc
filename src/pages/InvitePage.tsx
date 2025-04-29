
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getInviteByCode, getInviteByLinkId, recordInviteUse, InviteData } from "@/services/inviteService";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import AuthLayout from "@/components/auth/AuthLayout";

const InvitePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const { currentUser } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch invite details on mount
  useEffect(() => {
    const fetchInvite = async () => {
      if (!code) {
        setIsInvalid(true);
        setIsLoading(false);
        return;
      }

      try {
        let inviteData: InviteData | null = null;
        
        // First try to look up by code
        inviteData = await getInviteByCode(code);
        
        // If not found, try by link ID
        if (!inviteData) {
          inviteData = await getInviteByLinkId(code);
        }
        
        if (!inviteData || !inviteData.is_active) {
          setIsInvalid(true);
          return;
        }
        
        // Check if expired
        if (inviteData.expires_at && new Date(inviteData.expires_at) < new Date()) {
          setIsInvalid(true);
          return;
        }
        
        // Check if max uses reached
        if (inviteData.max_uses !== null && inviteData.used_count >= inviteData.max_uses) {
          setIsInvalid(true);
          return;
        }
        
        setInvite(inviteData);
      } catch (error) {
        console.error("Error fetching invite:", error);
        setIsInvalid(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvite();
  }, [code]);

  const acceptInvite = async () => {
    if (!currentUser || !invite) return;
    
    setIsAccepting(true);
    
    try {
      const inviteId = await recordInviteUse(invite.code, currentUser.id);
      
      if (inviteId) {
        toast({
          title: "Success",
          description: "You've successfully accepted the invite!",
        });
        
        // If the invite is for a specific community, navigate there
        if (invite.community_id) {
          navigate(`/community/${invite.community_id}`);
        } else {
          navigate("/");
        }
      } else {
        toast({
          title: "Error",
          description: "There was a problem accepting the invite",
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
      setIsAccepting(false);
    }
  };

  const handleSignIn = () => {
    // Store invite code in session storage to use after login
    if (code) {
      sessionStorage.setItem("pendingInviteCode", code);
    }
    navigate(`/auth?redirectTo=/invite/${code}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (isInvalid) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Invalid Invite</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This invite is invalid, expired, or has reached its maximum usage.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // User is not logged in, show sign-in prompt
    return (
      <AuthLayout
        title="You've Been Invited!"
        subtitle="Sign in or create an account to join the community"
      >
        <Card>
          <CardHeader>
            <CardTitle>Join via Invite</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to sign in or create an account to accept this invitation.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSignIn}>Sign In / Sign Up</Button>
          </CardFooter>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>You've Been Invited!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You've received an invitation to connect
              {invite?.community_id ? " and join a community" : ""}.
            </p>

            {invite && (
              <div className="space-y-2 text-sm">
                {invite.expires_at && (
                  <p>
                    <span className="font-medium">Valid until:</span>{" "}
                    {format(new Date(invite.expires_at), "PPP")}
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link to="/">Ignore</Link>
              </Button>
              <Button onClick={acceptInvite} disabled={isAccepting}>
                {isAccepting ? "Accepting..." : "Accept Invitation"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InvitePage;
