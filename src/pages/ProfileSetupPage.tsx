
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import ProfileSetupWizard from "@/components/profile/ProfileSetupWizard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProfileSetupPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !currentUser) {
      setAuthError("You need to be logged in to set up your profile.");
    } else {
      setAuthError(null);
    }
  }, [currentUser, isLoading]);

  // Handle manual recovery attempt
  const handleRecoveryAttempt = async () => {
    setIsRecovering(true);
    try {
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        setAuthError("Failed to restore your session. Please try logging in again.");
      } else if (data.session) {
        // Force page reload to initialize everything fresh
        window.location.reload();
      } else {
        setAuthError("Could not restore your session. Please log in again.");
      }
    } catch (err) {
      console.error("Error during recovery:", err);
      setAuthError("An unexpected error occurred. Please try logging in again.");
    } finally {
      setIsRecovering(false);
    }
  };

  // Handle navigation to login
  const handleNavigateToLogin = () => {
    navigate("/auth?redirectTo=/profile/setup");
  };

  // Show loading state while checking auth
  if (isLoading) {
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

  // Show error state if authentication failed
  if (authError) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleRecoveryAttempt} 
                variant="outline"
                disabled={isRecovering}
                className="flex items-center gap-2"
              >
                {isRecovering ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isRecovering ? "Recovering..." : "Try to recover session"}
              </Button>
              
              <Button onClick={handleNavigateToLogin}>
                Go to login page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProfileSetupWizard />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
