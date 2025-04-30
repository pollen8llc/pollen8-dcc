
import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ConnectionsDirectory from "@/components/connections/ConnectionsDirectory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

const ConnectionsPage: React.FC = () => {
  const { currentUser, isLoading } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Helper function to handle errors in ConnectionsDirectory
  const handleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  // Retry loading connections
  const handleRetry = () => {
    setIsRetrying(true);
    setError(null);
    // Force re-render ConnectionsDirectory
    setTimeout(() => setIsRetrying(false), 100);
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
  if (!currentUser) {
    return <Navigate to="/auth?redirectTo=/connections" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Connections</h1>
          </div>
          
          {error ? (
            <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="mt-4"
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>Retry</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            !isRetrying && <ConnectionsDirectory maxDepth={3} onError={handleError} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsPage;
