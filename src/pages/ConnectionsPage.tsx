
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ConnectionsDirectory from "@/components/connections/ConnectionsDirectory";

const ConnectionsPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();

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
  if (!currentUser) {
    return <Navigate to="/auth?redirectTo=/connections" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ConnectionsDirectory maxDepth={3} />
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
