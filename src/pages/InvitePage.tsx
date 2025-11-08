
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
import ErrorBoundary from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";

const InvitePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, refreshUser } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch invite details on mount
  useEffect(() => {
    const fetchInvite = async () => {
      if (!code) {
        setIsInvalid(true);
        setError("No invite code provided");
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        console.log("Fetching invite with code/linkId:", code);
        let inviteData: InviteData | null = null;
        
        // First try to look up by code
        inviteData = await getInviteByCode(code);
        
        // If not found, try by link ID
        if (!inviteData) {
          console.log("Invite not found by code, trying link ID");
          inviteData = await getInviteByLinkId(code);
        }
        
        console.log("Invite data:", inviteData);
        
        if (!inviteData) {
          setIsInvalid(true);
          setError("This invite code is invalid or does not exist");
          return;
        }
        
        if (!inviteData.is_active) {
          setIsInvalid(true);
          setError("This invite has been deactivated");
          return;
        }
        
        // Check if expired
        if (inviteData.expires_at && new Date(inviteData.expires_at) < new Date()) {
          setIsInvalid(true);
          setError("This invite has expired");
          return;
        }
        
        // Check if max uses reached
        if (inviteData.max_uses !== null && inviteData.used_count >= inviteData.max_uses) {
          setIsInvalid(true);
          setError("This invite has reached its maximum usage limit");
          return;
        }
        
        setInvite(inviteData);
      } catch (error) {
        console.error("Error fetching invite:", error);
        setIsInvalid(true);
        setError("Error loading invite data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvite();
  }, [code]);

  const acceptInvite = async () => {
    if (!currentUser || !invite || !invite.code) {
      setError("Unable to accept invite. Please try again.");
      return;
    }
    
    setIsAccepting(true);
    setError(null);
    
    try {
      console.log("This invite system is deprecated. Redirecting to new flow...");
      toast({
        title: "Notice",
        description: "This invite link format is no longer supported. Please request a new invite link.",
        variant: "destructive",
      });
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "There was a problem processing the invite",
        variant: "destructive",
      });
      setError("An error occurred");
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

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Current session:", data.session ? "Active" : "None");
    };
    
    checkSession();
  }, []);

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
              <p>{error || "This invite is invalid, expired, or has reached its maximum usage."}</p>
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
      <ErrorBoundary>
        <AuthLayout
          title="You've Been Invited!"
          subtitle="Sign in or create an account to join"
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
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>You've Been Invited!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                You've received an invitation to connect.
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
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-md text-red-600">
                  {error}
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
    </ErrorBoundary>
  );
};

export default InvitePage;
