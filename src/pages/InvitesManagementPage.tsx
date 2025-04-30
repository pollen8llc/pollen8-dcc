
import React, { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import InviteGenerator from "@/components/invites/InviteGenerator";
import InviteList from "@/components/invites/InviteList";
import { UserRole } from "@/models/types";
import ErrorBoundary from "@/components/ErrorBoundary";

const InvitesManagementPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Set auth checked after we've determined if user is logged in or not
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading]);

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

  // Redirect if user is not authenticated or not an organizer
  if (authChecked && !currentUser) {
    return <Navigate to="/auth?redirectTo=/organizer/invites" replace />;
  }

  // Ensure we've checked auth status and user is loaded before checking roles
  if (authChecked && currentUser) {
    const isOrganizer = currentUser.role === UserRole.ORGANIZER || 
                       currentUser.role === UserRole.ADMIN ||
                       (currentUser.managedCommunities && currentUser.managedCommunities.length > 0);

    if (!isOrganizer) {
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
                <InviteGenerator />
              </div>
              
              <InviteList />
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
