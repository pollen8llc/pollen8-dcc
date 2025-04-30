
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import InviteGenerator from "@/components/invites/InviteGenerator";
import InviteList from "@/components/invites/InviteList";
import { UserRole } from "@/models/types";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InvitesManagementPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  const [authChecked, setAuthChecked] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Set auth checked after we've determined if user is logged in or not
    if (!isLoading) {
      setAuthChecked(true);
      console.log("Auth check completed, user:", currentUser?.name || "not logged in");
    }
  }, [isLoading, currentUser]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
    toast({
      title: "Refreshing invites",
      description: "Your invites list is being reloaded..."
    });
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
              <p className="mt-4 text-lg">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if user is not authenticated
  if (authChecked && !currentUser) {
    console.log("User not authenticated, redirecting to auth");
    return <Navigate to="/auth?redirectTo=/organizer/invites" replace />;
  }

  // Ensure we've checked auth status and user is loaded before checking roles
  if (authChecked && currentUser) {
    const isOrganizer = currentUser.role === UserRole.ORGANIZER || 
                       currentUser.role === UserRole.ADMIN ||
                       (currentUser.managedCommunities && currentUser.managedCommunities.length > 0);

    console.log("Checking organizer status:", {
      role: currentUser.role,
      isAdmin: currentUser.role === UserRole.ADMIN,
      isOrganizer: currentUser.role === UserRole.ORGANIZER,
      managedCommunities: currentUser.managedCommunities,
      hasAccessToPage: isOrganizer
    });

    if (!isOrganizer) {
      console.log("User is not an organizer, redirecting to home");
      return <Navigate to="/" replace />;
    }

    return (
      <ErrorBoundary>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Invites</h1>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={refreshData} className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                  <InviteGenerator />
                </div>
              </div>
              
              <InviteList key={refreshTrigger} />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Fallback loading state if we reach here
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Verifying permissions...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitesManagementPage;
