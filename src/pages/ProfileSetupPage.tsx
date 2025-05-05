
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import UnifiedProfileForm from "@/components/profile/UnifiedProfileForm";

const ProfileSetupPage: React.FC = () => {
  const { currentUser, isLoading, recoverUserSession } = useUser();
  const navigate = useNavigate();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isRecovering, setIsRecovering] = React.useState(false);

  // Check if user is authenticated
  React.useEffect(() => {
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
      const recovered = await recoverUserSession();
      
      if (!recovered) {
        setAuthError("Failed to restore your session. Please try logging in again.");
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
          <UnifiedProfileForm mode="setup" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
